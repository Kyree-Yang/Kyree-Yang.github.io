import type { Entry } from './types';

/** Video assets are basenames; VideoCard appends .webm/.mp4. */
export type VideoRef = {
  src: string;
  poster: string;
  caption: string;
  clickToPlay: boolean;
};

export const aghfMedia: VideoRef[] = [
  {
    src: '/media/aghf_hardware',
    poster: '/media/aghf_hardware-poster.jpg',
    caption: 'Real robot arm executing the planned trajectory — the sim-to-real proof point.',
    clickToPlay: true,
  },
  {
    src: '/media/aghf_sim',
    poster: '/media/aghf_sim-poster.jpg',
    caption: 'Optimal trajectory planning in simulation.',
    clickToPlay: false,
  },
];

export const aghfLinks = [
  { label: 'ROAHM Lab', href: 'https://www.roahmlab.com/' },
  { label: 'Prof. Ram Vasudevan', href: 'https://www.roahmlab.com/ram-personal' },
];

export const aghf: Entry = {
  slug: 'aghf',
  order: 3,
  title: 'AGHF trajectory optimization',
  tagline:
    'A path optimization method that evolves trajectories toward optimal solutions by applying affine-invariant geometric heat flow equations — taken from simulation to real hardware.',
  eyebrow: 'ENTRY 03 · SEP 2024 – APR 2026 · ROAHM LAB, UNIVERSITY OF MICHIGAN',
  dates: 'Sep 2024 – Apr 2026',
  role: 'Research Assistant · advised by Prof. Ram Vasudevan · IROS 2026 co-author',
  category: 'robotics',
  categoryLabel: 'robotics',
  stack: ['C++', 'trajectory optimization', 'Lagrangian interpolation', 'dynamics'],
  headline: [
    { label: 'solver runtime', value: '−40%' },
    { label: 'peer-reviewed', value: 'IROS 2026' },
    { label: 'sim → hardware', value: 'validated' },
  ],
  caveatTeaser:
    "The 40% figure is an average execution-time reduction from the analytical Jacobian modules measured on the lab's benchmark set, not a claim about the method as a whole.",
  teaser: 'The interpolation scheme had to be reworked before variable time horizons held state limits.',
  metrics: [
    {
      label: 'Solver execution time',
      value: '−40%',
      note: 'Average reduction from the C++ analytical Jacobian modules',
      tone: 'emerald',
    },
    { label: 'Peer-reviewed credit', value: 'IROS 2026', note: 'Co-author', tone: 'violet' },
    { label: 'Research tenure', value: 20, suffix: ' months', note: 'Sep 2024 – Apr 2026' },
    {
      label: 'Deployment',
      value: 'sim → hardware',
      note: 'Trajectory tracking and obstacle avoidance on a real arm',
      tone: 'cyan',
    },
  ],
  sections: [
    {
      id: 'explainer',
      heading: 'Explainer',
      body: "A trajectory optimizer usually starts from a guess and pushes it downhill. AGHF instead treats the trajectory as something that relaxes: a bad initial path — a straight line straight through an obstacle — evolves under a heat-flow PDE until it settles into a smooth, feasible one. The scrubber below is an illustration of that relaxation, not the lab's solver output.",
      viz: ['AghfMorph'],
    },
    {
      id: 'contributions',
      heading: 'Contributions',
      body: '',
      bullets: [
        'Engineered optimized C++ modules for analytical Jacobian computation inside the PDE-based trajectory optimization framework, cutting solver execution time by 40% on average.',
        'Derived a time-scaling factor formulation and Lagrangian interpolation constraints to reparameterize the PDE evolution, letting the solver generalize across variable time horizons and strictly enforce state limits.',
        'Verified and extended the method with endpoint constraints for real-world feasibility, then transferred simulation results to hardware with reliable trajectory tracking and obstacle avoidance.',
        'Co-authored a peer-reviewed paper demonstrating the effectiveness and generality of the approach (IROS 2026).',
      ],
    },
    { id: 'sim-hardware', heading: 'Sim → hardware', body: '' },
    { id: 'publications', heading: 'Publications', body: '' },
    {
      id: 'origin',
      heading: 'Origin note',
      body: 'The interest started earlier and lower-tech: an automatic complex-terrain vehicle with transformable wheels, built for the Design and Manufacturing course at Shanghai Jiao Tong University.',
    },
  ],
  caveats: [
    'The animation on this page is an illustrative curve-shortening relaxation with obstacle repulsion, computed in the browser. It is a faithful cartoon of what the solver does, not solver output, and it is labelled that way rather than passed off as a result.',
    "The 40% figure is an average execution-time reduction from the analytical Jacobian modules measured on the lab's benchmark set, not a claim about the method as a whole.",
  ],
  docs: [
    'aghf-phasing-through-the-flames',
    'pathological-diagnosis',
    'aghf-demo-video',
    'transformable-wheel-vehicle',
  ],
};
