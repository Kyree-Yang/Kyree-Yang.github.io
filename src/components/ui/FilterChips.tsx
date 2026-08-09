import { useRef, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

/**
 * Roving tabindex for a pill radiogroup: one tab stop, arrows move focus and
 * selection together. Lives here because FilterChips and TrackToggle are the
 * only two consumers and neither warrants its own module.
 */
export function useRovingFocus(count: number, index: number, onSelect: (i: number) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (next: number) => {
    const i = ((next % count) + count) % count;
    onSelect(i);
    refs.current[i]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        move(index + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        move(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        move(0);
        break;
      case 'End':
        event.preventDefault();
        move(count - 1);
        break;
    }
  };

  return { refs, onKeyDown };
}

/* Chamfered plate, not a pill; the active filter is an ink stamp (fg/bg swap).
   The clip lives on an inner span so the button keeps its focus ring. */
const CHIP_INNER =
  'inline-flex border px-3 py-1.5 transition-colors [clip-path:polygon(0_0,calc(100%-7px)_0,100%_7px,100%_100%,0_100%)]';

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T | 'all';
  onChange: (v: T | 'all') => void;
}) {
  const chips: { id: T | 'all'; label: string }[] = [{ id: 'all', label: 'all' }, ...options];
  const index = Math.max(
    0,
    chips.findIndex((c) => c.id === value),
  );
  const { refs, onKeyDown } = useRovingFocus(chips.length, index, (i) => onChange(chips[i].id));

  return (
    <div role="radiogroup" aria-label="Filter entries by category" className="flex flex-wrap gap-2">
      {chips.map((chip, i) => {
        const on = chip.id === value;
        return (
          <button
            key={chip.id}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={i === index ? 0 : -1}
            ref={(el) => {
              refs.current[i] = el;
            }}
            onKeyDown={onKeyDown}
            onClick={() => onChange(chip.id)}
            className="font-mono text-[11px] tracking-[0.14em] uppercase"
          >
            <span
              className={cn(
                CHIP_INNER,
                'elevate',
                on ? 'border-fg bg-fg font-bold text-bg' : 'bg-surface text-muted',
              )}
            >
              {chip.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
