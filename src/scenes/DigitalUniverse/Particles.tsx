import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, ShaderMaterial, Vector3 } from 'three'
import { sceneState } from '../../lib/sceneState'
import { pointsFrag, pointsVert } from './shaders'

interface Opts {
  count: number
  /** [min, max] radius of the shell the points are scattered in. */
  radius: [number, number]
  size: [number, number]
  /** 1 = full sphere, <1 flattens it into a disc (used for orbiting dust). */
  flatten?: number
  alpha?: number
  drift?: number
  repel?: boolean
  tint?: [number, number, number]
}

function useParticles(o: Opts) {
  const geo = useMemo(() => {
    const g = new BufferGeometry()
    const pos = new Float32Array(o.count * 3)
    const seed = new Float32Array(o.count)
    const size = new Float32Array(o.count)
    for (let i = 0; i < o.count; i++) {
      const u = Math.random() * 2 - 1
      const th = Math.random() * Math.PI * 2
      const s = Math.sqrt(1 - u * u)
      const r = o.radius[0] + Math.pow(Math.random(), 0.8) * (o.radius[1] - o.radius[0])
      pos[i * 3] = Math.cos(th) * s * r
      pos[i * 3 + 1] = u * r * (o.flatten ?? 1)
      pos[i * 3 + 2] = Math.sin(th) * s * r
      seed[i] = Math.random()
      size[i] = o.size[0] + Math.random() * (o.size[1] - o.size[0])
    }
    g.setAttribute('position', new BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new BufferAttribute(seed, 1))
    g.setAttribute('aSize', new BufferAttribute(size, 1))
    return g
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o.count])

  const mat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: pointsVert,
        fragmentShader: pointsFrag,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uReveal: { value: 0 },
          uPx: { value: 1 },
          uRepel: { value: o.repel ? 1 : 0 },
          uAlpha: { value: o.alpha ?? 1 },
          uDrift: { value: o.drift ?? 0.3 },
          uMouse: { value: new Vector3(999, 999, 999) },
          uTint: { value: new Vector3(...(o.tint ?? [1, 1, 1])) },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(
    () => () => {
      geo.dispose()
      mat.dispose()
    },
    [geo, mat],
  )
  return { geo, mat }
}

/** A starfield that trails the camera at 85% so travelling between worlds shows parallax. */
export function Stars({ count }: { count: number }) {
  const { geo, mat } = useParticles({ count, radius: [30, 95], size: [1.1, 3.2], drift: 0.15, alpha: 0.9 })
  const ref = useRef<Group>(null)
  useFrame(({ clock, camera, gl }) => {
    mat.uniforms.uTime.value = clock.elapsedTime
    mat.uniforms.uReveal.value = sceneState.particles
    mat.uniforms.uPx.value = gl.getPixelRatio()
    ref.current?.position.copy(camera.position).multiplyScalar(0.85)
  })
  return (
    <group ref={ref}>
      <points geometry={geo} material={mat} frustumCulled={false} />
    </group>
  )
}

/**
 * Close dust cloud that the pointer pushes away from.
 * The pointer is projected onto the plane through the group at the monolith's depth.
 */
export function InteractiveDust({ count, position = [0, 0, 0] }: { count: number; position?: [number, number, number] }) {
  const { geo, mat } = useParticles({
    count,
    radius: [1.9, 8],
    size: [0.7, 1.7],
    drift: 0.4,
    repel: true,
    alpha: 0.75,
  })
  const ref = useRef<Group>(null)
  const { raycast } = useMemo(
    () => ({ raycast: { o: new Vector3(), d: new Vector3(), p: new Vector3() } }),
    [],
  )

  useFrame(({ clock, camera, gl }) => {
    const g = ref.current
    if (!g) return
    const visible = sceneState.f < 2.3
    g.visible = visible
    if (!visible) return
    mat.uniforms.uTime.value = clock.elapsedTime
    mat.uniforms.uReveal.value = sceneState.particles
    mat.uniforms.uPx.value = gl.getPixelRatio()
    const { o, d, p } = raycast
    o.copy(camera.position)
    d.set(sceneState.mx, sceneState.my, 0.5).unproject(camera).sub(o).normalize()
    const t = (g.position.z - o.z) / (d.z || -1)
    p.copy(o).addScaledVector(d, t).sub(g.position)
    ;(mat.uniforms.uMouse.value as Vector3).copy(p)
  })

  return (
    <group ref={ref} position={position}>
      <points geometry={geo} material={mat} frustumCulled={false} />
    </group>
  )
}

/** Dust ring orbiting the eclipse. */
export function OrbitDust({ count }: { count: number }) {
  const { geo, mat } = useParticles({
    count,
    radius: [6.4, 17],
    size: [0.8, 2],
    flatten: 0.06,
    drift: 0.2,
    alpha: 0.8,
    tint: [1, 0.95, 0.9],
  })
  const ref = useRef<Group>(null)
  useFrame(({ clock, gl }, dt) => {
    const g = ref.current
    if (!g) return
    g.visible = sceneState.f > 6.2
    if (!g.visible) return
    mat.uniforms.uTime.value = clock.elapsedTime
    mat.uniforms.uReveal.value = 1
    mat.uniforms.uPx.value = gl.getPixelRatio()
    g.rotation.y += dt * 0.035
  })
  return (
    <group ref={ref}>
      <points geometry={geo} material={mat} frustumCulled={false} />
    </group>
  )
}
