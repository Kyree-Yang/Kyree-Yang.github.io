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

/** What each step leaves behind — two artifact lines per step, shown in the
 *  side panel as the cursor arrives. Restates facts the entry page already
 *  claims; nothing here is a new number. */
const ARTIFACTS: [string, string][] = [
  ['ticket parsed → platform picked', 'repo snapshot mounted'],
  ['fresh git worktree, own branch', 'no checkout shared between runs'],
  ['attachments · logs · screen recording', 'counterpart impl on the other platform'],
  ['notes from prior runs pulled in', 'auto-written at step 19'],
  ['competing hypotheses, argued in writing', 'every fact anchored file:line'],
  ['hypotheses vote on a root cause', 'the losing theory is kept, not deleted'],
  ['candidate fixes scored for blast radius', 'smallest reversible diff wins'],
  ['patch applied in the worktree', 'kill switch wired — one flag reverts'],
  ['agent reviews its own diff cold', 'scope · style · regression risk'],
  ['builds on both targets', 'a red build loops back with the log'],
  ['evidence table pasted into the MR', 'reviewers see reasoning, not vibes'],
  ['debug instrumentation committed', 'QR install build for a phone'],
  ['MR opened against trunk', 'CI pipeline attached'],
  ['internal CI must go green', 'red blocks the close hook'],
  ['a human with the phone confirms', 'the largest queue in the system'],
  ['debug logs stripped byte-clean', 'diff re-verified after the strip'],
  ['status written back to the tracker', 'links: MR · build · evidence'],
  ['run report: what changed, what broke', 'denominators included'],
  ['lessons written for the next run', 'read back at step 4'],
  ['worktree removed, locks released', 'scheduler slot freed'],
];

const REPLAY_LINES: [string, string] = ['status must be 13, got 15', 'hook exit 2 → step re-entered'];

/** Steps whose completion a shell hook blocks on, not just documents. */
const GATED = new Set([3, 6, 9, 12, 13, 14, 16]);
/** The only step that waits on a person. */
const HUMAN_STOP = 14;

/** The lap occupies most of the loop; the tail replays an ordering violation. */
const LAP_END = 0.86;

const R = 118;
const CX = 175;
const CY = 178;
const C = 2 * Math.PI * R;

/* Artifact panel geometry (chamfered plate, top-right cut). */
const PX = 322;
const PW = 226;
const PY = 44;
const PH = 208;
const CUT = 12;

function pos(i: number) {
  const a = (i / STEPS.length) * Math.PI * 2 - Math.PI / 2;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
}

export function PipelineRing({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [override, setOverride] = useState<number | null>(null);
  const clock = useAnimationClock(t, 20000, ref);
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

  // Panel lines type in as the cursor settles on the step. Under reduced
  // motion the clock is pinned mid-run, so both lines render fully.
  const lines: [string, string] = replaying ? REPLAY_LINES : ARTIFACTS[active];
  // Thresholds keep the reduced-motion still (clock pinned at 0.62 → frac .42)
  // with every line fully visible.
  const lineOpacity = (k: number) =>
    replaying ? sat((replay - 0.1 - k * 0.16) / 0.1) : sat((frac - 0.1 - k * 0.14) / 0.1);

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
        caption="Entering step N writes the run status; the completion hook asserts the run is at N+1 or beyond before it will let the step close. Ordering is mechanically enforced — most content checks are existence checks, and I am precise about which is which. Panel lines are the artifact types each step leaves behind."
      >
        <svg viewBox="0 0 560 368" className="w-full" role="img" aria-label="20-step pipeline ring">
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

          {/* artifact panel — the step's paper trail, on a chamfered plate */}
          <path
            d={`M ${PX} ${PY} H ${PX + PW - CUT} L ${PX + PW} ${PY + CUT} V ${PY + PH} H ${PX} Z`}
            fill={VIZ.surface}
            stroke={VIZ.line}
            strokeWidth={1}
          />
          <text x={PX + 14} y={PY + 24} fill={VIZ.faint} fontSize={9} fontFamily="var(--font-mono)" letterSpacing="0.14em">
            {replaying ? 'HOOK TRANSCRIPT' : 'STEP ARTIFACTS'}
          </text>
          <text x={PX + 14} y={PY + 46} fill={replaying ? VIZ.rose : VIZ.fg} fontSize={12} fontWeight={600}>
            {replaying
              ? 'completion hook fires'
              : `${String(active + 1).padStart(2, '0')} · ${STEPS[active]}`}
          </text>
          <line x1={PX + 14} y1={PY + 58} x2={PX + PW - 14} y2={PY + 58} stroke={VIZ.line} strokeWidth={1} />
          {lines.map((line, k) => (
            <g key={`${active}-${k}`} opacity={lineOpacity(k)}>
              <text x={PX + 14} y={PY + 82 + k * 24} fill={VIZ.muted} fontSize={10.5} fontFamily="var(--font-mono)">
                <tspan fill={replaying ? VIZ.rose : VIZ.emerald}>▸ </tspan>
                {line}
              </text>
            </g>
          ))}
          {!replaying && GATED.has(active) && (
            <g opacity={lineOpacity(2)}>
              <text x={PX + 14} y={PY + 82 + 2 * 24} fill={VIZ.amber} fontSize={10.5} fontFamily="var(--font-mono)">
                ▸ close blocked until artifacts exist
              </text>
            </g>
          )}
          <text x={PX + 14} y={PY + PH - 16} fill={override !== null ? VIZ.primary : VIZ.faint} fontSize={9.5} fontFamily="var(--font-mono)">
            {override !== null ? 'paused — you are driving' : 'one run · 20 steps · every step audited'}
          </text>

          {/* legend, bottom strip */}
          <g transform="translate(20 344)" fontFamily="var(--font-mono)" fontSize={10.5}>
            <circle cx={6} cy={-4} r={4.5} fill={VIZ.surface} stroke={VIZ.line} />
            <text x={16} y={0} fill={VIZ.muted}>
              step
            </text>
            <circle cx={64} cy={-4} r={4.5} fill={VIZ.surface} stroke={VIZ.amber} strokeWidth={1.6} />
            <text x={74} y={0} fill={VIZ.muted}>
              hook-gated (7)
            </text>
            <circle cx={182} cy={-4} r={5} fill={VIZ.cyan} />
            <text x={192} y={0} fill={VIZ.muted}>
              run cursor
            </text>
            <text x={272} y={0} fill={VIZ.faint}>
              7 hooks · 54 blocks · 2 human stops
            </text>
          </g>
        </svg>
      </VizFrame>
    </div>
  );
}
