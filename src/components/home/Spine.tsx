import { Container, Section } from '@/components/ui/primitives';
import { EntryCard } from '@/components/ui/EntryCard';
import { LazyViz } from '@/components/ui/LazyViz';
import { Reveal } from '@/components/ui/Reveal';
import { DagFlow } from '@/components/viz/DagFlow';
import { PipelineRing } from '@/components/viz/PipelineRing';
import { workIndex } from '@/content/site';

/** Fails loudly at import time rather than rendering an empty card. */
function row(slug: string) {
  const found = workIndex.find((r) => r.slug === slug);
  if (!found) throw new Error(`Unknown work entry: ${slug}`);
  return found;
}

const abf = row('autonomous-bug-fix');
const designLab = row('design-lab');

export function Spine() {
  return (
    <Section className="pt-2 sm:pt-4">
      <Container>
        {/* One Reveal for the pair so the two cards stretch to a shared height. */}
        <Reveal>
          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <EntryCard
              emphasis
              to={`/work/${abf.slug}`}
              title={abf.title}
              tagline={abf.tagline}
              dates={abf.dates}
              metrics={abf.metrics}
              caveat="The last mile never closed — automated self-verification returned a verdict 0 times in 46 attempts."
              viz={
                <LazyViz height={280}>
                  <PipelineRing bare />
                </LazyViz>
              }
            />

            <EntryCard
              emphasis
              to={`/work/${designLab.slug}`}
              title={designLab.title}
              tagline={designLab.tagline}
              dates={designLab.dates}
              metrics={designLab.metrics}
              caveat="Device-verified end to end on iOS only; the Android side is specified and templated but proven at contract level."
              viz={
                <LazyViz height={200}>
                  <DagFlow bare />
                </LazyViz>
              }
            />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
