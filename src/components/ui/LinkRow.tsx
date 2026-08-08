import { Link } from 'react-router-dom';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RowLink = { label: string; href: string; icon?: LucideIcon };

/** Route paths stay inside the SPA; assets and off-site URLs get a real anchor. */
const isRoute = (href: string) => href.startsWith('/') && !href.slice(1).includes('.');

export function LinkRow({ links, size = 'md' }: { links: RowLink[]; size?: 'sm' | 'md' }) {
  const cls = cn(
    'card elevate inline-flex items-center gap-2 font-medium transition-colors hover:border-line-strong',
    size === 'sm' ? 'px-2.5 py-1 text-[13px]' : 'px-3 py-1.5 text-sm',
  );
  const iconSize = size === 'sm' ? 13 : 15;

  return (
    <div className="flex flex-wrap gap-2">
      {links.map(({ label, href, icon: Icon }) => {
        const external = !href.startsWith('/');
        const body = (
          <>
            {Icon && <Icon size={iconSize} strokeWidth={1.75} className="text-muted" aria-hidden />}
            <span>{label}</span>
            {external && (
              <ArrowUpRight size={iconSize} strokeWidth={1.75} className="text-faint" aria-hidden />
            )}
          </>
        );
        return isRoute(href) ? (
          <Link key={label} to={href} className={cls}>
            {body}
          </Link>
        ) : (
          <a
            key={label}
            href={href}
            className={cls}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
          >
            {body}
          </a>
        );
      })}
    </div>
  );
}
