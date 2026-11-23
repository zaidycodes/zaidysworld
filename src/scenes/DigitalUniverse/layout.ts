import { MathUtils } from 'three'

/** Where each world lives in 3D space. Fog + visibility ranges keep them from bleeding into each other. */
export const WORLD = {
  A: [0, 0, 0],
  B: [36, 4, -6],
  C: [-40, 0, 0],
  D: [0, 0, -150],
} as const

export interface CamKey {
  p: [number, number, number]
  t: [number, number, number]
  /** Portrait / phone framing: the object moves up, text takes the lower half. */
  m?: { p: [number, number, number]; t: [number, number, number] }
}

/**
 * Camera keyframes indexed by the float section index `f`.
 * 0 home · 1 about · 2 work · 3 lab · 4 tools · 5 journey(start) · 6 journey(end) · 7 contact(in) · 8 contact(end)
 */
export const KEYS: CamKey[] = [
  { p: [0, 0.3, 8.6], t: [-3.0, 0, 0], m: { p: [0, 0.3, 16.5], t: [-1.3, -3.0, 0] } },
  { p: [-4.4, -0.9, 5.9], t: [-2.0, 0.3, 0], m: { p: [-2.4, -0.6, 10.5], t: [-1.2, -2.6, 0] } },
  { p: [36, 4.2, 3.7], t: [32.6, 4, -6], m: { p: [36, 4.2, 8.5], t: [35, -0.6, -6] } },
  { p: [30.5, 7, -0.4], t: [36, 4, -6], m: { p: [30.5, 7, -0.4], t: [36, 1.8, -6] } },
  { p: [42, 1, -0.8], t: [36, 4.5, -6], m: { p: [42, 1, -0.8], t: [36, 2.2, -6] } },
  { p: [-40, 1.7, -24], t: [-40, 2.8, -60] },
  { p: [-40, 1.7, -88], t: [-40, 3, -112] },
  { p: [0, 1.5, -124], t: [0, 0, -150] },
  { p: [0, 0.8, -133], t: [0, 0, -150] },
]

/** Segments that jump between worlds get a FOV "warp" kick. */
export const WARP_SEGMENTS = new Set([1, 4, 6])
/** Segments that should travel linearly (the long corridor walk). */
export const LINEAR_SEGMENTS = new Set([5, 7])

export const smooth01 = (t: number) => t * t * (3 - 2 * t)
export const range = (f: number, a: number, b: number) => MathUtils.clamp((f - a) / (b - a), 0, 1)
