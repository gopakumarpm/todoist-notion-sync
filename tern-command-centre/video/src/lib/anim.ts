import { interpolate, spring } from 'remotion';
import { FPS } from './theme';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** 0→1 fade over [start, start+len] frames */
export const fadeIn = (frame: number, start: number, len = 15) => interpolate(frame, [start, start + len], [0, 1], CLAMP);
/** 1→0 fade over [end-len, end] */
export const fadeOut = (frame: number, end: number, len = 12) => interpolate(frame, [end - len, end], [1, 0], CLAMP);
/** spring entrance: returns 0→1 with slight overshoot */
export const pop = (frame: number, start: number, damping = 14) => spring({ frame: Math.max(0, frame - start), fps: FPS, config: { damping, stiffness: 140, mass: 0.8 } });
/** slide from offset px to 0 with spring */
export const slide = (frame: number, start: number, from = 40) => from * (1 - pop(frame, start, 16));
/** counts from 0 to n with ease-out */
export const countUp = (frame: number, start: number, len: number, n: number) => Math.round(interpolate(frame, [start, start + len], [0, n], { ...CLAMP, easing: (t) => 1 - Math.pow(1 - t, 3) }));
export const clamp01 = (frame: number, a: number, b: number) => interpolate(frame, [a, b], [0, 1], CLAMP);
