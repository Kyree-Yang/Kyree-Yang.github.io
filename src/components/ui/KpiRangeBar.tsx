const fmt = (n: number) => n.toLocaleString('en-US');

/**
 * A p50 dressed as "the" latency is a lie by omission. This renders the measured
 * spread as a band on a shared scale so the reader sees the worst case too.
 */
export function KpiRangeBar({
  label,
  min,
  max,
  unit,
  scaleMax,
}: {
  label: string;
  min: number;
  max: number;
  unit: string;
  scaleMax: number;
}) {
  const pct = (n: number) => `${Math.max(0, Math.min(100, (n / scaleMax) * 100))}%`;
  const range = `${fmt(min)}–${fmt(max)} ${unit}`;

  return (
    <div className="card p-4">
      <div className="text-2xl font-semibold tracking-tight text-primary tnum sm:text-[28px]">
        {fmt(min)}–{fmt(max)}
        <span className="ml-1 text-base font-medium text-muted">{unit}</span>
      </div>
      <div className="mt-1 text-[13px] font-medium">{label}</div>

      <svg
        width="100%"
        height="8"
        className="mt-3 block w-full"
        role="img"
        aria-label={`${label}: ${range} on a 0 to ${fmt(scaleMax)} ${unit} scale`}
      >
        <rect x="0" y="0" width="100%" height="8" rx="4" fill="var(--surface-2)" />
        <rect
          x={pct(min)}
          y="0"
          width={pct(max - min)}
          height="8"
          rx="4"
          fill="var(--primary)"
        />
      </svg>

      <div className="mt-1.5 flex justify-between font-mono text-[11px] text-faint tnum">
        <span>0</span>
        <span>
          {fmt(scaleMax)} {unit}
        </span>
      </div>
    </div>
  );
}
