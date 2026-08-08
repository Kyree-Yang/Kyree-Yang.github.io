import type { Entry, Tone } from './types';

/**
 * Query latency was never a single number — the aggregator waits on the slowest
 * shard — so it is modelled as a range and rendered as a bar, never averaged away.
 */
export type SearchKpi =
  | {
      kind: 'value';
      label: string;
      value: number | string;
      prefix?: string;
      suffix?: string;
      decimals?: number;
      note?: string;
      tone?: Tone;
    }
  | {
      kind: 'range';
      label: string;
      min: number;
      max: number;
      unit: string;
      scaleMax: number;
      note?: string;
      tone?: Tone;
    };

export const searchEngineKpis: SearchKpi[] = [
  { kind: 'value', label: 'Pages crawled', value: 30, suffix: 'M', note: 'over 240 GB of HTML' },
  { kind: 'value', label: 'Crawler threads', value: 7500, note: 'multi-threaded, with crash recovery' },
  { kind: 'value', label: 'Seed list', value: 3000, tone: 'cyan' },
  { kind: 'value', label: 'Tokens indexed', value: 20, suffix: 'B+', tone: 'violet' },
  { kind: 'value', label: 'Index size', value: 500, suffix: ' GB', note: 'hash-partitioned across servers' },
  { kind: 'value', label: 'Chunk size', value: 1.1, decimals: 1, suffix: ' GB', tone: 'cyan' },
  {
    kind: 'range',
    label: 'Query latency',
    min: 300,
    max: 2000,
    unit: 'ms',
    scaleMax: 2500,
    note: 'the slowest shard sets the number',
    tone: 'amber',
  },
];

export const searchEngineDemo = {
  src: '/media/super_quality',
  poster: '/media/super_quality-poster.jpg',
  caption: 'End-to-end search process demonstration.',
  toggleLabel: 'watch the real UI',
};

export const searchEngineLinks = [
  { label: 'EECS 440 · System Design of a Search Engine', href: 'https://web.eecs.umich.edu/~nham/eecs440w21/' },
  { label: 'Prof. Nicole Hamilton', href: 'https://nicolehamilton.com/' },
];

export const searchEngine: Entry = {
  slug: 'search-engine',
  order: 4,
  title: 'Crawler Crew — distributed search engine',
  tagline:
    'A search engine built from scratch in C++ by six people, with no external packages beyond the standard library. I owned the ranker.',
  eyebrow: 'ENTRY 04 · WINTER 2025 · EECS 440, UNIVERSITY OF MICHIGAN',
  dates: 'Winter 2025',
  role: 'Prof. Nicole Hamilton · team of 6',
  category: 'distributed-systems',
  categoryLabel: 'distributed systems',
  stack: ['C++', 'Linux', 'sockets', 'memory-mapped I/O'],
  headline: [
    { label: 'pages indexed', value: '30M' },
    { label: 'cluster', value: '12 nodes' },
    { label: 'tail latency', value: '~8 s → <2 s' },
  ],
  caveatTeaser:
    'A six-person course project: my scope was the ranker and the aggregator profiling, and the KPIs describe the system we built together.',
  teaser: 'Tail latency was one straggler shard, not the average.',
  metrics: [
    { label: 'Pages crawled', value: 30, suffix: 'M', note: 'over 240 GB of HTML' },
    { label: 'Crawler threads', value: 7500, note: 'multi-threaded, with crash recovery' },
    { label: 'Seed list', value: 3000, tone: 'cyan' },
    { label: 'Tokens indexed', value: 20, suffix: 'B+', tone: 'violet' },
    { label: 'Index size', value: 500, suffix: ' GB', note: 'hash-partitioned across servers' },
    { label: 'Chunk size', value: 1.1, decimals: 1, suffix: ' GB', tone: 'cyan' },
    {
      label: 'Query latency',
      value: '300–2,000 ms',
      note: 'the slowest shard sets the number',
      tone: 'amber',
    },
  ],
  sections: [
    {
      id: 'architecture',
      heading: 'Architecture',
      body: "Twelve Linux nodes — a mix of cloud VMs and local machines — crawl, index, and serve. Multi-threaded crawlers with crash recovery sustain throughput across 240 GB of HTML; the inverted index is hash-partitioned and sharded across servers; a central aggregator merges and re-ranks partial results from every shard. The slowest returning shard is the whole query's latency, which is why the profiling work targeted the aggregator path rather than the average.",
      viz: ['ShardFanout'],
    },
    {
      id: 'owned',
      heading: 'What I owned',
      body: '',
      bullets: [
        'Ranker design — the scoring and re-ranking layer over the merged shard results.',
        'Profiling the aggregator path, taking tail query latency from ~8 s to under 2 s under concurrent load.',
        'UTF-8 adoption plus delta and variable-length encoding, cutting the on-disk index footprint roughly 50% and improving cache locality.',
      ],
    },
    { id: 'artifacts', heading: 'Artifacts', body: '' },
  ],
  caveats: [
    'This was a six-person course project. The crawler, indexer, and query service were team-owned; my scope was the ranker and the aggregator profiling, and the KPIs above describe the system we built together, not work I did alone.',
    "The figures are from the final report's measurement run on our own cluster, not a sustained production deployment.",
  ],
  docs: ['crawler-crew-slides', 'crawler-crew-report'],
};
