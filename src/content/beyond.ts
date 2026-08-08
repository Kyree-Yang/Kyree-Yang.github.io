import type { Metric } from './types';

export type BeyondLink = { label: string; href: string };

export type BeyondPhoto = {
  src: string;
  webp: string;
  alt: string;
  caption: string;
  badge?: string;
};

export type Competition = {
  id: string;
  title: string;
  fullName: string;
  award: string;
  date: string;
  badge: string;
  body: string;
  photo?: BeyondPhoto;
  links: BeyondLink[];
  /** Keys into src/content/docs.ts. */
  docs: string[];
};

export type Activity = {
  id: string;
  title: string;
  place: string;
  date: string;
  badge: string;
  body: string;
  photo: BeyondPhoto;
  links: BeyondLink[];
  /** Rendered as count-ups over the photograph. */
  stats?: Metric[];
  /** Trailing line whose link must be a real anchor — the Jekyll build printed it as literal brackets. */
  note?: { text: string; link: BeyondLink };
};

export const beyondHeader = {
  title: 'Beyond the lab',
  lead: 'Three medals and two field projects. The most striking photographs on this site are here, and none of them are of a screen.',
};

export const competitions: Competition[] = [
  {
    id: 'mcm-2024',
    title: 'MCM 2024',
    fullName: 'Mathematical Contest in Modeling',
    award: 'Outstanding Winner (top <1%)',
    date: 'February 2024',
    badge: 'MCM Highest Prize',
    body: 'Our team was awarded the Outstanding Winner Prize for analyzing momentum shifts in tennis using 2023 Wimbledon match data. The topic is really fascinating for me, since I myself am a tennis lover. I contributed to the use of Exponential Weighted Moving Average (EWMA) to define and detect momentum swings.',
    photo: {
      src: '/media/Oprize.jpg',
      webp: '/media/Oprize.webp',
      alt: 'MCM 2024 Outstanding Winner recognition.',
      caption: 'MCM 2024 · Outstanding Winner, top <1% of teams.',
      badge: 'MCM Highest Prize',
    },
    links: [
      { label: 'Contest', href: 'https://www.comap.com/contests/mcm-icm' },
      { label: 'Story', href: 'https://www.ji.sjtu.edu.cn/off-the-press/2024-05-28/146005/' },
    ],
    docs: ['mcm-2024-paper'],
  },
  {
    id: 'cuymc-2024',
    title: 'CUYMC 2024',
    fullName: 'China–US Young Maker Competition',
    award: 'First Prize',
    date: 'February – April 2024',
    badge: 'CUYMC First Prize',
    body: "I designed a digital virtual human to make our intelligent elderly care project more approachable and user-friendly for seniors. By integrating large language models (LLMs) into the Unreal Engine 5 (UE5) platform, I enhanced the system's interactivity and responsiveness.",
    links: [
      { label: 'Contest', href: 'https://www.chinausyoungmaker.org/' },
      { label: 'Story', href: 'https://www.ji.sjtu.edu.cn/off-the-press/2024-07-22/146816/' },
    ],
    docs: ['cuymc-software-copyright'],
  },
  {
    id: 'upc-2023',
    title: 'University Physics Competition 2023',
    fullName: 'University Physics Competition',
    award: 'Bronze Medal',
    date: 'November 2023',
    badge: 'UPC Bronze Medal',
    body: 'We studied complex dynamic systems, including the problem of multiple people bouncing on an elastic trampoline. In this competition, I worked on simulation-based prediction problems for the first time, leveraging my interdisciplinary background in both mechanical engineering and computer science.',
    photo: {
      src: '/media/2023UPC.jpg',
      webp: '/media/2023UPC.webp',
      alt: 'University Physics Competition 2023 Bronze Medal recognition.',
      caption: 'University Physics Competition 2023 · Bronze Medal.',
      badge: 'UPC Bronze Medal',
    },
    links: [{ label: 'Contest', href: 'https://uphysicsc.com/' }],
    // Ruling 11: the legacy "paper" link was a copy of the MCM file id, so it ships with none.
    docs: [],
  },
];

export const digitalHuman = {
  src: '/media/hantian1',
  poster: '/media/hantian1-poster.jpg',
  caption:
    'A UE5 digital human with an LLM backend, built to make an elderly-care system approachable for seniors.',
};

export const activities: Activity[] = [
  {
    id: 'tengger',
    title: 'Tengger Desert',
    place: 'Gansu, China',
    date: 'April – May 2024',
    badge: 'Desertification Control in Tengger',
    body: 'Together with more than 40 fellow students from the Green Grid Club at Shanghai Jiao Tong University, we ventured deep into the Tengger Desert in early summer to participate in a social practice project focused on sand prevention and desertification control. Through our joint efforts, our team planted a total of 1,000 bundles—nearly 80,000 saplings—of cold-resistant Haloxylon ammodendron, hoping to contribute a patch of green to the ecologically fragile Minqin area.',
    photo: {
      src: '/media/green_grid.jpg',
      webp: '/media/green_grid.webp',
      alt: 'The planting site in the Tengger Desert.',
      caption: 'Sand prevention and desertification control, Minqin area.',
      badge: 'Desertification Control in Tengger',
    },
    links: [{ label: 'Tengger Desert', href: 'https://en.wikipedia.org/wiki/Tengger_Desert' }],
    stats: [
      { label: 'students, Green Grid Club', value: 40, suffix: '+', tone: 'emerald' },
      { label: 'bundles planted', value: 1000, tone: 'emerald' },
      { label: 'saplings', value: 80000, prefix: '~', tone: 'emerald' },
    ],
  },
  {
    id: 'eryuan',
    title: 'Eryuan County',
    place: 'Yunnan Province, China',
    date: 'January – February 2023',
    badge: 'Conducting a Physics Experiment in Eryuan',
    body: "Together with more than twenty other members of the Miyuan Youth Volunteer Team, I traveled to Eryuan in Yunnan Province, where we spent an unforgettable time with local middle school students from several schools. I was responsible for tutoring the children in mathematics, science, and English. Unexpectedly, living, eating, and sharing daily life with the students taught me even more than I was able to teach them, allowing me to grow in ways I hadn't anticipated.",
    photo: {
      src: '/media/eryuan.jpg',
      webp: '/media/eryuan.webp',
      alt: 'Conducting a physics experiment with students in Eryuan County.',
      caption: 'Tutoring mathematics, science, and English in Eryuan County.',
      badge: 'Conducting a Physics Experiment in Eryuan',
    },
    links: [{ label: 'Eryuan County', href: 'https://en.wikipedia.org/wiki/Eryuan_County' }],
    note: {
      text: 'The STEM education volunteer program behind this trip was named',
      link: {
        label: 'SJTU’s 2023 "Person of the Year"',
        href: 'https://www.ji.sjtu.edu.cn/off-the-press/2023-12-05/142729/',
      },
    },
  },
];

/** Closing grid: the recognition photographs, none of them of a screen. */
export const beyondGallery: BeyondPhoto[] = [
  {
    src: '/media/Oprize.jpg',
    webp: '/media/Oprize.webp',
    alt: 'MCM 2024 Outstanding Winner recognition.',
    caption: 'MCM Outstanding Winner, 2024',
  },
  {
    src: '/media/2023UPC.jpg',
    webp: '/media/2023UPC.webp',
    alt: 'University Physics Competition 2023 Bronze Medal recognition.',
    caption: 'University Physics Competition Bronze Medal, 2023',
  },
  {
    src: '/media/tenvolunteer.jpg',
    webp: '/media/tenvolunteer.webp',
    alt: 'Named among the Top Ten Volunteers, 2023.',
    caption: 'Named among the Top Ten Volunteers, 2023',
  },
];
