import { Link } from 'react-router-dom';

import { Seo } from '@/components/shell/Seo';
import { CaveatList } from '@/components/ui/CaveatList';
import { DocLink } from '@/components/ui/DocLink';
import { EntryMasthead } from '@/components/ui/EntryMasthead';
import { JumpRail } from '@/components/ui/JumpRail';
import { Bullets, Container, Section, SectionHeading } from '@/components/ui/primitives';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/ui/Reveal';
import { doc } from '@/content/docs';
import { mcm, mcmFigures, type McmFigure } from '@/content/mcm';

const railItems = [
  ...mcm.sections.map((s) => ({ id: s.id, label: s.heading })),
  { id: 'caveats', label: 'Caveats' },
];

/** Plate numbers run across the whole page, not per section. */
const FIG_NUMBER: Record<string, number> = {};
{
  let n = 0;
  for (const s of mcm.sections) {
    for (const f of mcmFigures[s.id] ?? []) FIG_NUMBER[f.src] = ++n;
  }
}

/** Paper figure as a chamfered plate: white media box, mono caption rail. */
function FigurePlate({ figure }: { figure: McmFigure }) {
  return (
    <figure className="mt-8">
      <div className="cut-card">
        <div className="cut-inner p-0">
          <div className="bg-white">
            <picture>
              <source srcSet={figure.webp} type="image/webp" />
              <img
                src={figure.src}
                alt={figure.alt}
                width={figure.width}
                height={figure.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </picture>
          </div>
          <figcaption className="border-t bg-surface-2/60 px-3 py-2 font-mono text-[12px] leading-relaxed tracking-[0.02em] text-faint">
            <span className="mr-1.5 text-fg/70">
              fig. {String(FIG_NUMBER[figure.src]).padStart(2, '0')}
            </span>
            {figure.caption}
          </figcaption>
        </div>
      </div>
    </figure>
  );
}

export default function Mcm() {
  const paper = doc('mcmPaper');

  return (
    <>
      <Seo
        title="Command the Flow — Ruikai Yang"
        description={mcm.tagline}
        path="/work/mcm-2024"
      />

      <Container className="pt-12 sm:pt-16">
        <Link
          to="/work"
          className="mb-6 inline-flex items-center gap-1.5 font-mono text-[12px] tracking-[0.08em] text-faint uppercase transition-colors hover:text-primary"
        >
          ← all work
        </Link>
        <EntryMasthead
          eyebrow={mcm.eyebrow}
          title={mcm.title}
          tagline={mcm.tagline}
          dates={mcm.dates}
          role={mcm.role}
          stack={mcm.stack}
          credits={mcm.credits}
          caveatTeaser={mcm.caveatTeaser}
        />
        <div className="mt-6 flex flex-wrap gap-2">
          <DocLink label={paper.label} href={paper.href} kind={paper.kind} />
        </div>
      </Container>

      <Container className="mt-4 grid gap-x-12 xl:grid-cols-[minmax(0,1fr)_13rem]">
        {/* Main column first in the DOM: the rail is a shortcut, not the reading order. */}
        <div className="min-w-0">
          {mcm.sections.map((s, i) => (
            <Section key={s.id} id={s.id} className={i > 0 ? 'border-t' : undefined}>
              <Reveal>
                <SectionHeading eyebrow={String(i + 1).padStart(2, '0')} title={s.heading} />
                <div className="gap-x-12 xl:grid xl:grid-cols-2">
                  <Prose>
                    <p>{s.body}</p>
                  </Prose>
                  {s.bullets && (
                    <div className="mt-6 xl:mt-0">
                      <Bullets items={s.bullets} />
                    </div>
                  )}
                </div>
              </Reveal>

              {(mcmFigures[s.id] ?? []).map((f) => (
                <Reveal key={f.src}>
                  <FigurePlate figure={f} />
                </Reveal>
              ))}
            </Section>
          ))}

          <Section id="caveats" className="border-t">
            <Reveal>
              <CaveatList items={mcm.caveats} />
            </Reveal>
          </Section>
        </div>

        {/* Wrapper, not the nav itself: a stretched grid item cannot travel under `sticky`. */}
        <div>
          <JumpRail items={railItems} />
        </div>
      </Container>
    </>
  );
}
