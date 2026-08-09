import { useMemo, useRef, useState } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { sat, wrap } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';

const M = 44; // samples along the path
const ITERS = 90; // relaxation steps kept as keyframes
const OBSTACLES = [
  { x: 190, y: 96, r: 34 },
  { x: 268, y: 168, r: 28 },
];
const START = { x: 74, y: 176 };
const GOAL = { x: 380, y: 78 };

/**
 * A small curve-shortening flow with obstacle repulsion, iterated at module
 * load. It is not the lab's solver — it is a faithful cartoon of what the
 * solver does: a bad initial guess relaxing into a smooth feasible path.
 */
function relaxations() {
  let pts = Array.from({ length: M }, (_, i) => {
    const s = i / (M - 1);
    return { x: START.x + (GOAL.x - START.x) * s, y: START.y + (GOAL.y - START.y) * s };
  });

  const frames = [pts.map((p) => ({ ...p }))];
  const costs = [cost(pts)];

  for (let k = 0; k < ITERS; k++) {
    const next = pts.map((p) => ({ ...p }));
    for (let i = 1; i < M - 1; i++) {
      // smoothing term
      let vx = (pts[i - 1].x + pts[i + 1].x) / 2 - pts[i].x;
      let vy = (pts[i - 1].y + pts[i + 1].y) / 2 - pts[i].y;
      // obstacle repulsion
      for (const o of OBSTACLES) {
        const dx = pts[i].x - o.x;
        const dy = pts[i].y - o.y;
        const d = Math.hypot(dx, dy) || 1e-6;
        const clearance = o.r + 12;
        if (d < clearance) {
          const push = ((clearance - d) / clearance) * 9;
          vx += (dx / d) * push;
          vy += (dy / d) * push;
        }
      }
      next[i].x = pts[i].x + vx * 0.55;
      next[i].y = pts[i].y + vy * 0.55;
    }
    pts = next;
    frames.push(pts.map((p) => ({ ...p })));
    costs.push(cost(pts));
  }
  return { frames, costs };
}

function cost(pts: { x: number; y: number }[]) {
  let len = 0;
  let pen = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  for (const p of pts)
    for (const o of OBSTACLES) {
      const d = Math.hypot(p.x - o.x, p.y - o.y);
      if (d < o.r) pen += (o.r - d) * 6;
    }
  return len + pen;
}

const toPath = (pts: { x: number; y: number }[]) =>
  pts.map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

export function AghfMorph({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [override, setOverride] = useState<number | null>(null);
  const { frames, costs } = useMemo(relaxations, []);
  const clock = useAnimationClock(t, 6000, ref);

  const p = override ?? wrap(clock);
  // converge over the first 70% of the loop, then hold the solution
  const k = Math.floor(sat(p / 0.7) * (frames.length - 1));
  const c0 = costs[0];
  const ck = costs[k];

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="Trajectory relaxing under geometric heat flow"
        caption="Affine Geometric Heat Flow evolves a poor initial trajectory toward an optimal one by running a PDE forward in a virtual time. My contribution was the analytical Jacobian modules inside that solver — 40% off average execution time — plus a time-scaling and Lagrangian-interpolation reparameterization so one solve generalizes across time horizons while strictly enforcing state limits. The curve above is an illustrative relaxation computed in the browser, not the lab's solver output."
      >
        <svg viewBox="0 0 560 250" className="w-full" role="img" aria-label="Trajectory optimization under AGHF">
          {/* ghost trail of earlier iterations */}
          {[0.15, 0.35, 0.6].map((f) => {
            const gi = Math.floor(f * k);
            return (
              <path key={f} d={toPath(frames[gi])} fill="none" stroke={VIZ.primary} strokeOpacity={0.14} strokeWidth={1.4} />
            );
          })}

          {OBSTACLES.map((o, i) => (
            <g key={i}>
              <circle cx={o.x} cy={o.y} r={o.r} fill={VIZ.rose} fillOpacity={0.1} stroke={VIZ.rose} strokeOpacity={0.5} strokeDasharray="4 3" />
            </g>
          ))}

          <path d={toPath(frames[k])} fill="none" stroke={VIZ.primary} strokeWidth={2.4} strokeLinecap="round" />

          <circle cx={START.x} cy={START.y} r={5} fill={VIZ.cyan} />
          <circle cx={GOAL.x} cy={GOAL.y} r={5} fill={VIZ.emerald} />
          <text x={START.x} y={START.y + 20} textAnchor="middle" fill={VIZ.faint} fontSize={10} fontFamily="var(--font-mono)">
            q₀
          </text>
          <text x={GOAL.x} y={GOAL.y - 12} textAnchor="middle" fill={VIZ.faint} fontSize={10} fontFamily="var(--font-mono)">
            q₁
          </text>

          {/* readout */}
          <g transform="translate(420 44)" fontFamily="var(--font-mono)">
            <text x={0} y={0} fill={VIZ.faint} fontSize={10}>
              PDE iteration
            </text>
            <text x={0} y={20} fill={VIZ.fg} fontSize={16} fontWeight={600} className="tnum">
              {String(k).padStart(3, '0')} / {ITERS}
            </text>

            <text x={0} y={54} fill={VIZ.faint} fontSize={10}>
              action functional
            </text>
            <text x={0} y={74} fill={VIZ.primary} fontSize={16} fontWeight={600} className="tnum">
              {(ck / c0).toFixed(3)}
            </text>
            {/* Keep this line short: the group starts at x=420 and the
                viewBox ends at 560, so anything wider than ~135 units clips. */}
            <text x={0} y={90} fill={VIZ.faint} fontSize={9.5}>
              vs. initial guess
            </text>

            <rect x={0} y={104} width={104} height={6} rx={3} fill={VIZ.surface} />
            <rect x={0} y={104} width={104 * sat(ck / c0)} height={6} rx={3} fill={VIZ.primary} />

            <text x={0} y={140} fill={VIZ.emerald} fontSize={11}>
              −40% solver time
            </text>
            <text x={0} y={156} fill={VIZ.faint} fontSize={9.5}>
              analytical Jacobian, C++
            </text>
          </g>
        </svg>

        {!bare && (
          <label className="mt-3 flex items-center gap-3 px-1">
            <span className="font-mono text-[11px] tracking-wider text-faint uppercase">
              iteration
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.005}
              value={p}
              onChange={(e) => setOverride(Number(e.target.value))}
              aria-label="PDE iteration"
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-surface-2 accent-[var(--primary)]"
            />
            <button
              type="button"
              onClick={() => setOverride(null)}
              className="elevate rounded-md border px-2 py-0.5 font-mono text-[11px] text-muted"
            >
              {override === null ? 'playing' : 'resume'}
            </button>
          </label>
        )}
      </VizFrame>
    </div>
  );
}
