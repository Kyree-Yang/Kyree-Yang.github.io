/**
 * Every document and external reference the site links to, in one table.
 *
 * The old site put twelve Google Drive `/view` URLs in front of readers: sign-in walls,
 * silent permission rot, and no way to know a link died. Everything that could be vendored
 * now lives under `/public/docs` and is served from this origin — no Drive URL ships.
 * Anything that could not be vendored carries `vendored: false` and no href, which makes
 * `DocLink` render a muted "document pending" chip instead of a link that fails on click.
 */

import type { DocRef } from './types';

export const docs: Record<string, DocRef> = {
  // One artefact, two names: the hero calls it a résumé, the CV page calls it a CV.
  // Compiled from the LaTeX source with the phone clause removed — the site never
  // publishes a personal phone number, including inside a downloadable document.
  cv: { id: 'cv', label: 'CV (PDF)', kind: 'pdf', href: '/docs/ruikai-yang-resume.pdf', vendored: true },
  resume: {
    id: 'resume',
    label: 'Résumé (PDF)',
    kind: 'pdf',
    href: '/docs/ruikai-yang-resume.pdf',
    vendored: true,
  },

  aghfPaper: {
    id: 'aghfPaper',
    label: 'Phasing Through the Flames (2025)',
    kind: 'pdf',
    href: '/docs/aghf-phasing-through-the-flames.pdf',
    vendored: true,
  },
  pathologyPaper: {
    id: 'pathologyPaper',
    label: 'A Pathological Diagnosis Method Combining Image-Text Large Model and Rule-Based Reasoning (2024)',
    kind: 'pdf',
    href: '/docs/pathological-diagnosis.pdf',
    vendored: true,
  },

  crawlerSlides: {
    id: 'crawlerSlides',
    label: 'Crawler Crew — presentation slides',
    kind: 'slides',
    href: '/docs/crawler-crew-slides.pdf',
    vendored: true,
    sizeNote: '2.2 MB',
  },
  crawlerReport: {
    id: 'crawlerReport',
    label: 'Crawler Crew — final report',
    kind: 'pdf',
    href: '/docs/crawler-crew-report.pdf',
    vendored: true,
  },

  diffusionSlides: {
    id: 'diffusionSlides',
    label: 'Diffusion-Pyramid — slides',
    kind: 'slides',
    href: '/docs/diffusion-pyramid-slides.pdf',
    vendored: true,
  },
  diffusionReport: {
    id: 'diffusionReport',
    label: 'Diffusion-Pyramid — report',
    kind: 'pdf',
    href: '/docs/diffusion-pyramid-report.pdf',
    vendored: true,
  },

  mcmPaper: {
    id: 'mcmPaper',
    label: 'MCM 2024 — contest paper',
    kind: 'pdf',
    href: '/docs/mcm-2024-paper.pdf',
    vendored: true,
  },
  cuymcCopyright: {
    id: 'cuymcCopyright',
    label: 'CUYMC — Chinese software copyright certificate',
    // Vendored as an image: the original is a scanned certificate, not a document.
    kind: 'site',
    href: '/docs/cuymc-software-copyright.webp',
    vendored: true,
  },
  transformableWheel: {
    id: 'transformableWheel',
    label: 'Automatic complex-terrain vehicle with transformable wheels',
    kind: 'pdf',
    href: '/docs/transformable-wheel-vehicle.pdf',
    vendored: true,
  },

  // The two demo videos were Drive-hosted and are not re-hostable here; they render as
  // disabled chips rather than as links to a sign-in wall.
  aghfDemoVideo: { id: 'aghfDemoVideo', label: '2-minute AGHF demo video', kind: 'video', vendored: false },
  crawlerDemoVideo: {
    id: 'crawlerDemoVideo',
    label: 'Full 5-minute search demo',
    kind: 'video',
    vendored: false,
  },

  mcmContest: {
    id: 'mcmContest',
    label: 'MCM/ICM contest',
    kind: 'site',
    href: 'https://www.comap.com/contests/mcm-icm',
    vendored: true,
  },
  cuymcContest: {
    id: 'cuymcContest',
    label: 'China–US Young Maker Competition',
    kind: 'site',
    href: 'https://www.chinausyoungmaker.org/',
    vendored: true,
  },
  upcContest: {
    id: 'upcContest',
    label: 'University Physics Competition',
    kind: 'site',
    href: 'https://uphysicsc.com/',
    vendored: true,
  },

  eecs440: {
    id: 'eecs440',
    label: 'EECS 440 — System Design of a Search Engine',
    kind: 'site',
    href: 'https://web.eecs.umich.edu/~nham/eecs440w21/',
    vendored: true,
  },
  profHamilton: {
    id: 'profHamilton',
    label: 'Prof. Nicole Hamilton',
    kind: 'site',
    href: 'https://nicolehamilton.com/',
    vendored: true,
  },
  eecs442: {
    id: 'eecs442',
    label: 'EECS 442 — Computer Vision',
    kind: 'site',
    href: 'https://www.eecs.umich.edu/courses/eecs442/fa24/',
    vendored: true,
  },
  profShen: {
    id: 'profShen',
    label: 'Prof. Liyue Shen',
    kind: 'site',
    href: 'https://liyueshen.engin.umich.edu/',
    vendored: true,
  },
  roahmLab: {
    id: 'roahmLab',
    label: 'ROAHM Lab',
    kind: 'site',
    href: 'https://www.roahmlab.com/',
    vendored: true,
  },
  profVasudevan: {
    id: 'profVasudevan',
    label: 'Prof. Ram Vasudevan',
    kind: 'site',
    href: 'https://www.roahmlab.com/ram-personal',
    vendored: true,
  },

  sjtuMcmStory: {
    id: 'sjtuMcmStory',
    label: 'SJTU JI — story on the MCM Outstanding Winner result',
    kind: 'site',
    href: 'https://www.ji.sjtu.edu.cn/off-the-press/2024-05-28/146005/',
    vendored: true,
  },
  sjtuCuymcStory: {
    id: 'sjtuCuymcStory',
    label: 'SJTU JI — story on the CUYMC First Prize',
    kind: 'site',
    href: 'https://www.ji.sjtu.edu.cn/off-the-press/2024-07-22/146816/',
    vendored: true,
  },
  sjtuPersonOfTheYear: {
    id: 'sjtuPersonOfTheYear',
    label: 'SJTU JI — 2023 “Person of the Year”',
    kind: 'site',
    href: 'https://www.ji.sjtu.edu.cn/off-the-press/2023-12-05/142729/',
    vendored: true,
  },
  sjtuFanXujiStory: {
    id: 'sjtuFanXujiStory',
    label: 'SJTU JI — Fan Xuji Scholarship announcement',
    kind: 'site',
    href: 'https://www.ji.sjtu.edu.cn/off-the-press/2024-06-21/146468/',
    vendored: true,
  },
  deansList: {
    id: 'deansList',
    label: 'University of Michigan Dean’s Honor List',
    kind: 'site',
    href: 'https://studentawards.engin.umich.edu/deanslist/',
    vendored: true,
  },

  tenggerDesert: {
    id: 'tenggerDesert',
    label: 'Tengger Desert',
    kind: 'site',
    href: 'https://en.wikipedia.org/wiki/Tengger_Desert',
    vendored: true,
  },
  eryuanCounty: {
    id: 'eryuanCounty',
    label: 'Eryuan County',
    kind: 'site',
    href: 'https://en.wikipedia.org/wiki/Eryuan_County',
    vendored: true,
  },
};

/** Lookup that fails loudly in development instead of rendering `undefined`. */
export function doc(id: string): DocRef {
  const found = docs[id];
  if (!found) throw new Error(`Unknown document id: ${id}`);
  return found;
}
