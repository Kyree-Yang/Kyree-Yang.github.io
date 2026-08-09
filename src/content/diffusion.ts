import type { Entry } from './types';

export const diffusionLinks = [
  { label: 'EECS 442 · Computer Vision', href: 'https://www.eecs.umich.edu/courses/eecs442/fa24/' },
  { label: 'Prof. Liyue Shen', href: 'https://liyueshen.engin.umich.edu/' },
];

export const diffusion: Entry = {
  slug: 'diffusion-pyramid',
  order: 5,
  title: 'Diffusion-Pyramid',
  tagline:
    'Improving the diversity and controllability of text-to-image diffusion through data augmentation.',
  eyebrow: 'ENTRY 05 · FALL 2024 · EECS 442 COMPUTER VISION',
  dates: 'Fall 2024',
  role: '3-person team · guidance from Prof. Liyue Shen',
  category: 'vision',
  categoryLabel: 'vision',
  stack: ['computer vision', 'data augmentation', 'Laplacian pyramid', 'Stable Diffusion'],
  headline: [
    { label: 'team', value: '3 people' },
    { label: 'augmentation', value: 'image + text' },
    { label: 'generation', value: 'one-shot' },
  ],
  caveatTeaser:
    'A three-person course project — the gains here are qualitative, and no diversity benchmark numbers are reported on this page.',
  teaser: 'One-shot generation traded diversity for control; we compared the two in side-by-side outputs rather than on a benchmark.',
  metrics: [
    { label: 'Team size', value: 3, note: 'EECS 442 course project, Fall 2024' },
    {
      label: 'Augmentation paths',
      value: 'image + text',
      note: 'Stable Diffusion with a Laplacian pyramid, plus prompt refinement',
      tone: 'violet',
    },
    {
      label: 'Generation',
      value: 'one-shot',
      note: 'a single prompt, minimal compute',
      tone: 'cyan',
    },
  ],
  sections: [
    {
      id: 'pipeline',
      heading: 'Pipeline',
      body: 'This is a class project from EECS 442 Computer Vision at UMich. With two teammates, we focused on improving the diversity and controllability of text-to-image diffusion models through data augmentation. The text-augmentation idea came from a suggestion by Prof. Liyue Shen.',
      viz: ['PipelineDiagram'],
    },
    {
      id: 'contributions',
      heading: 'Contributions',
      body: '',
      bullets: [
        'Applied image augmentation via Stable Diffusion and a Laplacian pyramid to enrich training samples.',
        'Developed an original text augmentation technique that refines prompts for more detailed and diverse output.',
        "Built a pipeline enabling efficient one-shot generation from a single prompt with minimal resources.",
      ],
    },
    { id: 'artifacts', heading: 'Artifacts', body: '' },
  ],
  caveats: [],
  docs: ['diffusion-pyramid-slides', 'diffusion-pyramid-report'],
};
