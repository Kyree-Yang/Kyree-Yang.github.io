#!/usr/bin/env node
/**
 * CI guard for the committed GIF artifacts.
 *
 * The GIFs are build output committed to the repo, because regenerating them
 * needs Chrome and ffmpeg and CI has neither. This asserts they are actually
 * present and within budget, and warns when one is older than the component it
 * was rendered from (a stale GIF is a wrong GIF, but not a reason to block a
 * deploy).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { MANIFEST } from './export-gifs.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GIF_DIR = path.join(ROOT, 'public', 'gif');
const REGISTRY = path.join(ROOT, 'src', 'gif', 'registry.tsx');
const MAX_BYTES = 400 * 1024;

let failed = false;

const registrySrc = fs.readFileSync(REGISTRY, 'utf8');

for (const { id } of MANIFEST) {
  const file = path.join(GIF_DIR, `${id}.gif`);

  if (!registrySrc.includes(`'${id}'`)) {
    console.error(`✗ ${id} — in MANIFEST but not registered in src/gif/registry.tsx`);
    failed = true;
  }

  if (!fs.existsSync(file)) {
    console.error(`✗ ${id}.gif — missing; run \`npm run build && npm run gif\``);
    failed = true;
    continue;
  }

  const stat = fs.statSync(file);
  if (stat.size > MAX_BYTES) {
    console.error(`✗ ${id}.gif — ${(stat.size / 1024).toFixed(0)} KB exceeds the 400 KB budget`);
    failed = true;
    continue;
  }

  console.log(`✓ ${id}.gif  ${(stat.size / 1024).toFixed(0)} KB`);
}

// Staleness is advisory: a GIF older than the component it was rendered from is
// probably out of date. Compare against that component only — comparing against
// the newest file in the viz directory flags all twelve every time one changes.
const vizDir = path.join(ROOT, 'src', 'components', 'viz');
const componentFor = Object.fromEntries(
  [...registrySrc.matchAll(/'([\w-]+)':\s*\(t\)\s*=>\s*<(\w+)\b/g)].map((m) => [m[1], m[2]]),
);

const stale = MANIFEST.filter(({ id }) => {
  const gif = path.join(GIF_DIR, `${id}.gif`);
  const component = componentFor[id] && path.join(vizDir, `${componentFor[id]}.tsx`);
  if (!fs.existsSync(gif) || !component || !fs.existsSync(component)) return false;
  return fs.statSync(gif).mtimeMs < fs.statSync(component).mtimeMs;
});

if (stale.length) {
  console.warn(
    `! ${stale.length} gif(s) older than their source component: ${stale.map((s) => s.id).join(', ')} — run \`npm run gif\``,
  );
}

process.exit(failed ? 1 : 0);
