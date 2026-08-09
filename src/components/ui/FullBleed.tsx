import { cn } from '@/lib/utils';

/**
 * Breaks a block out of its column and back to the viewport width.
 *
 * `margin-inline: calc(50% - 50vw)` is the standard trick, and it is the reason
 * `main` carries `overflow-x: clip` — on platforms with classic scrollbars 100vw
 * is wider than the client area, and without the clip that difference becomes a
 * horizontal scrollbar on every page. `clip` is deliberate rather than `hidden`:
 * `hidden` would make `main` a scroll container and break `position: sticky` in
 * the jump rail.
 *
 * Used for the architecture figure, which is unreadable at prose width.
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
    <div
      // At xl the entry pages show a sticky jump rail in the right column. A
      // full-bleed block would otherwise run underneath it and the two would
      // overlap, so reserve the rail's width back at that breakpoint only.
      className={cn('mx-auto w-full px-5 sm:px-8 xl:pr-[15rem]', className)}
      style={{
        marginInline: 'calc(50% - 50vw)',
        width: '100vw',
        maxWidth: '100vw',
      }}
    >
      <div className="mx-auto w-full" style={{ maxWidth: max }}>
        {children}
      </div>
    </div>
  );
}
