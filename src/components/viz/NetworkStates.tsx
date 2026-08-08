import { useRef, useState } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { wrap, cn } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';

type Gear = 'normal' | 'weak' | 'timeout' | 'offline';

const GEARS: { id: Gear; label: string; resolveAt: number | null; color: string }[] = [
  { id: 'normal', label: 'Normal', resolveAt: 0.8, color: VIZ.emerald },
  { id: 'weak', label: 'Weak', resolveAt: 5.0, color: VIZ.amber },
  { id: 'timeout', label: 'Timeout', resolveAt: null, color: VIZ.rose },
  { id: 'offline', label: 'Offline', resolveAt: 0, color: VIZ.faint },
];

const SLOW = 3; // seconds — adds an "unstable connection" hint
const TIMEOUT = 8; // seconds — loading converts to a retryable failure
const SPAN = 10;

export function NetworkStates({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<Gear>('weak');
  const clock = useAnimationClock(t, 12000, ref);

  const auto = t !== undefined;
  const p = wrap(clock);
  // GIF mode cycles all four gears; interactive mode replays the picked one.
  const slot = Math.floor(p * 4);
  const gear = auto ? GEARS[slot].id : picked;
  const local = auto ? (p * 4) % 1 : wrap(clock * 2);
  const cfg = GEARS.find((g) => g.id === gear)!;

  const sec = local * SPAN;
  const offline = gear === 'offline';
  const resolved = cfg.resolveAt !== null && sec >= cfg.resolveAt;
  const timedOut = cfg.resolveAt === null && sec >= TIMEOUT;
  const showHint = !offline && !resolved && sec >= SLOW && !timedOut;

  const x = (s: number) => 40 + (s / SPAN) * 330;

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="Weak-network state machine"
        caption="Weak network defaults to slow-but-successful, matching how real networks behave; timeout stays a distinct state instead of collapsing into it. Screens hold zero network listeners — flipping a gear re-mounts the screen centrally, so the code an engineer receives has no sandbox scaffolding to strip."
        aside={
          !bare && (
            <div className="flex gap-1">
              {GEARS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setPicked(g.id)}
                  className={cn(
                    'elevate rounded-md border px-2 py-0.5 font-mono text-[11px] transition-colors',
                    picked === g.id ? 'border-primary text-primary' : 'text-muted',
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>
          )
        }
      >
        <svg viewBox="0 0 560 250" className="w-full" role="img" aria-label="Network state machine timeline">
          {/* timeline */}
          <line x1={40} y1={70} x2={370} y2={70} stroke={VIZ.line} strokeWidth={1.4} />
          {[0, 2, 4, 6, 8, 10].map((s) => (
            <g key={s}>
              <line x1={x(s)} y1={66} x2={x(s)} y2={74} stroke={VIZ.line} />
              <text x={x(s)} y={90} textAnchor="middle" fill={VIZ.faint} fontSize={10} fontFamily="var(--font-mono)">
                {s}s
              </text>
            </g>
          ))}

          {/* thresholds */}
          <line x1={x(SLOW)} y1={34} x2={x(SLOW)} y2={78} stroke={VIZ.amber} strokeDasharray="3 3" />
          <text x={x(SLOW)} y={28} textAnchor="middle" fill={VIZ.amber} fontSize={10} fontFamily="var(--font-mono)">
            3s slow
          </text>
          <line x1={x(TIMEOUT)} y1={34} x2={x(TIMEOUT)} y2={78} stroke={VIZ.rose} strokeDasharray="3 3" />
          <text x={x(TIMEOUT)} y={28} textAnchor="middle" fill={VIZ.rose} fontSize={10} fontFamily="var(--font-mono)">
            8s timeout
          </text>

          {/* playhead */}
          {!offline && (
            <>
              <rect x={40} y={64} width={Math.max(0, x(Math.min(sec, SPAN)) - 40)} height={12} rx={6} fill={cfg.color} fillOpacity={0.28} />
              <circle cx={x(Math.min(sec, SPAN))} cy={70} r={5} fill={cfg.color} />
            </>
          )}

          <text x={40} y={116} fill={VIZ.faint} fontSize={11} fontFamily="var(--font-mono)">
            gear: {cfg.label.toLowerCase()}
            {cfg.id === 'timeout' && ' · sandbox-only'}
          </text>

          {/* phone frame */}
          <g transform="translate(400 16)">
            <rect x={0} y={0} width={132} height={218} rx={18} fill={VIZ.surface} stroke={VIZ.line} strokeWidth={1.4} />
            {offline ? (
              <>
                <circle cx={66} cy={84} r={20} fill="none" stroke={VIZ.faint} strokeWidth={1.6} />
                <line x1={54} y1={72} x2={78} y2={96} stroke={VIZ.faint} strokeWidth={1.6} />
                <text x={66} y={124} textAnchor="middle" fill={VIZ.muted} fontSize={10.5}>
                  No connection
                </text>
                <rect x={36} y={138} width={60} height={22} rx={11} fill="none" stroke={VIZ.primary} />
                <text x={66} y={153} textAnchor="middle" fill={VIZ.primary} fontSize={10}>
                  Retry
                </text>
              </>
            ) : timedOut ? (
              <>
                <circle cx={66} cy={84} r={20} fill="none" stroke={VIZ.rose} strokeWidth={1.6} />
                <text x={66} y={90} textAnchor="middle" fill={VIZ.rose} fontSize={18}>
                  !
                </text>
                <text x={66} y={124} textAnchor="middle" fill={VIZ.muted} fontSize={10.5}>
                  Couldn’t load
                </text>
                <rect x={36} y={138} width={60} height={22} rx={11} fill="none" stroke={VIZ.primary} />
                <text x={66} y={153} textAnchor="middle" fill={VIZ.primary} fontSize={10}>
                  Retry
                </text>
              </>
            ) : resolved ? (
              <>
                {[0, 1, 2, 3].map((i) => (
                  <rect key={i} x={16} y={24 + i * 42} width={100} height={30} rx={6} fill={VIZ.surface} stroke={VIZ.line} />
                ))}
                <text x={66} y={204} textAnchor="middle" fill={VIZ.emerald} fontSize={10} fontFamily="var(--font-mono)">
                  content
                </text>
              </>
            ) : (
              <>
                <circle
                  cx={66}
                  cy={96}
                  r={14}
                  fill="none"
                  stroke={VIZ.line}
                  strokeWidth={3}
                />
                <circle
                  cx={66}
                  cy={96}
                  r={14}
                  fill="none"
                  stroke={cfg.color}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray={`${22} ${88}`}
                  transform={`rotate(${local * 1080} 66 96)`}
                />
                {showHint && (
                  <g>
                    <rect x={12} y={162} width={108} height={26} rx={8} fill={VIZ.amber} fillOpacity={0.16} stroke={VIZ.amber} />
                    <text x={66} y={179} textAnchor="middle" fill={VIZ.amber} fontSize={9}>
                      Unstable connection
                    </text>
                  </g>
                )}
              </>
            )}
          </g>

          {/* rules */}
          <g transform="translate(40 146)" fontSize={11} fontFamily="var(--font-mono)">
            <text y={0} fill={VIZ.faint}>
              3 network states + 1 sandbox gear · 2 latency thresholds
            </text>
            <text y={20} fill={VIZ.faint}>
              8 loading scenarios → 6 loading forms
            </text>
            <text y={40} fill={VIZ.faint}>
              retry only where a retry can restore intent
            </text>
            <text y={60} fill={VIZ.muted}>
              pull-to-refresh and load-more restore the prior view instead
            </text>
          </g>
        </svg>
      </VizFrame>
    </div>
  );
}
