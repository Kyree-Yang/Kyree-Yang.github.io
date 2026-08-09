import { cn } from '@/lib/utils';

export type StripPhoto = {
  src: string;
  webp?: string;
  alt: string;
  caption: string;
  /** Portrait-ish photos may ask for a narrower card. */
  aspect?: '4/3' | '3/2';
};

/**
 * A horizontal film strip of photo plates: snap scrolling, chamfered frames,
 * mono captions, and edge fades that only imply more when more exists. The
 * strip is a focusable scroll container, so arrow keys pan it.
 */
export function PhotoStrip({
  photos,
  label,
  className,
  fade = 'bg',
}: {
  photos: StripPhoto[];
  label: string;
  className?: string;
  /** Ground color of the hosting section, so the edge fade blends into it. */
  fade?: 'bg' | 'subtle';
}) {
  return (
    <div className={cn('relative', className)}>
      <div
        tabIndex={0}
        role="group"
        aria-label={label}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        {photos.map((photo) => (
          <figure
            key={photo.src}
            className="w-[260px] shrink-0 snap-start sm:w-[300px] lg:w-[320px]"
          >
            <div className="cut-card">
              <div className="cut-inner p-0">
                <div
                  className="overflow-hidden bg-bg-subtle"
                  style={{ aspectRatio: photo.aspect ?? '4/3' }}
                >
                  <picture>
                    {photo.webp && <source srcSet={photo.webp} type="image/webp" />}
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      width={1200}
                      height={photo.aspect === '3/2' ? 800 : 900}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  </picture>
                </div>
                <figcaption className="border-t bg-surface-2/60 px-3 py-2 font-mono text-[11.5px] leading-snug tracking-[0.02em] text-faint">
                  {photo.caption}
                </figcaption>
              </div>
            </div>
          </figure>
        ))}
      </div>
      {/* Edge fades: scroll affordance without chrome. Left fade only matters
          once scrolled, but a static pair stays honest on both themes. */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l to-transparent',
          fade === 'subtle' ? 'from-bg-subtle' : 'from-bg',
        )}
      />
    </div>
  );
}
