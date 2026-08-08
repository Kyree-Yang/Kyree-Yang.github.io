import { TriangleAlert } from 'lucide-react';

import { Seo } from '@/components/shell/Seo';
import { CaveatList } from '@/components/ui/CaveatList';
import { DocLink } from '@/components/ui/DocLink';
import { EntryMasthead } from '@/components/ui/EntryMasthead';
import { LazyViz } from '@/components/ui/LazyViz';
import { LinkRow } from '@/components/ui/LinkRow';
import { Bullets, Container, Section, SectionHeading } from '@/components/ui/primitives';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/ui/Reveal';
import { VideoCard } from '@/components/ui/VideoCard';
import { AghfMorph } from '@/components/viz/AghfMorph';
import { aghf, aghfLinks, aghfMedia } from '@/content/aghf';
import { doc } from '@/content/docs';
import { publications } from '@/content/profile';
import type { Section as EntrySection } from '@/content/types';

/** Sections are addressed by id so the page order can never silently drift from the content module. */
const S: Record<string, EntrySection> = Object.fromEntries(aghf.sections.map((s) => [s.id, s]));

const demoVideo = doc('aghfDemoVideo');
const originDoc = doc('transformableWheel');

export default function Aghf() {
  return (
    <>
      <Seo
        title="AGHF trajectory optimization — Ruikai Yang"
        description="Affine Geometric Heat Flow relaxes a bad trajectory into a feasible one. Analytical Jacobian modules in C++ took 40% off average solver time, and the method was carried from simulation onto a real arm at ROAHM Lab."
        path="/work/aghf"
      />

      <Container size="read">
        <Section className="pb-0 sm:pb-0">
          <Reveal>
            <EntryMasthead
              eyebrow={aghf.eyebrow}
              title={aghf.title}
              tagline={aghf.tagline}
              dates={aghf.dates}
              role={aghf.role}
              stack={aghf.stack}
              caveatTeaser={aghf.caveatTeaser}
            />
            <div className="mt-6">
              <LinkRow links={aghfLinks} size="sm" />
            </div>
          </Reveal>
        </Section>

        <Section id="explainer">
          <Reveal>
            <SectionHeading title={S.explainer.heading} />
            <Prose size="lead">
              <p>{S.explainer.body}</p>
            </Prose>
          </Reveal>

          <Reveal>
            <div className="mt-8">
              {/* The disclaimer sits above the drawing, at body weight — a reader who only
                  looks at the picture still cannot mistake it for solver output. */}
              <p className="mb-4 flex items-start gap-2.5 rounded-[var(--radius-sm)] border border-l-2 border-l-amber bg-surface-2/60 px-3.5 py-2.5 text-[13px] leading-relaxed text-muted">
                <TriangleAlert
                  aria-hidden
                  size={15}
                  strokeWidth={1.75}
                  className="mt-[3px] shrink-0 text-amber"
                />
                <span>
                  The animation below is an{' '}
                  <span className="font-medium text-fg">
                    illustrative relaxation, not the lab's solver output
                  </span>{' '}
                  — a curve-shortening flow with obstacle repulsion, computed in the browser. Drag
                  the scrubber to step the iteration yourself.
                </span>
              </p>

              <LazyViz height={420}>
                <AghfMorph />
              </LazyViz>
            </div>
          </Reveal>
        </Section>

        <Section id="contributions">
          <Reveal>
            <SectionHeading title={S.contributions.heading} />
            <Bullets items={S.contributions.bullets ?? []} />
          </Reveal>
        </Section>

        <Section id="sim-hardware">
          <Reveal>
            <SectionHeading
              title={S['sim-hardware'].heading}
              sub="The simulation clip plays on its own; the hardware clip waits for a click, because the proof point deserves a deliberate look rather than motion in the corner of the eye."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {aghfMedia.map((m) => (
                <VideoCard
                  key={m.src}
                  src={m.src}
                  poster={m.poster}
                  caption={m.caption}
                  clickToPlay={m.clickToPlay}
                />
              ))}
            </div>
          </Reveal>
        </Section>

        <Section id="publications">
          <Reveal>
            <SectionHeading title={S.publications.heading} />
            <ol className="space-y-6">
              {publications.map((p) => {
                const d = doc(p.doc);
                return (
                  <li key={p.doc} className="border-l-2 border-l-line pl-4 sm:pl-5">
                    <div className="font-mono text-[11px] tracking-[0.14em] text-faint">{p.year}</div>
                    <p className="mt-1.5 max-w-[68ch] text-[15px] leading-relaxed">{p.title}</p>
                    <div className="mt-3">
                      <DocLink label={d.label} href={d.href} kind={d.kind} />
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6">
              <DocLink label={demoVideo.label} href={demoVideo.href} kind={demoVideo.kind} />
            </div>
          </Reveal>
        </Section>

        <Section id="origin">
          <Reveal>
            <SectionHeading title={S.origin.heading} />
            <Prose>
              <p>{S.origin.body}</p>
            </Prose>
            <div className="mt-5">
              <DocLink label={originDoc.label} href={originDoc.href} kind={originDoc.kind} />
            </div>
          </Reveal>
        </Section>

        <Section id="caveats" className="border-t">
          <Reveal>
            <CaveatList items={aghf.caveats} />
          </Reveal>
        </Section>
      </Container>
    </>
  );
}
