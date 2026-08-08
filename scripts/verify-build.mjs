#!/usr/bin/env node
/**
 * Post-build assertions that are cheap to check and expensive to get wrong.
 *
 * These are the things a visual review will not catch: a phone number that
 * slipped back into a content module, a Google Drive URL, an internal codename,
 * a route missing from the sitemap.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

/** Substrings that must never reach the published bundle. */
const BANNED = [
  ['phone number', /734[.\s-]?747[.\s-]?1258|\(734\)/i],
  ['google drive URL', /drive\.google\.com|docs\.google\.com/i],
  ['internal issue tracker', /\bmeego\b/i],
  ['internal review platform', /\bbits\b(?!\s*of)/i],
  ['internal CI', /zhongkui|钟馗/i],
  ['internal i18n platform', /\bstarling\b/i],
  ['internal design system', /\btuxedo\b/i],
  ['internal chat platform', /larkoffice|feishu/i],
  ['internal app platform', /妙搭/],
  ['internal build tool', /\bjojo\b/i],
  ['ticket ids', /\bAME-\d{6,}/],
];

const REQUIRED_ROUTES = [
  '/',
  '/work',
  '/work/autonomous-bug-fix',
  '/work/design-lab',
  '/work/aghf',
  '/work/search-engine',
  '/work/diffusion-pyramid',
  '/cv',
  '/beyond',
];

let failed = false;
const fail = (msg) => {
  console.error(`✗ ${msg}`);
  failed = true;
};

if (!fs.existsSync(DIST)) {
  fail('dist/ missing — run `npm run build` first');
  process.exit(1);
}

// 1. Nothing banned in any text asset.
const textFiles = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|css|html|json|txt|xml|webmanifest)$/.test(e.name)) textFiles.push(p);
  }
};
walk(DIST);

for (const file of textFiles) {
  const src = fs.readFileSync(file, 'utf8');
  for (const [name, re] of BANNED) {
    const hit = src.match(re);
    if (hit) fail(`${name} found in ${path.relative(ROOT, file)}: "${hit[0]}"`);
  }
}
console.log(`✓ scanned ${textFiles.length} text assets for banned content`);

// 2. SPA fallback and required public files.
for (const f of ['404.html', 'robots.txt', 'sitemap.xml', 'site.webmanifest', '.nojekyll']) {
  if (!fs.existsSync(path.join(DIST, f))) fail(`dist/${f} missing`);
}
console.log('✓ SPA fallback and site metadata present');

// 3. Every public route is in the sitemap.
const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
for (const r of REQUIRED_ROUTES) {
  const url = `https://kyree-yang.github.io${r === '/' ? '/' : r}`;
  if (!sitemap.includes(url)) fail(`sitemap.xml missing ${url}`);
}
console.log(`✓ all ${REQUIRED_ROUTES.length} routes listed in sitemap.xml`);

// 4. Bundle budget.
const assets = path.join(DIST, 'assets');
const js = fs
  .readdirSync(assets)
  .filter((f) => f.endsWith('.js'))
  .map((f) => ({ f, size: fs.statSync(path.join(assets, f)).size }))
  .sort((a, b) => b.size - a.size);
const biggest = js[0];
console.log(
  `  largest js chunk: ${biggest.f} ${(biggest.size / 1024).toFixed(0)} KB · ${js.length} chunks · ${(
    js.reduce((s, x) => s + x.size, 0) / 1024
  ).toFixed(0)} KB total`,
);

// 5. Media budget.
const du = (dir) => {
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    n += e.isDirectory() ? du(p) : fs.statSync(p).size;
  }
  return n;
};
const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(
  `  media ${mb(du(path.join(DIST, 'media')))} MB · docs ${mb(du(path.join(DIST, 'docs')))} MB · gif ${mb(du(path.join(DIST, 'gif')))} MB · dist ${mb(du(DIST))} MB`,
);

process.exit(failed ? 1 : 0);
