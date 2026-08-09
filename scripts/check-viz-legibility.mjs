#!/usr/bin/env node
/**
 * Report the rendered pixel size of every text element in a visualization.
 *
 * SVG font sizes are in viewBox units, so the same number renders at a
 * different size depending on how wide the figure is drawn. A 14-unit label in
 * a 2000-unit-wide figure shown at 1600 px is 11.2 px — small enough to be the
 * first thing a reader complains about. This computes that number so type can
 * be sized against the result rather than against the unit.
 *
 * Usage: node scripts/check-viz-legibility.mjs <Component> [renderWidthPx]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const name = process.argv[2];
const renderWidth = Number(process.argv[3] ?? 1600);
if (!name) {
  console.error('usage: node scripts/check-viz-legibility.mjs <Component> [renderWidthPx]');
  process.exit(1);
}

const file = path.join(ROOT, 'src', 'components', 'viz', `${name}.tsx`);
const src = fs.readFileSync(file, 'utf8');

const vb = src.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
if (!vb) throw new Error(`no viewBox found in ${name}.tsx`);
const [vw, vh] = [Number(vb[1]), Number(vb[2])];
const scale = renderWidth / vw;

// fontSize={n} and fontSize="n", plus any numeric literal assigned to a
// *Size / *_SIZE constant, which is how these components usually hold them.
const sizes = new Map();
const bump = (n, where) => {
  if (!Number.isFinite(n) || n <= 0) return;
  const list = sizes.get(n) ?? [];
  list.push(where);
  sizes.set(n, list);
};

for (const m of src.matchAll(/fontSize=\{?["']?(\d+(?:\.\d+)?)["']?\}?/g)) bump(Number(m[1]), 'fontSize');
// Ternaries: fontSize={cond ? 24 : 20} — both arms count.
for (const m of src.matchAll(/fontSize=\{[^}]*?\?\s*(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)\s*\}/g)) {
  bump(Number(m[1]), 'fontSize ternary');
  bump(Number(m[2]), 'fontSize ternary');
}
for (const m of src.matchAll(/(?:const|let)\s+([A-Z_a-z]*(?:SIZE|Size|FS))\s*=\s*(\d+(?:\.\d+)?)/g))
  bump(Number(m[2]), m[1]);

if (!sizes.size) {
  console.log(`${name}: no explicit font sizes found (they may be in CSS classes)`);
  process.exit(0);
}

console.log(`${name}.tsx  viewBox ${vw}x${vh}  rendered at ${renderWidth}px  scale ${scale.toFixed(3)}`);
console.log('');
console.log('  units   rendered   count  verdict');

let worst = Infinity;
for (const [unit, uses] of [...sizes.entries()].sort((a, b) => b[0] - a[0])) {
  const px = unit * scale;
  worst = Math.min(worst, px);
  const verdict = px >= 15 ? 'comfortable' : px >= 12.5 ? 'ok' : px >= 11 ? 'small' : 'TOO SMALL';
  console.log(
    `  ${String(unit).padStart(5)}   ${px.toFixed(1).padStart(6)}px   ${String(uses.length).padStart(4)}   ${verdict}`,
  );
}

console.log('');
console.log(`smallest rendered text: ${worst.toFixed(1)}px`);
process.exit(worst < 11 ? 1 : 0);
