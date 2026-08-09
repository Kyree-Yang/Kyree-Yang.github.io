import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { Container, Section } from '@/components/ui/primitives';
import { LazyViz } from '@/components/ui/LazyViz';
import { Reveal } from '@/components/ui/Reveal';
import { VideoCard } from '@/components/ui/VideoCard';
import { PipelineDiagram } from '@/components/viz/PipelineDiagram';

/**
 * Three supporting entries in identical frames: same 16:10 media window, same
 * one-line caption rail, so the row rules up regardless of what each cell
 * holds — two videos and one drawing.
 */
function Act({
  title,
  to,
  caption,
  children,
}: {
  title: string;
  to: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <article className="flex min-w-0 flex-col">
      <Link
        to={to}
        className="group inline-flex items-center gap-1.5 self-start text-[15px] font-semibold tracking-[-0.01em]"
      >
        <span>{title}</span>
        <ArrowRight
          aria-hidden
          className="size-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
        />
      </Link>
      <figure className="cut-card mt-3">
        <div className="cut-inner p-0">
          <div className="aspect-[16/10] overflow-hidden bg-bg-subtle">{children}</div>
          <figcaption className="truncate border-t bg-surface-2/60 px-3 py-2 font-mono text-[11.5px] leading-snug tracking-[0.02em] text-faint">
            {caption}
          </figcaption>
        </div>
      </figure>
    </article>
  );
}

export function SupportingActs() {
  return (
    <Section className="border-y bg-bg-subtle">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Act
              title="AGHF robotics"
              to="/work/aghf"
              caption="sim-to-real trajectory tracking, ROAHM Lab"
            >
              <VideoCard
                bare
                src="/media/aghf_hardware"
                poster="/media/aghf_hardware-poster.jpg"
                caption="sim-to-real trajectory tracking, ROAHM Lab"
                clickToPlay
              />
            </Act>

            <Act
              title="Crawler Crew"
              to="/work/search-engine"
              caption="live query against 30M pages, from-scratch C++"
            >
              <VideoCard
                bare
                src="/media/super_quality"
                poster="/media/super_quality-poster.jpg"
                caption="live query against 30M pages, from-scratch C++"
                clickToPlay
              />
            </Act>

            <Act
              title="Diffusion-Pyramid"
              to="/work/diffusion-pyramid"
              caption="text augmentation · Stable Diffusion · Laplacian pyramid"
            >
              <div className="flex size-full items-center px-3">
                <LazyViz height={220}>
                  <PipelineDiagram bare />
                </LazyViz>
              </div>
            </Act>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
