import { useRef } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { segment, wrap } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';

const STAGES = [
  { lines: ['prompt'], sub: 'user text', color: VIZ.muted },
  { lines: ['text', 'augmentation'], sub: 'prompt variants', color: VIZ.violet },
  { lines: ['Stable', 'Diffusion'], sub: 'image synthesis', color: VIZ.primary },
  { lines: ['Laplacian', 'pyramid'], sub: 'frequency bands', color: VIZ.cyan },
  { lines: ['diverse', 'outputs'], sub: 'training samples', color: VIZ.violet },
];

const DUR = 4800;
const STAGGER = 120 / DUR;
const BOXW = 88;
// GAP 28 keeps the last box's right edge (incl. stroke) at 554.5, well inside
// the 560 viewBox — at 29 it sat 1.5px from the edge and shaved at small scales.
const GAP = 28;
const PITCH = BOXW + GAP;
const X0 = 2;
const LASTX = X0 + 4 * PITCH;
const BOXY = 44;
const BOXH = 100;
const MID = BOXY + BOXH / 2;

export function PipelineDiagram({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const clock = useAnimationClock(t, DUR, ref);
  const p = wrap(clock);

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="One-shot generation pipeline"
        caption="combining text augmentation, Stable Diffusion, and Laplacian pyramid for diverse generation"
      >
        <svg viewBox="0 0 560 200" className="w-full" role="img" aria-label="Five-stage text-to-image augmentation pipeline">
          <text x={X0} y={22} fill={VIZ.faint} fontSize={10.5} fontFamily="var(--font-mono)">
            one-shot pipeline
          </text>
          <text x={558} y={22} textAnchor="end" fill={VIZ.faint} fontSize={10.5} fontFamily="var(--font-mono)">
            5 stages · 4 connectors
          </text>

          {STAGES.slice(0, -1).map((s, i) => {
            const start = 0.1 + i * STAGGER;
            const grow = segment(p, start, start + 340 / DUR);
            const x1 = X0 + i * PITCH + BOXW;
            return (
              <g key={`link-${s.sub}`} opacity={grow}>
                <line
                  x1={x1}
                  y1={MID}
                  x2={x1 + GAP - 7}
                  y2={MID}
                  stroke={VIZ.faint}
                  strokeWidth={1.6}
                  strokeDasharray={GAP - 7}
                  strokeDashoffset={(GAP - 7) * (1 - grow)}
                />
                <path
                  d={`M ${x1 + GAP - 7} ${MID - 4} L ${x1 + GAP} ${MID} L ${x1 + GAP - 7} ${MID + 4} Z`}
                  fill={VIZ.faint}
                />
              </g>
            );
          })}

          {STAGES.map((s, i) => {
            const start = 0.04 + i * STAGGER;
            const appear = segment(p, start, start + 380 / DUR);
            const x = X0 + i * PITCH;
            const cx = x + BOXW / 2;
            return (
              <g key={s.sub} opacity={appear} transform={`translate(0 ${8 * (1 - appear)})`}>
                <rect x={x} y={BOXY} width={BOXW} height={BOXH} rx={10} fill={VIZ.surface} stroke={VIZ.line} />
                <text
                  x={cx}
                  y={BOXY + 20}
                  textAnchor="middle"
                  fill={VIZ.faint}
                  fontSize={9}
                  fontFamily="var(--font-mono)"
                  className="tnum"
                >
                  {String(i + 1).padStart(2, '0')}
                </text>
                <line x1={cx - 14} y1={BOXY + 30} x2={cx + 14} y2={BOXY + 30} stroke={s.color} strokeWidth={2} />
                {s.lines.map((line, li) => (
                  <text
                    key={line}
                    x={cx}
                    y={BOXY + (s.lines.length === 1 ? 56 : 50 + li * 14)}
                    textAnchor="middle"
                    fill={VIZ.fg}
                    fontSize={10.5}
                    fontWeight={600}
                  >
                    {line}
                  </text>
                ))}
                <text
                  x={cx}
                  y={BOXY + 84}
                  textAnchor="middle"
                  fill={VIZ.faint}
                  fontSize={9}
                  fontFamily="var(--font-mono)"
                >
                  {s.sub}
                </text>
              </g>
            );
          })}

          {/* one-shot claim, printed statically: one input at the head,
              many outputs at the tail — no animation state can hide it */}
          <g fontFamily="var(--font-mono)" stroke="none">
            <path d={`M ${X0} 150 v 5 h ${BOXW} v -5`} fill="none" stroke={VIZ.faint} strokeWidth={1} />
            <line x1={X0 + BOXW / 2} y1={155} x2={X0 + BOXW / 2} y2={159} stroke={VIZ.faint} strokeWidth={1} />
            <text x={X0 + BOXW / 2} y={170} textAnchor="middle" fill={VIZ.muted} fontSize={8.5}>
              one prompt
            </text>

            <path d={`M ${LASTX} 150 v 5 h ${BOXW} v -5`} fill="none" stroke={VIZ.faint} strokeWidth={1} />
            {[-22, 0, 22].map((dx) => (
              <line
                key={dx}
                x1={LASTX + BOXW / 2 + dx}
                y1={155}
                x2={LASTX + BOXW / 2 + dx}
                y2={159}
                stroke={VIZ.faint}
                strokeWidth={1}
              />
            ))}
            <text x={LASTX + BOXW / 2} y={170} textAnchor="middle" fill={VIZ.muted} fontSize={8.5}>
              diverse outputs,
            </text>
            <text x={LASTX + BOXW / 2} y={180} textAnchor="middle" fill={VIZ.muted} fontSize={8.5}>
              one shot
            </text>
          </g>

          <text
            x={X0}
            y={182}
            fill={VIZ.muted}
            fontSize={10.5}
            // completes by p=0.6 so the reduced-motion still (0.62) is whole
            opacity={segment(p, 0.48, 0.6)}
          >
            text augmentation was the original contribution; the pyramid recombines frequency bands
          </text>
        </svg>
      </VizFrame>
    </div>
  );
}
