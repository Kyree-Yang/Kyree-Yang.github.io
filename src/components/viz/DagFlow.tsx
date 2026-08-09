import { useRef, useState } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { wrap } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';

type Kind = 'input' | 'subagent' | 'engineer';

/** `detail` is what a node actually ships — the unit of "add a capability". */
const NODES: { id: string; label: string; kind: Kind; row: number; detail: string }[] = [
  { id: 'tech', label: 'architecture', kind: 'input', row: 1, detail: 'asks the designer which structure fits' },
  { id: 'comp', label: 'components', kind: 'input', row: 1, detail: 'asks which design-system components to use' },
  { id: 'ui', label: 'UI build', kind: 'subagent', row: 1, detail: 'writes the screen on both platforms' },
  { id: 'net', label: 'weak network', kind: 'subagent', row: 0, detail: '3 network states · 2 thresholds · 6 loading forms' },
  { id: 'empty', label: 'empty state', kind: 'subagent', row: 1, detail: 'the state a design file never shows' },
  { id: 'size', label: 'screen sizes', kind: 'subagent', row: 2, detail: 'layout across device classes' },
  { id: 'dark', label: 'dark mode', kind: 'subagent', row: 0, detail: 'token-only colour, no literals' },
  { id: 'i18n', label: 'i18n strings', kind: 'input', row: 1, detail: 'designer confirms the copy to extract' },
  { id: 'l10n', label: 'localization', kind: 'subagent', row: 2, detail: '1 manual · 8 references · 4 tools · 3 hooks · 2,207 lines' },
  { id: 'mr', label: 'design MR', kind: 'subagent', row: 1, detail: 'fans in from all seven build stages' },
  { id: 'integ', label: 'integration', kind: 'engineer', row: 1, detail: 'engineer-owned — never auto-completed' },
  { id: 'merge', label: 'final merge', kind: 'engineer', row: 1, detail: 'engineer-owned — never auto-completed' },
];

const COL = 46;
const X0 = 16;
const ROW_Y = [46, 104, 162];

const KIND_COLOR: Record<Kind, string> = {
  input: VIZ.cyan,
  subagent: VIZ.primary,
  engineer: VIZ.faint,
};

/** The localization node is where the compile gate bounces the agent back. */
const GATE_INDEX = 8;

export function DagFlow({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const clock = useAnimationClock(t, 11000, ref);
  const p = wrap(clock);

  // Token walks the spine; it stalls at the localization gate, gets rejected
  // once, then passes.
  const cursor = p * (NODES.length + 1.6);
  const idx = Math.min(NODES.length - 1, Math.floor(cursor));
  const frac = cursor - Math.floor(cursor);

  const atGate = idx === GATE_INDEX;
  const gateFail = atGate && frac < 0.55;

  const nx = (i: number) => X0 + i * COL;
  const ny = (i: number) => ROW_Y[NODES[i].row];

  const a = { x: nx(idx), y: ny(idx) };
  const bIdx = Math.min(NODES.length - 1, idx + 1);
  const b = { x: nx(bIdx), y: ny(bIdx) };
  const travel = gateFail ? 0 : frac;
  const tokenX = a.x + (b.x - a.x) * travel;
  const tokenY = a.y + (b.y - a.y) * travel;

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="12-node delivery DAG"
        caption="Structural work first, then layout, then color, then text — text runs last because translated strings are what stress the layout. Seven stages dispatch to isolated subagents; three must ask the designer a question; two belong to an engineer and are never auto-completed."
      >
        <svg viewBox="0 0 600 268" className="w-full" role="img" aria-label="Twelve-node delivery DAG">
          {/* edges */}
          {NODES.slice(0, -1).map((n, i) => {
            const x1 = nx(i);
            const y1 = ny(i);
            const x2 = nx(i + 1);
            const y2 = ny(i + 1);
            const mx = (x1 + x2) / 2;
            const done = i < idx;
            return (
              <path
                key={n.id}
                d={`M ${x1 + 13} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2 - 13} ${y2}`}
                fill="none"
                stroke={done ? VIZ.primary : VIZ.line}
                strokeOpacity={done ? 0.5 : 1}
                strokeWidth={1.4}
              />
            );
          })}

          {/* nodes */}
          {NODES.map((n, i) => {
            const x = nx(i);
            const y = ny(i);
            const active = i === idx;
            const done = i < idx;
            const c = KIND_COLOR[n.kind];
            return (
              <g
                key={n.id}
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* generous hit target — the visible node is only 10px */}
                <circle cx={x} cy={y} r={22} fill="transparent" />
                <circle
                  cx={x}
                  cy={y}
                  r={active ? 13 : 10}
                  fill={done || active ? c : VIZ.surface}
                  fillOpacity={active ? 0.95 : done ? 0.35 : 1}
                  stroke={c}
                  strokeWidth={n.kind === 'engineer' ? 1.2 : 1.5}
                  strokeDasharray={n.kind === 'engineer' ? '3 2' : undefined}
                />
                {active && gateFail && (
                  <circle cx={x} cy={y} r={19} fill="none" stroke={VIZ.rose} strokeWidth={1.6} opacity={0.85} />
                )}
                {/* Twelve labels at this pitch collide into mush, so each node
                    carries only its ordinal; the name is read out below. */}
                <text
                  x={x}
                  y={y + 3.5}
                  textAnchor="middle"
                  fill={done || active ? 'var(--primary-fg)' : VIZ.faint}
                  fontSize={9}
                  fontFamily="var(--font-mono)"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}

          {/* token */}
          <circle cx={tokenX} cy={tokenY} r={5} fill={VIZ.amber} />
          <circle cx={tokenX} cy={tokenY} r={11} fill={VIZ.amber} opacity={0.2} />

          {/* Node name + what it ships: the hovered node wins, else the active one. */}
          <text
            x={290}
            y={196}
            textAnchor="middle"
            fill={VIZ.fg}
            fontSize={13}
            fontWeight={600}
          >
            {String((hovered ?? idx) + 1).padStart(2, '0')} · {NODES[hovered ?? idx].label}
          </text>
          <text
            x={290}
            y={213}
            textAnchor="middle"
            fill={VIZ.faint}
            fontSize={10.5}
            fontFamily="var(--font-mono)"
          >
            {NODES[hovered ?? idx].detail}
          </text>

          {/* gate narration */}
          <text
            x={290}
            y={232}
            textAnchor="middle"
            fill={gateFail ? VIZ.rose : VIZ.emerald}
            fontSize={11.5}
            fontFamily="var(--font-mono)"
            opacity={hovered !== null ? 0 : atGate ? 1 : 0}
          >
            {gateFail
              ? 'on-stop gate → exit 2 · project did not compile'
              : 'gate passed · artifacts exist and the build is green'}
          </text>

          {/* legend */}
          <g transform="translate(16 260)" fontSize={10.5} fontFamily="var(--font-mono)">
            <circle cx={5} cy={-4} r={5} fill={VIZ.primary} fillOpacity={0.35} stroke={VIZ.primary} />
            <text x={16} y={0} fill={VIZ.muted}>
              isolated subagent (7)
            </text>
            <circle cx={165} cy={-4} r={5} fill={VIZ.surface} stroke={VIZ.cyan} />
            <text x={176} y={0} fill={VIZ.muted}>
              asks the designer (3)
            </text>
            <circle cx={330} cy={-4} r={5} fill={VIZ.surface} stroke={VIZ.faint} strokeDasharray="3 2" />
            <text x={341} y={0} fill={VIZ.muted}>
              engineer-owned (2)
            </text>
            <text x={470} y={0} fill={VIZ.faint}>
              5 blocking gates
            </text>
          </g>
        </svg>
      </VizFrame>
    </div>
  );
}
