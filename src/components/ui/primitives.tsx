import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/* ---------- layout ---------- */

export function Container({
  children,
  size = 'wide',
  className,
}: {
  children: React.ReactNode;
  size?: 'wide' | 'read';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 sm:px-8',
        size === 'wide' ? 'max-w-7xl' : 'max-w-4xl',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn('scroll-mt-20 py-16 sm:py-24', className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  className,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={cn('mb-8', className)}>
      {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
      <h2 className="text-[1.75rem] leading-[1.15] font-bold tracking-tight text-balance sm:text-[2rem]">
        {title}
      </h2>
      {sub && <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}

/* ---------- surfaces ---------- */

/** Chamfered surface — the masonry cut. Hairline border follows the 45° bevel. */
export function Card({
  children,
  className,
  innerClassName,
  interactive,
  cut = 'md',
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  interactive?: boolean;
  cut?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div className={cn('cut-card', cut === 'sm' && 'cut-sm', cut === 'lg' && 'cut-lg', className)}>
      <div
        className={cn(
          'cut-inner p-5 sm:p-6',
          interactive && 'elevate transition-colors',
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

const TAG_TONE = {
  neutral: 'text-muted',
  primary: 'text-primary',
  violet: 'text-violet',
  cyan: 'text-cyan',
  amber: 'text-amber',
  emerald: 'text-emerald',
  rose: 'text-rose',
} as const;

export function Tag({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof TAG_TONE;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[var(--radius-sm)] border bg-surface-2/60 px-2 py-0.5 font-mono text-[11px] whitespace-nowrap',
        TAG_TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------- numbers ---------- */

/** Count from 0 to `value` once the element scrolls into view. */
export function useCountUp(value: number, durationMs = 1100) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value);
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / durationMs);
          // easeOutExpo — fast commitment, soft landing
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          setShown(value * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, durationMs]);

  return { ref, shown };
}

export function CountUp({
  value,
  decimals = 0,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const { ref, shown } = useCountUp(value);
  return (
    <span ref={ref} className={cn('tnum', className)}>
      {shown.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}

/** Render "a / b" values with the part after the slash muted: the headline
 *  number pops while what it is measured against stays visibly attached. */
export function StatValue({ value }: { value: string }) {
  const m = value.match(/^(.*?)(\s*\/\s*)(.+)$/);
  if (!m) return <>{value}</>;
  return (
    <>
      {m[1]}
      <span className="font-normal text-muted">
        {m[2]}
        {m[3]}
      </span>
    </>
  );
}

export function Stat({
  value,
  label,
  note,
  suffix,
  prefix,
  decimals,
  tone = 'neutral',
}: {
  value: number | string;
  label: string;
  note?: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  tone?: keyof typeof TAG_TONE;
}) {
  // Machine numbers speak mono; phrase values ("iOS 41 / Android 32") speak
  // Besley. A run of 3+ letters marks a phrase; 1-2 letter units ("s", "GB")
  // stay on the mono track.
  const isPhrase = typeof value === 'string' && /[a-zA-Z]{3,}/.test(value);
  const toneClass = tone === 'neutral' ? 'text-fg' : TAG_TONE[tone];
  return (
    <div className="cut-card">
      <div className="cut-inner elevate p-4 transition-colors">
        <div
          className={cn(
            'tracking-tight',
            isPhrase
              ? 'text-xl leading-snug font-semibold'
              : 'tnum font-mono text-[clamp(20px,1.1rem+0.8vw,26px)] font-semibold',
            toneClass,
          )}
        >
          {prefix}
          {typeof value === 'number' ? (
            <CountUp value={value} decimals={decimals} />
          ) : (
            <StatValue value={value} />
          )}
          {suffix}
        </div>
        <div className="mt-1 text-[13px] font-medium">{label}</div>
        {note && <div className="mt-0.5 text-xs leading-snug text-faint">{note}</div>}
      </div>
    </div>
  );
}

/* ---------- text ---------- */

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-muted">
          <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-primary/70" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function Callout({
  title,
  children,
  tone = 'amber',
}: {
  title: string;
  children: React.ReactNode;
  tone?: 'amber' | 'primary';
}) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius)] border-l-2 bg-surface-2/60 py-4 pr-5 pl-5',
        tone === 'amber' ? 'border-l-amber' : 'border-l-primary',
      )}
    >
      <div className="mb-1.5 text-sm font-semibold">{title}</div>
      <div className="text-[15px] leading-relaxed text-muted">{children}</div>
    </div>
  );
}
