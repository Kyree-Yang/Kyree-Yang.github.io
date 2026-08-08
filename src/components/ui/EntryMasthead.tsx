import { Tag } from './primitives';

/**
 * Entry header. The caveat one-liner is part of the masthead, not a footnote:
 * the reader meets the honest limitation before the metrics, not after them.
 */
export function EntryMasthead({
  eyebrow,
  title,
  tagline,
  dates,
  role,
  stack,
  caveatTeaser,
}: {
  eyebrow: string;
  title: string;
  tagline: string;
  dates: string;
  role: string;
  stack: string[];
  caveatTeaser: string;
}) {
  return (
    <header>
      <div className="font-mono text-[11px] tracking-[0.14em] text-primary uppercase">{eyebrow}</div>

      <h1 className="mt-3 text-[30px] leading-[1.12] font-semibold tracking-[-0.025em] sm:text-4xl">
        {title}
      </h1>

      <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.75] text-muted">{tagline}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px] text-faint">
        <span>{dates}</span>
        <span aria-hidden>·</span>
        <span>{role}</span>
      </div>

      {stack.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      )}

      <p className="mt-6 max-w-[68ch] border-l-2 border-l-amber pl-4 text-[15px] leading-relaxed text-muted italic">
        {caveatTeaser}
      </p>
    </header>
  );
}
