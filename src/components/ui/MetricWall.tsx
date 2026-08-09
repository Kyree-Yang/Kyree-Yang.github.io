import type { Metric } from '@/content/types';
import { cn } from '@/lib/utils';
import { Stat } from './primitives';

const COLS = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
} as const;

export function MetricWall({ metrics, cols = 5 }: { metrics: Metric[]; cols?: 2 | 3 | 4 | 5 }) {
  // Ink by default; burgundy is rationed to one hero number per wall. Semantic
  // tones (emerald/amber/rose) always pass through — they carry meaning.
  let primaryUsed = false;
  return (
    <div className={cn('grid gap-3', COLS[cols])}>
      {metrics.map((m) => {
        let tone = m.tone;
        if (tone === 'primary') {
          tone = primaryUsed ? undefined : 'primary';
          primaryUsed = true;
        }
        return (
          <Stat
            key={m.label}
            value={m.value}
            label={m.label}
            note={m.note}
            prefix={m.prefix}
            suffix={m.suffix}
            decimals={m.decimals}
            tone={tone}
          />
        );
      })}
    </div>
  );
}
