import { Seo } from '@/components/shell/Seo';
import { DocLink } from '@/components/ui/DocLink';
import { EntryMasthead } from '@/components/ui/EntryMasthead';
import { LazyViz } from '@/components/ui/LazyViz';
import { LinkRow } from '@/components/ui/LinkRow';
import { Bullets, Container, Section, SectionHeading } from '@/components/ui/primitives';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/ui/Reveal';
import { PipelineDiagram } from '@/components/viz/PipelineDiagram';
import { diffusion, diffusionLinks } from '@/content/diffusion';
import { doc } from '@/content/docs';

const pipeline = diffusion.sections.find((s) => s.id === 'pipeline')!;
const contributions = diffusion.sections.find((s) => s.id === 'contributions')!;

export default function DiffusionPyramid() {
  const slides = doc('diffusionSlides');
  const report = doc('diffusionReport');

  return (
    <Container>
      <Seo
        title="Diffusion-Pyramid — Ruikai Yang"
        description="A three-person EECS 442 project improving the diversity and controllability of text-to-image diffusion through image and text augmentation."
        path="/work/diffusion-pyramid"
      />

      <Section className="pb-4 sm:pb-6">
        <EntryMasthead
          eyebrow={diffusion.eyebrow}
          title={diffusion.title}
          tagline={diffusion.tagline}
          dates={diffusion.dates}
          role={diffusion.role}
          stack={diffusion.stack}
          caveatTeaser={diffusion.caveatTeaser}
        />
      </Section>

      <Section id="pipeline">
        <Reveal>
          <SectionHeading title={pipeline.heading} />
          <Prose>
            <p>{pipeline.body}</p>
          </Prose>
        </Reveal>
        <Reveal>
          <div className="mt-8">
            <LazyViz height={380}>
              <PipelineDiagram />
            </LazyViz>
          </div>
        </Reveal>
      </Section>

      <Section id="contributions">
        <Reveal>
          <SectionHeading title={contributions.heading} sub="Three people, three months, one course." />
          <div className="max-w-[68ch]">
            <Bullets items={contributions.bullets ?? []} />
          </div>
        </Reveal>
      </Section>

      <Section id="artifacts">
        <Reveal>
          <SectionHeading title="Artifacts" sub="The slides and report submitted for the course." />
          <div className="flex flex-wrap gap-2">
            <DocLink label={slides.label} href={slides.href} kind={slides.kind} />
            <DocLink label={report.label} href={report.href} kind={report.kind} />
          </div>

          <div className="mt-8">
            <div className="mb-3 font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
              References
            </div>
            <LinkRow links={diffusionLinks} size="sm" />
          </div>
        </Reveal>
      </Section>
    </Container>
  );
}
