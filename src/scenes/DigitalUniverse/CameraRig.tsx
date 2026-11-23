import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'
import { sceneState } from '../../lib/sceneState'
import { useApp } from '../../store/app'
import { KEYS, LINEAR_SEGMENTS, WARP_SEGMENTS, smooth01 } from './layout'

const BASE_FOV = 42

/** Scroll → camera. Reads mutable state each frame: zero React re-renders while scrolling. */
export function CameraRig() {
  const v = useMemo(
    () => ({
      pos: new Vector3(...KEYS[0].p),
      tgt: new Vector3(...KEYS[0].t),
      a: new Vector3(),
      b: new Vector3(),
      c: new Vector3(),
      d: new Vector3(),
      e: new Vector3(),
    }),
    [],
  )

  useFrame(({ camera, size }, dt) => {
    const reduced = useApp.getState().reducedMotion
    const f = MathUtils.clamp(sceneState.f, 0, KEYS.length - 1.0001)
    const i = Math.floor(f)
    const raw = f - i
    const t = LINEAR_SEGMENTS.has(i) ? raw : smooth01(raw)
    const k0 = KEYS[i]
    const k1 = KEYS[i + 1]

    // 0 on landscape, 1 on phones: blend between desktop and portrait framings
    const aspect = size.width / Math.max(1, size.height)
    const por = MathUtils.clamp((1.05 - aspect) / 0.35, 0, 1)
    const pick = (k: (typeof KEYS)[number], out: Vector3, key: 'p' | 't', tmp: Vector3) => {
      out.set(...k[key])
      if (k.m && por > 0) out.lerp(tmp.set(...k.m[key]), por)
      return out
    }
    pick(k0, v.a, 'p', v.e)
    pick(k1, v.b, 'p', v.e)
    pick(k0, v.c, 't', v.e)
    pick(k1, v.d, 't', v.e)
    v.a.lerp(v.b, t)
    v.c.lerp(v.d, t)

    // pointer parallax (very small, disabled for reduced motion)
    const par = reduced ? 0 : 1
    v.a.x += sceneState.mx * 0.55 * par
    v.a.y += sceneState.my * 0.32 * par

    const lam = reduced ? 40 : 7
    v.pos.x = MathUtils.damp(v.pos.x, v.a.x, lam, dt)
    v.pos.y = MathUtils.damp(v.pos.y, v.a.y, lam, dt)
    v.pos.z = MathUtils.damp(v.pos.z, v.a.z, lam, dt)
    v.tgt.x = MathUtils.damp(v.tgt.x, v.c.x, lam, dt)
    v.tgt.y = MathUtils.damp(v.tgt.y, v.c.y, lam, dt)
    v.tgt.z = MathUtils.damp(v.tgt.z, v.c.z, lam, dt)

    camera.position.copy(v.pos)
    camera.lookAt(v.tgt)

    // FOV: warp kick between worlds + a hint of scroll velocity
    const warp = WARP_SEGMENTS.has(i) ? Math.sin(Math.PI * raw) * 14 : 0
    const kick = reduced ? 0 : Math.min(Math.abs(sceneState.velocity), 40) * 0.08
    const cam = camera as typeof camera & { fov: number; updateProjectionMatrix: () => void }
    const targetFov = BASE_FOV + (reduced ? 0 : warp) + kick
    const next = MathUtils.damp(cam.fov, targetFov, 6, dt)
    if (Math.abs(next - cam.fov) > 0.005) {
      cam.fov = next
      cam.updateProjectionMatrix()
    }
  })
  return null
}
