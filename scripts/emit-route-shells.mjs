#!/usr/bin/env node
/**
 * Emit a real HTML file at every public route.
 *
 * Without this, GitHub Pages answers /work, /cv and every entry page with
 * 404.html. The bundled shim bounces those back through the router so a browser
 * ends up in the right place, but the HTTP status is still 404 — which is what
 * crawlers, link unfurlers and uptime checks record. Writing an index.html at
 * each path makes them 200, removes the redirect hop, and lets each route ship
 * its own title and description for previews.
 *
 * 404.html stays as the fallback for genuinely unknown URLs.
 *
 * Runs as part of `npm run build`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const ORIGIN = 'https://kyree-yang.github.io';

/** Must stay in step with the <Seo> props on each page. */
const ROUTES = [
  {
    path: '/work',
    title: 'Work — Ruikai Yang',
    description:
      'Five systems, newest first: an autonomous bug-fix pipeline, an agentic design-to-code workflow, PDE trajectory optimization, a distributed search engine, and a diffusion augmentation project.',
  },
  {
    path: '/work/autonomous-bug-fix',
    title: 'Autonomous Bug-Fix Pipeline — Ruikai Yang',
    description:
      'A four-layer, ~42,500-line system that drove bug tickets on a large dual-platform mobile codebase from evidence to merge request, unattended.',
  },
  {
    path: '/work/design-lab',
    title: 'Design Lab — Ruikai Yang',
    description:
      'Designers ship real dual-platform UI code, not mockups — a 12-node agent DAG with deterministic quality gates.',
  },
  {
    path: '/work/aghf',
    title: 'AGHF trajectory optimization — Ruikai Yang',
    description:
      'A path optimization method that evolves trajectories toward optimal solutions under an affine geometric heat flow PDE — taken from simulation to real hardware.',
  },
  {
    path: '/work/search-engine',
    title: 'Crawler Crew — Ruikai Yang',
    description:
      'A search engine built from scratch in C++ by six people over 30M pages on a twelve-node cluster. I owned the ranker.',
  },
  {
    path: '/work/diffusion-pyramid',
    title: 'Diffusion-Pyramid — Ruikai Yang',
    description:
      'Improving the diversity and controllability of text-to-image diffusion through data augmentation.',
  },
  {
    path: '/cv',
    title: 'CV — Ruikai Yang',
    description:
      'Education, experience, research, publications and honors — re-weightable by track.',
  },
  {
    path: '/beyond',
    title: 'Beyond the lab — Ruikai Yang',
    description: 'Three competition medals and two field projects.',
  },
];

const shell = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

/**
 * Replace one tag without pulling in a DOM parser. The patterns span newlines
 * because the source formatting survives into the built HTML.
 */
const swap = (html, pattern, replacement) => {
  if (!pattern.test(html)) throw new Error(`route shell: no match for ${pattern}`);
  return html.replace(pattern, replacement);
};

for (const route of ROUTES) {
  let html = shell;
  html = swap(html, /<title>[^<]*<\/title>/, `<title>${route.title}</title>`);
  html = swap(
    html,
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${route.description}" />`,
  );
  html = swap(
    html,
    /<link\s+rel="canonical"[\s\S]*?\/>/,
    `<link rel="canonical" href="${ORIGIN}${route.path}" />`,
  );
  html = swap(
    html,
    /<meta\s+property="og:title"[\s\S]*?\/>/,
    `<meta property="og:title" content="${route.title}" />`,
  );
  html = swap(
    html,
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${route.description}" />`,
  );
  html = swap(
    html,
    /<meta\s+property="og:url"[\s\S]*?\/>/,
    `<meta property="og:url" content="${ORIGIN}${route.path}" />`,
  );

  const dir = path.join(DIST, route.path);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

console.log(`route shells: ${ROUTES.length} written`);
