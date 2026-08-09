import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';

import { Seo } from '@/components/shell/Seo';
import { Container, Section, SectionHeading } from '@/components/ui/primitives';
import { FilterChips } from '@/components/ui/FilterChips';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/ui/Reveal';
import { colophon, workFilters, workHeader, workIndex } from '@/content/site';
import type { WorkRow } from '@/content/site';
import type { Entry } from '@/content/types';
import { cn } from '@/lib/utils';

type Category = Entry['category'];

/** FilterChips prepends its own `all` chip, so the data's `all` row is dropped here. */
const CATEGORY_OPTIONS = workFilters.filter(
  (f): f is { id: Category; label: string } => f.id !== 'all',
);

/** Ids and dimensions mirror the MANIFEST in scripts/export-gifs.mjs. */
const GIFS: { id: string; title: string; w: number; h: number }[] = [
  { id: 'abf-pipeline', title: '20-step state machine', w: 760, h: 500 },
  { id: 'abf-layers', title: 'Four layers', w: 760, h: 462 },
  { id: 'abf-funnel', title: 'Outcome funnel · the honest shape', w: 760, h: 426 },
  { id: 'abf-cas', title: 'Claiming a job under concurrency', w: 760, h: 336 },
  { id: 'abf-signal', title: 'Click → agent spawn', w: 760, h: 386 },
  { id: 'designlab-dag', title: '12-node delivery DAG', w: 760, h: 395 },
  { id: 'i18n-delta-loop', title: 'Translation wait · 300s → 5.1s', w: 760, h: 362 },
  { id: 'rtl-mirror', title: 'RTL mirroring', w: 760, h: 362 },
  { id: 'weak-network', title: 'Weak-network state machine', w: 760, h: 362 },
  { id: 'search-shards', title: 'Query fan-out across 12 nodes', w: 760, h: 370 },
  { id: 'aghf-morph', title: 'Trajectory relaxing under geometric heat flow', w: 760, h: 362 },
  { id: 'degree-gantt', title: 'Concurrent, not sequential', w: 760, h: 344 },
  { id: 'abf-architecture', title: 'Two planes and the one wire between them', w: 980, h: 660 },
];

/**
 * Per-project spine color for the catalog: the cover carries a book-spine band
 * in the project's own hue, so six cards read as one system with six voices.
 * MCM gets the award wash — the same maize the honor chips use.
 */
const SPINE: Record<string, { band: string; value: string; dot: string }> = {
  'autonomous-bug-fix': { band: 'bg-primary/10', value: 'text-primary', dot: 'bg-primary' },
  'design-lab': { band: 'bg-amber/10', value: 'text-amber', dot: 'bg-amber' },
  aghf: { band: 'bg-violet/10', value: 'text-violet', dot: 'bg-violet' },
  'search-engine': { band: 'bg-cyan/10', value: 'text-cyan', dot: 'bg-cyan' },
  'diffusion-pyramid': { band: 'bg-emerald/10', value: 'text-emerald', dot: 'bg-emerald' },
  'mcm-2024': { band: 'bg-gold/15', value: 'text-fg', dot: 'bg-gold' },
};

/**
 * Catalog card: one representative landscape frame with the project's spine
 * band, then the record line and a one-row metric strip. The whole card is the
 * link; "what broke" lives on the detail page, so the catalog stays scannable.
 */
function CoverCard({ row }: { row: WorkRow }) {
  const isGif = row.cover.src.endsWith('.gif');
  // The DagFlow export carries edge-to-edge legend text that object-cover
  // would crop mid-word; letterbox that one instead.
  const contain = row.slug === 'design-lab';
  const spine = SPINE[row.slug] ?? SPINE.aghf;
  const lead = row.metrics[0];
  return (
    <Link to={`/work/${row.slug}`} className="group block h-full">
      <article className="cut-card h-full">
        <div className="cut-inner flex h-full flex-col p-0">
          <div className="grid grid-cols-[minmax(0,1fr)_92px] border-b">
            <div className="relative aspect-[16/10] overflow-hidden bg-bg-subtle">
              <picture>
                {row.cover.webp && <source srcSet={row.cover.webp} type="image/webp" />}
                <img
                  src={row.cover.src}
                  alt={row.cover.alt}
                  width={1200}
                  height={750}
                  loading="lazy"
                  decoding="async"
                  className={cn("size-full transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100", contain ? "object-contain" : "object-cover")}
                />
              </picture>
              {isGif && (
                <span className="absolute top-2.5 right-2.5 border bg-surface/90 px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] text-faint uppercase">
                  live drawing
                </span>
              )}
            </div>
            <div
              className={cn('flex flex-col justify-between border-l p-3', spine.band)}
            >
              <span aria-hidden className={cn('size-2 rounded-full', spine.dot)} />
              <div>
                <div className={cn('tnum font-mono text-[17px] leading-tight font-bold whitespace-nowrap', spine.value)}>
                  {lead.value}
                </div>
                <div className="mt-1 font-mono text-[9px] leading-snug tracking-[0.08em] text-faint uppercase">
                  {lead.label}
                </div>
              </div>
            </div>
          </div>
          <div className="elevate flex flex-1 flex-col p-4 transition-colors sm:p-5">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
              <span>{row.dates}</span>
              <span aria-hidden>·</span>
              <span className="text-primary">{row.categoryLabel}</span>
            </div>
            <h3 className="mt-2 flex items-start gap-2 text-lg font-semibold tracking-[-0.01em] sm:text-xl">
              <span>{row.title}</span>
              <ArrowRight
                aria-hidden
                className="mt-1.5 size-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{row.tagline}</p>
            <p className="tnum mt-auto pt-3 font-mono text-[11.5px] text-faint">
              {row.metrics.map((m, i) => (
                <span key={m.label}>
                  {i > 0 && <span aria-hidden> · </span>}
                  <span className="text-muted">{m.value}</span> {m.label}
                </span>
              ))}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function Work() {
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const rows = filter === 'all' ? workIndex : workIndex.filter((r) => r.category === filter);

  return (
    <>
      <Seo
        title="Work — Ruikai Yang"
        description="Six projects, newest first: an autonomous bug-fix pipeline, a design-to-code agent DAG, PDE trajectory optimization, a from-scratch distributed search engine, a diffusion pipeline, and an MCM Outstanding Winner model."
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {rows.map((row, i) => (
              <Reveal key={row.slug} delay={i * 60} className="h-full">
                <CoverCard row={row} />
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
