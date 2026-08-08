import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * `src` is a basename without extension — "/media/aghf_hardware" resolves to
 * the .webm/.mp4 pair. Nothing here ever autoplays under reduced motion, so the
 * poster is always a valid resting state.
 */
export function VideoCard({
  src,
  poster,
  caption,
  aspect = '16 / 9',
  clickToPlay = true,
}: {
  src: string;
  poster: string;
  caption: string;
  aspect?: string;
  clickToPlay?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || clickToPlay) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.muted = true;
    void el.play().catch(() => {
      // Autoplay refused (data saver, low power) — the poster + play button stand in.
    });
  }, [clickToPlay]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.muted = true;
      void el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  };

  return (
    <figure className="card overflow-hidden">
      <div className="relative bg-bg-subtle" style={{ aspectRatio: aspect }}>
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={caption}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="size-full object-cover"
        >
          <source src={`${src}.webm`} type="video/webm" />
          <source src={`${src}.mp4`} type="video/mp4" />
        </video>

        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Pause: ${caption}` : `Play: ${caption}`}
          className={cn(
            'absolute inset-0 grid place-items-center transition-opacity',
            playing
              ? 'opacity-0 hover:opacity-100 focus-visible:opacity-100'
              : 'bg-bg/25 opacity-100',
          )}
        >
          <span className="grid size-12 place-items-center rounded-full border border-line-strong bg-surface/90">
            {playing ? (
              <Pause aria-hidden className="size-5 text-fg" />
            ) : (
              <Play aria-hidden className="size-5 translate-x-px text-fg" />
            )}
          </span>
        </button>
      </div>

      <figcaption className="border-t px-4 py-2.5 text-[13px] leading-relaxed text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
