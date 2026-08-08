import { Link } from 'react-router-dom';

import { Container, CountUp, Section } from '@/components/ui/primitives';
import { Reveal } from '@/components/ui/Reveal';
import { proofStrip, proofStripNote } from '@/content/site';
import type { Tone } from '@/content/types';
import { cn } from '@/lib/utils';

const TONE: Record<Tone, string> = {
  neutral: 'text-fg',
  primary: 'text-primary',
  violet: 'text-violet',
  cyan: 'text-cyan',
  amber: 'text-amber',
  emerald: 'text-emerald',
  rose: 'text-rose',
};

export function ProofStrip() {
  return (
    <Section className="py-10 sm:py-12">
      <Container>
        <Reveal>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {proofStrip.map((cell) => (
              <li key={cell.label}>
                <Link
                  to={cell.to}
                  className="card elevate flex h-full flex-col justify-between gap-2 p-4 transition-colors hover:border-line-strong"
                >
                  <span
                    className={cn(
                      'tnum text-xl font-semibold tracking-tight sm:text-2xl',
                      TONE[cell.tone],
                    )}
                  >
                    {cell.count === undefined ? (
                      cell.value
                    ) : (
                      <>
                        {cell.prefix}
                        <CountUp value={cell.count} />
                        {cell.suffix}
                      </>
                    )}
                  </span>
                  <span className="text-xs leading-snug text-muted">{cell.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-[13px] text-faint">{proofStripNote}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
