import { useRef, useState } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { wrap, cn } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';

const COPY = {
  ltr: { title: 'Order summary', body: 'Delivery in 2–3 business days', cta: 'Continue', price: '1.299,00 €' },
  rtl: { title: 'ملخص الطلب', body: 'التوصيل خلال ٢-٣ أيام عمل', cta: 'متابعة', price: '1.299,00 €' },
};

/**
 * Mirroring demo. `dir` interpolates 0 (LTR) → 1 (RTL) so every element can be
 * positioned as a lerp instead of a hard swap — which is what makes the flip
 * legible rather than instantaneous.
 */
export function RtlMirror({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [manual, setManual] = useState<0 | 1>(0);
  const clock = useAnimationClock(t, 6000, ref);

  const auto = t !== undefined;
  const p = wrap(clock);
  // dwell, flip, dwell, flip back
  const dir = auto
    ? p < 0.35
      ? 0
      : p < 0.5
        ? (p - 0.35) / 0.15
        : p < 0.85
          ? 1
          : 1 - (p - 0.85) / 0.15
    : manual;

  const W = 190;
  const PAD = 16;
  const mirror = (x: number, w: number) => x + (W - 2 * x - w) * dir;
  const isRtl = dir > 0.5;
  const copy = isRtl ? COPY.rtl : COPY.ltr;

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="RTL mirroring"
        caption="A direction scanner classifies findings by confidence: a single-sided absolute constraint blocks, a symmetric full-width pin is merely unidiomatic. The mirroring-exception registry is deliberately empty — every candidate turned out to be a real bug, and filing exceptions would have made the gate pass while the defect shipped."
        aside={
          !bare && (
            <div className="flex gap-1">
              {([0, 1] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setManual(d)}
                  className={cn(
                    'elevate rounded-md border px-2 py-0.5 font-mono text-[11px] transition-colors',
                    manual === d ? 'border-primary text-primary' : 'text-muted',
                  )}
                >
                  {d === 0 ? 'LTR' : 'RTL'}
                </button>
              ))}
            </div>
          )
        }
      >
        <svg viewBox="0 0 560 250" className="w-full" role="img" aria-label="Left-to-right versus right-to-left layout">
          {/* phone */}
          <g transform="translate(30 14)">
            <rect x={0} y={0} width={W} height={218} rx={20} fill={VIZ.surface} stroke={VIZ.line} strokeWidth={1.4} />

            {/* back chevron — mirrored by scaleX, not by a second asset */}
            <g transform={`translate(${mirror(PAD, 12) + 6} 28)`}>
              <path
                d="M 4 -6 L -3 0 L 4 6"
                fill="none"
                stroke={VIZ.fg}
                strokeWidth={1.8}
                strokeLinecap="round"
                transform={`scale(${1 - 2 * dir} 1)`}
              />
            </g>

            <text
              x={mirror(PAD + 26, 100)}
              y={32}
              fill={VIZ.fg}
              fontSize={12.5}
              fontWeight={600}
              textAnchor={isRtl ? 'end' : 'start'}
              transform={isRtl ? `translate(${100} 0)` : undefined}
            >
              {copy.title}
            </text>

            <line x1={PAD} y1={48} x2={W - PAD} y2={48} stroke={VIZ.line} />

            {/* checkout progress: fills from the reading edge, so its
                direction reverses under mirroring */}
            <rect x={PAD} y={55} width={W - 2 * PAD} height={3.5} rx={1.75} fill={VIZ.line} />
            <rect
              x={mirror(PAD, (W - 2 * PAD) * 0.62)}
              y={55}
              width={(W - 2 * PAD) * 0.62}
              height={3.5}
              rx={1.75}
              fill={VIZ.cyan}
            />

            {/* body copy: aligns to the reading edge */}
            <text
              x={isRtl ? W - PAD : PAD}
              y={72}
              fill={VIZ.muted}
              fontSize={10.5}
              textAnchor={isRtl ? 'end' : 'start'}
            >
              {copy.body}
            </text>

            {/* price row: label mirrors, the number itself stays LTR */}
            <text
              x={isRtl ? W - PAD : PAD}
              y={104}
              fill={VIZ.faint}
              fontSize={10}
              textAnchor={isRtl ? 'end' : 'start'}
            >
              {isRtl ? 'المجموع' : 'Total'}
            </text>
            <text
              x={isRtl ? PAD : W - PAD}
              y={104}
              fill={VIZ.fg}
              fontSize={12}
              fontWeight={600}
              fontFamily="var(--font-mono)"
              textAnchor={isRtl ? 'start' : 'end'}
            >
              {copy.price}
            </text>

            {/* disclosure row */}
            <rect x={PAD} y={120} width={W - 2 * PAD} height={34} rx={8} fill={VIZ.surface} stroke={VIZ.line} />
            <text
              x={isRtl ? W - PAD - 12 : PAD + 12}
              y={141}
              fill={VIZ.muted}
              fontSize={10.5}
              textAnchor={isRtl ? 'end' : 'start'}
            >
              {isRtl ? 'العنوان' : 'Address'}
            </text>
            <g transform={`translate(${mirror(PAD + 12, 10) + 5} 137)`}>
              <path
                d="M -3 -5 L 4 0 L -3 5"
                fill="none"
                stroke={VIZ.faint}
                strokeWidth={1.6}
                strokeLinecap="round"
                transform={`scale(${1 - 2 * dir} 1)`}
              />
            </g>

            {/* cta */}
            <rect x={PAD} y={170} width={W - 2 * PAD} height={30} rx={15} fill={VIZ.primary} />
            <text x={W / 2} y={190} textAnchor="middle" fill="var(--primary-fg)" fontSize={11.5} fontWeight={600}>
              {copy.cta}
            </text>
          </g>

          {/* annotations — both states carry the same three callouts, each
              naming a property that mirrors: text alignment, icon side,
              progress direction. Parity means the RTL pane demonstrates the
              flip instead of gesturing at it. */}
          <g transform="translate(252 30)" fontSize={11.5} fontFamily="var(--font-mono)">
            <text y={0} fill={isRtl ? VIZ.emerald : VIZ.faint}>
              {isRtl ? '✓ text alignment — starts at the right' : 'text alignment: starts at the left'}
            </text>
            <text y={22} fill={isRtl ? VIZ.emerald : VIZ.faint}>
              {isRtl ? '✓ icon side — chevrons flipped via scaleX' : 'icon side: chevrons on the left'}
            </text>
            <text y={44} fill={isRtl ? VIZ.emerald : VIZ.faint}>
              {isRtl ? '✓ progress direction — fills right-to-left' : 'progress direction: fills left-to-right'}
            </text>
          </g>

          <g transform="translate(252 106)" fontSize={12}>
            <rect x={-8} y={-18} width={286} height={112} rx={10} fill={VIZ.surface} stroke={VIZ.line} />
            <text y={0} fill={VIZ.faint} fontSize={10.5} fontFamily="var(--font-mono)">
              scanner scoreboard · worked scope
            </text>
            <text y={26} fill={VIZ.muted} fontSize={11.5}>
              direction-icon violations
            </text>
            <text x={266} y={26} textAnchor="end" fill={VIZ.emerald} fontSize={12} fontFamily="var(--font-mono)">
              22 → 0
            </text>
            <text y={50} fill={VIZ.muted} fontSize={11.5}>
              blocking findings
            </text>
            <text x={266} y={50} textAnchor="end" fill={VIZ.amber} fontSize={12} fontFamily="var(--font-mono)">
              4 → 1
            </text>
            <text y={74} fill={VIZ.muted} fontSize={11.5}>
              mirroring exceptions filed
            </text>
            <text x={266} y={74} textAnchor="end" fill={VIZ.emerald} fontSize={12} fontFamily="var(--font-mono)">
              0
            </text>
          </g>

          <text x={252} y={238} fill={VIZ.faint} fontSize={10.5} fontFamily="var(--font-mono)">
            the one survivor needs a human design decision — left open, not silenced
          </text>
        </svg>
      </VizFrame>
    </div>
  );
}
