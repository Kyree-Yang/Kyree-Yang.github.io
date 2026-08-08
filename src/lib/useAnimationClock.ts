import { useEffect, useRef, useState } from 'react';

/**
 * Shared clock for every animated visualization.
 *
 * Contract: a component takes `t?: number`. When `t` is supplied (GIF export,
 * or a user dragging a scrubber) the component is a pure function of `t` and
 * this hook simply echoes it back. When `t` is undefined the hook drives a
 * rAF loop over `durationMs`, pausing whenever the element scrolls out of view
 * or the visitor prefers reduced motion.
 */
export function useAnimationClock(
  t: number | undefined,
  durationMs: number,
  ref?: React.RefObject<Element | null>,
) {
  const [value, setValue] = useState(t ?? 0);
  const raf = useRef(0);
  const controlled = t !== undefined;

  useEffect(() => {
    if (controlled) {
      setValue(t);
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setValue(0.62); // a representative, information-dense still
      return;
    }

    let visible = true;
    let observer: IntersectionObserver | undefined;
    const el = ref?.current;
    if (el) {
      observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { threshold: 0.05 },
      );
      observer.observe(el);
    }

    const start = performance.now();
    const tick = (now: number) => {
      if (visible) setValue((((now - start) % durationMs) / durationMs));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      observer?.disconnect();
    };
  }, [controlled, t, durationMs, ref]);

  return controlled ? t : value;
}
