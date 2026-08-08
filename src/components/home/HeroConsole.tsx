import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, GraduationCap, Linkedin, Mail, type LucideIcon } from 'lucide-react';

import { LazyViz } from '@/components/ui/LazyViz';
import { Container, Tag } from '@/components/ui/primitives';
import { NetworkStates } from '@/components/viz/NetworkStates';
import { PipelineRing } from '@/components/viz/PipelineRing';
import { RtlMirror } from '@/components/viz/RtlMirror';
import { contact, hero, heroChips, heroCtas, heroTabs } from '@/content/profile';
import { cn } from '@/lib/utils';

type VizComponent = React.ComponentType<{ t?: number; bare?: boolean }>;

/** Keyed by `heroTabs[].id`; the content module owns the labels, the page owns the wiring. */
const TAB_VIZ: Record<string, VizComponent> = {
  pipeline: PipelineRing,
  locale: RtlMirror,
  network: NetworkStates,
};

const CONTACTS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: contact.emailPrimary, href: `mailto:${contact.emailPrimary}`, icon: Mail },
  { label: 'GitHub', href: contact.github, icon: Github },
  { label: 'LinkedIn', href: contact.linkedin, icon: Linkedin },
  { label: 'Google Scholar', href: contact.scholar, icon: GraduationCap },
];

/** A route link stays in the SPA; the résumé is a real file and must not be routed. */
const isFile = (to: string) => to.slice(1).includes('.');

export function HeroConsole() {
  const [active, setActive] = useState(0);
  const [driving, setDriving] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tab = heroTabs[active];
  const Viz = TAB_VIZ[tab.id];

  const select = (i: number) => {
    setActive(i);
    tabRefs.current[i]?.focus();
  };

  const onTabKeyDown = (e: React.KeyboardEvent) => {
    const n = heroTabs.length;
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? (active + 1) % n
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? (active - 1 + n) % n
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? n - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    select(next);
  };

  const takeControl = () => setDriving(true);

  return (
    <section className="relative overflow-hidden border-b bg-bg-subtle">
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0" />

      <Container className="relative py-12 sm:py-16 lg:py-20">
        {/* `auto_1fr` rows matter: without them the console (which spans both
            rows) stretches row 1 and strands the CTAs at the bottom of a gap. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-7">
          {/* Identity. On mobile the console interrupts here, before the CTAs. */}
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="font-mono text-[11px] tracking-[0.22em] text-primary uppercase">
              {hero.eyebrow}
            </p>

            <h1 className="mt-4 text-[2.25rem] leading-[1.05] font-semibold tracking-[0.01em] text-balance sm:text-5xl lg:text-[3.25rem]">
              {hero.title}
            </h1>

            <p className="mt-5 max-w-[54ch] text-[16px] leading-[1.75] text-muted sm:text-[17px]">
              {hero.lead}
            </p>

            {/* Not ChipRow: these labels are long enough to overflow a 320px viewport
                unless the chip is allowed to wrap. */}
            <div className="mt-6 flex flex-wrap gap-2">
              {heroChips.map((chip) => (
                <Tag key={chip.label} tone={chip.tone} className="whitespace-normal">
                  {chip.label}
                </Tag>
              ))}
            </div>
          </div>

          {/* Live driver. Row-spans both left rows at lg so it sits beside the whole column. */}
          <div
            onPointerDown={takeControl}
            onPointerMove={driving ? undefined : takeControl}
            onKeyDown={takeControl}
            className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
          >
            <picture>
              <source srcSet="/media/Ruikai.webp" type="image/webp" />
              <img
                src={hero.avatar.src}
                alt={hero.avatar.alt}
                width={96}
                height={96}
                decoding="async"
                className="size-24 rounded-full border object-cover"
              />
            </picture>

            <div
              role="tablist"
              aria-label="Live visualizations"
              onKeyDown={onTabKeyDown}
              className="mt-5 flex flex-wrap gap-1.5"
            >
              {heroTabs.map((item, i) => (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`hero-tab-${item.id}`}
                  aria-selected={i === active}
                  aria-controls={`hero-panel-${item.id}`}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={cn(
                    'card elevate px-2.5 py-1.5 font-mono text-[11px] tracking-wide transition-colors',
                    i === active ? 'border-primary text-primary' : 'text-muted hover:border-line-strong',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Deliberately unkeyed: LazyViz must keep its mounted state across tab
                switches, otherwise every switch replays the intersection wait. */}
            <div
              role="tabpanel"
              id={`hero-panel-${tab.id}`}
              aria-labelledby={`hero-tab-${tab.id}`}
              tabIndex={0}
              className="mt-3"
            >
              <LazyViz height={420}>
                <Viz />
              </LazyViz>
            </div>

            <p
              aria-live="polite"
              className="mt-3 flex items-center gap-2 font-mono text-[11px] text-faint"
            >
              <span
                aria-hidden
                className={cn('size-1.5 rounded-full', driving ? 'bg-primary' : 'bg-emerald')}
              />
              {driving ? 'you are driving' : 'auto-playing · take control at any time'}
            </p>
          </div>

          {/* Actions. Second left-column row, so mobile order is identity → console → CTAs. */}
          <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
            <div className="flex flex-wrap gap-2.5">
              {heroCtas.map((cta) => {
                const cls = cn(
                  'elevate inline-flex items-center justify-center rounded-[var(--radius)] border px-4 py-2 text-sm font-medium transition-colors',
                  cta.primary
                    ? 'border-primary bg-primary text-primary-fg'
                    : 'card hover:border-line-strong',
                );
                return isFile(cta.to) ? (
                  <a key={cta.label} href={cta.to} target="_blank" rel="noreferrer" className={cls}>
                    {cta.label}
                  </a>
                ) : (
                  <Link key={cta.label} to={cta.to} className={cls}>
                    {cta.label}
                  </Link>
                );
              })}
            </div>

            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
              {CONTACTS.map(({ label, href, icon: Icon }) => {
                const external = !href.startsWith('mailto:');
                return (
                  <li key={label}>
                    <a
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg"
                    >
                      <Icon size={14} strokeWidth={1.75} className="text-faint" aria-hidden />
                      <span className="break-all">{label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
