export type Quality = 'high' | 'low' | 'none'

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isFinePointer(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  )
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    if (!gl) return false
    const lose = gl.getExtension('WEBGL_lose_context')
    lose?.loseContext()
    return true
  } catch {
    return false
  }
}

/**
 * Pick a rendering tier once at startup.
 *  none = no WebGL → static CSS backdrop
 *  low  = phones, low-memory or low-core devices → fewer particles, no shards, dpr 1
 *  high = everything else
 */
export function detectQuality(): Quality {
  if (typeof window === 'undefined') return 'none'
  if (!hasWebGL()) return 'none'
  const nav = navigator as Navigator & { deviceMemory?: number }
  const small = window.innerWidth < 768
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const lowMem = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4
  const lowCores = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4
  return small || coarse || lowMem || lowCores ? 'low' : 'high'
}

export function safeSession(key: string, value?: string): string | null {
  try {
    if (value !== undefined) sessionStorage.setItem(key, value)
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}
