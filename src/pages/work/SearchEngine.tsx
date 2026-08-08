import { useState } from 'react';
import { ChevronDown, Play } from 'lucide-react';

import { Seo } from '@/components/shell/Seo';
import { CaveatList } from '@/components/ui/CaveatList';
import { DocLink } from '@/components/ui/DocLink';
import { EntryMasthead } from '@/components/ui/EntryMasthead';
import { KpiRangeBar } from '@/components/ui/KpiRangeBar';
import { LazyViz } from '@/components/ui/LazyViz';
import { LinkRow } from '@/components/ui/LinkRow';
import { Bullets, Card, Container, Section, SectionHeading, Stat } from '@/components/ui/primitives';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/ui/Reveal';
import { VideoCard } from '@/components/ui/VideoCard';
import { ShardFanout } from '@/components/viz/ShardFanout';
import { doc } from '@/content/docs';
import {
  searchEngine,
  searchEngineDemo,
  searchEngineKpis,
  searchEngineLinks,
  type SearchKpi,
} from '@/content/searchEngine';
import { cn } from '@/lib/utils';

const architecture = searchEngine.sections.find((s) => s.id === 'architecture')!;
const owned = searchEngine.sections.find((s) => s.id === 'owned')!;

/**
 * The two changes that moved a measured number, kept apart from the ownership
 * list so each one carries its own before/after instead of a résumé verb.
 */
const OPTIMIZATIONS = [
  {
    title: 'Profiling the aggregator path',
    delta: '~8 s → under 2 s',
    body: 'A query is only as fast as its slowest shard, because the aggregator cannot merge and re-rank until every partial result is in. Profiling that merge path under concurrent load — rather than chasing the average, which already looked fine — took tail query latency from roughly eight seconds to under two.',
  },
  {
    title: 'UTF-8 plus delta and variable-length encoding',
    delta: '≈ −50% on disk',
    body: 'Re-encoding the inverted index cut its on-disk footprint roughly in half. The win compounds: smaller postings mean more of a shard fits in cache, so the serving path reads fewer pages per query as well.',
  },
];

/**
 * Seven figures, one of which refuses to be a figure: query latency is a
 * measured spread, and averaging it away would hide the straggler shard that
 * the whole architecture section is about.
 */
function KpiWall({ items }: { items: SearchKpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((k) =>
        k.kind === 'range' ? (
          <div key={k.label} className="col-span-2 sm:col-span-1">
            <KpiRangeBar
              label={k.label}
              min={k.min}
              max={k.max}
              unit={k.unit}
              scaleMax={k.scaleMax}
            />
            {k.note && (
              <p className="mt-1.5 px-1 text-xs leading-snug text-faint">{k.note}</p>
            )}
          </div>
        ) : (
          <Stat
            key={k.label}
            value={k.value}
            label={k.label}
            note={k.note}
            prefix={k.prefix}
            suffix={k.suffix}
            decimals={k.decimals}
            tone={k.tone}
          />
        ),
      )}
    </div>
  );
}

export default function SearchEngine() {
  const [showDemo, setShowDemo] = useState(false);
  const slides = doc('crawlerSlides');
  const report = doc('crawlerReport');

  return (
    <Container>
      <Seo
        title="Crawler Crew — Ruikai Yang"
        description="A search engine built from scratch in C++ on a 12-node cluster: 30M pages indexed, a hash-partitioned inverted index, and tail query latency profiled from ~8 s to under 2 s."
        path="/work/search-engine"
      />

      <Section className="pb-4 sm:pb-6">
        <EntryMasthead
          eyebrow={searchEngine.eyebrow}
          title={searchEngine.title}
          tagline={searchEngine.tagline}
          dates={searchEngine.dates}
          role={searchEngine.role}
          stack={searchEngine.stack}
          caveatTeaser={searchEngine.caveatTeaser}
        />
      </Section>

      <Section id="kpis" className="py-8 sm:py-10">
        <Reveal>
          <KpiWall items={searchEngineKpis} />
        </Reveal>
      </Section>

      <Section id="architecture">
        <Reveal>
          <SectionHeading title={architecture.heading} />
          <Prose>
            <p>{architecture.body}</p>
          </Prose>
        </Reveal>
        <Reveal>
          <div className="mt-8">
            <LazyViz height={420}>
              <ShardFanout />
            </LazyViz>
          </div>
        </Reveal>
      </Section>

      <Section id="owned">
        <Reveal>
          <SectionHeading
            title={owned.heading}
            sub="Six people built this. These three pieces were mine."
          />
          <div className="max-w-[68ch]">
            <Bullets items={owned.bullets ?? []} />
          </div>
        </Reveal>
      </Section>

      <Section id="optimizations">
        <Reveal>
          <SectionHeading
            title="Optimizations"
            sub="Both numbers below come from the final report's measurement run on our own cluster."
          />
          <div className="grid gap-3 lg:grid-cols-2">
            {OPTIMIZATIONS.map((o) => (
              <Card key={o.title}>
                <div className="font-mono text-[15px] font-semibold text-emerald tnum">
                  {o.delta}
                </div>
                <div className="mt-1.5 text-[15px] font-medium">{o.title}</div>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{o.body}</p>
              </Card>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section id="artifacts">
        <Reveal>
          <SectionHeading
            title="Artifacts"
            sub="The slides and the final report the figures on this page are taken from."
          />

          <div className="flex flex-wrap gap-2">
            <DocLink label={slides.label} href={slides.href} kind={slides.kind} />
            <DocLink label={report.label} href={report.href} kind={report.kind} />
          </div>

          <div className="mt-8 max-w-[68ch]">
            <p className="text-[15px] leading-relaxed text-muted">
              The course deliverable also included a five-minute screen recording of the finished
              interface. It shows the product, not the cluster — the fan-out diagram above is the
              part worth reading — so it stays behind a toggle.
            </p>
            <button
              type="button"
              onClick={() => setShowDemo((v) => !v)}
              aria-expanded={showDemo}
              aria-controls="ui-demo"
              className="card elevate mt-4 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors hover:border-line-strong"
            >
              <Play size={15} strokeWidth={1.75} className="text-primary" aria-hidden />
              <span>{searchEngineDemo.toggleLabel}</span>
              <ChevronDown
                size={15}
                strokeWidth={1.75}
                aria-hidden
                className={cn('text-faint transition-transform', showDemo && 'rotate-180')}
              />
            </button>
          </div>

          <div id="ui-demo" className="max-w-3xl">
            {showDemo && (
              <div className="mt-4">
                <VideoCard
                  src={searchEngineDemo.src}
                  poster={searchEngineDemo.poster}
                  caption={searchEngineDemo.caption}
                  aspect="720 / 468"
                />
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="mb-3 font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
              References
            </div>
            <LinkRow links={searchEngineLinks} size="sm" />
          </div>
        </Reveal>
      </Section>

      <Section id="caveats">
        <Reveal>
          <CaveatList items={searchEngine.caveats} />
        </Reveal>
      </Section>
    </Container>
  );
}
