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

// Staleness is advisory: a GIF older than its source is probably out of date.
const vizDir = path.join(ROOT, 'src', 'components', 'viz');
if (fs.existsSync(vizDir)) {
  const newestViz = fs
    .readdirSync(vizDir)
    .map((f) => fs.statSync(path.join(vizDir, f)).mtimeMs)
    .reduce((a, b) => Math.max(a, b), 0);
  const stale = MANIFEST.filter(({ id }) => {
    const file = path.join(GIF_DIR, `${id}.gif`);
    return fs.existsSync(file) && fs.statSync(file).mtimeMs < newestViz;
  });
  if (stale.length) {
    console.warn(
      `! ${stale.length} gif(s) older than the newest viz source: ${stale.map((s) => s.id).join(', ')}`,
    );
  }
}

process.exit(failed ? 1 : 0);
