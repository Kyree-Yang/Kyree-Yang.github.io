import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Sections carry scroll-mt-20 (5rem); a settled anchor sits at this offset. */
const ANCHOR_TOP = 80;
/** A lazily-loaded route can sit in its Suspense fallback well past one frame,
 *  so the anchor is retried on a time budget rather than a frame count. */
const RETRY_MS = 100;
const MAX_TRIES = 30;

/**
 * Scroll to `el`, then correct for late layout shift. LazyViz blocks reserve an
 * estimated height and swap in taller content after mount, so a smooth scroll
 * started against the pre-mount layout lands short. After the scroll settles
 * ('scrollend' where supported, timeout fallback everywhere), the target's
 * position is re-checked and snapped at most three times.
 */
function scrollWithCorrection(el: HTMLElement, smooth: boolean) {
  el.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' });

  let corrections = 0;
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout>;

  const settle = () => {
    if (cancelled) return;
    const drift = Math.abs(el.getBoundingClientRect().top - ANCHOR_TOP);
    if (drift > 24 && corrections < 3) {
      corrections += 1;
      el.scrollIntoView({ block: 'start', behavior: 'auto' });
      // Content below may still be mounting; check again after it breathes.
      timer = setTimeout(settle, 350);
    }
  };

  const onEnd = () => {
    clearTimeout(timer);
    timer = setTimeout(settle, 50);
  };
  // scrollend fires when the smooth scroll finishes; the timeout covers
  // browsers without it and scrolls that never start (already in place).
  window.addEventListener('scrollend', onEnd, { once: true });
  timer = setTimeout(settle, smooth ? 1200 : 120);

  return () => {
    cancelled = true;
    clearTimeout(timer);
    window.removeEventListener('scrollend', onEnd);
  };
}

export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let cleanupScroll: (() => void) | undefined;
    let timer: ReturnType<typeof setTimeout>;

    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        cleanupScroll = scrollWithCorrection(el, !reduce);
        return;
      }
      if (++tries < MAX_TRIES) timer = setTimeout(attempt, RETRY_MS);
    };

    attempt();
    return () => {
      clearTimeout(timer);
      cleanupScroll?.();
    };
  }, [pathname, hash]);

  return null;
}

export default ScrollManager;
