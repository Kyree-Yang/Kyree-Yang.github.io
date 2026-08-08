import { ExternalLink, FileText, Play, Presentation, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DocKind = 'pdf' | 'slides' | 'video' | 'site';

const ICON: Record<DocKind, LucideIcon> = {
  pdf: FileText,
  slides: Presentation,
  video: Play,
  site: ExternalLink,
};

const base =
  'inline-flex items-center gap-2 rounded-[var(--radius-sm)] border px-3 py-1.5 text-[13px] font-medium';

/**
 * A missing href is a real state, not an error: several artifacts are still
 * awaiting clearance. Say so in place rather than hiding the row.
 */
export function DocLink({ label, href, kind }: { label: string; href?: string; kind: DocKind }) {
  const Icon = ICON[kind];

  if (!href) {
    return (
      <span aria-disabled="true" className={cn(base, 'cursor-not-allowed text-faint')}>
        <Icon size={14} strokeWidth={1.75} aria-hidden />
        <span>{label} · document pending</span>
      </span>
    );
  }

  const external = !href.startsWith('/');
  return (
    <a
      href={href}
      className={cn(base, 'card elevate transition-colors hover:border-line-strong')}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      <Icon size={14} strokeWidth={1.75} className="text-primary" aria-hidden />
      <span>{label}</span>
    </a>
  );
}
