import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatValue } from './primitives';

/**
 * One entry, summarised: three metrics, one honest caveat, one mini viz.
 * `emphasis` is reserved for the two spine cards on `/` — the only cards on the
 * site allowed a shadow (drop-shadow on the unclipped link, so it follows the
 * chamfer instead of being clipped with it).
 */
export function EntryCard({
  to,
  title,
  tagline,
  dates,
  eyebrow,
  metrics,
  caveat,
  viz,
  emphasis,
}: {
  to: string;
  title: string;
  tagline: string;
  dates: string;
  /** Replaces the date line — used when an enclosing block already states the dates. */
  eyebrow?: string;
  /** Exactly three. */
  metrics: { label: string; value: string }[];
  caveat: string;
  viz?: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        'group block',
        emphasis && '[filter:drop-shadow(0_10px_24px_rgb(38_32_23/0.10))]',
      )}
    >
      <div className={cn('cut-card h-full', emphasis && 'cut-lg')}>
        <div
          className={cn(
            'cut-inner elevate flex h-full flex-col transition-colors',
            emphasis ? 'p-6' : 'p-5',
          )}
        >
          <div className="font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
            {eyebrow ?? dates}
          </div>

          <h3 className="mt-2 flex items-start gap-2 text-lg font-semibold tracking-[-0.01em]">
            <span>{title}</span>
            <ArrowRight
              aria-hidden
              className="mt-1 size-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
            />
          </h3>

          <p className="mt-2 text-[15px] leading-relaxed text-muted">{tagline}</p>

          {viz && (
            <div className="mt-5 overflow-hidden rounded-[var(--radius)] border bg-bg-subtle p-3">
              {viz}
            </div>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {metrics.map((m) => (
              <div key={m.label}>
                <div className="tnum font-mono text-[15px] font-semibold">
                  <StatValue value={m.value} />
                </div>
                <div className="mt-0.5 text-xs leading-snug text-faint">{m.label}</div>
              </div>
            ))}
          </div>

          {/* What broke — the site's most honest element, in its most distinct voice. */}
          <p className="mt-5 border-t pt-4 text-[13.5px] leading-relaxed text-muted italic">
            <span className="mr-2 font-mono text-[10px] font-bold tracking-[0.14em] text-amber uppercase not-italic">
              what broke
            </span>
            {caveat}
          </p>
        </div>
      </div>
    </Link>
  );
}
