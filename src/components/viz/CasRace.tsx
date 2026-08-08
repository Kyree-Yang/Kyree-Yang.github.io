import { useRef, useState } from 'react';
import { useAnimationClock } from '@/lib/useAnimationClock';
import { segment, wrap } from '@/lib/utils';
import { VizFrame, VIZ } from './VizFrame';
import { cn } from '@/lib/utils';

/**
 * The concurrency bug that shipped a duplicate merge request, and the one-line
 * shape of the fix. Two runners race for the same row; `mode` picks whether the
 * claim is read-then-write or an atomic conditional update.
 */
export function CasRace({ t, bare }: { t?: number; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'before' | 'after'>('before');
  const clock = useAnimationClock(t, 5200, ref);

  // In GIF mode, spend the first half on `before` and the second on `after`.
  const p = wrap(clock);
  const auto = t !== undefined;
  const phase = auto ? (p < 0.5 ? 'before' : 'after') : mode;
  const local = auto ? (p < 0.5 ? p * 2 : (p - 0.5) * 2) : p;

  const reach = segment(local, 0.06, 0.34);
  const back = segment(local, 0.38, 0.62);
  const emit = segment(local, 0.66, 0.9);
  const isBefore = phase === 'before';

  const runner = (x: number, label: string, winner: boolean) => {
    const rowX = 280;
    const armX = x + (rowX - x) * reach;
    const resultOpacity = back;
    const ok = isBefore || winner;
    return (
      <g key={label}>
        <rect x={x - 52} y={92} width={104} height={38} rx={8} fill={VIZ.surface} stroke={VIZ.line} />
        <text x={x} y={116} textAnchor="middle" fill={VIZ.fg} fontSize={12} fontFamily="var(--font-mono)">
          {label}
        </text>
        {/* claim arrow */}
        <line
          x1={x}
          y1={92}
          x2={armX}
          y2={60}
          stroke={VIZ.faint}
          strokeWidth={1.4}
          strokeDasharray="4 3"
          opacity={reach}
        />
        {/* returned verdict */}
        <text
          x={x}
          y={150}
          textAnchor="middle"
          fill={ok ? VIZ.emerald : VIZ.faint}
          fontSize={11}
          fontFamily="var(--font-mono)"
          opacity={resultOpacity}
        >
          {isBefore ? "read 'queued'" : ok ? 'affected_rows = 1' : 'affected_rows = 0'}
        </text>
        {/* emitted merge request */}
        {(isBefore || winner) && (
          <g opacity={emit}>
            <rect x={x - 40} y={168} width={80} height={28} rx={6} fill={ok ? VIZ.emerald : VIZ.faint} fillOpacity={0.16} stroke={ok ? VIZ.emerald : VIZ.faint} />
            <text x={x} y={186} textAnchor="middle" fill={ok ? VIZ.emerald : VIZ.faint} fontSize={11} fontFamily="var(--font-mono)">
              opens MR
            </text>
          </g>
        )}
      </g>
    );
  };

  return (
    <div ref={ref}>
      <VizFrame
        bare={bare}
        title="Claiming a job under concurrency"
        caption="Read-then-write let two runners both observe 'queued' and both proceed — one ticket, two merge requests. Making the claim a conditional update means the loser is told so by the database itself."
        aside={
          !bare && (
            <div className="flex gap-1">
              {(['before', 'after'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    'elevate rounded-md border px-2 py-0.5 font-mono text-[11px] transition-colors',
                    mode === m ? 'border-primary text-primary' : 'text-muted',
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          )
        }
      >
        <svg viewBox="0 0 560 230" className="w-full" role="img" aria-label="Compare-and-swap job claiming">
          {/* the contended row */}
          <rect x={200} y={26} width={160} height={34} rx={8} fill={VIZ.surface} stroke={isBefore ? VIZ.rose : VIZ.emerald} strokeWidth={1.4} />
          <text x={280} y={48} textAnchor="middle" fill={VIZ.fg} fontSize={12} fontFamily="var(--font-mono)">
            job row · status
          </text>

          <text
            x={280}
            y={16}
            textAnchor="middle"
            fill={isBefore ? VIZ.rose : VIZ.emerald}
            fontSize={11}
            fontFamily="var(--font-mono)"
          >
            {isBefore ? "SELECT status  →  UPDATE" : "UPDATE … WHERE status = 'queued'"}
          </text>

          {runner(120, 'runner A', true)}
          {runner(440, 'runner B', false)}

          <text
            x={280}
            y={214}
            textAnchor="middle"
            fill={isBefore ? VIZ.rose : VIZ.emerald}
            fontSize={12.5}
            fontWeight={600}
            opacity={emit}
          >
            {isBefore ? '2 merge requests for 1 ticket' : '1 merge request — the loser is told by the database'}
          </text>
        </svg>
      </VizFrame>
    </div>
  );
}
