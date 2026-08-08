/**
 * The limitations block. Deliberately full body size and always expanded —
 * shrinking it or hiding it behind a disclosure would be the polite lie this
 * site is built to avoid.
 */
export function CaveatList({
  items,
  title = 'What I would fix, and what did not work',
}: {
  items: string[];
  title?: string;
}) {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <ol className="max-w-[68ch] space-y-5 border-l-2 border-l-amber pl-5 sm:pl-6">
        {items.map((text, i) => (
          <li key={text} className="flex gap-4">
            <span aria-hidden className="tnum mt-px shrink-0 font-mono text-[13px] text-amber">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="text-[15px] leading-relaxed text-muted">{text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
