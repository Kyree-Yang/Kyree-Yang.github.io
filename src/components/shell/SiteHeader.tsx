import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FileText, Menu, X } from 'lucide-react';

import { routeDirectory } from '@/content/site';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

const NAV = [
  { to: '/work', label: 'Work' },
  { to: '/cv', label: 'CV' },
  { to: '/beyond', label: 'Beyond' },
];

const RESUME = '/docs/ruikai-yang-resume.pdf';

const linkClass = (isActive: boolean) =>
  cn(
    'nav-link rounded-[var(--radius-sm)] px-3 py-1.5 text-[13px] font-medium transition-colors',
    isActive ? 'nav-active text-primary' : 'text-muted hover:text-fg',
  );

export function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const [past, setPast] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const lastY = useRef(0);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    lastY.current = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        setPast(y > 360);
        const dy = y - lastY.current;
        // Ignore sub-pixel jitter and iOS rubber-banding, otherwise the header flickers.
        if (Math.abs(dy) < 6) return;
        lastY.current = y;
        setHidden(y > 200 && dy > 0);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Running head: once the entry masthead has scrolled away, the sticky bar
  // says where you are. Work entries only — elsewhere the nav is enough.
  // Deep links may arrive with a trailing slash (route shells serve directories).
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const runningHead =
    past && normalizedPath.startsWith('/work/')
      ? routeDirectory.find((r) => r.to === normalizedPath)?.label
      : undefined;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    // Resizing past the breakpoint hides the sheet with CSS; close it too, or the
    // scroll lock outlives it.
    const desktop = window.matchMedia('(min-width: 768px)');
    const onBreakpoint = () => desktop.matches && setOpen(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onBreakpoint);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onBreakpoint);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md',
          'transition-transform duration-[180ms] ease-out motion-reduce:transition-none',
          hidden && !open ? '-translate-y-full' : 'translate-y-0',
        )}
      >
        <div className="relative mx-auto flex h-[60px] w-full max-w-7xl items-center gap-3 px-5 sm:px-8">
          <Link to="/" aria-label="Ruikai Yang — home" className="shrink-0">
            <span className="cut-card cut-sm inline-flex">
              <span className="cut-inner elevate inline-flex size-8 items-center justify-center px-0 py-0 font-serif text-[15px] font-extrabold text-primary">
                RY
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => linkClass(isActive)}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {runningHead && (
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 hidden max-w-[36ch] -translate-x-1/2 truncate font-mono text-[11px] tracking-[0.08em] text-faint uppercase lg:block"
            >
              Work — {runningHead}
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <a
              href={RESUME}
              target="_blank"
              rel="noreferrer"
              className="elevate hidden items-center gap-1.5 rounded-[var(--radius-sm)] border border-line px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:text-fg md:inline-flex"
            >
              <FileText className="size-3.5" aria-hidden />
              Résumé
            </a>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="elevate inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-line text-muted transition-colors hover:text-fg md:hidden"
            >
              {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {/* The sheet lives outside <header>: backdrop-blur and transform on the header
          make it a containing block, which would break fixed positioning here. */}
      {open && (
        <div className="fixed inset-x-0 top-[60px] bottom-0 z-40 md:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={() => setOpen(false)}
            className="absolute inset-0 w-full bg-bg/70 backdrop-blur-sm"
          />
          <div
            id="site-menu"
            className="absolute inset-x-0 top-0 border-b border-line bg-bg px-5 pt-3 pb-5"
          >
            <nav aria-label="Primary" className="flex flex-col gap-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(linkClass(isActive), 'px-3 py-2.5 text-[15px]')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <a
                href={RESUME}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2.5 text-[15px] font-medium text-muted transition-colors hover:text-fg"
              >
                <FileText className="size-4" aria-hidden />
                Résumé (PDF)
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default SiteHeader;
