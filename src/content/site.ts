/** Site-wide chrome: navigation, the route directory, the /work index, and the colophon. */

import type { Entry } from './types';

export const siteMeta = {
  name: 'Ruikai Yang',
  url: 'https://kyree-yang.github.io',
  title: 'Ruikai Yang — systems that run unattended',
  description:
    'Engineering runbook of Ruikai Yang: LLM-agent infrastructure, distributed backends, and PDE-based motion planning. Every number carries its denominator.',
} as const;

export const navItems: { label: string; to: string }[] = [
  { label: 'Work', to: '/work' },
  { label: 'CV', to: '/cv' },
  { label: 'Beyond', to: '/beyond' },
];

/** The nine public routes, used by the footer directory and by the 404 page. */
export const routeDirectory: { to: string; label: string; description: string }[] = [
  { to: '/', label: 'Home', description: 'Who I am, and the two agent systems I built this summer.' },
  { to: '/work', label: 'Work', description: 'Five systems, newest first, with their caveats attached.' },
  {
    to: '/work/autonomous-bug-fix',
    label: 'Autonomous Bug-Fix Pipeline',
    description: 'Bug ticket to merge request, unattended — and where it stopped.',
  },
  {
    to: '/work/design-lab',
    label: 'Design Lab',
    description: 'A 12-node agent DAG that turns design intent into dual-platform UI code.',
  },
  {
    to: '/work/aghf',
    label: 'AGHF trajectory optimization',
    description: 'Heat-flow PDE motion planning, from solver internals to a real robot arm.',
  },
  {
    to: '/work/search-engine',
    label: 'Crawler Crew',
    description: 'A from-scratch C++ search engine over 30M pages on twelve nodes.',
  },
  {
    to: '/work/diffusion-pyramid',
    label: 'Diffusion-Pyramid',
    description: 'Text augmentation and a Laplacian pyramid for more diverse generation.',
  },
  { to: '/cv', label: 'CV', description: 'Education, experience, research, honors — re-weightable by track.' },
  {
    to: '/beyond',
    label: 'Beyond the lab',
    description: 'Three competition medals, a desert, and a county in Yunnan.',
  },
];

export const workHeader = {
  title: 'Work',
  lead: 'Five systems, newest first. Each entry runs problem → constraint → design → what broke → what shipped → what I would still fix. The numbers are the ones I can defend, not the ones that read best.',
} as const;

export const workFilters: { id: Entry['category'] | 'all'; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'agent-infrastructure', label: 'agent infrastructure' },
  { id: 'distributed-systems', label: 'distributed systems' },
  { id: 'robotics', label: 'robotics' },
  { id: 'vision', label: 'vision' },
];

export type WorkRow = {
  slug: string;
  title: string;
  tagline: string;
  dates: string;
  role: string;
  category: Entry['category'];
  categoryLabel: string;
  /** Exactly three. */
  metrics: { label: string; value: string }[];
  /** The "what broke" line — the reason the row is worth clicking. */
  teaser: string;
  /** Key of the bare mini-viz the row renders; resolved by the page. */
  viz: string;
};

export const workIndex: WorkRow[] = [
  {
    slug: 'autonomous-bug-fix',
    title: 'Autonomous Bug-Fix Pipeline',
    tagline:
      'A four-layer, ~42,500-line system that drove mobile bug tickets from evidence to merge request, unattended.',
    dates: 'May – Aug 2026',
    role: 'Solo · TikTok, Intelligent Creation',
    category: 'agent-infrastructure',
    categoryLabel: 'agent infrastructure',
    metrics: [
      { value: '75', label: 'autonomous runs' },
      { value: '66 / 56', label: 'MRs / green CI' },
      { value: '20 · 7', label: 'steps · hooks' },
    ],
    teaser: '34 of 73 runs ended waiting for a human with a phone.',
    viz: 'PipelineRing',
  },
  {
    slug: 'design-lab',
    title: 'Design Lab',
    tagline:
      'Designers ship real dual-platform UI code, not mockups — a 12-node agent DAG with deterministic quality gates.',
    dates: 'May – Aug 2026',
    role: 'TikTok, Intelligent Creation',
    category: 'agent-infrastructure',
    categoryLabel: 'agent infrastructure',
    metrics: [
      { value: '12 · 7', label: 'DAG nodes · subagent stages' },
      { value: '11 · 326', label: 'locales · strings' },
      { value: '300 s → 5.1 s', label: 'translation wait' },
    ],
    teaser:
      'A node that does not compile-check its own output will confidently call design-system APIs that do not exist.',
    viz: 'DagFlow',
  },
  {
    slug: 'aghf',
    title: 'AGHF trajectory optimization',
    tagline:
      'A path optimization method that evolves trajectories toward optimal solutions under an affine geometric heat flow PDE — taken from simulation to real hardware.',
    dates: 'Sep 2024 – Apr 2026',
    role: 'Research Assistant · ROAHM Lab, University of Michigan',
    category: 'robotics',
    categoryLabel: 'robotics',
    metrics: [
      { value: '−40%', label: 'solver runtime' },
      { value: 'IROS 2026', label: 'co-authored paper' },
      { value: '20 months', label: 'in the lab' },
    ],
    teaser: 'The interpolation scheme had to be reworked before variable time horizons held state limits.',
    viz: 'AghfMorph',
  },
  {
    slug: 'search-engine',
    title: 'Crawler Crew',
    tagline:
      'A search engine built from scratch in C++ by six people, with no external packages beyond the standard library. I owned the ranker.',
    dates: 'Winter 2025',
    role: 'Ranker owner · EECS 440, University of Michigan',
    category: 'distributed-systems',
    categoryLabel: 'distributed systems',
    metrics: [
      { value: '30M', label: 'pages indexed' },
      { value: '12', label: 'node cluster' },
      { value: '~8 s → < 2 s', label: 'tail query latency' },
    ],
    teaser: 'Tail latency was one straggler shard, not the average.',
    viz: 'ShardFanout',
  },
  {
    slug: 'diffusion-pyramid',
    title: 'Diffusion-Pyramid',
    tagline: 'Improving the diversity and controllability of text-to-image diffusion through data augmentation.',
    dates: 'Fall 2024',
    role: '3-person team · EECS 442, University of Michigan',
    category: 'vision',
    categoryLabel: 'vision',
    metrics: [
      { value: '5-stage', label: 'one-shot pipeline' },
      { value: '3', label: 'person team' },
      { value: '2', label: 'augmentation techniques' },
    ],
    teaser: 'One-shot generation traded diversity for control; we measured both.',
    viz: 'PipelineDiagram',
  },
];

export const colophon: {
  title: string;
  body: string;
  assets: { label: string; value: string }[];
} = {
  title: 'How this site is built',
  body: 'React 19 + Vite + TypeScript, Tailwind v4 with CSS-first tokens, no chart library and no animation library. Every visualization is hand-written SVG driven by one shared clock and is a pure function of t, which is what lets the same component animate on the page, freeze under prefers-reduced-motion, and be captured frame-by-frame into a .gif. The previous site referenced 106 MB of images, six animated GIFs accounting for 83 MB of it; those are now video with a poster frame, and the photographs ship WebP with a JPEG fallback.',
  // Measured after the final build, not targets.
  assets: [
    { label: 'photos and video', value: '105.9 MB → 3.4 MB' },
    { label: 'animated GIFs used as video', value: '6 (83.3 MB) → 0' },
    { label: 'documents, self-hosted', value: '90 MB → 7.1 MB' },
    { label: 'exported visualization GIFs', value: '12 · 1.0 MB · none over 400 KB' },
    { label: 'entry chunk', value: '37 KB · 11 KB gzipped' },
    { label: 'unreferenced originals', value: 'dropped, ~56 MB' },
  ],
};

export const notFound = {
  title: 'Not found',
  body: 'That URL does not exist here. The site was rebuilt in August 2026; old anchors are redirected automatically, so if you followed one and still landed here, the content moved.',
} as const;
