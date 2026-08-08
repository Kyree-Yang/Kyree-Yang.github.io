import { useRef, useState } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { cn, segment, wrap } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';

const N = 73;

const STATES = [
  { label: 'waiting on on-device verification', n: 34, color: VIZ.amber },
  { label: 'completed', n: 27, color: VIZ.emerald },
  { label: 'stopped in evidence collection', n: 4, color: VIZ.faint },
  { label: 'needs-human', n: 4, color: VIZ.faint },
  { label: 'at strip-commit', n: 3, color: VIZ.faint },
  { label: 'at commit #1', n: 1, color: VIZ.faint },
];

const DUR = 5200;
const GROW = 700 / DUR;
const STAGGER = 80 / DUR;
const PULSE = 400 / DUR;
const START = 0.06;

const X0 = 4;
const BAR = 552;
const GAP = 2;
const SPAN = BAR - (STATES.length - 1) * GAP;

/** Isolating a segment pins the bar at its finished state so it can be read. */
const SETTLED = 0.9;

export function TerminalStates({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isolated, setIsolated] = useState<number | null>(null);
  const [override, setOverride] = useState<number | null>(null);
  const clock = useAnimationClock(t, DUR, ref);
  const p = override ?? wrap(clock);

  const toggle = (i: number) => {
    const next = isolated === i ? null : i;
    setIsolated(next);
    setOverride(next === null ? null : SETTLED);
  };

  let cursor = X0;
  const segs = STATES.map((s, i) => {
    const start = START + i * STAGGER;
    const full = (s.n / N) * SPAN;
    const x = cursor;
    cursor += full + GAP;
    return { ...s, i, x, full, grow: segment(p, start, start + GROW), share: s.n / N };
  });

  // The dominant bucket gets one stroke pulse as it lands — it is the finding.
  const pulseAt = START + GROW;
  const pulse =
    p < pulseAt || p > pulseAt + PULSE ? 0 : 1 - Math.abs(p - (pulseAt + PULSE / 2)) / (PULSE / 2);

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="Terminal states · 73 runs"
        caption="47% of all runs end waiting for a human with a phone. Human verification, not agent capability, was the throughput ceiling."
      >
        <svg viewBox="0 0 560 100" className="w-full" role="img" aria-label="Where 73 autonomous runs stopped">
          <text x={X0} y={13} fill={VIZ.faint} fontSize={10.5} fontFamily="var(--font-mono)">
            73 runs with complete state records
          </text>
          <text
            x={X0 + BAR}
            y={13}
            textAnchor="end"
            fill={VIZ.faint}
            fontSize={10.5}
            fontFamily="var(--font-mono)"
          >
            100%
          </text>

          <rect x={X0} y={24} width={BAR} height={44} rx={6} fill={VIZ.surface} />

          {segs.map((s) => (
            <g
              key={s.label}
              className="transition-opacity duration-200"
              opacity={isolated === null || isolated === s.i ? 1 : 0.2}
            >
              <rect
                x={s.x}
                y={24}
                width={Math.max(0, s.full * s.grow)}
                height={44}
                rx={3}
                fill={s.color}
                stroke={s.i === 0 ? s.color : 'none'}
                strokeWidth={s.i === 0 ? 1 + 2 * pulse : 0}
              />
              {s.i < 2 && (
                <>
                  <text
                    x={s.x + 12}
                    y={46}
                    fill="var(--primary-fg)"
                    fontSize={15}
                    fontWeight={700}
                    fontFamily="var(--font-mono)"
                    className="tnum"
                    opacity={s.grow}
                  >
                    {Math.round(s.n * s.grow)}
                  </text>
                  <text x={s.x + 12} y={61} fill="var(--primary-fg)" fontSize={10} opacity={s.grow}>
                    {s.label}
                  </text>
                </>
              )}
              {/* under 5 % there is no room for a share label — the legend carries those */}
              {s.share >= 0.05 && (
                <text
                  x={s.x + s.full / 2}
                  y={85}
                  textAnchor="middle"
                  fill={VIZ.muted}
                  fontSize={9.5}
                  fontFamily="var(--font-mono)"
                  className="tnum"
                  opacity={s.grow}
                >
                  {Math.round(s.share * 100)}%
                </text>
              )}
            </g>
          ))}
        </svg>

        {!bare && (
          <div className="mt-3 grid grid-cols-1 gap-x-5 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-3">
            {STATES.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={isolated === i}
                className={cn(
                  'elevate flex items-start gap-2 rounded-md px-1.5 py-1 text-left transition-opacity',
                  isolated !== null && isolated !== i && 'opacity-40',
                )}
              >
                <span
                  aria-hidden
                  className="mt-[6px] size-2 shrink-0 rounded-[2px]"
                  style={{ background: s.color }}
                />
                <span className="min-w-0 flex-1 text-[11.5px] leading-snug text-muted">{s.label}</span>
                <span className="tnum font-mono text-[11.5px] leading-snug">{s.n}</span>
              </button>
            ))}
          </div>
        )}
      </VizFrame>
    </div>
  );
}
