/**
 * Identity, credentials and CV data. Pure data — every page reads its numbers from here
 * so prose and charts can never drift apart.
 *
 * Two standing rules, enforced by review: no phone number ships anywhere on this site,
 * and the SJTU GPA is 3.85 / 4.00 with no percentile claim attached.
 */

import type { EduItem, Honor, TeachingItem, Tone, Track } from './types';

export const identity = {
  name: 'Ruikai Yang',
  /** Rendered in small caps by the hero; kept as a separate string so casing is not a CSS accident. */
  display: 'RUIKAI YANG',
  location: 'Atlanta, GA',
  role: 'Incoming M.S. in Computer Science, Georgia Tech',
  summary:
    'Dual-degree engineer working on LLM-agent infrastructure, distributed backends, and PDE-based motion planning.',
} as const;

export const contact = {
  emailPrimary: 'ryang435@gatech.edu',
  emailSecondary: 'ruikai@umich.edu',
  emailSecondaryNote: 'Michigan, through Dec 2026',
  github: 'https://github.com/Kyree-Yang',
  linkedin: 'https://www.linkedin.com/in/ruikai-yang-17a940344',
  scholar: 'https://scholar.google.com/citations?user=fXi8G90AAAAJ',
  site: 'https://kyree-yang.github.io',
} as const;

/** Ordered for the footer and the CV identity header. Labels are what the anchor text renders. */
export const contactLinks: { label: string; href: string; note?: string }[] = [
  { label: contact.emailPrimary, href: `mailto:${contact.emailPrimary}` },
  {
    label: contact.emailSecondary,
    href: `mailto:${contact.emailSecondary}`,
    note: contact.emailSecondaryNote,
  },
  { label: 'GitHub', href: contact.github },
  { label: 'LinkedIn', href: contact.linkedin },
  { label: 'Google Scholar', href: contact.scholar },
];

export const hero = {
  eyebrow: 'ENGINEERING RUNBOOK',
  title: identity.display,
  lead: 'I build LLM-agent pipelines, distributed backends, and PDE solvers for robot motion. Most of it has to run overnight with nobody watching, which is why this site reads like a runbook: what each system actually did, and what never worked.',
  consoleLead:
    'Three of the systems below, drawn live from one shared clock. Scrub them, flip them, throttle them — they are the same state machines the pages describe.',
  portrait: {
    avif: '/media/portrait-hero.avif',
    webp: '/media/portrait-hero.webp',
    src: '/media/portrait-hero.jpg',
    alt: 'Ruikai Yang in a graduation gown at the University of Michigan Law Quadrangle.',
    caption: 'fig. 01 · law quadrangle, ann arbor · commencement 2026',
  },
} as const;

export const heroChips: { label: string; tone: Tone }[] = [
  { label: 'Georgia Tech · MSCS · Aug 2026', tone: 'emerald' },
  { label: 'TikTok · SWE Intern, Intelligent Creation · Summer 2026', tone: 'amber' },
  { label: 'Michigan · BSE CS · 4.00', tone: 'primary' },
  { label: 'SJTU · BEng ME · 3.85', tone: 'cyan' },
];

export const heroCtas: { label: string; to: string; primary?: boolean }[] = [
  { label: 'Read the work →', to: '/work', primary: true },
  { label: 'CV', to: '/cv' },
  { label: 'Résumé (PDF)', to: '/docs/ruikai-yang-resume.pdf' },
];

/** Tab labels for the hero console; the page owns which viz each tab mounts. */
export const heroTabs: { id: string; label: string }[] = [
  { id: 'pipeline', label: 'Scrub the pipeline' },
  { id: 'locale', label: 'Flip the locale' },
  { id: 'network', label: 'Throttle the network' },
];

export const education: EduItem[] = [
  {
    school: 'Georgia Institute of Technology',
    degree: 'M.S. in Computer Science',
    place: 'Atlanta, GA',
    dates: 'Aug 2026 – Dec 2027 (expected)',
    current: true,
  },
  {
    school: 'University of Michigan, Ann Arbor',
    degree: 'B.S.E. in Computer Science (dual degree)',
    place: 'Ann Arbor, MI',
    dates: 'Aug 2024 – May 2026',
    detail: 'GPA 4.00 / 4.00 · Summa Cum Laude',
    coursework: [
      'Foundations of Computer Science',
      'Computer Vision',
      'Robot Learning',
      'System Design of a Search Engine',
    ],
  },
  {
    school: 'Shanghai Jiao Tong University',
    degree: 'B.Eng. in Mechanical Engineering',
    place: 'Shanghai, China',
    dates: 'Sep 2022 – Aug 2026',
    detail: 'GPA 3.85 / 4.00',
    coursework: ['Data Structures and Algorithms', 'Advanced Mathematics', 'Design and Manufacturing'],
  },
];

export const degreeNote =
  'The two bachelor’s degrees ran at the same time under a dual-degree program: Michigan coursework and lab work stacked on top of an SJTU degree that had not finished yet. Georgia Tech starts the month SJTU ends.';

export type ExperienceStream = {
  id: 'abf' | 'design-lab';
  title: string;
  summary: string;
  metric: string;
  to: string;
  /** Selected per track by `cvTracks[t].streamHighlights`. */
  highlights: { id: string; text: string }[];
};

export type Experience = {
  org: string;
  team: string;
  title: string;
  place: string;
  dates: string;
  context: string;
  streams: ExperienceStream[];
};

export const experience: Experience = {
  org: 'TikTok',
  team: 'Intelligent Creation',
  title: 'Software Engineer Intern',
  place: 'San Jose, CA',
  dates: 'May 2026 – Aug 2026',
  /** Ruling 13: the codebase is described by shape, never by name. */
  context: 'a large dual-platform mobile codebase',
  streams: [
    {
      id: 'abf',
      title: 'Autonomous Bug-Fix Pipeline',
      summary:
        'Built a four-layer, ~42,500-line system that drove bug tickets on a large dual-platform mobile codebase from evidence collection through root cause, patch, merge request and green CI without supervision. A 20-step state machine is enforced out of band by lifecycle hooks rather than by prompt instructions, a scheduler daemon hands work to runners that claim jobs atomically, and every ticket is built in its own git worktree so ten agents can work at once without sharing a checkout.',
      metric: '75 autonomous runs · 66 merge requests · 56 green pipelines',
      to: '/work/autonomous-bug-fix',
      highlights: [
        {
          id: 'state-machine',
          text: '20-step state machine enforced out of band by 7 hooks and 54 hard-block exit points, so a confident agent cannot skip a step by asserting it already did it.',
        },
        {
          id: 'cas-claiming',
          text: 'Compare-and-swap job claiming — only affected_rows == 1 wins — replacing a concurrency gate that had never once fired and let two runners open two merge requests for one ticket.',
        },
        {
          id: 'orphan-takeover',
          text: 'Orphan takeover: runs whose driver process dies are adopted by UUID-keyed process markers instead of being silently lost.',
        },
        {
          id: 'signal-path',
          text: 'An SSE push channel with a credit pull replaced polling and took click-to-action latency from ~95 s to 1–2 s, with fallback polling kept as the floor.',
        },
      ],
    },
    {
      id: 'design-lab',
      title: 'Design Lab',
      summary:
        'Built a design-to-code delivery workflow so designers ship real iOS and Android UI code instead of mockups: a 12-node agent DAG whose seven heaviest stages run in isolated subagents, with lifecycle hooks registering every node and per-node on-stop gates that block the agent until the artifacts it claims to have produced actually exist. Localization, RTL correctness and weak-network behavior are separate nodes, each with a deterministic checker rather than a model opinion.',
      metric: '12-node DAG · 11 locales · 326 strings · 300 s → 5.1 s translation wait',
      to: '/work/design-lab',
      highlights: [
        {
          id: 'dag-isolation',
          text: 'Seven heavy stages isolated in subagents, keeping the design-rule corpus out of the main context window entirely.',
        },
        {
          id: 'on-stop-gates',
          text: 'Blocking on-stop artifact gates: the node cannot finish until the files it promised exist and compile.',
        },
        {
          id: 'delta-translation',
          text: 'Delta-only machine translation against a snapshot of the English source, collapsing a 300 s namespace-wide wait to 5.1 s.',
        },
        {
          id: 'rtl-network',
          text: 'Deterministic checkers for RTL mirroring and for weak/no-network states, verified by fault injection rather than by a happy-path screenshot.',
        },
      ],
    },
  ],
};

export type Research = {
  lab: string;
  role: string;
  dates: string;
  advisor: string;
  credit: string;
  summary: string;
  bullets: string[];
  to: string;
};

export const research: Research = {
  lab: 'ROAHM Lab, University of Michigan',
  role: 'Research Assistant',
  dates: 'Sep 2024 – Apr 2026',
  advisor: 'Prof. Ram Vasudevan',
  credit: 'IROS 2026 co-author',
  summary:
    'AGHF — Affine Geometric Heat Flow — is a path optimization method that evolves trajectories toward optimal solutions by applying affine-invariant geometric heat flow equations. I worked on the solver internals and on taking the method from simulation to real hardware.',
  bullets: [
    'Wrote the C++ modules that compute the analytical Jacobians inside the PDE trajectory-optimization framework; they cut solver execution time by 40% on average.',
    'Derived a time-scaling factor formulation and Lagrangian interpolation constraints to reparameterize the PDE evolution, letting the solver generalize across variable time horizons and strictly enforce state limits.',
    'Verified and extended the method with endpoint constraints for real-world feasibility, then transferred simulation results to hardware with reliable trajectory tracking and obstacle avoidance.',
  ],
  to: '/work/aghf',
};

export type Publication = { year: string; title: string; doc: string };

export const publications: Publication[] = [
  {
    year: '2025',
    title:
      'Phasing Through the Flames: Rapid Motion Planning with the AGHF PDE for Arbitrary Objective Functions and Constraints',
    doc: 'aghfPaper',
  },
  {
    year: '2024',
    title: 'A Pathological Diagnosis Method Combining Image-Text Large Model and Rule-Based Reasoning',
    doc: 'pathologyPaper',
  },
];

export type CvProject = { id: string; title: string; meta: string; to: string; bullets: string[] };

/** CV project entries. Bullet count is re-weighted by the track toggle. */
export const projects: CvProject[] = [
  {
    id: 'search-engine',
    title: 'Crawler Crew — distributed search engine',
    meta: 'EECS 440 · Winter 2025 · team of 6 · C++',
    to: '/work/search-engine',
    bullets: [
      'Ranker design — the scoring and re-ranking layer over the merged shard results.',
      'Profiling the aggregator path, taking tail query latency from ~8 s to under 2 s under concurrent load.',
      'UTF-8 adoption plus delta and variable-length encoding, cutting the on-disk index footprint roughly 50% and improving cache locality.',
    ],
  },
  {
    id: 'diffusion-pyramid',
    title: 'Diffusion-Pyramid',
    meta: 'EECS 442 · Fall 2024 · 3-person team',
    to: '/work/diffusion-pyramid',
    bullets: [
      'Image augmentation via Stable Diffusion and a Laplacian pyramid to enrich training samples.',
      'An original text augmentation technique that refines prompts for more detailed and more diverse output.',
      'A pipeline enabling efficient one-shot generation from a single prompt with minimal resources.',
    ],
  },
];

export const honors: Honor[] = [
  {
    // Two separate semesters, one award — Home block 7 refers to it as "×2" for the same reason.
    date: '2025.06 · 2025.01',
    title: 'University of Michigan Dean’s Honor List ×2',
    note: 'Winter 2025 and Fall 2024',
    href: 'https://studentawards.engin.umich.edu/deanslist/',
  },
  { date: '2024.12', title: '2024 First-Class China Undergraduate Excellence Scholarship', note: 'top 1%' },
  { date: '2024.07', title: 'The Tang Junyuan Scholarship', note: 'top 0.5%' },
  {
    date: '2024.06',
    title: 'The Fan Xuji Scholarship',
    note: 'top 0.5%',
    href: 'https://www.ji.sjtu.edu.cn/off-the-press/2024-06-21/146468/',
  },
  { date: '2023.12', title: 'China Undergraduate Outstanding Scholarship', note: 'top 1%' },
  { date: '2023.12', title: '2023 First-Class China Undergraduate Excellence Scholarship', note: 'top 1%' },
  { date: '2023.11', title: 'The John Wu and Jane Sun Excellence Scholarship', note: 'top 1%' },
  { date: '2023.10', title: 'China Undergraduate National Scholarship', note: 'top 1.5%' },
];

/** Past tense throughout — every one of these roles has ended. */
export const teaching: TeachingItem[] = [
  {
    dates: '2024.09 – 2026.05',
    text: 'Advisor at the Joint Institute Advising Center, where I organized several workshops.',
  },
  { dates: '2024.09 – 2026.05', text: 'Member of the Joint Institute Alumni committee; organized a few events.' },
  {
    dates: '2024.05 – 2024.08',
    text: 'Teaching Assistant for PHYS 1500J, Summer 2024. Nominated as Outstanding TA.',
  },
  {
    dates: '2023.10',
    text: 'Invited to give a talk about my learning experience to the incoming class.',
  },
  { dates: '2023.09 – 2024.08', text: 'Department Leader of the Joint Institute Student Union.' },
  {
    dates: '2022.09 – 2023.08',
    text: 'Group Leader of the Joint Institute Miyuan Youth Volunteer Team.',
  },
];

export const teachingPhotos = [
  { src: '/media/TA.jpg', webp: '/media/TA.webp', alt: 'Teaching PHYS 1500J', caption: 'PHYS 1500J TA, 2024' },
  { src: '/media/talk.jpg', webp: '/media/talk.webp', alt: 'Giving a talk to the incoming class', caption: 'Invited talk to the incoming class, 2023' },
  { src: '/media/tenvolunteer.jpg', webp: '/media/tenvolunteer.webp', alt: 'Top Ten Volunteers award', caption: 'Named among the Top Ten Volunteers, 2023' },
];

export const skills = [
  'C++',
  'Swift',
  'Kotlin',
  'TypeScript',
  'Python',
  'React',
  'NestJS',
  'distributed systems',
  'LLM-agent infrastructure',
  'motion planning',
  'Bazel / Gradle',
  'Linux',
];

export type CvSectionId =
  | 'education'
  | 'experience'
  | 'research'
  | 'projects'
  | 'publications'
  | 'honors'
  | 'teaching'
  | 'skills';

export type TrackConfig = {
  label: string;
  /** One line under the toggle explaining what this ordering is arguing. */
  blurb: string;
  order: CvSectionId[];
  /** Which experience highlights survive on this track, keyed by stream id. */
  streamHighlights: Record<ExperienceStream['id'], string[]>;
  /** Bullet budget for the sections that expand and contract. */
  bullets: { research: number; searchEngine: number };
};

/**
 * The same record, three defensible orderings. Education, publications, honors, teaching and
 * skills never move; only experience / research / projects trade places.
 */
export const cvTracks: Record<Track, TrackConfig> = {
  agents: {
    label: 'agents',
    blurb: 'Agent infrastructure first: state machines, isolation, and the gates that enforce them.',
    order: ['education', 'experience', 'research', 'projects', 'publications', 'honors', 'teaching', 'skills'],
    streamHighlights: {
      abf: ['state-machine', 'cas-claiming', 'orphan-takeover'],
      'design-lab': ['dag-isolation', 'on-stop-gates'],
    },
    bullets: { research: 2, searchEngine: 2 },
  },
  systems: {
    label: 'systems',
    blurb: 'Distributed systems first: sharding, concurrency, and where the tail latency actually was.',
    order: ['education', 'projects', 'experience', 'research', 'publications', 'honors', 'teaching', 'skills'],
    streamHighlights: {
      abf: ['cas-claiming', 'signal-path', 'orphan-takeover'],
      'design-lab': ['delta-translation'],
    },
    bullets: { research: 2, searchEngine: 3 },
  },
  robotics: {
    label: 'robotics',
    blurb: 'Research first: the AGHF PDE work, in full, from solver internals to hardware.',
    order: ['education', 'research', 'experience', 'projects', 'publications', 'honors', 'teaching', 'skills'],
    streamHighlights: {
      abf: ['state-machine'],
      'design-lab': ['dag-isolation'],
    },
    bullets: { research: 3, searchEngine: 2 },
  },
};

export const tracks: Track[] = ['agents', 'systems', 'robotics'];
