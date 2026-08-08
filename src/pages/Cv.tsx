import { Fragment, useEffect, useState } from 'react';

import { Seo } from '@/components/shell/Seo';
import { ChipRow } from '@/components/ui/ChipRow';
import { DocLink } from '@/components/ui/DocLink';
import { LazyViz } from '@/components/ui/LazyViz';
import { LinkRow } from '@/components/ui/LinkRow';
import { PhotoGrid } from '@/components/ui/PhotoGrid';
import { Bullets, Card, Container, Section, SectionHeading, Tag } from '@/components/ui/primitives';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/ui/Reveal';
import { TrackToggle } from '@/components/ui/TrackToggle';
import { DegreeGantt } from '@/components/viz/DegreeGantt';
import { doc } from '@/content/docs';
import {
  contactLinks,
  cvTracks,
  degreeNote,
  education,
  experience,
  honors,
  identity,
  projects,
  publications,
  research,
  skills,
  teaching,
  teachingPhotos,
  type CvSectionId,
  type TrackConfig,
} from '@/content/profile';
import type { Honor, Track } from '@/content/types';

const TRACK_KEY = 'cv.track';

const isTrack = (value: unknown): value is Track =>
  value === 'agents' || value === 'systems' || value === 'robotics';

/**
 * Session-scoped, not local: the ordering is a reading preference for one visit,
 * and a recruiter returning next month should get the default argument back.
 */
function useTrack() {
  const [track, setTrack] = useState<Track>(() => {
    if (typeof window === 'undefined') return 'agents';
    try {
      const saved = window.sessionStorage.getItem(TRACK_KEY);
      return isTrack(saved) ? saved : 'agents';
    } catch {
      return 'agents';
    }
  });

  useEffect(() => {
    try {
      window.sessionStorage.setItem(TRACK_KEY, track);
    } catch {
      // Storage disabled — the toggle still works, it just does not survive a reload.
    }
  }, [track]);

  return [track, setTrack] as const;
}

const isExternal = (href: string) => href.startsWith('http');

const LINK =
  'text-primary underline decoration-line-strong underline-offset-[3px] transition-colors hover:decoration-primary';

function IdentityHeader() {
  const resume = doc('resume');

  return (
    <header>
      <div className="font-mono text-[11px] tracking-[0.14em] text-primary uppercase">
        Curriculum vitae
      </div>

      <h1 className="mt-3 text-[30px] leading-[1.12] font-semibold tracking-[-0.025em] sm:text-4xl">
        {identity.name}
      </h1>

      <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.75] text-muted">{identity.summary}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px] text-faint">
        <span>{identity.location}</span>
        <span aria-hidden>·</span>
        <span>{identity.role}</span>
      </div>

      <ul className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2 text-[14px]">
        {contactLinks.map((link) => (
          <li key={link.label} className="min-w-0">
            <a
              href={link.href}
              className={`${LINK} break-words`}
              target={isExternal(link.href) ? '_blank' : undefined}
              rel={isExternal(link.href) ? 'noreferrer' : undefined}
            >
              {link.label}
            </a>
            {link.note && <span className="ml-1.5 text-faint">({link.note})</span>}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <DocLink label="Download résumé (PDF)" href={resume.href} kind={resume.kind} />
      </div>
    </header>
  );
}

function EducationSection() {
  return (
    <Section id="education" className="border-t">
      <Reveal>
        <SectionHeading eyebrow="Education" title="Education" sub={degreeNote} />
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {education.map((item, i) => (
          <Reveal key={item.school} delay={i * 60}>
            <Card className="h-full">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[17px] leading-snug font-semibold tracking-[-0.01em]">
                  {item.school}
                </h3>
                {item.current && <Tag tone="emerald">incoming</Tag>}
              </div>

              <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.degree}</p>

              <div className="mt-2 font-mono text-[12px] leading-relaxed text-faint">
                {item.place} · {item.dates}
              </div>

              {item.detail && (
                <div className="tnum mt-3 text-[13px] font-medium text-primary">{item.detail}</div>
              )}

              {item.coursework && (
                <div className="mt-4">
                  <div className="mb-2 font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
                    Selected coursework
                  </div>
                  <ChipRow items={item.coursework.map((course) => ({ label: course }))} />
                </div>
              )}
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="mt-6">
        <LazyViz height={400}>
          <DegreeGantt />
        </LazyViz>
      </div>
    </Section>
  );
}

function ExperienceSection({ cfg }: { cfg: TrackConfig }) {
  return (
    <Section id="experience" className="border-t">
      <Reveal>
        <SectionHeading eyebrow="Experience" title="Experience" />

        <Card>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-[17px] font-semibold tracking-[-0.01em]">
              {experience.org} · {experience.team}
            </h3>
            <span className="font-mono text-[12px] text-faint">{experience.dates}</span>
          </div>
          <div className="mt-1 text-[15px] text-muted">
            {experience.title} · {experience.place}
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-faint">
            Two streams, both on {experience.context}.
          </p>
        </Card>
      </Reveal>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {experience.streams.map((stream, i) => {
          // The track picks both which highlights survive and the order they argue in.
          const highlights = cfg.streamHighlights[stream.id]
            .map((id) => stream.highlights.find((h) => h.id === id)?.text)
            .filter((text): text is string => Boolean(text));

          return (
            <Reveal key={stream.id} delay={i * 60}>
              <Card className="flex h-full flex-col">
                <h4 className="text-base font-semibold tracking-[-0.01em]">{stream.title}</h4>

                <Prose className="mt-3">
                  <p>{stream.summary}</p>
                </Prose>

                <div className="mt-4 rounded-[var(--radius-sm)] border bg-surface-2 px-3 py-2 font-mono text-[12px] leading-relaxed text-primary">
                  {stream.metric}
                </div>

                <div className="mt-4">
                  <Bullets items={highlights} />
                </div>

                <div className="mt-5 pt-1">
                  <LinkRow size="sm" links={[{ label: `${stream.title} — full write-up`, href: stream.to }]} />
                </div>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function ResearchSection({ cfg }: { cfg: TrackConfig }) {
  return (
    <Section id="research" className="border-t">
      <Reveal>
        <SectionHeading eyebrow="Research" title="Research" />

        <Card>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-[17px] font-semibold tracking-[-0.01em]">{research.lab}</h3>
            <span className="font-mono text-[12px] text-faint">{research.dates}</span>
          </div>

          <div className="mt-1 text-[15px] text-muted">
            {research.role} · advised by {research.advisor}
          </div>

          <div className="mt-3">
            <Tag tone="emerald">{research.credit}</Tag>
          </div>

          <Prose className="mt-4">
            <p>{research.summary}</p>
          </Prose>

          <div className="mt-4">
            <Bullets items={research.bullets.slice(0, cfg.bullets.research)} />
          </div>

          <div className="mt-5">
            <LinkRow size="sm" links={[{ label: 'AGHF trajectory optimization — full write-up', href: research.to }]} />
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}

function ProjectsSection({ cfg }: { cfg: TrackConfig }) {
  return (
    <Section id="projects" className="border-t">
      <Reveal>
        <SectionHeading eyebrow="Projects" title="Projects" />
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 60}>
            <Card className="flex h-full flex-col">
              <h3 className="text-base font-semibold tracking-[-0.01em]">{project.title}</h3>
              <div className="mt-1 font-mono text-[12px] text-faint">{project.meta}</div>

              <div className="mt-4">
                <Bullets
                  items={
                    // Only the search engine trades bullet count by track; §5.8 gives no
                    // budget for the others, so they keep everything they have.
                    project.id === 'search-engine'
                      ? project.bullets.slice(0, cfg.bullets.searchEngine)
                      : project.bullets
                  }
                />
              </div>

              <div className="mt-auto pt-5">
                <LinkRow size="sm" links={[{ label: 'Full write-up', href: project.to }]} />
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function PublicationsSection() {
  return (
    <Section id="publications" className="border-t">
      <Reveal>
        <SectionHeading eyebrow="Publications" title="Publications" />

        <ol className="space-y-6">
          {publications.map((pub) => {
            const ref = doc(pub.doc);
            return (
              <li
                key={pub.title}
                className="flex flex-col gap-3 border-t pt-6 first:border-t-0 first:pt-0 sm:flex-row sm:gap-6"
              >
                <span className="tnum font-mono text-[13px] text-faint sm:w-14 sm:shrink-0">
                  {pub.year}
                </span>
                <div className="min-w-0">
                  <p className="max-w-[68ch] text-[15px] leading-relaxed">{pub.title}</p>
                  <div className="mt-3">
                    <DocLink label="Read the paper (PDF)" href={ref.href} kind={ref.kind} />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Reveal>
    </Section>
  );
}

/**
 * The legacy list carried the Dean's Honor List as two dated rows, each linking to the
 * same verification page. profile.ts merges them into one "×2" entry, so both semesters
 * still ship as their own source link rather than collapsing into one.
 */
function honorSources(honor: Honor): { label: string; href: string }[] {
  const href = honor.href;
  if (!href) return [];
  const semesters = honor.note?.split(' and ') ?? [];
  return semesters.length === 2
    ? semesters.map((label) => ({ label, href }))
    : [{ label: 'Source', href }];
}

function HonorsSection() {
  return (
    <Section id="honors" className="border-t">
      <Reveal>
        <SectionHeading
          eyebrow="Honors"
          title="Honors & awards"
          sub="Eight awards, newest first. Percentiles are the ones printed on the citation."
        />

        <ol>
          {honors.map((honor) => {
            const sources = honorSources(honor);
            return (
              <li
                key={honor.title}
                className="flex flex-col gap-1 border-t py-4 first:border-t-0 first:pt-0 sm:flex-row sm:gap-6"
              >
                <span className="tnum font-mono text-[12px] whitespace-nowrap text-faint sm:w-36 sm:shrink-0 sm:pt-1">
                  {honor.date}
                </span>

                <div className="min-w-0">
                  <p className="text-[15px] leading-relaxed">
                    {honor.title}
                    {honor.note && <span className="ml-2 text-[13px] text-muted">{honor.note}</span>}
                  </p>

                  {sources.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
                      {sources.map((source) => (
                        <a
                          key={source.label}
                          href={source.href}
                          target="_blank"
                          rel="noreferrer"
                          className={LINK}
                        >
                          {source.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </Reveal>
    </Section>
  );
}

function TeachingSection() {
  return (
    <Section id="teaching" className="border-t">
      <Reveal>
        <SectionHeading eyebrow="Service" title="Teaching & leadership" />

        <ol className="mb-8">
          {teaching.map((item) => (
            <li
              key={item.text}
              className="flex flex-col gap-1 border-t py-4 first:border-t-0 first:pt-0 sm:flex-row sm:gap-6"
            >
              <span className="tnum font-mono text-[12px] whitespace-nowrap text-faint sm:w-36 sm:shrink-0 sm:pt-1">
                {item.dates}
              </span>
              <p className="max-w-[68ch] text-[15px] leading-relaxed text-muted">{item.text}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      <PhotoGrid
        items={teachingPhotos.map((photo) => ({
          ...photo,
          // Every photograph in the build ships a webp sibling; beyond.ts names both,
          // this list predates that pairing.
          webp: photo.src.replace(/\.jpg$/, '.webp'),
        }))}
      />
    </Section>
  );
}

function SkillsSection() {
  return (
    <Section id="skills" className="border-t">
      <Reveal>
        <SectionHeading eyebrow="Skills" title="Skills" />
        <ChipRow items={skills.map((skill) => ({ label: skill }))} />
      </Reveal>
    </Section>
  );
}

const SECTIONS: Record<CvSectionId, (cfg: TrackConfig) => React.ReactNode> = {
  education: () => <EducationSection />,
  experience: (cfg) => <ExperienceSection cfg={cfg} />,
  research: (cfg) => <ResearchSection cfg={cfg} />,
  projects: (cfg) => <ProjectsSection cfg={cfg} />,
  publications: () => <PublicationsSection />,
  honors: () => <HonorsSection />,
  teaching: () => <TeachingSection />,
  skills: () => <SkillsSection />,
};

export default function Cv() {
  const [track, setTrack] = useTrack();
  const cfg = cvTracks[track];

  return (
    <>
      <Seo
        title="CV — Ruikai Yang"
        description="Education, experience, research, publications, honors and teaching for Ruikai Yang — re-orderable by track: agents, systems, or robotics."
        path="/cv"
      />

      <Container>
        <Section className="pt-10 pb-8 sm:pt-14 sm:pb-10">
          <IdentityHeader />
        </Section>

        <div className="border-t py-6">
          <div className="flex flex-col gap-3">
            <TrackToggle value={track} onChange={setTrack} />
            <p className="max-w-[60ch] text-[14px] leading-relaxed text-muted" aria-live="polite">
              {cfg.blurb}
            </p>
            <p className="text-[13px] leading-relaxed text-faint">
              One record, three orderings. The toggle changes what leads and how much each
              section says — never the facts, and never the URL.
            </p>
          </div>
        </div>

        {cfg.order.map((id) => (
          <Fragment key={id}>{SECTIONS[id](cfg)}</Fragment>
        ))}
      </Container>
    </>
  );
}
