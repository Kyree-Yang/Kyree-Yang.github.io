/** Shared content vocabulary. Prose and charts import the same numbers from here. */

export type Tone = 'neutral' | 'primary' | 'violet' | 'cyan' | 'amber' | 'emerald' | 'rose';

export type Metric = {
  label: string;
  /** Numbers count up on scroll-in; strings render as-is. */
  value: string | number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  note?: string;
  tone?: Tone;
};

export type Section = {
  /** Anchor id, also used by JumpRail. */
  id: string;
  heading: string;
  body: string;
  bullets?: string[];
  /** Key of a visualization rendered after the prose; resolved by the page. */
  viz?: string[];
  callout?: { title: string; text: string };
};

export type DocRef = {
  id: string;
  label: string;
  kind: 'pdf' | 'slides' | 'video' | 'site';
  /** Absolute site path when vendored, external URL otherwise. */
  href?: string;
  /** False → DocLink renders a disabled "document pending" chip. */
  vendored: boolean;
  /** Set when the asset is heavy enough that the reader deserves a warning. */
  sizeNote?: string;
};

export type Entry = {
  slug: string;
  order: number;
  title: string;
  tagline: string;
  eyebrow: string;
  dates: string;
  role: string;
  category: 'agent-infrastructure' | 'distributed-systems' | 'robotics' | 'vision' | 'modeling';
  categoryLabel: string;
  stack: string[];
  /** Exactly three, for the index row and the home spine card. */
  headline: { label: string; value: string }[];
  /** One line, the honest limitation. Shown in italic on cards and mastheads. */
  caveatTeaser: string;
  /** "What broke" line on the /work index. */
  teaser: string;
  metrics: Metric[];
  /** Collaborators and advisor, e.g. 'with A and B · advised by Prof. C'. */
  credits?: string;
  sections: Section[];
  caveats: string[];
  docs?: string[];
};

export type EduItem = {
  school: string;
  degree: string;
  place: string;
  dates: string;
  detail?: string;
  coursework?: string[];
  current?: boolean;
};

export type Honor = { date: string; title: string; note?: string; href?: string };

export type TeachingItem = { dates: string; text: string };

export type Track = 'agents' | 'systems' | 'robotics';
