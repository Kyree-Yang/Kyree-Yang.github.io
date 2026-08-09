import { Tag } from './primitives';

/**
 * Entry header — one grid, fixed 12px rhythm, deployed identically on all five
 * work pages. The caveat one-liner is promoted to a formal epigraph: the reader
 * meets the honest limitation before the metrics, not after them.
 */
export function EntryMasthead({
  eyebrow,
  title,
  tagline,
  dates,
  role,
  credits,
  stack,
  caveatTeaser,
}: {
  eyebrow: string;
  title: string;
  tagline: string;
  dates: string;
  role: string;
  /** Collaborators and advisor — named only as far as the public record allows. */
  credits?: string;
  stack: string[];
  caveatTeaser: string;
}) {
  return (
    <header className="seam-top pt-6">
      <div className="eyebrow">{eyebrow}</div>

      <h1 className="mt-3 text-[2rem] leading-[1.1] font-extrabold tracking-[-0.015em] text-balance sm:text-[2.5rem] lg:text-[3rem]">
        {title}
      </h1>

      <p className="mt-4 max-w-[68ch] text-lg leading-[1.6] text-muted">{tagline}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px] text-faint">
        <span>{dates}</span>
        <span aria-hidden>·</span>
        <span>{role}</span>
      </div>
      {credits && <p className="mt-1.5 font-mono text-[12.5px] text-faint">{credits}</p>}

      {stack.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      )}

      <p className="mt-6 max-w-[76ch] border-l-2 border-l-primary pl-4 text-[15.5px] leading-relaxed text-muted italic">
        {caveatTeaser}
      </p>
    </header>
  );
}
