import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Sticky section nav, xl and up only — below that the page is short enough to
 * scroll and a second nav would compete with the header.
 */
export function JumpRail({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState('');

  // Pages pass a fresh array literal every render, so key off the ids instead.
  const key = items.map((i) => i.id).join('|');

  useEffect(() => {
    const order = key.split('|').filter(Boolean);
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = order.find((id) => visible.has(id));
        if (first) setActive(first);
      },
      // Top band only: a section counts as active once its heading clears the
      // sticky header and before the next one takes over the upper viewport.
      { rootMargin: '-88px 0px -55% 0px', threshold: 0 },
    );

    for (const id of order) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [key]);

  return (
    <nav aria-label="On this page" className="sticky top-24 hidden xl:block">
      <div className="mb-3 font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
        On this page
      </div>
      <ul className="border-l">
        {items.map((item) => {
          const on = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={on ? 'true' : undefined}
                className={cn(
                  '-ml-px block border-l-2 py-1.5 pl-3 text-[13px] leading-snug transition-colors',
                  on
                    ? 'border-l-primary font-medium text-fg'
                    : 'border-l-transparent text-faint hover:text-muted',
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
