import { useRef, useState } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { cn, lerp, segment, wrap } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';

const STOPS = [
  { pct: 18, frac: '4 / 22', label: 'round 1 · of units run', quoted: false },
  { pct: 28, frac: '7 / 25', label: 'round 2 · of units queued', quoted: false },
  { pct: 33, frac: '4 / 12', label: 'round 1 · of units with a verdict', quoted: false },
  { pct: 44, frac: '4 / 9', label: 'round 1 · of units that reproduced', quoted: false },
  { pct: 54, frac: '7 / 13', label: 'round 2 · of units that reproduced', quoted: false },
  { pct: 58, frac: 'denominator undefined', label: 'quoted elsewhere', quoted: true },
];

const UNITS = 31;
/** The five pairs carrying an on-device verdict on both arms — fixed, not sampled. */
const BOTH = new Set([3, 9, 15, 22, 28]);

const DUR = 7000;
const LEFT = 70;
const RIGHT = 190;
const TOP = 34;
const PITCH = 8.2;

/** Starts on the most conservative stop; the reader has to drag to flatter numbers. */
const DEFAULT_STOP = 0.5 / STOPS.length;

export function DenominatorSlider({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [override, setOverride] = useState<number | null>(DEFAULT_STOP);
  const clock = useAnimationClock(t, DUR, ref);

  const p = override ?? wrap(clock);
  const idx = Math.min(STOPS.length - 1, Math.floor(p * STOPS.length));

  // The pair plot narrates on its own clock — the slider owns `p`.
  const focus = segment(clock, 0.34, 0.5);
  const verdict = segment(clock, 0.52, 0.64);

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="Two-arm benchmark · 31 paired units"
        caption="31 paired units. Only 5 have on-device verdicts on both arms — at n=5 the core question is not answerable, and I published it that way."
      >
        <div className="grid items-center gap-6 sm:grid-cols-2">
          <svg viewBox="0 0 260 300" className="w-full" role="img" aria-label="31 paired benchmark units, five with verdicts on both arms">
            <text x={LEFT} y={14} textAnchor="middle" fill={VIZ.faint} fontSize={9.5} fontFamily="var(--font-mono)">
              raw ticket
            </text>
            <text x={RIGHT} y={14} textAnchor="middle" fill={VIZ.faint} fontSize={9.5} fontFamily="var(--font-mono)">
              evidence-enriched
            </text>

            {Array.from({ length: UNITS }, (_, i) => {
              const start = 0.03 + i * 0.004;
              const show = segment(clock, start, start + 800 / DUR);
              const both = BOTH.has(i);
              const y = TOP + i * PITCH;
              const color = both ? VIZ.primary : VIZ.faint;
              return (
                <g key={i} opacity={show}>
                  <line
                    x1={LEFT + 6}
                    y1={y}
                    x2={RIGHT - 6}
                    y2={y}
                    stroke={color}
                    strokeWidth={both ? lerp(1, 2.2, focus) : 1}
                    strokeOpacity={both ? lerp(0.5, 1, focus) : lerp(0.5, 0.1, focus)}
                  />
                  <circle cx={LEFT} cy={y} r={both ? lerp(2.6, 3.6, focus) : 2.6} fill={color} fillOpacity={both ? 1 : lerp(0.8, 0.3, focus)} />
                  <circle cx={RIGHT} cy={y} r={both ? lerp(2.6, 3.6, focus) : 2.6} fill={color} fillOpacity={both ? 1 : lerp(0.8, 0.3, focus)} />
                </g>
              );
            })}

            <text x={0} y={294} fill={VIZ.amber} fontSize={10.5} fontFamily="var(--font-mono)" opacity={verdict}>
              5 of 31 have verdicts on both arms
            </text>
          </svg>

          <div>
            <div className="font-mono text-[10.5px] tracking-wider text-faint uppercase">denominator</div>

            {/* an odometer, so a stop change slides the digits instead of swapping them */}
            <div className="mt-1 h-24 overflow-hidden">
              <div
                className="transition-transform duration-300 ease-out"
                style={{ transform: `translateY(-${idx * 6}rem)` }}
              >
                {STOPS.map((s) => (
                  <div key={s.pct} className="flex h-24 flex-col justify-center">
                    <div
                      className={cn(
                        'tnum text-4xl font-semibold tracking-tight',
                        s.quoted ? 'text-amber' : 'text-fg',
                      )}
                    >
                      {s.pct}%
                    </div>
                    <div className="tnum font-mono text-[12px] text-muted">{s.frac}</div>
                    <div className="text-[12px] leading-snug text-faint">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={STOPS.length - 1}
              step={1}
              value={idx}
              onChange={(e) => setOverride((Number(e.target.value) + 0.5) / STOPS.length)}
              aria-label="denominator"
              className="mt-4 w-full accent-primary"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-faint">
              {STOPS.map((s) => (
                <span key={s.pct} className="tnum">
                  {s.pct}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-snug text-faint">
              Same experiment, six defensible denominators. Every table ships a denominator definition
              before it quotes a rate.
            </p>
          </div>
        </div>
      </VizFrame>
    </div>
  );
}
