import { cn } from '@/lib/utils';

/** 9:16 device bezel. The tilt is `motion-safe` only — it is decoration, not information. */
export function PhoneFrame({ children, tilt }: { children: React.ReactNode; tilt?: boolean }) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[280px] transition-transform duration-300 ease-out',
        tilt &&
          'motion-safe:hover:[transform:perspective(900px)_rotate3d(1,-1,0,6deg)_scale(1.01)]',
      )}
    >
      <div className="rounded-[var(--radius-phone)] border border-line-strong bg-surface-2 p-2.5 shadow-pop">
        <div
          className="relative overflow-hidden rounded-[18px] bg-bg"
          style={{ aspectRatio: '9 / 16' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
