import { useRef, useState } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { segment, wrap } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';

const COLS = ['loading ball', 'skeleton', 'spinner', 'progress ring', 'in-panel pie', 'blocking overlay'];

/** `col: null` is a real answer — the scenario ships no loading form at all. */
const ROWS: { label: string; col: number | null; retry: boolean; rule: string }[] = [
  {
    label: 'full-screen first load',
    col: 0,
    retry: true,
    rule: 'Nothing is known about the content yet, so the loading ball owns the screen — and the failure state owns it too, with a full-width retry.',
  },
  {
    label: 'stable list/detail first load',
    col: 1,
    retry: true,
    rule: 'The structure is known in advance, so a skeleton stands in for it and failure retries in place.',
  },
  {
    label: 'pull/push refresh',
    col: 2,
    retry: false,
    rule: 'Content is already on screen: failure surfaces as a toast and the prior view is restored, never left half-refreshed.',
  },
  {
    label: 'partial refresh',
    col: 2,
    retry: false,
    rule: 'Only the changed region spins. On failure that region reverts to what it showed before and the toast carries the reason.',
  },
  {
    label: 'progress task',
    col: 3,
    retry: true,
    rule: 'Determinate work earns a progress ring; retry is only offered where the container is large enough to hold the button.',
  },
  {
    label: 'single in-panel element',
    col: 4,
    retry: true,
    rule: 'One element, one in-panel pie — the retry affordance shrinks to an icon instead of borrowing the whole panel.',
  },
  {
    label: 'blocking wait',
    col: 5,
    retry: false,
    rule: 'A blocking overlay means the user cannot act, so failure dismisses the overlay and reports by toast rather than trapping them.',
  },
  {
    label: 'silent refresh of shown content',
    col: null,
    retry: false,
    rule: 'No loading form at all: what is on screen stays until new content is ready, and a failure changes nothing the user can see.',
  },
];

const DUR = 6400;
const STEP = 45 / DUR;
const FILL = 400 / DUR;
const GX = 170;
const GY = 80;
const COLW = 50;
const ROWH = 27;
const GW = COLW * COLS.length;
const GH = ROWH * ROWS.length;

/** Hovering a row freezes the wipe at its finished state so the row can be read. */
const HELD = 0.9;

const DEFAULT_RULE = '8 loading scenarios → 6 loading forms · hover a row for its rule';

function RetryIcon({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${0.2 + 0.8 * s})`} opacity={s}>
      <circle
        r={7}
        fill="none"
        stroke={VIZ.primary}
        strokeWidth={1.4}
        strokeDasharray="31 13"
        transform="rotate(28)"
      />
      <path d="M 5.2 -5.4 L 8.6 -2.6 L 4.4 -1.2 Z" fill={VIZ.primary} />
    </g>
  );
}

function ToastIcon({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${0.2 + 0.8 * s})`} opacity={s}>
      <rect x={-8} y={-5} width={16} height={10} rx={3} fill="none" stroke={VIZ.amber} strokeWidth={1.3} />
      <line x1={-4.5} y1={0} x2={2.5} y2={0} stroke={VIZ.amber} strokeWidth={1.3} strokeLinecap="round" />
    </g>
  );
}

export function ScenarioMatrix({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [override, setOverride] = useState<number | null>(null);
  const clock = useAnimationClock(t, DUR, ref);
  const p = override ?? wrap(clock);

  const enter = (r: number) => {
    setHovered(r);
    setOverride(HELD);
  };
  const leave = () => {
    setHovered(null);
    setOverride(null);
  };

  const cellIn = (r: number, c: number) => segment(p, 0.05 + (r + c) * STEP, 0.05 + (r + c) * STEP + FILL);
  const note1 = segment(p, 0.34, 0.44);
  const note2 = segment(p, 0.44, 0.54);

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="Loading-form selection matrix"
        caption="Every scenario gets one form and one failure behavior, decided once in the matrix instead of per screen. The rule that a failure only offers retry where retry can restore intent is what keeps refreshes from stranding a half-drawn view."
      >
        <svg viewBox="0 0 560 348" className="w-full" role="img" aria-label="Eight loading scenarios mapped onto six loading forms">
          <g fontSize={10} fontFamily="var(--font-mono)">
            <RetryIcon x={9} y={24} s={1} />
            <text x={24} y={28} fill={VIZ.muted}>
              failure has retry
            </text>
            <ToastIcon x={9} y={50} s={1} />
            <text x={24} y={54} fill={VIZ.muted}>
              toast, restore prior state
            </text>
          </g>

          {COLS.map((c, i) => (
            <text
              key={c}
              transform={`translate(${GX + i * COLW + 8} 74) rotate(-42)`}
              fill={VIZ.faint}
              fontSize={9}
              fontFamily="var(--font-mono)"
            >
              {c}
            </text>
          ))}

          {COLS.map((c, i) => (
            <line key={c} x1={GX + i * COLW} y1={GY} x2={GX + i * COLW} y2={GY + GH} stroke={VIZ.line} />
          ))}
          <line x1={GX + GW} y1={GY} x2={GX + GW} y2={GY + GH} stroke={VIZ.line} />

          {ROWS.map((row, r) => {
            const y = GY + r * ROWH;
            const cy = y + ROWH / 2;
            const dim = hovered !== null && hovered !== r;
            return (
              <g
                key={row.label}
                className="transition-opacity duration-200"
                opacity={dim ? 0.25 : 1}
                onPointerEnter={() => enter(r)}
                onPointerLeave={leave}
              >
                <rect
                  x={0}
                  y={y}
                  width={GX + GW}
                  height={ROWH}
                  fill={hovered === r ? VIZ.surface : 'transparent'}
                />
                <line x1={GX} y1={y} x2={GX + GW} y2={y} stroke={VIZ.line} />
                <text x={GX - 10} y={cy + 3.5} textAnchor="end" fill={VIZ.fg} fontSize={9.5}>
                  {row.label}
                </text>

                {COLS.map((c, i) => {
                  const cx = GX + i * COLW + COLW / 2;
                  const s = cellIn(r, i);
                  if (row.col !== i) {
                    return <circle key={c} cx={cx} cy={cy} r={1.6} fill={VIZ.faint} opacity={s * 0.45} />;
                  }
                  return row.retry ? (
                    <RetryIcon key={c} x={cx} y={cy} s={s} />
                  ) : (
                    <ToastIcon key={c} x={cx} y={cy} s={s} />
                  );
                })}
              </g>
            );
          })}
          <line x1={GX} y1={GY + GH} x2={GX + GW} y2={GY + GH} stroke={VIZ.line} />

          <g opacity={note1} transform={`translate(0 ${6 * (1 - note1)})`}>
            <circle cx={4} cy={312} r={3} fill={VIZ.primary} />
            <text x={14} y={316} fill={VIZ.muted} fontSize={10.5}>
              skeleton structure must match real content
            </text>
          </g>
          <g opacity={note2} transform={`translate(0 ${6 * (1 - note2)})`}>
            <circle cx={4} cy={332} r={3} fill={VIZ.amber} />
            <text x={14} y={336} fill={VIZ.amber} fontSize={10.5}>
              container ≥ ~240pt or the retry button overflows — only visible on device
            </text>
          </g>
        </svg>

        {!bare && (
          <p className="mt-2 min-h-[36px] text-[12.5px] leading-snug text-muted">
            {hovered === null ? DEFAULT_RULE : ROWS[hovered].rule}
          </p>
        )}
      </VizFrame>
    </div>
  );
}
