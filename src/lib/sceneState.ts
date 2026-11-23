/**
 * Mutable, NON-reactive state shared between the DOM layer and the WebGL layer.
 * The 3D scene reads this every frame inside useFrame, so scrolling never causes a React re-render.
 */
export const sceneState = {
  /** 0 → 1 cinematic reveal of the monolith / lights during the intro. */
  reveal: 0,
  /** 0 → 1 particle emergence during the intro. */
  particles: 0,
  /** Float section index: 0 = top of Home, 1 = top of About … */
  f: 0,
  /** 0 → 1 across the whole document. */
  progress: 0,
  /** Smoothed scroll velocity (px per frame-ish), used for subtle FOV kick. */
  velocity: 0,
  /** Normalised pointer, -1 → 1. */
  mx: 0,
  my: 0,
  /** Index of the hovered project row (-1 = none). Drives the abstract form. */
  hover: -1,
  /** Hue (0–360) the abstract form is tinted toward on project hover. */
  hue: 222,
  /** Pulse 0→1 triggered on interactions (nav, project open). */
  pulse: 0,
}
