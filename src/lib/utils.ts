import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp to [0,1]. */
export const sat = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smootherstep easing — flat at both ends, no overshoot. */
export const ease = (t: number) => {
  const x = sat(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

/**
 * Map a global progress value to a sub-segment.
 * segment(t, 0.2, 0.5) is 0 before t=0.2, 1 after t=0.5, eased in between.
 */
export const segment = (t: number, start: number, end: number) =>
  ease(sat((t - start) / (end - start)));

/** Wrap into [0,1) — used so looping animations stay seamless at the GIF splice. */
export const wrap = (t: number) => ((t % 1) + 1) % 1;
