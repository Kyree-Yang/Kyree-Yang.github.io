import { useRef } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { segment } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';

const LAYERS = [
  { name: 'Web dashboard', detail: 'NestJS + React · 25 endpoints · 16-state machine', loc: 29179, color: VIZ.violet },
  { name: 'Fix engine', detail: 'agent plugin · 20 steps · 7 hooks · 3 subagents', loc: 8385, color: VIZ.primary },
  { name: 'Scheduler + runners', detail: 'daemon · 5 runners · CI watchdog · signal listener', loc: 4909, color: VIZ.cyan },
  { name: 'Chat + proxy', detail: 'outbound cards · inbound Q&A bot · CONNECT proxy', loc: 900, color: VIZ.amber },
];

/**
 * The widely-quoted ~42,500 figure is the sum of the three exactly-counted
 * layers (42,473). The chat layer was estimated separately and is not inside
 * it, so the honest total across all four is ~43,400. Both are shown rather
 * than quietly reconciled.
 */
const CORE = LAYERS.filter((l) => l.name !== 'Chat + proxy').reduce((s, l) => s + l.loc, 0);
const TOTAL = LAYERS.reduce((s, l) => s + l.loc, 0);
const MAX = Math.max(...LAYERS.map((l) => l.loc));

export function LayerStack({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const clock = useAnimationClock(t, 5200, ref);

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="Four layers"
        caption="The thing that reasons about code, the thing that schedules work, the thing humans click, and the thing that talks to people — each fails independently, each measured independently. The ~42,500 figure quoted elsewhere is the three exactly-counted layers; the chat layer was estimated separately and sits on top of it."
      >
        <svg viewBox="0 0 560 310" className="w-full" role="img" aria-label="Code distribution across four layers">
          {LAYERS.map((l, i) => {
            const grow = segment(clock, 0.05 + i * 0.09, 0.45 + i * 0.09);
            const w = (l.loc / MAX) * 372 * grow;
            const y = 34 + i * 58;
            return (
              <g key={l.name}>
                <text x={0} y={y + 12} fill={VIZ.fg} fontSize={13.5} fontWeight={600}>
                  {l.name}
                </text>
                <text x={0} y={y + 29} fill={VIZ.faint} fontSize={11} fontFamily="var(--font-mono)">
                  {l.detail}
                </text>
                <rect x={0} y={y + 36} width={372} height={7} rx={3.5} fill={VIZ.surface} />
                <rect x={0} y={y + 36} width={w} height={7} rx={3.5} fill={l.color} />
                <text
                  x={392}
                  y={y + 43}
                  fill={l.color}
                  fontSize={13}
                  fontWeight={600}
                  fontFamily="var(--font-mono)"
                  className="tnum"
                >
                  {Math.round(l.loc * grow).toLocaleString('en-US')}
                </text>
              </g>
            );
          })}

          <line x1={0} y1={266} x2={476} y2={266} stroke={VIZ.line} />
          <text x={0} y={284} fill={VIZ.muted} fontSize={11.5} fontFamily="var(--font-mono)">
            three exactly-counted layers
          </text>
          <text
            x={476}
            y={284}
            textAnchor="end"
            fill={VIZ.fg}
            fontSize={14}
            fontWeight={700}
            fontFamily="var(--font-mono)"
            className="tnum"
          >
            {Math.round(CORE * segment(clock, 0.05, 0.72)).toLocaleString('en-US')} lines
          </text>
          <text x={0} y={300} fill={VIZ.faint} fontSize={10.5} fontFamily="var(--font-mono)">
            with the estimated chat layer
          </text>
          <text
            x={476}
            y={300}
            textAnchor="end"
            fill={VIZ.faint}
            fontSize={11}
            fontFamily="var(--font-mono)"
            className="tnum"
          >
            ≈ {(Math.round((TOTAL * segment(clock, 0.05, 0.72)) / 100) * 100).toLocaleString('en-US')}{' '}
            lines
          </text>
        </svg>
      </VizFrame>
    </div>
  );
}
