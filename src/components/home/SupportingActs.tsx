import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { Container, Section } from '@/components/ui/primitives';
import { LazyViz } from '@/components/ui/LazyViz';
import { Reveal } from '@/components/ui/Reveal';
import { VideoCard } from '@/components/ui/VideoCard';
import { PipelineDiagram } from '@/components/viz/PipelineDiagram';



function Act({ title, to, children }: { title: string; to: string; children: React.ReactNode }) {
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
      <div className="mt-3">{children}</div>
    </article>
  );
}

export function SupportingActs() {
  return (
    <Section className="border-y bg-bg-subtle">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Act title="AGHF robotics" to="/work/aghf">
              <VideoCard
                src="/media/aghf_hardware"
                poster="/media/aghf_hardware-poster.jpg"
                caption="sim-to-real trajectory tracking, ROAHM Lab"
                clickToPlay
              />
            </Act>

            <Act title="Crawler Crew" to="/work/search-engine">
              <VideoCard
                src="/media/super_quality"
                poster="/media/super_quality-poster.jpg"
                caption="live query against 30M pages, from-scratch C++"
                clickToPlay
              />
            </Act>

            <Act title="Diffusion-Pyramid" to="/work/diffusion-pyramid">
              <LazyViz height={220}>
                <PipelineDiagram />
              </LazyViz>
            </Act>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
