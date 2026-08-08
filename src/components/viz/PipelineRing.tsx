import { useRef, useState } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { VizFrame, VIZ } from './VizFrame';
import { sat, wrap } from '@/lib/utils';

const STEPS = [
  'workspace',
  'worktree',
  'collect evidence',
  'read knowledge base',
  'analyze',
  'root-cause vote',
  'solution vote',
  'fix',
  'self-review',
  'compile',
  'MR text',
  'commit #1 · logs in',
  'open MR',
  'CI gate',
  'on-device verify',
  'commit #2 · logs stripped',
  'close ticket',
  'report',
  'knowledge base write',
  'cleanup',
];

/** Steps whose completion a shell hook blocks on, not just documents. */
const GATED = new Set([3, 6, 9, 12, 13, 14, 16]);
/** The only step that waits on a person. */
const HUMAN_STOP = 14;

/** The lap occupies most of the loop; the tail replays an ordering violation. */
const LAP_END = 0.86;

const R = 118;
const CX = 190;
const CY = 175;
const C = 2 * Math.PI * R;

function pos(i: number) {
  const a = (i / STEPS.length) * Math.PI * 2 - Math.PI / 2;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
}

export function PipelineRing({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [override, setOverride] = useState<number | null>(null);
  const clock = useAnimationClock(t, 14000, ref);
  const p = override ?? wrap(clock);

  const replaying = p >= LAP_END;
  const lap = replaying ? 1 : p / LAP_END;

  const cursor = lap * STEPS.length;
  const active = Math.min(STEPS.length - 1, Math.floor(cursor));
  const frac = cursor - Math.floor(cursor);

  // During the replay the token attempts 12 → 15 and is bounced back to 12.
  const replay = sat((p - LAP_END) / (1 - LAP_END));
  const reach = replay < 0.55 ? replay / 0.55 : 1 - (replay - 0.55) / 0.45;

  const from = replaying ? pos(11) : pos(active);
  const to = replaying ? pos(14) : pos((active + 1) % STEPS.length);
  const travel = replaying ? reach * 0.8 : frac;
  const tokenX = from.x + (to.x - from.x) * travel;
  const tokenY = from.y + (to.y - from.y) * travel;

  const gateHit = !replaying && GATED.has(active) && frac < 0.35;
  const humanStop = !replaying && active === HUMAN_STOP;
  const rejecting = replaying && replay > 0.5;

  return (
    <div
      ref={ref}
      onPointerEnter={() => setOverride(p)}
      onPointerLeave={() => setOverride(null)}
      onFocus={() => setOverride(p)}
      onBlur={() => setOverride(null)}
    >
      <VizFrame
        bare={bare}
        title="20-step state machine"
        caption="Entering step N writes the run status; the completion hook asserts the run is at N+1 or beyond before it will let the step close. Ordering is mechanically enforced — most content checks are existence checks, and I am precise about which is which."
      >
        <svg viewBox="0 0 560 350" className="w-full" role="img" aria-label="20-step pipeline ring">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke={VIZ.line} strokeWidth={1} />

          {/* progress arc traced by the token */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={VIZ.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - lap)}
            transform={`rotate(-90 ${CX} ${CY})`}
            opacity={0.55}
          />

          {STEPS.map((label, i) => {
            const { x, y } = pos(i);
            const done = i < active;
            const isActive = !replaying && i === active;
            const gated = GATED.has(i);
            const bounced = replaying && i === HUMAN_STOP;
            return (
              <g key={label}>
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 7.5 : 4.5}
                  fill={isActive || done ? VIZ.primary : VIZ.surface}
                  fillOpacity={isActive ? 1 : done ? 0.45 : 1}
                  stroke={bounced ? VIZ.rose : gated ? VIZ.amber : VIZ.line}
                  strokeWidth={gated || bounced ? 1.6 : 1}
                />
                {gated && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isActive && gateHit ? 13 : 10}
                    fill="none"
                    stroke={VIZ.amber}
                    strokeWidth={1}
                    opacity={isActive && gateHit ? 0.9 : 0.25}
                  />
                )}
                {bounced && (
                  <circle cx={x} cy={y} r={14} fill="none" stroke={VIZ.rose} strokeWidth={1.6} opacity={rejecting ? 0.95 : 0.35} />
                )}
              </g>
            );
          })}

          <circle cx={tokenX} cy={tokenY} r={5} fill={replaying ? VIZ.rose : VIZ.cyan} />
          <circle cx={tokenX} cy={tokenY} r={11} fill={replaying ? VIZ.rose : VIZ.cyan} opacity={0.18} />

          {/* centre readout */}
          <text x={CX} y={CY - 14} textAnchor="middle" fill={VIZ.faint} fontSize={11} fontFamily="var(--font-mono)">
            {replaying ? 'ORDERING VIOLATION' : `STEP ${String(active + 1).padStart(2, '0')} / 20`}
          </text>
          <text x={CX} y={CY + 8} textAnchor="middle" fill={VIZ.fg} fontSize={14} fontWeight={600}>
            {replaying ? 'commit #1 → on-device verify' : STEPS[active]}
          </text>
          {!replaying && GATED.has(active) && (
            <text x={CX} y={CY + 28} textAnchor="middle" fill={VIZ.amber} fontSize={10.5} fontFamily="var(--font-mono)">
              hook gate · exit 2 on violation
            </text>
          )}
          {humanStop && (
            <text x={CX} y={CY + 46} textAnchor="middle" fill={VIZ.rose} fontSize={10.5} fontFamily="var(--font-mono)">
              one of only two human stop points
            </text>
          )}
          {replaying && (
            <text x={CX} y={CY + 28} textAnchor="middle" fill={VIZ.rose} fontSize={10.5} fontFamily="var(--font-mono)">
              exit 2 — status must be 13, got 15
            </text>
          )}

          {/* legend */}
          <g transform="translate(360 66)" fontFamily="var(--font-mono)" fontSize={11}>
            <circle cx={6} cy={-4} r={4.5} fill={VIZ.surface} stroke={VIZ.line} />
            <text x={20} y={0} fill={VIZ.muted}>
              step
            </text>
            <circle cx={6} cy={22} r={4.5} fill={VIZ.surface} stroke={VIZ.amber} strokeWidth={1.6} />
            <circle cx={6} cy={22} r={9.5} fill="none" stroke={VIZ.amber} opacity={0.3} />
            <text x={20} y={26} fill={VIZ.muted}>
              hook-gated (7)
            </text>
            <circle cx={6} cy={48} r={5} fill={VIZ.cyan} />
            <text x={20} y={52} fill={VIZ.muted}>
              run cursor
            </text>

            <text x={0} y={92} fill={VIZ.faint}>
              20 steps
            </text>
            {/* Only ~200px of viewBox remains right of x=360; longer clips. */}
            <text x={0} y={110} fill={VIZ.faint}>
              7 hooks · 54 hard blocks
            </text>
            <text x={0} y={128} fill={VIZ.faint}>
              2 human stop points
            </text>
            {override !== null && (
              <text x={0} y={156} fill={VIZ.primary}>
                paused — you are driving
              </text>
            )}
          </g>
        </svg>
      </VizFrame>
    </div>
  );
}
