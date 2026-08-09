import { Link } from 'react-router-dom';

import { HeroConsole } from '@/components/home/HeroConsole';
import { Experience } from '@/components/home/Experience';
import { SupportingActs } from '@/components/home/SupportingActs';
import { Seo } from '@/components/shell/Seo';
import { DocLink } from '@/components/ui/DocLink';
import { LazyViz } from '@/components/ui/LazyViz';
import { Container, Section, SectionHeading } from '@/components/ui/primitives';
import { PhotoStrip, type StripPhoto } from '@/components/ui/PhotoStrip';
import { Reveal } from '@/components/ui/Reveal';
import { DegreeGantt } from '@/components/viz/DegreeGantt';
import { doc } from '@/content/docs';
import { degreeNote, publications } from '@/content/profile';
import { siteMeta } from '@/content/site';

/** Four lines only — the remaining awards live on /cv#honors rather than here. */
const RECOGNITION = [
  'MCM 2024 — Outstanding Winner (top <1%)',
  'China Undergraduate National Scholarship (top 1.5%)',
  'University of Michigan Dean’s Honor List ×2',
  'Tang Junyuan Scholarship (top 0.5%)',
];

/** The field-work strip: five frames, scrolls sideways like a contact sheet. */
const BEYOND_PHOTOS: StripPhoto[] = [
  {
    src: '/media/green_grid.jpg',
    webp: '/media/green_grid.webp',
    alt: 'The planting site in the Tengger Desert.',
    caption: 'Sand-control planting line · Minqin edge, Tengger Desert',
  },
  {
    src: '/media/tengger-fire.jpg',
    webp: '/media/tengger-fire.webp',
    alt: 'Tending the camp stove during the Tengger Desert sand-control trip.',
    caption: 'Camp logistics on the same trip — tending the stove',
  },
  {
    src: '/media/eryuan-teaching.jpg',
    webp: '/media/eryuan-teaching.webp',
    alt: 'Teaching a water-purification science lesson to middle-school students in Eryuan County.',
    caption: 'Teaching a water-purification lesson · Eryuan, Yunnan',
  },
  {
    src: '/media/eryuan.jpg',
    webp: '/media/eryuan.webp',
    alt: 'Conducting a physics experiment with students in Eryuan County.',
    caption: 'Physics experiment with the same class · Eryuan, Yunnan',
  },
  {
    src: '/media/tenvolunteer.jpg',
    webp: '/media/tenvolunteer.webp',
    alt: 'Named among the Top Ten Volunteers, 2023.',
    caption: 'Top Ten Volunteers · 2023',
  },
];

/** Faces behind the Recognition list — teaching, the MCM team, the award. */
const RECOGNITION_PHOTOS: StripPhoto[] = [
  {
    src: '/media/mcm-team.jpg',
    webp: '/media/mcm-team.webp',
    alt: 'With both MCM 2024 teammates after the Outstanding Winner result.',
    caption: 'MCM 2024 Outstanding Winner · with the team',
  },
  {
    src: '/media/wu-sun-scholarship.jpg',
    webp: '/media/wu-sun-scholarship.webp',
    alt: 'Award ceremony of the John Wu and Jane Sun Excellence Scholarship.',
    caption: 'John Wu and Jane Sun Excellence Scholarship · Nov 2023',
  },
  {
    src: '/media/TA.jpg',
    webp: '/media/TA.webp',
    alt: 'Holding a PHYS1500J recitation as teaching assistant at SJTU.',
    caption: 'PHYS1500J recitation, teaching assistant · Summer 2024',
  },
];

export default function Home() {
  return (
    <>
      <Seo title={siteMeta.title} description={siteMeta.description} path="/" />

      <HeroConsole />
      <Experience />
      <SupportingActs />

      <Section id="timeline">
        <Container>
          <Reveal>
            {/* The viz is rendered bare: its own frame repeats this heading verbatim. */}
            <SectionHeading title="Concurrent, not sequential" sub={degreeNote} />
            <div className="card p-3 sm:p-4">
              <LazyViz height={300}>
                <DegreeGantt bare />
              </LazyViz>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section id="publications" className="border-t bg-bg-subtle">
        <Container>
          <Reveal>
            <SectionHeading title="Publications" />
            <ol className="grid gap-3 lg:grid-cols-2">
              {publications.map((pub) => {
                const ref = doc(pub.doc);
                return (
                  <li key={pub.title} className="card flex flex-col p-4 sm:p-5">
                    <span className="font-mono text-[11px] tracking-[0.14em] text-faint">
                      {pub.year}
                    </span>
                    <h3 className="mt-1.5 text-[15px] leading-snug font-semibold text-balance">
                      {pub.title}
                    </h3>
                    <div className="mt-4">
                      <DocLink label="PDF" href={ref.href} kind={ref.kind} />
                    </div>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </Container>
      </Section>

      <Section id="recognition">
        <Container>
          <Reveal>
            <SectionHeading title="Recognition" />
            <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12">
              <div>
                <ul className="card divide-y overflow-hidden">
                  {RECOGNITION.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-3 px-4 py-3 text-[15px] leading-relaxed sm:px-5"
                    >
                      <span
                        aria-hidden
                        className="mt-[10px] size-1.5 shrink-0 rounded-full bg-primary/70"
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/cv#honors"
                  className="mt-5 inline-flex text-sm font-medium text-primary underline decoration-line-strong underline-offset-[3px] hover:decoration-primary"
                >
                  8 awards, 6 teaching and leadership roles →
                </Link>
              </div>
              <PhotoStrip photos={RECOGNITION_PHOTOS} label="Recognition photos" />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section id="beyond" className="border-t bg-bg-subtle">
        <Container>
          <Reveal>
            <p className="eyebrow mb-6">beyond the lab</p>
            <PhotoStrip photos={BEYOND_PHOTOS} label="Field-work photos" fade="subtle" />
            <Link
              to="/beyond"
              className="mt-6 inline-flex text-sm font-medium text-primary underline decoration-line-strong underline-offset-[3px] hover:decoration-primary"
            >
              Desert reforestation, rural teaching, and three competition medals →
            </Link>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
