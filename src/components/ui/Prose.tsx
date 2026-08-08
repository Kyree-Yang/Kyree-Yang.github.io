import { cn } from '@/lib/utils';

/**
 * Typographic wrapper. Descendant styles live here rather than on every page so
 * a paragraph written in one content module reads identically everywhere, and
 * the measure stays inside the readable band from §2.3 of the design language.
 */
export function Prose({
  children,
  size = 'body',
  className,
}: {
  children: React.ReactNode;
  size?: 'body' | 'lead';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'text-muted',
        size === 'lead'
          ? 'max-w-[60ch] text-[17px] leading-[1.75]'
          : 'max-w-[68ch] text-[15px] leading-[1.7]',
        '[&_p+p]:mt-4',
        '[&_a]:text-primary [&_a]:underline [&_a]:decoration-line-strong [&_a]:underline-offset-[3px] [&_a:hover]:decoration-primary',
        '[&_strong]:font-semibold [&_strong]:text-fg',
        '[&_em]:text-fg [&_em]:italic',
        '[&_code]:rounded-[var(--radius-sm)] [&_code]:border [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:leading-[1.6] [&_code]:text-fg',
        '[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:pl-5 [&_li]:marker:text-faint',
        '[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2.5 [&_ol]:pl-5',
        className,
      )}
    >
      {children}
    </div>
  );
}
