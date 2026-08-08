import { useEffect, useRef, useState } from 'react';
import { Tag } from './primitives';

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
};

/** Intrinsic size the browser can reserve before the file arrives — no layout shift. */
function intrinsic(aspect: string) {
  const [w, h] = aspect.split('/').map((n) => Number(n.trim()));
  const width = 1200;
  if (!w || !h) return { width, height: 900 };
  return { width, height: Math.round((width * h) / w) };
}

export function PhotoCard({
  src,
  webp,
  alt,
  caption,
  badge,
  aspect = '4 / 3',
  index = 0,
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
      className="reveal card overflow-hidden"
    >
      <div className="relative bg-bg-subtle" style={{ aspectRatio: aspect }}>
        <picture>
          {webp && <source srcSet={webp} type="image/webp" />}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        </picture>
        {badge && (
          <Tag tone="amber" className="absolute top-3 left-3 bg-surface/90">
            {badge}
          </Tag>
        )}
      </div>
      <figcaption className="border-t px-4 py-2.5 text-[13px] leading-relaxed text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
