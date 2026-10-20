import { Easing, interpolate, spring } from "remotion";
import { FPS } from "./style";

export const sec = (s: number) => Math.round(s * FPS);

export const pop = (frame: number, delay = 0) =>
  spring({ frame: frame - delay, fps: FPS, config: { damping: 14, stiffness: 180, mass: 0.6 } });

// Entrada con desenfoque + subida, como las palabras grandes de la referencia 2.
export const blurIn = (frame: number, delay = 0, dur = 9) => {
  const t = interpolate(frame - delay, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return { opacity: t, filter: `blur(${(1 - t) * 14}px)`, transform: `translateY(${(1 - t) * 24}px)` };
};

export const fadeOut = (frame: number, end: number, dur = 6) =>
  interpolate(frame, [end - dur, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
