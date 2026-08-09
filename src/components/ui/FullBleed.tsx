import { cn } from '@/lib/utils';

/**
 * Full-column block for oversize figures.
 *
 * This used to bleed to 100vw with `margin-inline: calc(50% - 50vw)`, but that
 * trick centers on the PARENT's midline — inside the entry grid (content column
 * + 13rem jump rail) the parent sits left of the viewport center, so the block
 * slid off the left edge and `main`'s overflow-x clip ate its title. Since the
 * architecture figure now carries a viewport-height cap, the plain content
 * column is already wider than the figure's height-limited render, so no
 * breakout is needed at all — the escape hatch died of obsolescence.
 */
export function FullBleed({
  children,
  className,
  max = 1700,
}: {
  children: React.ReactNode;
  className?: string;
  /** Cap so the figure does not stretch absurdly on an ultra-wide display. */
  max?: number;
}) {
  return (
    <div className={cn('w-full', className)}>
      <div className="mx-auto w-full" style={{ maxWidth: max }}>
        {children}
      </div>
    </div>
  );
}
