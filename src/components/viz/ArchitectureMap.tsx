import { useRef, useState } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { cn, wrap } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';

/**
 * A = control plane (cloud), B = execution plane (one laptop), ext = systems
 * neither plane owns. Plane drives colour, the filter chips, and nothing else —
 * the topology is carried entirely by EDGES.
 */
type Plane = 'A' | 'B' | 'ext';

const PLANE_COLOR: Record<Plane, string> = {
  A: VIZ.primary,
  B: VIZ.amber,
  ext: VIZ.faint,
};

type Node = {
  id: string;
  plane: Plane;
  title: string;
  sub?: string[];
  x: number;
  y: number;
  w: number;
  h: number;
  /** `solid` tints the frame with its plane colour; `dashed` stays hollow. */
  box?: 'solid' | 'dashed';
  /** Route paths read as code, so their titles are set in mono. */
  mono?: boolean;
  /** The one shared table is the heaviest object on the canvas. */
  big?: boolean;
  parent?: string;
};

/**
 * Hand-placed geometry. The vertical split is the argument: everything above
 * y=1000 runs in the cloud, everything below runs on one laptop inside an
 * office network, and only two edges cross the divider.
 */
const NODES: Node[] = [
  // ── clients ────────────────────────────────────────────────────────────
  {
    id: 'c1',
    plane: 'A',
    title: 'Chat-platform web app',
    sub: ['in-app link · desktop & mobile'],
    x: 60,
    y: 56,
    w: 300,
    h: 92,
  },
  { id: 'c2', plane: 'A', title: 'Desktop browser', sub: ['internal network'], x: 390, y: 56, w: 300, h: 92 },

  // ── gateway: three route families, one box each ─────────────────────────
  { id: 'gw', plane: 'A', title: 'Internal app-platform gateway', box: 'solid', x: 60, y: 208, w: 360, h: 368 },
  { id: 'g1', plane: 'A', parent: 'gw', mono: true, title: '/api/*', sub: ['SSO user session'], x: 82, y: 258, w: 316, h: 90 },
  {
    id: 'g2',
    plane: 'A',
    parent: 'gw',
    mono: true,
    title: '/openapi/*',
    sub: ['API key · worker egress only'],
    x: 82,
    y: 360,
    w: 316,
    h: 90,
  },
  { id: 'g3', plane: 'A', parent: 'gw', mono: true, title: '/*', sub: ['server-rendered fallback'], x: 82, y: 462, w: 316, h: 90 },

  // ── backend modules ─────────────────────────────────────────────────────
  { id: 'be', plane: 'A', title: 'NestJS backend · server/modules', box: 'dashed', x: 520, y: 208, w: 600, h: 368 },
  { id: 'm1', plane: 'A', parent: 'be', title: 'FixJob', sub: ['16 states · 20 steps'], x: 542, y: 258, w: 268, h: 90 },
  { id: 'm2', plane: 'A', parent: 'be', title: 'WatchConfig', sub: ['60 s poll'], x: 830, y: 258, w: 268, h: 90 },
  { id: 'm3', plane: 'A', parent: 'be', title: 'Credential', sub: ['AES-256-GCM'], x: 542, y: 360, w: 268, h: 90 },
  { id: 'm4', plane: 'A', parent: 'be', title: 'Signal', sub: ['SSE / long-poll'], x: 830, y: 360, w: 268, h: 90 },
  { id: 'm5', plane: 'A', parent: 'be', title: 'Tracker link', sub: ['service-level OAuth'], x: 542, y: 462, w: 268, h: 90 },
  { id: 'm6', plane: 'A', parent: 'be', title: 'View / Translate', sub: ['first paint · bilingual'], x: 830, y: 462, w: 268, h: 90 },

  // ── SPA: sits under the gateway because it calls straight back up into it ─
  { id: 'fe', plane: 'A', title: 'React SPA · client', box: 'dashed', x: 60, y: 640, w: 460, h: 300 },
  { id: 'p1', plane: 'A', parent: 'fe', title: 'Dashboard', sub: ['five-column board'], x: 82, y: 692, w: 196, h: 100 },
  { id: 'p2', plane: 'A', parent: 'fe', title: 'JobDetail', sub: ['20-step detail'], x: 302, y: 692, w: 196, h: 100 },
  { id: 'p3', plane: 'A', parent: 'fe', title: 'Configs', sub: ['assignee watch'], x: 82, y: 812, w: 196, h: 100 },
  { id: 'p4', plane: 'A', parent: 'fe', title: 'Credential', sub: ['vault · onboarding'], x: 302, y: 812, w: 196, h: 100 },

  // ── the one shared table ────────────────────────────────────────────────
  {
    id: 'db',
    plane: 'A',
    big: true,
    title: 'PostgreSQL · managed',
    sub: ['fix_job · watch_config', 'user_credential · control_signal'],
    x: 620,
    y: 700,
    w: 500,
    h: 118,
  },

  // ── external systems ────────────────────────────────────────────────────
  {
    id: 'chat',
    plane: 'ext',
    title: 'Chat-platform API',
    sub: ['bot direct messages', 'started · needs verification · MR opened'],
    x: 1440,
    y: 56,
    w: 300,
    h: 150,
  },
  {
    id: 'tracker',
    plane: 'ext',
    title: 'Issue tracker',
    sub: ['HTTP API · query language', 'service-level OAuth'],
    x: 1440,
    y: 300,
    w: 300,
    h: 168,
  },
  {
    id: 'infra',
    plane: 'ext',
    title: 'Engineering infrastructure',
    sub: ['code review · internal CI · monorepo', 'iOS and Android worktrees'],
    x: 1440,
    y: 700,
    w: 300,
    h: 150,
  },

  // ── execution plane ─────────────────────────────────────────────────────
  {
    id: 'wk',
    plane: 'B',
    title: 'Laptop daemon · launchd → daemon.sh · 90 s active / 600 s idle',
    box: 'solid',
    x: 60,
    y: 1060,
    w: 1230,
    h: 216,
  },
  {
    id: 'w1',
    plane: 'B',
    parent: 'wk',
    title: 'Five runners',
    sub: ['stop / queue / verify', 'retry / resume', 'claim queued → start'],
    x: 82,
    y: 1114,
    w: 282,
    h: 128,
  },
  {
    id: 'w2',
    plane: 'B',
    parent: 'wk',
    title: 'signal-listener',
    sub: ['WS → SSE → long-poll', 'three-tier fallback', 'kick → wake in seconds'],
    x: 384,
    y: 1114,
    w: 282,
    h: 128,
  },
  {
    id: 'w3',
    plane: 'B',
    parent: 'wk',
    title: 'bridge · write-back',
    sub: ['status.md → fix_job', 'progress / MR / CI / install build', 'a transition fires the notification'],
    x: 686,
    y: 1114,
    w: 282,
    h: 128,
  },
  {
    id: 'w4',
    plane: 'B',
    parent: 'wk',
    title: 'Background sweeps',
    sub: ['assignee sync 5 min', 'CI watchdog 15 min', 'tracker watch 12 h'],
    x: 988,
    y: 1114,
    w: 282,
    h: 128,
  },
  {
    id: 'orc',
    plane: 'B',
    title: 'orchestrate.sh → headless agent',
    sub: ['20-step plugin', 'one process per ticket · single-instance lock'],
    x: 1370,
    y: 1114,
    w: 370,
    h: 128,
  },
];

const BY_ID = new Map(NODES.map((n) => [n.id, n]));
/** Containment is declared on the child; the reverse index is what hover needs. */
const CHILDREN = NODES.reduce<Record<string, string[]>>((acc, n) => {
  if (n.parent) (acc[n.parent] ??= []).push(n.id);
  return acc;
}, {});

type Tone = 'A' | 'B' | 'ext' | 'signal';

const TONE_COLOR: Record<Tone, string> = {
  A: VIZ.primary,
  B: VIZ.amber,
  ext: VIZ.faint,
  signal: VIZ.rose,
};

type Edge = {
  from: string;
  to: string;
  label: string;
  tone: Tone;
  /** Routed by hand: the corridors matter more than any auto-router would guess. */
  d: string;
  lx: number;
  ly: number;
};

const EDGES: Edge[] = [
  { from: 'c1', to: 'gw', label: 'http', tone: 'A', d: 'M 210 148 L 210 208', lx: 210, ly: 178 },
  { from: 'c2', to: 'gw', label: 'http', tone: 'A', d: 'M 540 148 C 540 178, 420 180, 340 208', lx: 452, ly: 172 },
  // Both leave the route box itself, not the enclosing frame, so the wire is
  // visibly attached to one route family. These two labels wrap and sit above
  // their wire rather than on it: only 100px separates the gateway frame from
  // the backend frame, which a pill plus an arrowhead cannot share.
  { from: 'g1', to: 'be', label: 'business\nrequest', tone: 'A', d: 'M 398 303 L 520 303', lx: 470, ly: 275 },
  {
    from: 'g3',
    to: 'be',
    label: 'first paint /\nstatic assets',
    tone: 'A',
    d: 'M 398 507 L 520 507',
    lx: 470,
    ly: 479,
  },
  { from: 'be', to: 'fe', label: 'index.html', tone: 'A', d: 'M 560 576 C 560 612, 476 626, 420 640', lx: 480, ly: 616 },
  { from: 'be', to: 'db', label: 'read / write', tone: 'A', d: 'M 790 576 L 790 700', lx: 790, ly: 638 },
  { from: 'fe', to: 'gw', label: 'axios /api/*', tone: 'A', d: 'M 140 640 L 140 576', lx: 140, ly: 608 },
  { from: 'be', to: 'tracker', label: '60 s direct query', tone: 'ext', d: 'M 1120 340 L 1440 340', lx: 1280, ly: 324 },
  {
    from: 'wk',
    to: 'tracker',
    label: 'assignee sync, 5 min',
    tone: 'ext',
    d: 'M 1150 1060 C 1300 1010, 1360 660, 1440 440',
    lx: 1236,
    ly: 900,
  },
  {
    from: 'wk',
    to: 'chat',
    label: 'bot card',
    tone: 'ext',
    d: 'M 1000 1060 C 1150 950, 1300 500, 1440 130',
    lx: 1214,
    ly: 656,
  },
  {
    from: 'chat',
    to: 'c1',
    label: 'link opens the board',
    tone: 'ext',
    d: 'M 1440 100 C 1240 100, 1200 26, 980 26 L 260 26 C 220 26, 210 34, 210 56',
    lx: 740,
    ly: 26,
  },
  // The single push channel: the laptop dials out, so the arrow points at the
  // gateway rather than the other way round. Routed around the outside of the
  // whole figure — it is the only wire the reader must not miss.
  {
    from: 'w2',
    to: 'g2',
    label: 'outbound long-lived connection · SSE / long-poll',
    tone: 'signal',
    d: 'M 525 1242 L 525 1334 Q 525 1348 511 1348 L 40 1348 Q 26 1348 26 1334 L 26 419 Q 26 405 40 405 L 82 405',
    lx: 300,
    ly: 1348,
  },
  // Bypasses HTTP entirely: the worker owns a database connection.
  { from: 'w3', to: 'db', label: 'direct write', tone: 'B', d: 'M 827 1114 L 827 818', lx: 827, ly: 900 },
  { from: 'wk', to: 'orc', label: 'spawn', tone: 'B', d: 'M 1290 1178 L 1370 1178', lx: 1330, ly: 1158 },
  {
    from: 'orc',
    to: 'infra',
    label: 'open MR / trigger CI',
    tone: 'ext',
    d: 'M 1555 1114 L 1555 850',
    lx: 1555,
    ly: 1044,
  },
];

const CHIPS: { plane: Plane; label: string }[] = [
  { plane: 'A', label: 'control plane · cloud' },
  { plane: 'B', label: 'execution plane · one laptop' },
  { plane: 'ext', label: 'external systems' },
];

/** GIF order: the unfiltered figure first, then one plane per quarter. */
const CYCLE: (Plane | null)[] = [null, 'A', 'B', 'ext'];

const DIM = 0.13;
/** Divider between what runs in the cloud and what runs on the laptop. */
const BOUNDARY_Y = 1000;

const ARIA =
  'Architecture map. A cloud control plane holds a gateway with three route families, a NestJS backend of six modules, a React single-page app, and one managed PostgreSQL database. An execution plane holds a single laptop daemon running five runners, a signal listener, a write-back bridge, background sweeps, and a spawned headless agent. Three external systems sit outside both. The laptop accepts no inbound connections, so the only cloud-to-laptop path is one outbound long-lived signal connection the laptop opens itself.';

/**
 * Mono advance width at the label size (0.6 em × 10.5px), plus a little. The
 * pill has to actually cover the wire it sits on — undersize it and the stroke
 * reads as a strikethrough through the text.
 */
const CH = 6.4;
const PILL_PAD = 10;

function EdgeLabel({ e, color }: { e: Edge; color: string }) {
  const lines = e.label.split('\n');
  const w = Math.max(...lines.map((l) => l.length)) * CH + PILL_PAD;
  const h = lines.length * 15 + 7;
  return (
    <g>
      <rect x={e.lx - w / 2} y={e.ly - h / 2} width={w} height={h} rx={5} fill={VIZ.surface} />
      {lines.map((line, i) => (
        <text
          key={line}
          x={e.lx}
          y={e.ly - h / 2 + 15 + i * 15}
          textAnchor="middle"
          fill={color}
          fontSize={10.5}
          fontFamily="var(--font-mono)"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

/** Title + sub-lines. Identical metrics everywhere so nested boxes line up. */
function NodeText({ n }: { n: Node }) {
  return (
    <>
      <text
        x={n.x + 14}
        y={n.y + 36}
        fill={VIZ.fg}
        fontSize={n.big ? 17 : 15}
        fontWeight={600}
        fontFamily={n.mono ? 'var(--font-mono)' : undefined}
      >
        {n.title}
      </text>
      {n.sub?.map((s, i) => (
        <text key={s} x={n.x + 14} y={n.y + 58 + i * 18} fill={VIZ.faint} fontSize={11} fontFamily="var(--font-mono)">
          {s}
        </text>
      ))}
    </>
  );
}

export function ArchitectureMap({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [lock, setLock] = useState<Plane | null>(null);
  // `t ?? 0` keeps the hook controlled when no `t` is supplied: without an
  // exported clock this figure is static, and a rAF loop would re-render forty
  // nodes sixty times a second to draw the same frame.
  const clock = useAnimationClock(t ?? 0, 12000, ref);

  const auto = t !== undefined;
  const p = wrap(clock);
  const planeLock = auto ? CYCLE[Math.min(CYCLE.length - 1, Math.floor(p * CYCLE.length))] : lock;

  // A locked chip owns the whole figure; hover is inert until it is cleared.
  const hover = planeLock ? null : focus;

  /**
   * One hop, deliberately. Seeds are the focused node plus its children; an
   * edge lights if either end is a seed, and lighting an edge lights its far
   * end — but that far end never becomes a seed itself. Walking the endpoints
   * back into the seed set is what leaked an extra hop in the original.
   */
  const seeds = new Set<string>();
  if (hover) {
    seeds.add(hover);
    for (const c of CHILDREN[hover] ?? []) seeds.add(c);
  }
  const litNodes = new Set(seeds);
  const litEdges = new Set<number>();
  if (hover) {
    EDGES.forEach((e, i) => {
      if (!seeds.has(e.from) && !seeds.has(e.to)) return;
      litEdges.add(i);
      litNodes.add(e.from);
      litNodes.add(e.to);
    });
    // A child keeps its own frame drawn, or the node appears to float free.
    const parent = BY_ID.get(hover)?.parent;
    if (parent) litNodes.add(parent);
  }

  const nodeOpacity = (n: Node) => {
    if (planeLock) return n.plane === planeLock ? 1 : DIM;
    if (!hover) return 1;
    return litNodes.has(n.id) ? 1 : DIM;
  };

  const edgeOpacity = (e: Edge, i: number) => {
    if (planeLock) {
      // Either end, matching the hover rule below. Requiring both would hide every
      // cross-plane wire — including the one signal channel the figure exists to show.
      const touches =
        BY_ID.get(e.from)?.plane === planeLock || BY_ID.get(e.to)?.plane === planeLock;
      return touches ? 1 : DIM;
    }
    if (!hover) return 1;
    return litEdges.has(i) ? 1 : DIM;
  };

  const containers = NODES.filter((n) => n.box);
  const leaves = NODES.filter((n) => !n.box);

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="Control plane, execution plane, and the one wire between them"
        caption="The laptop that does the work sits inside an office network and accepts no inbound connections, so nothing in the cloud can call it — pressing a button in the web UI does one thing, increment a version number in a control_signal row. Everything the two planes share is that single PostgreSQL table plus one outbound long-lived connection the laptop opens itself, drawn in the failure colour because it is the only push channel that exists."
      >
        {!bare && (
          <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">
            {CHIPS.map((c) => {
              const on = planeLock === c.plane;
              return (
                <button
                  key={c.plane}
                  type="button"
                  aria-pressed={on}
                  disabled={auto}
                  onClick={() => setLock((prev) => (prev === c.plane ? null : c.plane))}
                  className={cn(
                    'elevate flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors',
                    on ? 'font-medium' : 'text-muted',
                  )}
                  style={on ? { borderColor: PLANE_COLOR[c.plane], color: PLANE_COLOR[c.plane] } : undefined}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: PLANE_COLOR[c.plane] }}
                  />
                  {c.label}
                </button>
              );
            })}
            <span className="text-[12px] text-faint">Hover any node to isolate the links it is on.</span>
          </div>
        )}

        {/* Wider than the reading column by design — the figure scrolls, the page never does. */}
        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 1760 1400"
            className="block"
            style={{ minWidth: 900, width: '100%' }}
            role="group"
            aria-label={ARIA}
          >
            <defs>
              {(Object.keys(TONE_COLOR) as Tone[]).map((tone) => (
                <marker
                  key={tone}
                  id={`am-head-${tone}`}
                  viewBox="0 0 10 10"
                  refX={9}
                  refY={5}
                  markerWidth={9}
                  markerHeight={9}
                  markerUnits="userSpaceOnUse"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={TONE_COLOR[tone]} />
                </marker>
              ))}
            </defs>

            {/* The constraint, stated as geometry. */}
            <line
              x1={0}
              y1={BOUNDARY_Y}
              x2={1760}
              y2={BOUNDARY_Y}
              stroke={VIZ.line}
              strokeWidth={1.2}
              strokeDasharray="10 8"
            />
            <text x={40} y={BOUNDARY_Y - 12} fill={VIZ.faint} fontSize={11} fontFamily="var(--font-mono)">
              office network boundary · nothing dials in; the laptop only dials out
            </text>

            {/* Containers first: children are painted on top and win the hit test. */}
            {containers.map((n) => {
              const color = PLANE_COLOR[n.plane];
              const dashed = n.box === 'dashed';
              return (
                <g
                  key={n.id}
                  tabIndex={0}
                  role="group"
                  aria-label={n.title}
                  opacity={nodeOpacity(n)}
                  className="transition-opacity duration-200"
                  style={{ cursor: 'pointer' }}
                  onPointerEnter={() => setFocus(n.id)}
                  onPointerLeave={() => setFocus(null)}
                  onFocus={() => setFocus(n.id)}
                  onBlur={() => setFocus(null)}
                >
                  <rect
                    x={n.x}
                    y={n.y}
                    width={n.w}
                    height={n.h}
                    rx={14}
                    fill={dashed ? 'transparent' : color}
                    fillOpacity={dashed ? 1 : 0.06}
                    stroke={color}
                    strokeWidth={1.4}
                    strokeDasharray={dashed ? '7 6' : undefined}
                  />
                  <text x={n.x + 20} y={n.y + 32} fill={color} fontSize={14} fontWeight={600}>
                    {n.title}
                  </text>
                </g>
              );
            })}

            {/* Edges sit above the container tints and below the leaf boxes. */}
            <g style={{ pointerEvents: 'none' }}>
              {EDGES.map((e, i) => {
                const color = TONE_COLOR[e.tone];
                const signal = e.tone === 'signal';
                return (
                  <g
                    key={`${e.from}-${e.to}`}
                    opacity={edgeOpacity(e, i)}
                    className="transition-opacity duration-200"
                  >
                    <path
                      d={e.d}
                      fill="none"
                      stroke={color}
                      strokeWidth={signal ? 2.6 : 1.5}
                      strokeLinecap="round"
                      markerEnd={`url(#am-head-${e.tone})`}
                    />
                    <EdgeLabel e={e} color={signal ? color : VIZ.muted} />
                  </g>
                );
              })}
            </g>

            {leaves.map((n) => {
              const color = PLANE_COLOR[n.plane];
              return (
                <g
                  key={n.id}
                  tabIndex={0}
                  role="group"
                  aria-label={n.title}
                  opacity={nodeOpacity(n)}
                  className="transition-opacity duration-200"
                  style={{ cursor: 'pointer' }}
                  onPointerEnter={() => setFocus(n.id)}
                  onPointerLeave={() => setFocus(null)}
                  onFocus={() => setFocus(n.id)}
                  onBlur={() => setFocus(null)}
                >
                  {/* generous hit target — the visible box stops at its border */}
                  <rect x={n.x - 10} y={n.y - 10} width={n.w + 20} height={n.h + 20} fill="transparent" />
                  <rect
                    x={n.x}
                    y={n.y}
                    width={n.w}
                    height={n.h}
                    rx={10}
                    fill={VIZ.surface}
                    stroke={color}
                    strokeWidth={n.big ? 2 : 1.4}
                  />
                  <NodeText n={n} />
                </g>
              );
            })}
          </svg>
        </div>
      </VizFrame>
    </div>
  );
}
