import { useLocation } from 'react-router-dom';

/**
 * A 220ms fade-and-rise on route change.
 *
 * Deliberately CSS, not a motion library: this is the only transition on the
 * site that would have justified one, and 112 KB of JavaScript for a fade is a
 * bad trade on a page whose LCP element is text. The `key` restarts the CSS
 * animation by remounting — keyed on pathname only, because a hash change is an
 * in-page jump rather than a new page. `.page-enter` is a no-op under
 * prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}

export default PageTransition;
