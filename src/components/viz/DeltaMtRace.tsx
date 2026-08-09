import { useRef } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { segment, wrap } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';

/** Log scale 0.1s .. 300s mapped onto the track width. */
const T0 = Math.log10(0.1);
const T1 = Math.log10(300);
const X0 = 118;
const XW = 300;
const xOf = (s: number) => X0 + ((Math.log10(Math.max(0.1, s)) - T0) / (T1 - T0)) * XW;

const LANES = [
  {
    label: 'whole namespace',
    sub: '256 keys sent · 129 that never resolve',
    end: 300,
    color: VIZ.rose,
    // Verdicts render at x=428 in a 560-wide viewBox: ~20 mono chars max.
    verdict: '300s · timed out',
  },
  {
    label: 'poll published translations',
    sub: 'rejected intermediate — wrong axis, reverted',
    end: 63.8,
    color: VIZ.amber,
    verdict: '63.8s · 127 / 256',
  },
  {
    label: 'delta only',
    sub: 'diff the English source snapshot, send what changed',
    end: 5.1,
    color: VIZ.emerald,
    verdict: '5.1s · done 1/1',
  },
];

export function DeltaMtRace({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const clock = useAnimationClock(t, 7000, ref);
  const p = wrap(clock);

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="Translation wait · 300s → 5.1s"
        caption="The fix was on the trigger side, not the wait side. The old sync handed the whole namespace to the translation service, which swept every unresolved key in the shared workspace — including historical ones that will never translate — into one job, then blocked on it. Keeping an English-source snapshot and sending only the delta made a one-word change cost one key."
      >
        <svg viewBox="0 0 560 250" className="w-full" role="img" aria-label="Translation latency comparison">
          {/* axis — the compression is named, and ticks make the 5.1s vs 300s
              bars readable as a measured ratio rather than a vibe */}
          <text x={X0} y={12} fill={VIZ.faint} fontSize={8} fontFamily="var(--font-mono)">
            wall-clock wait · log scale
          </text>
          {[1, 10, 100, 300].map((s) => (
            <g key={s}>
              <line x1={xOf(s)} y1={30} x2={xOf(s)} y2={196} stroke={VIZ.line} strokeDasharray="2 4" />
              <line x1={xOf(s)} y1={24} x2={xOf(s)} y2={30} stroke={VIZ.faint} />
              <text x={xOf(s)} y={21} textAnchor="middle" fill={VIZ.faint} fontSize={8} fontFamily="var(--font-mono)">
                {s} s
              </text>
            </g>
          ))}

          {LANES.map((lane, i) => {
            const y = 52 + i * 48;
            // All lanes finish by p=0.6 so the reduced-motion still (0.62)
            // shows every bar at its measured length, verdicts included.
            const grow = segment(p, 0.06 + i * 0.02, 0.06 + i * 0.02 + (i === 2 ? 0.06 : i === 1 ? 0.36 : 0.52));
            const w = (xOf(lane.end) - X0) * grow;
            const done = grow > 0.995;
            return (
              <g key={lane.label}>
                {/* Tracks paint first so no text is ever buried under a bar.
                    The label sits ABOVE the track (baseline y−12, glyph
                    bottom ≈ y−9.5 vs bar top y−6): 'poll published
                    translations' is ~186 units wide and would otherwise run
                    under the bar, which starts at X0 = 118. */}
                <rect x={X0} y={y - 6} width={XW} height={12} rx={6} fill={VIZ.surface} />
                <rect x={X0} y={y - 6} width={w} height={12} rx={6} fill={lane.color} fillOpacity={0.85} />
                <text x={0} y={y - 12} fill={VIZ.fg} fontSize={11.5} fontWeight={600}>
                  {lane.label}
                </text>
                <text x={0} y={y + 19} fill={VIZ.faint} fontSize={9.5} fontFamily="var(--font-mono)">
                  {lane.sub}
                </text>
                <text
                  x={X0 + XW + 10}
                  y={y + 4}
                  fill={done ? lane.color : VIZ.faint}
                  fontSize={10.5}
                  fontFamily="var(--font-mono)"
                  opacity={done ? 1 : 0.4}
                >
                  {lane.verdict}
                </text>
              </g>
            );
          })}

          {/* the zero-delta case */}
          <g transform={`translate(0 196)`} opacity={segment(p, 0.48, 0.6)}>
            {/* Same paint order and label placement as the lanes above. */}
            <rect x={X0} y={-6} width={XW} height={12} rx={6} fill={VIZ.surface} />
            <text x={0} y={-12} fill={VIZ.fg} fontSize={11.5} fontWeight={600}>
              delta of zero
            </text>
            <text x={0} y={19} fill={VIZ.faint} fontSize={9.5} fontFamily="var(--font-mono)">
              nothing changed since the snapshot
            </text>
            <text x={X0 + 8} y={4} fill={VIZ.emerald} fontSize={10.5} fontFamily="var(--font-mono)">
              skipped entirely — no job, no wait
            </text>
          </g>

          <text x={0} y={242} fill={VIZ.faint} fontSize={10.5} fontFamily="var(--font-mono)">
            one shared XML table · 11 locales · 326 strings + 9 plural sets + 3 arrays
          </text>
        </svg>
      </VizFrame>
    </div>
  );
}
