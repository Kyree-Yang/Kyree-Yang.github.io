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


/** The commencement portrait on its chamfered stone plate: hairline frame,
 *  paper mat, gold seam on the diagonal, and a figure caption that gives the
 *  photograph the same record-keeping discipline as the numbers. */
function PortraitPlate() {
  return (
    <figure className="w-full max-w-[440px]">
      <div className="relative">
        <div className="cut-card cut-lg cut-strong">
          <div className="cut-inner bg-bg p-2">
            <div className="relative overflow-hidden [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,0_100%)]">
              <picture>
                <source srcSet={hero.portrait.avif} type="image/avif" />
                <source srcSet={hero.portrait.webp} type="image/webp" />
                <img
                  src={hero.portrait.src}
                  alt={hero.portrait.alt}
                  width={880}
                  height={1100}
                  fetchPriority="high"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover object-[50%_18%] dark:brightness-[0.94] dark:saturate-[0.9]"
                />
              </picture>
              {/* Dark theme: the photo glows like a lit window in a dark facade. */}
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 hidden h-1/4 bg-gradient-to-t from-[rgb(22_18_13/0.25)] to-transparent dark:block"
              />
            </div>
          </div>
        </div>
        {/* Gold seam along the chamfer diagonal — the signature at its loudest. */}
        <span
          aria-hidden
          className="absolute top-[-1px] left-[calc(100%-22px)] h-[2px] w-[31px] origin-left rotate-45 bg-gold"
        />
        {/* Dimension annotation. The joke is for the engineers. */}
        <div
          aria-hidden
          className="absolute inset-y-0 -right-7 hidden w-4 items-center gap-1.5 xl:flex"
        >
          <span className="relative block h-full w-px bg-line-strong">
            <span className="absolute top-0 -left-[3px] h-px w-[7px] bg-line-strong" />
            <span className="absolute bottom-0 -left-[3px] h-px w-[7px] bg-line-strong" />
          </span>
          <span className="font-mono text-[9px] tracking-[0.1em] text-faint [writing-mode:vertical-rl]">
            1316 px
          </span>
        </div>
      </div>
      <figcaption className="plate mt-2 inline-block">{hero.portrait.caption}</figcaption>
    </figure>
  );
}

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
    <>
      <section className="relative overflow-hidden border-b bg-bg-subtle">
        <div
          aria-hidden
          className="grid-bg pointer-events-none absolute inset-0 opacity-40 lg:right-[46%]"
        />

        <Container className="relative py-12 sm:py-16 lg:py-20">
          <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,54fr)_minmax(0,46fr)] lg:grid-rows-[auto_1fr]">
            {/* Identity. On mobile the portrait interrupts here, before the chips. */}
            <div className="lg:col-start-1 lg:row-start-1">
              <p className="eyebrow">{hero.eyebrow}</p>

              <h1 className="mt-5 text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.015em] text-balance sm:text-[2.75rem] lg:text-[3.5rem]">
                {hero.title}
              </h1>

              <p className="mt-5 max-w-[64ch] text-[17px] leading-[1.6] text-muted">{hero.lead}</p>
            </div>

            {/* The portrait carries the fold. */}
            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:justify-self-end">
              <PortraitPlate />
            </div>

            {/* Credentials and actions. */}
            <div className="lg:col-start-1 lg:row-start-2 lg:self-end">
              <div className="flex flex-wrap gap-2">
                {heroChips.map((chip) => (
                  <Tag key={chip.label} tone={chip.tone} className="whitespace-normal">
                    {chip.label}
                  </Tag>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {heroCtas.map((cta) => {
                  // Chamfer on an inner span: the anchor stays unclipped so the
                  // focus ring survives the masonry cut.
                  const inner = cta.primary ? (
                    <span className="elevate inline-flex items-center justify-center border border-primary bg-primary px-4 py-2 text-primary-fg [clip-path:polygon(0_0,calc(100%-7px)_0,100%_7px,100%_100%,0_100%)]">
                      {cta.label}
                    </span>
                  ) : (
                    <span className="elevate inline-flex items-center justify-center rounded-[var(--radius)] border bg-surface px-4 py-2 transition-colors group-hover/cta:border-line-strong">
                      {cta.label}
                    </span>
                  );
                  const cls = 'group/cta inline-flex text-sm font-semibold';
                  return isFile(cta.to) ? (
                    <a
                      key={cta.label}
                      href={cta.to}
                      target="_blank"
                      rel="noreferrer"
                      className={cls}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link key={cta.label} to={cta.to} className={cls}>
                      {inner}
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

      {/* The live console: interactivity preserved, in its own instrument band. */}
      <section className="border-b bg-bg">
        <Container className="py-10 sm:py-12">
          <div
            onPointerDown={takeControl}
            onPointerMove={driving ? undefined : takeControl}
            onKeyDown={takeControl}
            className="grid grid-cols-1 gap-x-12 gap-y-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]"
          >
            <div className="max-w-[44ch]">
              <p className="eyebrow">runbook, live</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{hero.consoleLead}</p>

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
                      i === active
                        ? 'border-primary text-primary'
                        : 'text-muted hover:border-line-strong',
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <p
                aria-live="polite"
                className="mt-4 flex items-center gap-2 font-mono text-[11px] text-faint"
              >
                <span
                  aria-hidden
                  className={cn('size-1.5 rounded-full', driving ? 'bg-primary' : 'bg-emerald')}
                />
                {driving ? 'you are driving' : 'auto-playing · take control at any time'}
              </p>
            </div>

            {/* Deliberately unkeyed: LazyViz must keep its mounted state across tab
                switches, otherwise every switch replays the intersection wait. */}
            <div
              role="tabpanel"
              id={`hero-panel-${tab.id}`}
              aria-labelledby={`hero-tab-${tab.id}`}
              tabIndex={0}
              className="min-w-0"
            >
              <LazyViz height={420}>
                <Viz />
              </LazyViz>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
