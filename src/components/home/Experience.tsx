import { Container, Section } from '@/components/ui/primitives';
import { EntryCard } from '@/components/ui/EntryCard';
import { LazyViz } from '@/components/ui/LazyViz';
import { Reveal } from '@/components/ui/Reveal';
import { DagFlow } from '@/components/viz/DagFlow';
import { PipelineRing } from '@/components/viz/PipelineRing';
import { experience } from '@/content/profile';
import { workIndex } from '@/content/site';

/** Fails loudly at import time rather than rendering an empty card. */
function row(slug: string) {
  const found = workIndex.find((r) => r.slug === slug);
  if (!found) throw new Error(`Unknown work entry: ${slug}`);
  return found;
}

const abf = row('autonomous-bug-fix');
const designLab = row('design-lab');

const CAVEATS = {
  abf: 'The last mile never closed — automated self-verification returned a verdict 0 times in 46 attempts.',
  designLab:
    'Device-verified end to end on iOS only; the Android side is specified and templated but proven at contract level.',
};

/**
 * The two agent systems are one internship, not two unrelated side projects.
 * Presenting them inside an employer masthead is the whole point of this block —
 * without it a reader has no idea they were built for a production codebase,
 * under review, on a deadline.
 */
export function Experience() {
  return (
    <Section id="experience" className="border-t bg-bg-subtle">
      <Container>
        <Reveal>
          <div className="rounded-[var(--radius-lg)] border bg-surface p-5 sm:p-7 lg:p-8">
            <header className="border-b pb-6">
              <p className="font-mono text-[11px] tracking-[0.22em] text-primary uppercase">
                Experience
              </p>

              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-[28px]">
                  {experience.org}
                  <span className="text-muted"> · {experience.team}</span>
                </h2>
                <p className="font-mono text-[12px] text-faint">{experience.dates}</p>
              </div>

              <p className="mt-1.5 font-mono text-[12px] text-muted">
                {experience.title} · {experience.place}
              </p>

              <p className="mt-5 max-w-[70ch] text-[15px] leading-relaxed text-muted">
                Two systems in twelve weeks, built on one rule: an agent touches production code
                only after the checks that don&rsquo;t trust it have passed. Both shipped into{' '}
                {experience.context}; neither relies on the agent behaving well.
              </p>
            </header>

            <div className="mt-7 grid gap-5 lg:grid-cols-2 lg:gap-6">
              <EntryCard
                emphasis
                eyebrow="Workstream 01 · autonomous repair"
                to={`/work/${abf.slug}`}
                title={abf.title}
                tagline={abf.tagline}
                dates={abf.dates}
                metrics={abf.metrics}
                caveat={CAVEATS.abf}
                viz={
                  <LazyViz height={280}>
                    <PipelineRing bare />
                  </LazyViz>
                }
              />

              <EntryCard
                emphasis
                eyebrow="Workstream 02 · design-to-code delivery"
                to={`/work/${designLab.slug}`}
                title={designLab.title}
                tagline={designLab.tagline}
                dates={designLab.dates}
                metrics={designLab.metrics}
                caveat={CAVEATS.designLab}
                viz={
                  <LazyViz height={200}>
                    <DagFlow bare />
                  </LazyViz>
                }
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
