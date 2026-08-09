/** Site-wide chrome: navigation, the route directory, the /work index, and the colophon. */

import type { Entry } from './types';

export const siteMeta = {
  name: 'Ruikai Yang',
  url: 'https://kyree-yang.github.io',
  title: 'Ruikai Yang — engineering runbook',
  description:
    'Ruikai Yang builds LLM-agent infrastructure, distributed backends, and PDE motion planning, and is headed into ML research at Georgia Tech. This site is the runbook: what each system did, and what never worked.',
} as const;

export const navItems: { label: string; to: string }[] = [
  { label: 'Work', to: '/work' },
  { label: 'CV', to: '/cv' },
  { label: 'Beyond', to: '/beyond' },
];

/** The nine public routes, used by the footer directory and by the 404 page. */
export const routeDirectory: { to: string; label: string; description: string }[] = [
  { to: '/', label: 'Home', description: 'Who I am, and the two agent systems I built this summer.' },
  { to: '/work', label: 'Work', description: 'Six projects, newest first, with their caveats attached.' },
  {
    to: '/work/autonomous-bug-fix',
    label: 'Autonomous Bug-Fix Pipeline',
    description:
      'An agent pipeline that takes a mobile bug ticket to a merge request without supervision. Most runs park at on-device verification.',
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
  {
    to: '/work/mcm-2024',
    label: 'MCM 2024 · Momentum in Tennis',
    description: 'An EWMA momentum model of the 2023 Wimbledon final. Outstanding Winner, top <1%.',
  },
  { to: '/cv', label: 'CV', description: 'Education, experience, research, honors — re-weightable by track.' },
  {
    to: '/beyond',
    label: 'Beyond the lab',
    description: 'Three competition medals and two field projects.',
  },
];

export const workHeader = {
  title: 'Work',
  lead: 'Six projects, newest first. Each entry runs problem → constraint → design → what broke → what shipped → what I would still fix. Where a metric had two possible denominators, each page uses the harsher one and says which it is.',
} as const;

export const workFilters: { id: Entry['category'] | 'all'; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'agent-infrastructure', label: 'agent infrastructure' },
  { id: 'distributed-systems', label: 'distributed systems' },
  { id: 'robotics', label: 'robotics' },
  { id: 'vision', label: 'vision' },
  { id: 'modeling', label: 'modeling' },
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
  /** Landscape catalog cover. GIF covers animate; jpg covers ship a webp sibling. */
  cover: { src: string; webp?: string; alt: string };
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
    cover: {
      src: '/gif/abf-architecture.gif',
      alt: 'Animated two-plane architecture map: control plane in the cloud, execution plane on one laptop, and the single wire between them.',
    },
  },
  {
    slug: 'design-lab',
    title: 'Design Lab',
    tagline:
      'A 12-node agent DAG that lets designers hand engineers compiling iOS and Android code instead of a design file.',
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
    cover: {
      src: '/gif/designlab-dag.gif',
      alt: 'Animated 12-node delivery DAG with a token walking the spine.',
    },
  },
  {
    slug: 'aghf',
    title: 'AGHF trajectory optimization',
    tagline:
      'A path optimization method that evolves trajectories toward optimal solutions under an affine geometric heat flow PDE — taken from simulation to real hardware.',
    dates: 'Sep 2024 – Apr 2026',
    role: 'Research Assistant',
    category: 'robotics',
    categoryLabel: 'robotics',
    metrics: [
      { value: '−40%', label: 'solver runtime' },
      { value: 'IROS 2026', label: 'co-authored paper' },
      { value: '20 months', label: 'in the lab' },
    ],
    teaser: 'The interpolation scheme had to be reworked before variable time horizons held state limits.',
    viz: 'AghfMorph',
    cover: {
      src: '/media/aghf_sim-poster.jpg',
      alt: 'Simulation frame: the Kinova arm threading between obstacle boxes.',
    },
  },
  {
    slug: 'search-engine',
    title: 'Crawler Crew',
    tagline:
      'A search engine built from scratch in C++ by six people, with no external packages beyond the standard library. I owned the ranker.',
    dates: 'Winter 2025',
    role: 'Ranker owner · team of six',
    category: 'distributed-systems',
    categoryLabel: 'distributed systems',
    metrics: [
      { value: '30M', label: 'pages indexed' },
      { value: '12', label: 'node cluster' },
      { value: '~8 s → < 2 s', label: 'tail query latency' },
    ],
    teaser: 'Tail latency was one straggler shard, not the average.',
    viz: 'ShardFanout',
    cover: {
      src: '/media/cover-crawler.jpg',
      webp: '/media/cover-crawler.webp',
      alt: 'The search engine returning ten results in 1.103 seconds for a live query.',
    },
  },
  {
    slug: 'diffusion-pyramid',
    title: 'Diffusion-Pyramid',
    tagline: 'Improving the diversity and controllability of text-to-image diffusion through data augmentation.',
    dates: 'Fall 2024',
    role: 'Team of three',
    category: 'vision',
    categoryLabel: 'vision',
    metrics: [
      { value: '5-stage', label: 'one-shot pipeline' },
      { value: '3', label: 'person team' },
      { value: '2', label: 'augmentation techniques' },
    ],
    teaser: 'One-shot generation traded diversity for control; we compared the two in side-by-side outputs rather than on a benchmark.',
    viz: 'PipelineDiagram',
    cover: {
      src: '/media/cover-diffusion.jpg',
      webp: '/media/cover-diffusion.webp',
      alt: 'Text and image augmentation pipeline from the report: prompts and Laplacian-pyramid blending feeding Dreambooth.',
    },
  },
  {
    slug: 'mcm-2024',
    title: 'MCM 2024 · Momentum in Tennis',
    tagline:
      'An EWMA momentum definition and swing detector for point-by-point tennis data, built on the 2023 Wimbledon final. Outstanding Winner, top <1% of teams.',
    dates: 'Feb 2024',
    role: '3-person team · SJTU',
    category: 'modeling',
    categoryLabel: 'modeling',
    metrics: [
      { value: 'top <1%', label: 'Outstanding Winner' },
      { value: '334', label: 'points, one final' },
      { value: '40', label: 'match features' },
    ],
    teaser: 'Momentum was defined from points already won, so the model shows coherence, not causation.',
    viz: 'none',
    cover: {
      src: '/media/mcm-momentum.jpg',
      webp: '/media/mcm-momentum.webp',
      alt: 'Momentum area chart across all five sets of the 2023 Wimbledon final, Alcaraz against Djokovic.',
    },
  },
];

/** Dated ledger for the home page — only events with public dates. */
export const log: { date: string; text: string }[] = [
  { date: '2026', text: 'AGHF paper under review at IROS 2026, co-authored with the ROAHM Lab.' },
  { date: 'Aug 2026', text: 'MSCS begins at Georgia Tech.' },
  { date: 'Aug 2026', text: 'Two agent systems shipped at TikTok Intelligent Creation (May – Aug).' },
  { date: 'May 2026', text: 'B.S.E. in Computer Science at Michigan, Summa Cum Laude.' },
  { date: 'Feb 2024', text: 'MCM Outstanding Winner, top <1% of teams.' },
];

export const colophon: {
  title: string;
  body: string;
  assets: { label: string; value: string }[];
} = {
  title: 'How this site is built',
  body: 'React 19 + Vite + TypeScript, Tailwind v4 with CSS-first tokens, no chart library and no animation library. Every visualization is hand-written SVG driven by one shared clock and is a pure function of t, which is what lets the same component animate on the page, freeze under prefers-reduced-motion, and be captured frame-by-frame into a .gif. Type is self-hosted: Besley (a Clarendon revival, with a true italic) and JetBrains Mono, three woff2 files, 0.2 MB. The previous site referenced 106 MB of images, six animated GIFs accounting for 83 MB of it; those are now video with a poster frame, and the photographs ship WebP with a JPEG fallback.',
  // Measured after the final build, not targets.
  assets: [
    { label: 'photos and video', value: '105.9 MB → 3.9 MB' },
    { label: 'animated GIFs used as video', value: '6 (83.3 MB) → 0' },
    { label: 'documents, self-hosted', value: '90 MB → 6.2 MB' },
    { label: 'exported visualization GIFs', value: '13 · 1.4 MB · none over 400 KB' },
    { label: 'entry chunk', value: '43 KB · 13 KB gzipped' },
    { label: 'unreferenced originals', value: 'dropped, ~56 MB' },
  ],
};

export const notFound = {
  title: 'Not found',
  body: 'That URL does not exist here. The site was rebuilt in August 2026; old anchors are redirected automatically, so if you followed one and still landed here, the content moved.',
} as const;
