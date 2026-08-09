import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';

import { Seo } from '@/components/shell/Seo';
import { Container, Section, SectionHeading } from '@/components/ui/primitives';
import { FilterChips } from '@/components/ui/FilterChips';
import { LazyViz } from '@/components/ui/LazyViz';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/ui/Reveal';
import { AghfMorph } from '@/components/viz/AghfMorph';
import { DagFlow } from '@/components/viz/DagFlow';
import { PipelineDiagram } from '@/components/viz/PipelineDiagram';
import { PipelineRing } from '@/components/viz/PipelineRing';
import { ShardFanout } from '@/components/viz/ShardFanout';
import { colophon, workFilters, workHeader, workIndex } from '@/content/site';
import type { WorkRow } from '@/content/site';
import type { Entry } from '@/content/types';

type Category = Entry['category'];

/** FilterChips prepends its own `all` chip, so the data's `all` row is dropped here. */
const CATEGORY_OPTIONS = workFilters.filter(
  (f): f is { id: Category; label: string } => f.id !== 'all',
);

/**
 * Index rows render the entry's viz `bare`: no frame, no caption, and — for
 * AghfMorph — no scrubber, which is what keeps the row free of controls nested
 * inside its link. Heights only reserve space until the viz mounts.
 */
const ROW_VIZ: Record<string, { Viz: React.ComponentType<{ bare?: boolean }>; height: number }> = {
  PipelineRing: { Viz: PipelineRing, height: 210 },
  DagFlow: { Viz: DagFlow, height: 150 },
  AghfMorph: { Viz: AghfMorph, height: 155 },
  ShardFanout: { Viz: ShardFanout, height: 155 },
  PipelineDiagram: { Viz: PipelineDiagram, height: 130 },
};

/** Ids and dimensions mirror the MANIFEST in scripts/export-gifs.mjs. */
const GIFS: { id: string; title: string; w: number; h: number }[] = [
  { id: 'abf-pipeline', title: '20-step state machine', w: 760, h: 490 },
  { id: 'abf-layers', title: 'Four layers', w: 760, h: 462 },
  { id: 'abf-funnel', title: 'Outcome funnel · the honest shape', w: 760, h: 426 },
  { id: 'abf-cas', title: 'Claiming a job under concurrency', w: 760, h: 336 },
  { id: 'abf-signal', title: 'Click → agent spawn', w: 760, h: 386 },
  { id: 'designlab-dag', title: '12-node delivery DAG', w: 760, h: 362 },
  { id: 'i18n-delta-loop', title: 'Translation wait · 300s → 5.1s', w: 760, h: 362 },
  { id: 'rtl-mirror', title: 'RTL mirroring', w: 760, h: 362 },
  { id: 'weak-network', title: 'Weak-network state machine', w: 760, h: 362 },
  { id: 'search-shards', title: 'Query fan-out across 12 nodes', w: 760, h: 370 },
  { id: 'aghf-morph', title: 'Trajectory relaxing under geometric heat flow', w: 760, h: 362 },
  { id: 'degree-gantt', title: 'Concurrent, not sequential', w: 760, h: 344 },
  { id: 'abf-architecture', title: 'Two planes and the one wire between them', w: 980, h: 816 },
];

function EntryRow({ row }: { row: WorkRow }) {
  const viz = ROW_VIZ[row.viz];

  return (
    <article className="card overflow-hidden">
      <div className="grid lg:grid-cols-[1.1fr_1fr]">
        <Link to={`/work/${row.slug}`} className="elevate group flex flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
            <span>{row.dates}</span>
            <span aria-hidden>·</span>
            <span className="text-primary">{row.categoryLabel}</span>
          </div>

          <h3 className="mt-2.5 flex items-start gap-2 text-lg font-semibold tracking-[-0.01em] sm:text-xl">
            <span>{row.title}</span>
            <ArrowRight
              aria-hidden
              className="mt-1.5 size-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
            />
          </h3>

          <p className="mt-1 text-[13px] text-faint">{row.role}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{row.tagline}</p>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {row.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-[var(--radius-sm)] border bg-surface-2/50 px-2.5 py-1.5"
              >
                <div className="tnum font-mono text-[13px] font-semibold text-primary">
                  {m.value}
                </div>
                <div className="mt-0.5 text-[11px] leading-snug text-faint">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-auto border-t pt-5">
            <div className="font-mono text-[10px] tracking-[0.14em] text-faint uppercase">
              what broke
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted italic">{row.teaser}</p>
          </div>
        </Link>

        {viz && (
          <div className="flex items-center border-t bg-bg-subtle p-4 lg:border-t-0 lg:border-l">
            <div className="w-full">
              <LazyViz height={viz.height}>
                <viz.Viz bare />
              </LazyViz>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Work() {
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const rows = filter === 'all' ? workIndex : workIndex.filter((r) => r.category === filter);

  return (
    <>
      <Seo
        title="Work — Ruikai Yang"
        description="Five systems, newest first: an autonomous bug-fix pipeline, a design-to-code agent DAG, PDE trajectory optimization, a from-scratch distributed search engine, and a diffusion pipeline."
        path="/work"
      />

      <Section className="pb-0 sm:pb-0">
        <Container>
          <Reveal>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {workHeader.title}
            </h1>
            <Prose size="lead" className="mt-4">
              <p>{workHeader.lead}</p>
            </Prose>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <FilterChips options={CATEGORY_OPTIONS} value={filter} onChange={setFilter} />
              <p aria-live="polite" className="font-mono text-[11px] text-faint">
                {rows.length} of {workIndex.length} entries
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="space-y-5">
            {rows.map((row, i) => (
              <Reveal key={row.slug} delay={i * 60}>
                <EntryRow row={row} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="colophon" className="border-t bg-bg-subtle">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="colophon" title={colophon.title} />
            <Prose>
              <p>{colophon.body}</p>
            </Prose>

            <div className="mt-6 max-w-xl overflow-x-auto">
              <table className="w-full min-w-[17rem] text-left text-[13px]">
                <caption className="sr-only">
                  Media payload of the previous site compared with this one
                </caption>
                <thead>
                  <tr className="border-b">
                    <th
                      scope="col"
                      className="py-2 pr-4 font-mono text-[10px] font-medium tracking-[0.14em] text-faint uppercase"
                    >
                      asset
                    </th>
                    <th
                      scope="col"
                      className="py-2 font-mono text-[10px] font-medium tracking-[0.14em] text-faint uppercase"
                    >
                      before → after
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {colophon.assets.map((a) => (
                    <tr key={a.label} className="border-b last:border-b-0">
                      <td className="py-2.5 pr-4 text-muted">{a.label}</td>
                      <td className="tnum py-2.5 font-mono text-[12px] text-fg">{a.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section id="gif" className="border-t">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="build output"
              title="Exported GIFs"
              sub="Because every visualization is a pure function of t, the export script drives the /_gif/:id route frame by frame through headless Chrome and hands the frames to ffmpeg. These are the committed artifacts — the same components you see above, without page chrome."
            />
            <p className="-mt-4 mb-8 font-mono text-[11px] break-all text-faint">
              {'npm run gif → public/gif/<id>.gif'}
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GIFS.map((g, i) => (
              <Reveal key={g.id} delay={(i % 3) * 60}>
                <figure className="card flex h-full flex-col overflow-hidden">
                  <img
                    src={`/gif/${g.id}.gif`}
                    alt={`${g.title} — exported animation`}
                    loading="lazy"
                    decoding="async"
                    width={g.w}
                    height={g.h}
                    className="h-auto w-full border-b bg-bg-subtle"
                  />
                  <figcaption className="flex flex-1 flex-col gap-3 p-4">
                    <div>
                      <div className="text-[14px] leading-snug font-medium">{g.title}</div>
                      <div className="mt-1 font-mono text-[11px] break-all text-faint">
                        {g.id}.gif
                      </div>
                    </div>
                    <a
                      href={`/gif/${g.id}.gif`}
                      download
                      className="card elevate mt-auto inline-flex w-fit items-center gap-2 px-2.5 py-1 text-[13px] font-medium transition-colors hover:border-line-strong"
                    >
                      <Download size={13} strokeWidth={1.75} className="text-muted" aria-hidden />
                      <span>Download</span>
                    </a>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
