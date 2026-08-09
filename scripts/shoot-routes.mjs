#!/usr/bin/env node
/**
 * Screenshot every public route for a manual review pass.
 *
 * Serves dist/ and captures each route at desktop and mobile widths in both
 * themes. Output goes to scripts/.shots/ (gitignored).
 *
 * Usage: node scripts/shoot-routes.mjs [--full] [route ...]
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'scripts', '.shots');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 4333;
const CDP_PORT = 9334;

const ROUTES = [
  ['home', '/'],
  ['work', '/work'],
  ['abf', '/work/autonomous-bug-fix'],
  ['designlab', '/work/design-lab'],
  ['aghf', '/work/aghf'],
  ['search', '/work/search-engine'],
  ['diffusion', '/work/diffusion-pyramid'],
  ['mcm', '/work/mcm-2024'],
  ['cv', '/cv'],
  ['beyond', '/beyond'],
  ['notfound', '/nope'],
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
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(fs.readFileSync(file));
  });
  return new Promise((r) => server.listen(PORT, () => r(server)));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Same one-Chrome-over-CDP approach as export-gifs.mjs, for the same reason. */
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
      }, 45000);
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
  const profile = path.join(os.tmpdir(), `chrome-shot-cdp-${process.pid}`);
  const child = spawn(
    CHROME,
    [
      '--headless=old', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      '--disable-extensions', '--no-first-run', '--no-default-browser-check',
      '--disable-background-networking', '--disable-sync',
      `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, 'about:blank',
    ],
    { stdio: 'ignore' },
  );
  for (let i = 0; i < 120; i++) {
    try {
      const json = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).json();
      if (json.webSocketDebuggerUrl) return { child, profile, browserWs: json.webSocketDebuggerUrl };
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error('Chrome never exposed its debugging endpoint');
}

const args = process.argv.slice(2);
const full = args.includes('--full');
const light = args.includes('--light');
const only = args.filter((a) => !a.startsWith('--'));

const server = await serve();
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const targets = only.length ? ROUTES.filter(([n]) => only.includes(n)) : ROUTES;
const sizes = full
  ? [['desk', 1440, 3400], ['mob', 390, 2600]]
  : [['desk', 1440, 1000], ['mob', 390, 844]];

const { child, profile, browserWs } = await launchChrome();
try {
  const browser = await Cdp.connect(browserWs);
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const page = await Cdp.connect(`ws://127.0.0.1:${CDP_PORT}/devtools/page/${targetId}`);
  await page.send('Page.enable');
  await page.send('Runtime.enable');
  await page.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-color-scheme', value: light ? 'light' : 'dark' }],
  });

  for (const [name, route] of targets) {
    for (const [tag, w, h] of sizes) {
      await page.send('Emulation.setDeviceMetricsOverride', {
        width: w,
        height: h,
        deviceScaleFactor: 1,
        mobile: tag === 'mob',
      });
      await page.send('Page.navigate', { url: `http://localhost:${PORT}${route}` });
      await sleep(1800); // lazy route chunk + fonts + scroll-in reveals
      const { data } = await page.send('Page.captureScreenshot', { format: 'png' });
      const file = path.join(OUT, `${name}-${tag}${light ? '-light' : ''}.png`);
      fs.writeFileSync(file, Buffer.from(data, 'base64'));
      console.log(`${path.basename(file)}  ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
    }
  }
} finally {
  child.kill('SIGKILL');
  fs.rmSync(profile, { recursive: true, force: true });
  server.close();
}

console.log(`\n${OUT}`);
