import { Link } from 'react-router-dom';
import type { Tone } from '@/content/types';
import { Tag } from './primitives';

export type Chip = { label: string; tone?: Tone; href?: string };

/** Route paths stay inside the SPA; assets and off-site URLs get a real anchor. */
const isRoute = (href: string) => href.startsWith('/') && !href.slice(1).includes('.');

export function ChipRow({ items }: { items: Chip[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ label, tone, href }) => {
        if (!href)
          return (
            <Tag key={label} tone={tone}>
              {label}
            </Tag>
          );

        const chip = (
          <Tag tone={tone} className="elevate transition-colors hover:border-line-strong">
            {label}
          </Tag>
        );
        if (isRoute(href))
          return (
            <Link key={label} to={href} className="rounded-md">
              {chip}
            </Link>
          );
        const external = !href.startsWith('/');
        return (
          <a
            key={label}
            href={href}
            className="rounded-md"
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
          >
            {chip}
          </a>
        );
      })}
    </div>
  );
}
