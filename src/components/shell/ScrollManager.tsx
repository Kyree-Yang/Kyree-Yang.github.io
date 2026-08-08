import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// A lazily-loaded route can still be inside its Suspense fallback one frame after
// navigation, so the anchor is retried for a few frames before giving up.
const MAX_FRAMES = 12;

export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = decodeURIComponent(hash.slice(1));
    let frame = 0;
    let tries = 0;

    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
        return;
      }
      if (++tries < MAX_FRAMES) frame = requestAnimationFrame(attempt);
    };

    frame = requestAnimationFrame(attempt);
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

export default ScrollManager;
