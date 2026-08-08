import { cn } from '@/lib/utils';
import { useRovingFocus } from './FilterChips';
import type { Track } from '@/content/types';

const TRACKS: { id: Track; label: string }[] = [
  { id: 'agents', label: 'agents' },
  { id: 'systems', label: 'systems' },
  { id: 'robotics', label: 'robotics' },
];

/** Segmented control on /cv. Reorders sections; never changes the route. */
export function TrackToggle({
  value,
  onChange,
}: {
  value: Track;
  onChange: (t: Track) => void;
}) {
  const index = Math.max(
    0,
    TRACKS.findIndex((t) => t.id === value),
  );
  const { refs, onKeyDown } = useRovingFocus(TRACKS.length, index, (i) => onChange(TRACKS[i].id));

  return (
    <div
      role="radiogroup"
      aria-label="Emphasis track"
      className="inline-flex flex-wrap gap-1 rounded-[var(--radius-pill)] border bg-surface-2 p-1"
    >
      {TRACKS.map((track, i) => {
        const on = track.id === value;
        return (
          <button
            key={track.id}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={i === index ? 0 : -1}
            ref={(el) => {
              refs.current[i] = el;
            }}
            onKeyDown={onKeyDown}
            onClick={() => onChange(track.id)}
            className={cn(
              'rounded-[var(--radius-pill)] px-4 py-1.5 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors',
              on ? 'bg-primary text-primary-fg' : 'elevate text-muted',
            )}
          >
            {track.label}
          </button>
        );
      })}
    </div>
  );
}
