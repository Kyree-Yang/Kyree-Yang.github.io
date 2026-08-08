import { useRef } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { sat, wrap } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';

const N = 12;
const CX = 150;
const CY = 128;
const R = 96;

/** Deterministic per-shard latency spread — one straggler carries the tail. */
const DELAY = [0.06, 0.1, 0.08, 0.14, 0.09, 0.12, 0.07, 0.11, 0.4, 0.09, 0.13, 0.08];

function node(i: number) {
  const a = (i / N) * Math.PI * 2 - Math.PI / 2;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
}

export function ShardFanout({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const clock = useAnimationClock(t, 4200, ref);
  const p = wrap(clock);

  const out = sat(p / 0.3);
  const backStart = 0.34;
  // Shard 8 is the straggler, so the query is only "done" once it returns.
  const tailResolved = p > backStart + DELAY[8] + 0.22;

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="Query fan-out across 12 nodes"
        caption="A hash-partitioned inverted index sharded across the cluster; every query fans out and a central aggregator merges and re-ranks the partial results. The slowest returning shard is the whole query's latency — profiling that path is what took the tail from ~8s to under 2s."
      >
        <svg viewBox="0 0 560 248" className="w-full" role="img" aria-label="Search query fan-out across a 12-node cluster">
          {Array.from({ length: N }, (_, i) => {
            const { x, y } = node(i);
            const d = DELAY[i];
            const ret = sat((p - backStart - d) / 0.22);
            const arrived = ret >= 1;
            const straggler = i === 8;
            const color = straggler ? VIZ.amber : VIZ.primary;

            // outbound dot
            const ox = CX + (x - CX) * out;
            const oy = CY + (y - CY) * out;
            // inbound dot
            const rx = x + (CX - x) * ret;
            const ry = y + (CY - y) * ret;

            return (
              <g key={i}>
                <line x1={CX} y1={CY} x2={x} y2={y} stroke={VIZ.line} strokeWidth={1} />
                {out < 1 && <circle cx={ox} cy={oy} r={2.6} fill={VIZ.cyan} />}
                {ret > 0 && ret < 1 && <circle cx={rx} cy={ry} r={3} fill={color} />}
                <circle
                  cx={x}
                  cy={y}
                  r={out >= 1 && ret === 0 ? 9 : 7}
                  fill={arrived ? color : VIZ.surface}
                  fillOpacity={arrived ? 0.35 : 1}
                  stroke={color}
                  strokeWidth={1.3}
                />
                <text x={x} y={y + 3.5} textAnchor="middle" fill={VIZ.faint} fontSize={8} fontFamily="var(--font-mono)">
                  {i + 1}
                </text>
              </g>
            );
          })}

          {/* aggregator */}
          <circle cx={CX} cy={CY} r={26} fill={VIZ.surface} stroke={VIZ.primary} strokeWidth={1.6} />
          <text x={CX} y={CY - 2} textAnchor="middle" fill={VIZ.fg} fontSize={9.5} fontFamily="var(--font-mono)">
            merge
          </text>
          <text x={CX} y={CY + 10} textAnchor="middle" fill={VIZ.faint} fontSize={9} fontFamily="var(--font-mono)">
            re-rank
          </text>

          {/* stats */}
          <g transform="translate(300 44)" fontFamily="var(--font-mono)">
            {[
              ['pages indexed', '30 M+'],
              ['HTML crawled', '240 GB'],
              ['crawler threads', '7,500'],
              ['index on disk', '500 GB'],
              ['index footprint', '−50% via UTF-8 + varint'],
              ['query latency', '300 – 2,000 ms'],
            ].map(([k, v], i) => (
              <g key={k}>
                <text x={0} y={i * 26} fill={VIZ.muted} fontSize={11}>
                  {k}
                </text>
                <text x={230} y={i * 26} textAnchor="end" fill={VIZ.fg} fontSize={11.5} fontWeight={600}>
                  {v}
                </text>
              </g>
            ))}
          </g>

          {/* Tail latency resolves only once the straggler lands. */}
          <text x={300} y={200} fill={VIZ.faint} fontSize={10} fontFamily="var(--font-mono)">
            tail query latency
          </text>
          <text
            x={300}
            y={220}
            fill={tailResolved ? VIZ.emerald : VIZ.amber}
            fontSize={15}
            fontWeight={600}
            fontFamily="var(--font-mono)"
          >
            {tailResolved ? '< 2 s' : '~8 s'}
          </text>
          <text x={362} y={220} fill={VIZ.faint} fontSize={10} fontFamily="var(--font-mono)">
            once the straggler returns
          </text>

          {/* Ingest chain: what the fan-out is serving from. */}
          <g transform="translate(4 238)" fontFamily="var(--font-mono)" fontSize={9.5}>
            {['3,000 seeds', '7,500 threads', '12 nodes', '30M pages / 240 GB'].map((s, i) => (
              <g key={s}>
                <text x={i * 138} y={0} fill={VIZ.faint}>
                  {s}
                </text>
                {i < 3 && (
                  <text x={i * 138 + 118} y={0} fill={VIZ.line}>
                    →
                  </text>
                )}
              </g>
            ))}
          </g>
        </svg>
      </VizFrame>
    </div>
  );
}
