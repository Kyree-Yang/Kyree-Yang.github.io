import { Container } from '@/components/ui/primitives';

const LINES = ['w-full', 'w-11/12', 'w-4/5', 'w-full', 'w-3/5'];

/** Reserves 60vh so a lazy route swapping in causes no layout shift. */
export function RouteSkeleton() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="h-[60vh] animate-pulse" aria-busy="true" aria-live="polite">
        <div className="h-3 w-32 rounded-[var(--radius-sm)] bg-surface-2" />
        <div className="mt-5 h-9 w-2/3 rounded-[var(--radius-sm)] bg-surface-2" />
        <div className="mt-8 space-y-3">
          {LINES.map((w, i) => (
            <div key={i} className={`h-3 rounded-[var(--radius-sm)] bg-surface-2 ${w}`} />
          ))}
        </div>
        <div className="mt-10 h-48 rounded-[var(--radius-lg)] border border-line bg-surface-2/60" />
        <span className="sr-only">Loading</span>
      </div>
    </Container>
  );
}

export default RouteSkeleton;
