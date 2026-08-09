import type { ReactNode } from 'react';

import { Seo } from '@/components/shell/Seo';
import { CaveatList } from '@/components/ui/CaveatList';
import { EntryMasthead } from '@/components/ui/EntryMasthead';
import { JumpRail } from '@/components/ui/JumpRail';
import { LazyViz } from '@/components/ui/LazyViz';
import { MetricWall } from '@/components/ui/MetricWall';
import { Bullets, Container, Section, SectionHeading } from '@/components/ui/primitives';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/ui/Reveal';
import { ArchitectureMap } from '@/components/viz/ArchitectureMap';
import { CasRace } from '@/components/viz/CasRace';
import { DenominatorSlider } from '@/components/viz/DenominatorSlider';
import { LayerStack } from '@/components/viz/LayerStack';
import { OutcomeFunnel } from '@/components/viz/OutcomeFunnel';
import { PipelineRing } from '@/components/viz/PipelineRing';
import { SignalLatency } from '@/components/viz/SignalLatency';
import { TerminalStates } from '@/components/viz/TerminalStates';
import { VerifyGate } from '@/components/viz/VerifyGate';
import { abf } from '@/content/abf';

/** Content modules stay JSX-free, so `section.viz` carries keys and the page owns the elements. */
const VIZ_NODES: Record<string, ReactNode> = {
  PipelineRing: <PipelineRing />,
  ArchitectureMap: <ArchitectureMap />,
  LayerStack: <LayerStack />,
  CasRace: <CasRace />,
  SignalLatency: <SignalLatency />,
  OutcomeFunnel: <OutcomeFunnel />,
  TerminalStates: <TerminalStates />,
  VerifyGate: <VerifyGate />,
  DenominatorSlider: <DenominatorSlider />,
};

/** Reserved height per viz, so mounting one never shoves the page under the cursor. */
const VIZ_HEIGHT: Record<string, number> = {
  PipelineRing: 540,
  ArchitectureMap: 900,
  LayerStack: 460,
  CasRace: 400,
  SignalLatency: 430,
  OutcomeFunnel: 470,
  TerminalStates: 330,
  VerifyGate: 470,
  DenominatorSlider: 450,
};

/** The rail needs a label that survives a 13rem column; headings do not. */
const RAIL_LABELS: Record<string, string> = {
  'what-it-does': 'What it does',
  'four-layers': 'Four layers',
  architecture: 'Two planes',
  enforcement: 'Enforcement',
  'execution-plane': 'Execution plane',
  'signal-path': 'Signal path',
  'control-plane': 'Control plane',
  'chat-layer': 'Chat layer',
  outcomes: 'Outcomes',
  'verify-gate': 'The gate that never fired',
  benchmark: 'Benchmark',
  audit: 'External audit',
};

const railItems = [
  ...abf.sections.map((s) => ({ id: s.id, label: RAIL_LABELS[s.id] ?? s.heading })),
  { id: 'caveats', label: 'Caveats' },
];

const paragraphs = (body: string) =>
  body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

export default function AutonomousBugFix() {
  return (
    <>
      <Seo
        title="Autonomous Bug-Fix Pipeline — Ruikai Yang"
        description={abf.tagline}
        path="/work/autonomous-bug-fix"
      />

      <Container className="pt-12 sm:pt-16">
        <EntryMasthead
          eyebrow={abf.eyebrow}
          title={abf.title}
          tagline={abf.tagline}
          dates={abf.dates}
          role={abf.role}
          stack={abf.stack}
          caveatTeaser={abf.caveatTeaser}
        />
      </Container>

      <Container className="mt-12 sm:mt-14">
        <Reveal>
          <MetricWall metrics={abf.metrics} cols={5} />
        </Reveal>
      </Container>

      <Container className="mt-4 grid gap-x-12 xl:grid-cols-[minmax(0,1fr)_13rem]">
        {/* Main column first in the DOM: the rail is a shortcut, not the reading order. */}
        <div className="min-w-0">
          {abf.sections.map((s, i) => (
            <Section key={s.id} id={s.id} className={i > 0 ? 'border-t' : undefined}>
              <Reveal>
                <SectionHeading eyebrow={String(i + 1).padStart(2, '0')} title={s.heading} />
                <Prose>
                  {paragraphs(s.body).map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </Prose>
                {s.bullets && (
                  <div className="mt-6 max-w-[68ch]">
                    <Bullets items={s.bullets} />
                  </div>
                )}
              </Reveal>

              {s.viz?.map((key) => (
                <Reveal key={key}>
                  <div className="mt-8">
                    <LazyViz height={VIZ_HEIGHT[key] ?? 420}>{VIZ_NODES[key]}</LazyViz>
                  </div>
                </Reveal>
              ))}
            </Section>
          ))}

          <Section id="caveats" className="border-t">
            <Reveal>
              <CaveatList items={abf.caveats} />
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
