import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

import { Seo } from '@/components/shell/Seo';
import { DocLink } from '@/components/ui/DocLink';
import { LinkRow } from '@/components/ui/LinkRow';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { PhotoCard } from '@/components/ui/PhotoCard';
import { PhotoGrid } from '@/components/ui/PhotoGrid';
import { Container, CountUp, Section, SectionHeading, Tag } from '@/components/ui/primitives';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/ui/Reveal';
import { activities, beyondGallery, beyondHeader, competitions, digitalHuman } from '@/content/beyond';
import type { Activity, Competition } from '@/content/beyond';
import { docs } from '@/content/docs';
import type { DocRef, Tone } from '@/content/types';
import { cn } from '@/lib/utils';

/**
 * beyond.ts names its documents by slug, docs.ts keys them camelCase. The bridge lives
 * here so neither content module has to know the other's naming, and an unresolved id
 * drops out instead of throwing on a page nobody can then read.
 */
const DOC_ALIAS: Record<string, string> = {
  'mcm-2024-paper': 'mcmPaper',
  'cuymc-software-copyright': 'cuymcCopyright',
};

const resolveDocs = (ids: string[]): DocRef[] =>
  ids.map((id) => docs[DOC_ALIAS[id] ?? id]).filter((ref): ref is DocRef => Boolean(ref));

const STAT_TONE: Record<Tone, string> = {
  neutral: 'text-fg',
  primary: 'text-primary',
  violet: 'text-violet',
  cyan: 'text-cyan',
  amber: 'text-amber',
  emerald: 'text-emerald',
  rose: 'text-rose',
};

/**
 * VideoCard carries its own card border and caption rail, neither of which can live
 * inside a 9:16 bezel, so the phone clip owns its playback control instead. Click to
 * play either way — nothing on this page moves before the reader asks.
 */
function PhoneClip({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.muted = true;
      void el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  };

  return (
    <>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="size-full object-cover"
      >
        <source src={`${src}.webm`} type="video/webm" />
        <source src={`${src}.mp4`} type="video/mp4" />
      </video>

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause: ${label}` : `Play: ${label}`}
        className={cn(
          'absolute inset-0 grid place-items-center transition-opacity',
          playing ? 'opacity-0 hover:opacity-100 focus-visible:opacity-100' : 'bg-bg/25 opacity-100',
        )}
      >
        <span className="grid size-12 place-items-center rounded-full border border-line-strong bg-surface/90">
          {playing ? (
            <Pause aria-hidden className="size-5 text-fg" />
          ) : (
            <Play aria-hidden className="size-5 translate-x-px text-fg" />
          )}
        </span>
      </button>
    </>
  );
}

function CompetitionBlock({ item }: { item: Competition }) {
  const artifacts = resolveDocs(item.docs);

  return (
    <article
      id={item.id}
      className={cn(
        'grid scroll-mt-20 gap-6 lg:gap-10',
        item.photo && 'lg:grid-cols-[1.1fr_1fr] lg:items-start',
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Tag tone="amber">{item.badge}</Tag>
          <span className="font-mono text-[12px] text-faint">{item.date}</span>
        </div>

        <h3 className="mt-3 text-xl font-semibold tracking-[-0.015em]">{item.title}</h3>

        <div className="mt-1 text-[15px] leading-relaxed text-muted">
          {item.fullName} · <span className="font-medium text-primary">{item.award}</span>
        </div>

        <Prose className="mt-4">
          <p>{item.body}</p>
        </Prose>

        <div className="mt-5 flex flex-wrap gap-2">
          <LinkRow size="sm" links={item.links} />
          {artifacts.map((ref) => (
            <DocLink key={ref.id} label={ref.label} href={ref.href} kind={ref.kind} />
          ))}
        </div>
      </div>

      {item.photo && (
        <PhotoCard
          src={item.photo.src}
          webp={item.photo.webp}
          alt={item.photo.alt}
          caption={item.photo.caption}
          badge={item.photo.badge}
          fig={false}
        />
      )}
    </article>
  );
}

/** The count-ups sit on the photograph itself: the scale is the point of the picture. */
function StatPhoto({ activity }: { activity: Activity }) {
  const { photo, stats } = activity;

  return (
    <figure className="cut-card">
      <div className="cut-inner p-0">
        <div className="relative overflow-hidden bg-bg-subtle" style={{ aspectRatio: '3 / 2' }}>
          <picture>
            <source srcSet={photo.webp} type="image/webp" />
            <img
              src={photo.src}
              alt={photo.alt}
              width={1200}
              height={800}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          </picture>

          {stats && (
            <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-px border-t border-line-strong bg-line-strong">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-surface/95 px-2 py-2.5 text-center sm:px-3">
                  <div
                    className={cn(
                      'tnum text-[17px] font-semibold tracking-tight sm:text-xl',
                      STAT_TONE[stat.tone ?? 'primary'],
                    )}
                  >
                    {stat.prefix}
                    {typeof stat.value === 'number' ? (
                      <CountUp value={stat.value} decimals={stat.decimals} />
                    ) : (
                      stat.value
                    )}
                    {stat.suffix}
                  </div>
                  <div className="mt-0.5 text-[11px] leading-tight text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <figcaption className="border-t bg-surface-2/60 px-3 py-2 font-mono text-[12px] leading-relaxed tracking-[0.02em] text-faint">
          {photo.badge && <span className="mr-1.5 text-amber">{photo.badge} ·</span>}
          {photo.caption}
        </figcaption>
      </div>
    </figure>
  );
}

function ActivityText({ activity }: { activity: Activity }) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Tag tone="emerald">{activity.place}</Tag>
        <span className="font-mono text-[12px] text-faint">{activity.date}</span>
      </div>

      <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{activity.title}</h2>

      <Prose className="mt-4">
        <p>{activity.body}</p>
        {activity.note && (
          <p>
            {activity.note.text}{' '}
            <a href={activity.note.link.href} target="_blank" rel="noreferrer">
              {activity.note.link.label}
            </a>
            .
          </p>
        )}
      </Prose>

      <div className="mt-5">
        <LinkRow size="sm" links={activity.links} />
      </div>
    </div>
  );
}

export default function Beyond() {
  const [tengger, eryuan] = activities;

  return (
    <>
      <Seo
        title="Beyond the lab — Ruikai Yang"
        description="Three competition medals, a UE5 digital human, desert reforestation in Tengger, and a month teaching in Eryuan County."
        path="/beyond"
      />

      <Container>
        <Section className="pt-10 pb-4 sm:pt-14 sm:pb-6">
          <div className="font-mono text-[11px] tracking-[0.14em] text-primary uppercase">
            Beyond
          </div>
          <h1 className="mt-3 text-[30px] leading-[1.12] font-semibold tracking-[-0.025em] sm:text-4xl">
            {beyondHeader.title}
          </h1>
          <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.75] text-muted">
            {beyondHeader.lead}
          </p>
        </Section>

        <Section id="competitions" className="border-t">
          <Reveal>
            <SectionHeading
              eyebrow="Competitions"
              title="Competitions"
              sub="Three team contests between 2023 and 2024, each with its contest page and whatever artifact survived it."
            />
          </Reveal>

          <div className="space-y-12 sm:space-y-16">
            {competitions.map((item, i) => (
              <Reveal key={item.id} delay={i * 60}>
                <CompetitionBlock item={item} />
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="digital-human" className="border-t">
          <Reveal>
            <SectionHeading
              eyebrow="CUYMC 2024"
              title="The digital human"
              sub="The piece of the elderly-care entry I built myself."
            />
          </Reveal>

          <Reveal>
            <div className="grid gap-8 sm:grid-cols-[minmax(0,260px)_1fr] sm:items-center sm:gap-10">
              <PhoneFrame tilt>
                <PhoneClip
                  src={digitalHuman.src}
                  poster={digitalHuman.poster}
                  label={digitalHuman.caption}
                />
              </PhoneFrame>

              <Prose>
                <p>{digitalHuman.caption}</p>
                <p>
                  Three screen recordings of it shipped on the old site as animated GIFs weighing
                  63 MB between them. One clip says the same thing, so the other two were deleted
                  rather than thumbnailed.
                </p>
              </Prose>
            </div>
          </Reveal>
        </Section>

        {/* The legacy #-activities anchor lands here — the field projects start with Tengger. */}
        <Section id="activities" className="border-t">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
              <ActivityText activity={tengger} />
              <StatPhoto activity={tengger} />
            </div>
          </Reveal>
        </Section>

        <Section id={eryuan.id} className="border-t">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
              <div className="lg:order-2">
                <ActivityText activity={eryuan} />
              </div>
              <div className="lg:order-1">
                <PhotoCard
                  src={eryuan.photo.src}
                  webp={eryuan.photo.webp}
                  alt={eryuan.photo.alt}
                  caption={eryuan.photo.caption}
                  badge={eryuan.photo.badge}
                  aspect="3 / 2"
                />
              </div>
            </div>
          </Reveal>
        </Section>

        <Section id="gallery" className="border-t">
          <Reveal>
            <SectionHeading
              eyebrow="Gallery"
              title="The photographs"
              sub="Recognition that exists on paper, in rooms, and in a desert — none of it on a screen."
            />
          </Reveal>
          <PhotoGrid items={beyondGallery} />
        </Section>
      </Container>
    </>
  );
}
