import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-in fade. Deliberately CSS (`.reveal` + data-shown) rather than
 * framer-motion: these wrap most of the page, and a motion component per block
 * would put hundreds of springs on the main thread for a 420ms opacity ramp.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setShown(true);
      return;
    }

    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(() => setShown(true), delay);
      },
      // threshold 0 so blocks taller than the viewport still fire
      { rootMargin: '0px 0px -48px 0px' },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [delay]);

  return (
    <div ref={ref} className={className ? `reveal ${className}` : 'reveal'} data-shown={shown ? 'true' : 'false'}>
      {children}
    </div>
  );
}
