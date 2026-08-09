import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Seo } from '@/components/shell/Seo';
import { CaveatList } from '@/components/ui/CaveatList';
import { EntryMasthead } from '@/components/ui/EntryMasthead';
import { JumpRail } from '@/components/ui/JumpRail';
import { LazyViz } from '@/components/ui/LazyViz';
import { MetricWall } from '@/components/ui/MetricWall';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/ui/Reveal';
import { Bullets, Callout, Container, Section, SectionHeading } from '@/components/ui/primitives';
import { DagFlow } from '@/components/viz/DagFlow';
import { DeltaMtRace } from '@/components/viz/DeltaMtRace';
import { NetworkStates } from '@/components/viz/NetworkStates';
import { RtlMirror } from '@/components/viz/RtlMirror';
import { ScenarioMatrix } from '@/components/viz/ScenarioMatrix';
import { designlab } from '@/content/designlab';

/**
 * Content modules name their visualizations as strings so prose and charts stay
 * decoupled; the page owns the mapping — and the height reservation each one
 * needs so a late mount never shoves the page under the reader's cursor.
 */
const VIZ_BY_KEY: Record<string, ReactNode> = {
  DagFlow: (
    <LazyViz height={470}>
      <DagFlow />
    </LazyViz>
  ),
  DeltaMtRace: (
    <LazyViz height={500}>
      <DeltaMtRace />
    </LazyViz>
  ),
  RtlMirror: (
    <LazyViz height={500}>
      <RtlMirror />
    </LazyViz>
  ),
  NetworkStates: (
    <LazyViz height={500}>
      <NetworkStates />
    </LazyViz>
  ),
  ScenarioMatrix: (
    <LazyViz height={600}>
      <ScenarioMatrix />
    </LazyViz>
  ),
};

/** Headings are full sentences; the rail needs thumb-sized labels. */
const RAIL_LABELS: Record<string, string> = {
  problem: 'The problem',
  dag: '12-node DAG',
  'hooks-and-gates': 'Hooks & gates',
  localization: 'Localization',
  rtl: 'RTL boundaries',
  'network-states': 'Network states',
  'fault-injection': 'Fault injection',
  dashboard: 'Delivery board',
};

const railItems = [
  ...designlab.sections.map((s) => ({ id: s.id, label: RAIL_LABELS[s.id] ?? s.heading })),
  { id: 'caveats', label: 'Caveats' },
];

const paragraphs = (body: string) =>
  body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

export default function DesignLab() {
  return (
    <>
      <Seo
        title="Design Lab — Ruikai Yang"
        description={designlab.tagline}
        path="/work/design-lab"
      />

      <Container className="pt-10 sm:pt-14">
        <Link
          to="/work"
          className="mb-6 inline-flex items-center gap-1.5 font-mono text-[12px] tracking-[0.08em] text-faint uppercase transition-colors hover:text-primary"
        >
          ← all work
        </Link>
        <EntryMasthead
          eyebrow={designlab.eyebrow}
          title={designlab.title}
          tagline={designlab.tagline}
          dates={designlab.dates}
          role={designlab.role}
          stack={designlab.stack}
          credits={designlab.credits}
          caveatTeaser={designlab.caveatTeaser}
        />

        <Section>
          <Reveal>
            <MetricWall metrics={designlab.metrics} cols={5} />
          </Reveal>
        </Section>

        <div className="grid gap-x-12 xl:grid-cols-[minmax(0,1fr)_13rem]">
          <div className="min-w-0">
            {designlab.sections.map((s, i) => (
              <Section key={s.id} id={s.id}>
                <Reveal>
                  <SectionHeading eyebrow={String(i + 1).padStart(2, '0')} title={s.heading} />

                  <div className="gap-x-12 xl:grid xl:grid-cols-2">
                    <Prose>
                      {paragraphs(s.body).map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </Prose>

                    {s.bullets && (
                      <div className="mt-6 xl:mt-0">
                        <Bullets items={s.bullets} />
                      </div>
                    )}
                  </div>

                  {s.callout && (
                    <div className="mt-7 max-w-[68ch]">
                      <Callout title={s.callout.title} tone="amber">
                        {s.callout.text}
                      </Callout>
                    </div>
                  )}
                </Reveal>

                {s.viz?.map((key) => (
                  <div key={key} className="mt-8">
                    <Reveal>{VIZ_BY_KEY[key]}</Reveal>
                  </div>
                ))}
              </Section>
            ))}

            <Section id="caveats">
              <Reveal>
                <CaveatList items={designlab.caveats} />
              </Reveal>
            </Section>
          </div>

          {/* Stretched wrapper, not the nav itself: sticky needs room to travel. */}
          <div className="hidden xl:block">
            <JumpRail items={railItems} />
          </div>
        </div>
      </Container>
    </>
  );
}
