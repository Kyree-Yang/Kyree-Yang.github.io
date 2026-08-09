import { useRef } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { segment } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';

// months since Sep 2022
const m = (year: number, month: number) => (year - 2022) * 12 + (month - 9);
const T_END = m(2027, 12);

const LANES = [
  { label: 'SJTU · B.Eng. Mechanical Eng.', from: m(2022, 9), to: m(2026, 8), color: VIZ.cyan, note: 'GPA 3.85 / 4.00' },
  { label: 'Michigan · B.S.E. Computer Science', from: m(2024, 8), to: m(2026, 5), color: VIZ.primary, note: 'GPA 4.00 / 4.00 · Summa Cum Laude' },
  { label: 'ROAHM Lab · Research Assistant', from: m(2024, 9), to: m(2026, 4), color: VIZ.violet, note: 'AGHF PDE trajectory optimization' },
  { label: 'TikTok · SWE Intern', from: m(2026, 5), to: m(2026, 8), color: VIZ.amber, note: 'Intelligent Creation' },
  { label: 'Georgia Tech · M.S. Computer Science', from: m(2026, 8), to: m(2027, 12), color: VIZ.emerald, note: 'incoming' },
];

// The label column has to clear the longest lane name, otherwise a bar that
// starts at t=0 is drawn straight through its own label.
const X0 = 236;
const XW = 300;
const x = (mo: number) => X0 + (mo / T_END) * XW;
const TODAY = m(2026, 8);

// The whole point of this figure is concurrency, so mark the overlap window
// explicitly: Aug 2024 – May 2026, when both bachelor's degrees and the lab
// ran at once. On the month scale that is x(23) ≈ 345.5 to x(44) ≈ 445.5.
const OV_FROM = m(2024, 8);
const OV_TO = m(2026, 5);

export function DegreeGantt({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const clock = useAnimationClock(t, 4600, ref);

  // Loop shape: staggered draw-in over the first ~third of the cycle (~1.5s),
  // then hold fully drawn until a brief fade at 0.9–0.97. The wrap back to 0
  // lands while everything is faded out, so the redraw never wipes a lane
  // that is still visible. The reduced-motion still (clock = 0.62) sits in
  // the hold, i.e. fully drawn and static.
  const fade = 1 - segment(clock, 0.9, 0.97);

  // Overlap-window band geometry; fades in just after the lanes draw, so the
  // reduced-motion still (clock = 0.62) shows it at full opacity.
  const bandX = x(OV_FROM);
  const bandW = x(OV_TO) - x(OV_FROM);
  const bandIn = segment(clock, 0.26, 0.4) * fade;

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="Concurrent, not sequential"
        caption="The two bachelor's degrees ran at the same time under a dual-degree program — Michigan coursework and lab work stacked on top of an SJTU degree that had not finished yet."
      >
        <svg viewBox="0 0 560 236" className="w-full" role="img" aria-label="Timeline of degrees and roles">
          {[2023, 2024, 2025, 2026, 2027].map((y) => (
            <g key={y}>
              <line x1={x(m(y, 1))} y1={22} x2={x(m(y, 1))} y2={188} stroke={VIZ.line} strokeDasharray="2 5" />
              <text x={x(m(y, 1))} y={16} textAnchor="middle" fill={VIZ.faint} fontSize={10} fontFamily="var(--font-mono)">
                {y}
              </text>
            </g>
          ))}

          {/* overlap band — behind the lanes, spanning the three concurrent
              tracks (their bars occupy y 32–105); bracket + label underneath */}
          <g opacity={bandIn}>
            <rect x={bandX} y={26} width={bandW} height={86} fill={VIZ.line} fillOpacity={0.22} />
            <path d={`M ${bandX} 116 v 4 h ${bandW} v -4`} fill="none" stroke={VIZ.faint} strokeWidth={1} />
            <text
              x={bandX + bandW - 4}
              y={130}
              textAnchor="end"
              fill={VIZ.faint}
              fontSize={8}
              fontFamily="var(--font-mono)"
            >
              two degrees + lab, in parallel
            </text>
          </g>

          {LANES.map((l, i) => {
            const grow = segment(clock, 0.02 + i * 0.04, 0.17 + i * 0.04);
            const w = (x(l.to) - x(l.from)) * grow;
            const y = 38 + i * 30;
            return (
              <g key={l.label}>
                <text x={0} y={y + 4} fill={VIZ.fg} fontSize={9.5} fontWeight={500}>
                  {l.label}
                </text>
                <text x={0} y={y + 17} fill={VIZ.faint} fontSize={8} fontFamily="var(--font-mono)">
                  {l.note}
                </text>
                <rect x={x(l.from)} y={y - 6} width={w} height={13} rx={6.5} fill={l.color} fillOpacity={0.75 * fade} />
              </g>
            );
          })}

          <line x1={x(TODAY)} y1={26} x2={x(TODAY)} y2={196} stroke={VIZ.primary} strokeWidth={1.4} opacity={segment(clock, 0.35, 0.5) * fade} />
          <text
            x={x(TODAY)}
            y={210}
            textAnchor="middle"
            fill={VIZ.primary}
            fontSize={10}
            fontFamily="var(--font-mono)"
            opacity={segment(clock, 0.35, 0.5) * fade}
          >
            Aug 2026
          </text>
        </svg>
      </VizFrame>
    </div>
  );
}
