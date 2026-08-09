#!/usr/bin/env node
/**
 * Deterministic GIF export.
 *
 * Every animated visualization accepts an optional `t` prop in [0,1]. When `t`
 * is supplied the component renders that exact frame instead of self-animating,
 * which makes headless capture reproducible. The route /_gif/:id?t=<n> mounts a
 * single visualization on a flat background at a fixed size.
 *
 * Capture drives ONE long-lived Chrome over the DevTools Protocol. The obvious
 * implementation — spawn `chrome --screenshot` per frame — costs 10–30 s a frame
 * because every launch with a fresh `--user-data-dir` pays full first-run
 * profile initialization. Here Chrome starts once, and each frame is a
 * `history.replaceState` + `popstate` (which react-router picks up without a
 * reload) followed by `Page.captureScreenshot`: ~100 ms a frame.
 *
 * Frames are stitched by ffmpeg (`palettegen` + `paletteuse`) into public/gif/.
 *
 * Usage: node scripts/export-gifs.mjs [id ...]
 */
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const FRAMES = path.join(ROOT, 'scripts', '.gif-frames');
const OUT = path.join(ROOT, 'public', 'gif');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 4321;
const CDP_PORT = 9333;
const SCALE = 2;

/** ids must match the keys in src/gif/registry.tsx */
export const MANIFEST = [
  { id: 'abf-pipeline', w: 760, h: 500, frames: 96, fps: 12 },
  { id: 'abf-layers', w: 760, h: 462, frames: 40, fps: 16 },
  { id: 'abf-funnel', w: 760, h: 426, frames: 40, fps: 16 },
  { id: 'abf-cas', w: 760, h: 336, frames: 48, fps: 16 },
  { id: 'abf-signal', w: 760, h: 386, frames: 44, fps: 16 },
  { id: 'designlab-dag', w: 760, h: 395, frames: 104, fps: 16 },
  { id: 'i18n-delta-loop', w: 760, h: 362, frames: 44, fps: 16 },
  { id: 'rtl-mirror', w: 760, h: 362, frames: 44, fps: 16 },
  { id: 'weak-network', w: 760, h: 362, frames: 56, fps: 16 },
  { id: 'search-shards', w: 760, h: 370, frames: 40, fps: 16 },
  { id: 'aghf-morph', w: 760, h: 362, frames: 40, fps: 16 },
  { id: 'degree-gantt', w: 760, h: 344, frames: 36, fps: 16 },
  // 1760x1400 viewBox; captured wide so the three-plane filter cycle stays legible.
  // Dense diagram: only four filter states to show, and a smaller palette costs
  // nothing visually because the figure is flat fills and hairlines.
  { id: 'abf-architecture', w: 980, h: 660, frames: 36, fps: 9, colors: 48 },
];

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm', '.gif': 'image/gif',
  '.pdf': 'application/pdf', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};

function serve() {
  const server = createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = path.join(DIST, url);
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, 'index.html');
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(fs.readFileSync(file));
  });
  return new Promise((r) => server.listen(PORT, () => r(server)));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Minimal CDP client: one socket, id-matched responses. */
class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data);
      const p = this.pending.get(msg.id);
      if (!p) return;
      this.pending.delete(msg.id);
      msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.delete(id)) reject(new Error(`${method} timed out`));
      }, 30000);
    });
  }

  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true });
      ws.addEventListener('error', () => reject(new Error('CDP socket failed')), { once: true });
    });
    return new Cdp(ws);
  }
}

async function launchChrome() {
  const profile = path.join(os.tmpdir(), `chrome-gif-cdp-${process.pid}`);
  const child = spawn(
    CHROME,
    [
      '--headless=old',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--disable-extensions',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-sync',
      `--remote-debugging-port=${CDP_PORT}`,
      `--user-data-dir=${profile}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  // Wait for the debugging endpoint rather than guessing at a startup delay.
  for (let i = 0; i < 120; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
      const json = await res.json();
      if (json.webSocketDebuggerUrl) return { child, profile, browserWs: json.webSocketDebuggerUrl };
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error('Chrome never exposed its debugging endpoint');
}

function ff(args) {
  const r = spawnSync('ffmpeg', args, { stdio: 'pipe' });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${r.stderr?.toString().slice(0, 600)}`);
}

async function main() {
  const only = process.argv.slice(2);
  const items = only.length ? MANIFEST.filter((m) => only.includes(m.id)) : MANIFEST;
  if (!fs.existsSync(DIST)) throw new Error('dist/ missing — run `npm run build` first');
  fs.mkdirSync(OUT, { recursive: true });

  const server = await serve();
  const { child, profile, browserWs } = await launchChrome();

  try {
    const browser = await Cdp.connect(browserWs);
    const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
    const wsUrl = `ws://127.0.0.1:${CDP_PORT}/devtools/page/${targetId}`;
    const page = await Cdp.connect(wsUrl);
    await page.send('Page.enable');
    await page.send('Runtime.enable');
    // The theme is resolved by an inline script before first paint, and headless
    // Chrome reports prefers-color-scheme: light. Emulate dark so the exported
    // frames match the site's default theme instead of the capture host's.
    await page.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-color-scheme', value: 'dark' }],
    });

    for (const m of items) {
      const dir = path.join(FRAMES, m.id);
      fs.rmSync(dir, { recursive: true, force: true });
      fs.mkdirSync(dir, { recursive: true });

      await page.send('Emulation.setDeviceMetricsOverride', {
        width: m.w,
        height: m.h,
        deviceScaleFactor: SCALE,
        mobile: false,
      });

      // One real navigation per visualization; frames are history swaps after that.
      await page.send('Page.navigate', { url: `http://localhost:${PORT}/_gif/${m.id}?t=0` });
      await sleep(1200); // fonts + first paint

      for (let i = 0; i < m.frames; i++) {
        const t = (i / m.frames).toFixed(5);
        await page.send('Runtime.evaluate', {
          expression: `history.replaceState({}, '', '/_gif/${m.id}?t=${t}');
                       window.dispatchEvent(new PopStateEvent('popstate'));
                       new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));`,
          awaitPromise: true,
        });
        const { data } = await page.send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(dir, `f${String(i).padStart(4, '0')}.png`), Buffer.from(data, 'base64'));
      }

      const pattern = path.join(dir, 'f%04d.png');
      const palette = path.join(dir, 'palette.png');
      const gif = path.join(OUT, `${m.id}.gif`);
      ff(['-y', '-v', 'error', '-i', pattern,
          '-vf', `scale=${m.w}:-1:flags=lanczos,palettegen=max_colors=${m.colors ?? 96}:stats_mode=diff`, palette]);
      ff(['-y', '-v', 'error',
          '-framerate', String(m.fps), '-i', pattern, '-i', palette,
          '-lavfi', `scale=${m.w}:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`,
          '-loop', '0', gif]);
      console.log(`${m.id}.gif  ${m.frames}f  ${(fs.statSync(gif).size / 1024).toFixed(0)} KB`);
      fs.rmSync(dir, { recursive: true, force: true });
    }
  } finally {
    child.kill('SIGKILL');
    fs.rmSync(profile, { recursive: true, force: true });
    server.close();
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
