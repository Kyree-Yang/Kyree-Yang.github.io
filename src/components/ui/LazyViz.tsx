import { useEffect, useRef, useState } from 'react';

/**
 * Visualizations are hundreds of SVG nodes each and several run rAF clocks, so
 * they mount only when the reader is nearly there. The reserved height keeps the
 * scrollbar honest — without it, every mount would shove the page under the cursor.
 */
export function LazyViz({ children, height }: { children: React.ReactNode; height: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setMounted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setMounted(true);
      },
      { rootMargin: '300px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Height is released after mount: the real viz is responsive and is usually
  // shorter than the reservation on narrow screens.
  return (
    <div ref={ref} style={mounted ? undefined : { minHeight: height }}>
      {mounted ? children : null}
    </div>
  );
}
