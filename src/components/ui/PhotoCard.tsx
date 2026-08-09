import { useEffect, useRef, useState } from 'react';

export type PhotoCardProps = {
  src: string;
  /** WebP sibling; served first, the jpg stays as the fallback. */
  webp?: string;
  alt: string;
  caption: string;
  badge?: string;
  aspect?: string;
  /** Set by PhotoGrid to stagger the scroll-in by 60 ms per card. */
  index?: number;
  /** fig-plate number; `false` renders the caption without one (used where a
   *  page has photos outside a numbered plate series). */
  fig?: number | false;
};

/** Intrinsic size the browser can reserve before the file arrives — no layout shift. */
function intrinsic(aspect: string) {
  const [w, h] = aspect.split('/').map((n) => Number(n.trim()));
  const width = 1200;
  if (!w || !h) return { width, height: 900 };
  return { width, height: Math.round((width * h) / w) };
}

/** Crop marks that fade in on attention — the photograph as a plate on the
 *  light table. Purely decorative. */
function CropMarks() {
  const corner = 'absolute size-3 border-fg/50';
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
    >
      <span className={`${corner} top-0 left-0 border-t border-l`} />
      <span className={`${corner} top-0 right-0 border-t border-r`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} right-0 bottom-0 border-r border-b`} />
    </span>
  );
}

export function PhotoCard({
  src,
  webp,
  alt,
  caption,
  badge,
  aspect = '4 / 3',
  index = 0,
  fig,
}: PhotoCardProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const { width, height } = intrinsic(aspect);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      data-shown={shown}
      style={{ transitionDelay: `${index * 60}ms` }}
      className="reveal group"
    >
      <div className="cut-card">
        <div className="cut-inner p-0">
          <div className="relative overflow-hidden bg-bg-subtle" style={{ aspectRatio: aspect }}>
            <picture>
              {webp && <source srcSet={webp} type="image/webp" />}
              <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                loading="lazy"
                decoding="async"
                className="duotone size-full object-cover"
              />
            </picture>
            <CropMarks />
          </div>
          <figcaption className="border-t bg-surface-2/60 px-3 py-2 font-mono text-[12px] leading-relaxed tracking-[0.02em] text-faint">
            {fig !== false && (
              <span className="mr-1.5 text-fg/70">
                fig. {String((fig ?? index + 1) as number).padStart(2, '0')}
              </span>
            )}
            {badge && <span className="mr-1.5 text-amber">{badge} ·</span>}
            {caption}
          </figcaption>
        </div>
      </div>
    </figure>
  );
}
