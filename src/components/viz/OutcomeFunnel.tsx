import { useRef } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { segment } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';

const STAGES = [
  { label: 'autonomous runs', n: 75, color: VIZ.primary },
  { label: 'complete state records', n: 73, color: VIZ.primary },
  { label: 'merge requests opened', n: 66, color: VIZ.cyan },
  { label: 'green CI pipelines', n: 56, color: VIZ.emerald },
  { label: 'reached the strip commit', n: 30, color: VIZ.amber },
  { label: 'merged to trunk', n: 2, color: VIZ.emerald },
];

const W = 300;
const TOP = 26;
const ROW = 42;

export function OutcomeFunnel({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const clock = useAnimationClock(t, 6000, ref);

  // Stage cascade, compressed so the whole funnel (and the closing note) is
  // fully drawn by the reduced-motion still at clock = 0.62.
  const appearAt = (i: number) => segment(clock, 0.02 + i * 0.07, 0.26 + i * 0.07);

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="Outcome funnel · the honest shape"
        caption="49 of the 66 merge requests were benchmark experiments never intended to land, and the merge decision always belonged to the owning engineer. Still: of 17 regular-intake tickets only 1 landed. Producing a reviewable, CI-green merge request and producing landed code are two different achievements."
      >
        <svg viewBox="0 0 560 300" className="w-full" role="img" aria-label="Outcome funnel from 75 runs to 2 merges">
          {STAGES.map((s, i) => {
            const appear = appearAt(i);
            const wTop = (STAGES[i].n / 75) * W;
            const wBot = ((STAGES[i + 1]?.n ?? STAGES[i].n) / 75) * W;
            const y = TOP + i * ROW;
            const cx = 172;
            const half = (wTop / 2) * appear;
            const halfB = (wBot / 2) * appear;
            const d = `M ${cx - half} ${y} L ${cx + half} ${y} L ${cx + halfB} ${y + ROW - 8} L ${cx - halfB} ${y + ROW - 8} Z`;
            return (
              <g key={s.label}>
                <path d={d} fill={s.color} fillOpacity={i === STAGES.length - 1 ? 0.55 : 0.22} stroke={s.color} strokeWidth={1.2} strokeOpacity={appear} />
                <text
                  x={cx}
                  y={y + 21}
                  textAnchor="middle"
                  fill={VIZ.fg}
                  fontSize={14}
                  fontWeight={700}
                  fontFamily="var(--font-mono)"
                  className="tnum"
                  opacity={appear}
                >
                  {Math.round(s.n * appear)}
                </text>
                <text x={352} y={y + 21} fill={VIZ.muted} fontSize={12.5} opacity={appear}>
                  {s.label}
                </text>
                {/* stage-to-stage conversion, computed from the stage counts
                    and placed beside each step-down edge */}
                {i < STAGES.length - 1 && (
                  <text
                    x={cx + wBot / 2 + 8}
                    y={y + ROW - 5}
                    fill={VIZ.muted}
                    fontSize={9.5}
                    fontFamily="var(--font-mono)"
                    className="tnum"
                    opacity={appearAt(i + 1)}
                  >
                    {Math.round((STAGES[i + 1].n / s.n) * 100)}%
                  </text>
                )}
              </g>
            );
          })}

          {/* centered under the funnel so the full line stays inside the
              560-wide viewBox (left-anchored at 352 it ran past the edge),
              and timed to be fully visible by the 0.62 reduced-motion still */}
          <text
            x={300}
            y={TOP + STAGES.length * ROW + 10}
            textAnchor="middle"
            fill={VIZ.amber}
            fontSize={11}
            fontFamily="var(--font-mono)"
            opacity={segment(clock, 0.48, 0.6)}
          >
            2 / 66 · the last mile stayed human
          </text>
        </svg>
      </VizFrame>
    </div>
  );
}
