import { useRef } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { segment, wrap } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';

const ATTEMPTS = 46;

const REASONS = [
  { label: 'iOS needed a simulator build; CI produced device builds', n: 22, color: VIZ.amber },
  { label: 'code path never reached', n: 8, color: VIZ.faint },
  { label: 'no criteria file', n: 6, color: VIZ.faint },
  { label: 'no build artifact', n: 4, color: VIZ.faint },
  { label: 'other', n: 6, color: VIZ.faint },
];

const DUR = 6000;
const CX = 120;
const CY = 132;
const R = 78;
const BAR = 556;
const GAP = 2;
const SPAN = BAR - (REASONS.length - 1) * GAP;

/** Semicircle from the left end, clockwise over the top. */
const arc = (f: number) => {
  const a = Math.PI + Math.PI * Math.min(f, 0.9995);
  return `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${(CX + R * Math.cos(a)).toFixed(2)} ${(CY + R * Math.sin(a)).toFixed(2)}`;
};

function Counter({ x, label, attempt }: { x: number; label: string; attempt: number }) {
  return (
    <g>
      <rect x={x} y={56} width={140} height={92} rx={10} fill={VIZ.surface} stroke={VIZ.line} />
      <text x={x + 16} y={78} fill={VIZ.faint} fontSize={11} fontFamily="var(--font-mono)">
        {label}
      </text>
      {/* the tick that never lands: rises, half-fades, falls back to nothing */}
      <text
        x={x + 70}
        y={124 - 4 * attempt}
        textAnchor="middle"
        fill={VIZ.amber}
        fontSize={34}
        fontWeight={700}
        fontFamily="var(--font-mono)"
        className="tnum"
        opacity={0.5 * attempt}
      >
        1
      </text>
      <text
        x={x + 70}
        y={124}
        textAnchor="middle"
        fill={VIZ.faint}
        fontSize={34}
        fontWeight={700}
        fontFamily="var(--font-mono)"
        className="tnum"
      >
        0
      </text>
    </g>
  );
}

export function VerifyGate({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const clock = useAnimationClock(t, DUR, ref);
  const p = wrap(clock);

  const sweep = segment(p, 0.02, 0.02 + 900 / DUR);
  const attempt = p < 0.45 || p > 0.55 ? 0 : 1 - Math.abs(p - 0.5) / 0.05;
  const settle = segment(p, 0.8, 0.88);

  let cursor = 0;
  const bars = REASONS.map((r, i) => {
    const start = 0.58 + i * (100 / DUR);
    const full = (r.n / ATTEMPTS) * SPAN;
    const x = cursor;
    cursor += full + GAP;
    return { ...r, x, full, grow: segment(p, start, start + 400 / DUR) };
  });

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="Tier-1 self-verification · 46 attempts"
        caption="Guardrail direction was right — it never returned a false PASS. Coverage was zero."
      >
        <svg viewBox="0 0 560 240" className="w-full" role="img" aria-label="46 verification attempts, 46 skips, zero verdicts">
          <path d={arc(1)} fill="none" stroke={VIZ.line} strokeWidth={12} strokeLinecap="round" />
          {sweep > 0.002 && (
            <path d={arc(sweep)} fill="none" stroke={VIZ.faint} strokeWidth={12} strokeLinecap="round" />
          )}

          <text
            x={CX}
            y={116}
            textAnchor="middle"
            fill={VIZ.fg}
            fontSize={34}
            fontWeight={700}
            fontFamily="var(--font-mono)"
            className="tnum"
          >
            {Math.round(ATTEMPTS * sweep)}
          </text>
          <text x={CX} y={136} textAnchor="middle" fill={VIZ.faint} fontSize={10.5} fontFamily="var(--font-mono)">
            attempts
          </text>

          <rect x={CX - 44} y={150} width={88} height={24} rx={12} fill={VIZ.amber} fillOpacity={0.14} stroke={VIZ.amber} />
          <text
            x={CX}
            y={166}
            textAnchor="middle"
            fill={VIZ.amber}
            fontSize={11.5}
            fontFamily="var(--font-mono)"
            className="tnum"
          >
            {ATTEMPTS} SKIP
          </text>

          <Counter x={248} label="PASS" attempt={attempt} />
          <Counter x={404} label="FAIL" attempt={attempt} />
          <text x={396} y={172} textAnchor="middle" fill={VIZ.faint} fontSize={10.5} fontFamily="var(--font-mono)">
            zero verdicts either way
          </text>

          <text x={0} y={198} fill={VIZ.faint} fontSize={10.5} fontFamily="var(--font-mono)">
            skip reasons
          </text>
          {bars.map((b) => (
            <rect
              key={b.label}
              x={b.x}
              y={204}
              width={Math.max(0, b.full * b.grow)}
              height={14}
              rx={3}
              fill={b.color}
            />
          ))}

          <text
            x={0}
            y={234}
            fill={VIZ.amber}
            fontSize={11}
            fontFamily="var(--font-mono)"
            opacity={settle}
          >
            coverage: 0 of 46 — the dominant blocker was a build format, not a judgement
          </text>
        </svg>

        {!bare && (
          <ul className="mt-3 space-y-1">
            {REASONS.map((r) => (
              <li key={r.label} className="flex items-start gap-2 text-[12px] leading-snug text-muted">
                <span
                  aria-hidden
                  className="mt-[5px] size-2 shrink-0 rounded-[2px]"
                  style={{ background: r.color }}
                />
                <span className="min-w-0 flex-1">{r.label}</span>
                <span className="tnum font-mono">{r.n}</span>
              </li>
            ))}
          </ul>
        )}
      </VizFrame>
    </div>
  );
}
