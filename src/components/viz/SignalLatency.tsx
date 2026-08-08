import { useRef } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { segment, wrap } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';

const CHANNELS = [
  { name: 'SSE + credit-pull', n: 102, color: VIZ.emerald },
  { name: 'plain SSE', n: 4, color: VIZ.cyan },
  { name: 'long-poll fallback', n: 0, color: VIZ.faint },
  { name: 'WebSocket', n: 0, color: VIZ.faint },
];

export function SignalLatency({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const clock = useAnimationClock(t, 6400, ref);
  const p = wrap(clock);

  const beforeFill = segment(p, 0.05, 0.62); // ~95 s crawls
  const afterFill = segment(p, 0.05, 0.075); // 1–2 s snaps
  const heartbeat = (Math.sin(p * Math.PI * 8) + 1) / 2;

  const bar = (y: number, label: string, value: string, fill: number, color: string) => (
    <g>
      <text x={0} y={y - 8} fill={VIZ.muted} fontSize={12}>
        {label}
      </text>
      <rect x={0} y={y} width={390} height={12} rx={6} fill={VIZ.surface} />
      <rect x={0} y={y} width={390 * fill} height={12} rx={6} fill={color} />
      <text x={402} y={y + 11} fill={color} fontSize={13} fontWeight={600} fontFamily="var(--font-mono)">
        {value}
      </text>
    </g>
  );

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="Click → agent spawn"
        caption="An outbound SSE channel with a credit-pull protocol: the laptop dials out, consumes one signal, then grants credit for the next. Polling stays underneath as the always-there fallback, so the fast path is an optimization and not a dependency."
      >
        <svg viewBox="0 0 560 268" className="w-full" role="img" aria-label="Signal latency before and after">
          {bar(24, 'before · next scheduler tick', '~95 s', beforeFill, VIZ.rose)}
          {bar(74, 'after · outbound push', '1–2 s', afterFill, VIZ.emerald)}

          <line x1={0} y1={116} x2={470} y2={116} stroke={VIZ.line} />

          <text x={0} y={138} fill={VIZ.faint} fontSize={11} fontFamily="var(--font-mono)">
            106 kicks delivered, by channel
          </text>

          {CHANNELS.map((c, i) => {
            const y = 154 + i * 24;
            const grow = segment(p, 0.2 + i * 0.06, 0.5 + i * 0.06);
            return (
              <g key={c.name}>
                <text x={0} y={y + 9} fill={c.n ? VIZ.muted : VIZ.faint} fontSize={11.5}>
                  {c.name}
                </text>
                <rect x={150} y={y} width={240} height={10} rx={5} fill={VIZ.surface} />
                <rect x={150} y={y} width={(c.n / 106) * 240 * grow} height={10} rx={5} fill={c.color} />
                <text
                  x={402}
                  y={y + 9}
                  fill={c.n ? c.color : VIZ.faint}
                  fontSize={12}
                  fontFamily="var(--font-mono)"
                  className="tnum"
                >
                  {Math.round(c.n * grow)}
                </text>
                {i === 0 && (
                  <circle cx={150 + 240 * (c.n / 106) * grow} cy={y + 5} r={3 + heartbeat * 2} fill={VIZ.emerald} opacity={0.5 + heartbeat * 0.5} />
                )}
              </g>
            );
          })}

          <text x={0} y={258} fill={VIZ.faint} fontSize={11} fontFamily="var(--font-mono)">
            fallback polling 90 s active / 600 s idle · 16,082 ticks over 40 days
          </text>
        </svg>
      </VizFrame>
    </div>
  );
}
