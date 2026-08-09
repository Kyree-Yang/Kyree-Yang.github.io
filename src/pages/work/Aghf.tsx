import { TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

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

      <Container>
        <Section className="pb-0 sm:pb-0">
          <Reveal>
            <Link
              to="/work"
              className="mb-6 inline-flex items-center gap-1.5 font-mono text-[12px] tracking-[0.08em] text-faint uppercase transition-colors hover:text-primary"
            >
              ← all work
            </Link>
            <EntryMasthead
              eyebrow={aghf.eyebrow}
              title={aghf.title}
              tagline={aghf.tagline}
              dates={aghf.dates}
              role={aghf.role}
              stack={aghf.stack}
              credits={aghf.credits}
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
              <p className="mb-4 flex max-w-[72ch] items-start gap-2.5 rounded-[var(--radius-sm)] border border-l-2 border-l-amber bg-surface-2/60 px-3.5 py-2.5 text-[13px] leading-relaxed text-muted">
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
            <div className="max-w-[68ch]">
              <Bullets items={S.contributions.bullets ?? []} />
            </div>

            {/* The working record behind those bullets: the derivation notebook
                and the solver's raw output, before any styling. */}
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              <figure className="cut-card">
                <div className="cut-inner flex h-full flex-col p-0">
                  <div className="flex-1 overflow-hidden border-b bg-white p-2">
                    <picture className="contents">
                      <source srcSet="/media/aghf-notebook.webp" type="image/webp" />
                      <img
                        src="/media/aghf-notebook.jpg"
                        alt="Handwritten derivation notes: Chebyshev nodes and barycentric Lagrange interpolation, with margin notes mapping each symbol to its MATLAB and C++ variable name."
                        width={1200}
                        height={1553}
                        loading="lazy"
                        decoding="async"
                        className="max-h-[420px] w-full object-contain"
                      />
                    </picture>
                  </div>
                  <figcaption className="bg-surface-2/60 px-3 py-2 font-mono text-[11.5px] leading-snug tracking-[0.02em] text-faint">
                    the notebook behind the solver — barycentric Lagrange derivation, symbols
                    mapped to code variables
                  </figcaption>
                </div>
              </figure>
              <VideoCard
                aspect="1280 / 756"
                src="/media/aghf-solver-raw"
                poster="/media/aghf-solver-raw-poster.jpg"
                caption="solver output, raw — Phase 1 control-torque trajectories, unstyled MATLAB export"
                clickToPlay
              />
            </div>
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
