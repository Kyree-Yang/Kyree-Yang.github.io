import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const target = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      // The label names the destination, not the current state — a screen reader
      // user needs to know what pressing it does.
      aria-label={`Switch to ${target} theme`}
      title={`Switch to ${target} theme`}
      className={cn(
        'elevate inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)]',
        'border border-line text-muted transition-colors hover:text-fg',
        className,
      )}
    >
      {theme === 'dark' ? (
        <Sun className="size-4" aria-hidden />
      ) : (
        <Moon className="size-4" aria-hidden />
      )}
    </button>
  );
}

export default ThemeToggle;
