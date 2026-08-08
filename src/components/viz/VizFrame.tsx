import { cn } from '@/lib/utils';

/**
 * Shared chrome for every visualization: a bordered panel with a mono caption
 * rail. `bare` drops the chrome entirely, which is what the GIF stage uses so
 * exported frames contain only the drawing.
 */
export function VizFrame({
  title,
  caption,
  children,
  bare,
  className,
  aside,
}: {
  title?: string;
  caption?: string;
  children: React.ReactNode;
  bare?: boolean;
  className?: string;
  aside?: React.ReactNode;
}) {
  if (bare) return <>{children}</>;
  return (
    <figure className={cn('card overflow-hidden', className)}>
      {(title || aside) && (
        <figcaption className="flex items-center justify-between gap-3 border-b px-4 py-2.5">
          <span className="font-mono text-[11px] tracking-wider text-muted uppercase">{title}</span>
          {aside}
        </figcaption>
      )}
      <div className="p-3 sm:p-4">{children}</div>
      {caption && (
        <div className="border-t px-4 py-2.5 text-[13px] leading-relaxed text-faint">{caption}</div>
      )}
    </figure>
  );
}

/** Palette pulled from CSS custom properties so viz respects the active theme. */
export const VIZ = {
  primary: 'var(--primary)',
  violet: 'var(--accent-violet)',
  cyan: 'var(--accent-cyan)',
  amber: 'var(--accent-amber)',
  emerald: 'var(--accent-emerald)',
  rose: 'var(--accent-rose)',
  fg: 'var(--fg)',
  muted: 'var(--fg-muted)',
  faint: 'var(--fg-faint)',
  line: 'var(--border)',
  surface: 'var(--surface-2)',
} as const;
