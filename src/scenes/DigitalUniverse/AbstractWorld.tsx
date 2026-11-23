import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, DoubleSide, Group, InstancedMesh, MathUtils, Object3D, ShaderMaterial } from 'three'
import { sceneState } from '../../lib/sceneState'
import { useApp } from '../../store/app'
import { blobFrag, blobVert } from './shaders'
import { WORLD } from './layout'

interface Shard {
  r: number
  a: number
  y: number
  sp: number
  s: number
  rx: number
  ry: number
  bob: number
}

/** World B — liquid chrome form that reacts to project hover, drifting shards and a wire cage. */
export function AbstractWorld({ high }: { high: boolean }) {
  const group = useRef<Group>(null)
  const blob = useRef<Group>(null)
  const cage = useRef<Group>(null)
  const shards = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const count = high ? 34 : 14

  const data = useMemo<Shard[]>(
    () =>
      Array.from({ length: count }, () => ({
        r: 3.9 + Math.random() * 5.5,
        a: Math.random() * Math.PI * 2,
        y: (Math.random() - 0.5) * 7,
        sp: (0.04 + Math.random() * 0.09) * (Math.random() > 0.5 ? 1 : -1),
        s: 0.14 + Math.random() * 0.42,
        rx: Math.random() * 0.8,
        ry: Math.random() * 0.8,
        bob: Math.random() * 6,
      })),
    [count],
  )

  const mat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: blobVert,
        fragmentShader: blobFrag,
        uniforms: {
          uTime: { value: 0 },
          uAmp: { value: 0.26 },
          uFreq: { value: 0.95 },
          uRadius: { value: 2.15 },
          uGlow: { value: 0 },
          uColorA: { value: new Color('#648cff') },
          uColorB: { value: new Color('#9b8cff') },
        },
        side: DoubleSide,
      }),
    [],
  )
  useEffect(() => () => mat.dispose(), [mat])

  const hue = useRef(222)
  const amp = useRef(0.26)

  useFrame(({ clock }, dt) => {
    const g = group.current
    if (!g) return
    const f = sceneState.f
    const vis = f > 1.35 && f < 5.35
    g.visible = vis
    if (!vis) return
    const reduced = useApp.getState().reducedMotion
    const t = clock.elapsedTime
    mat.uniforms.uTime.value = reduced ? 0 : t

    const hovering = sceneState.hover >= 0
    amp.current = MathUtils.damp(amp.current, 0.26 + (hovering ? 0.12 : 0) + sceneState.pulse * 0.18, 4, dt)
    mat.uniforms.uAmp.value = amp.current
    mat.uniforms.uGlow.value = MathUtils.damp(mat.uniforms.uGlow.value as number, hovering ? 0.7 : 0, 4, dt)

    hue.current = MathUtils.damp(hue.current, sceneState.hue, 3.5, dt)
    ;(mat.uniforms.uColorA.value as Color).setHSL(hue.current / 360, 0.85, 0.62)
    ;(mat.uniforms.uColorB.value as Color).setHSL(((hue.current + 42) % 360) / 360, 0.72, 0.7)

    if (blob.current) {
      blob.current.rotation.y = reduced ? 0.4 : t * 0.12 + sceneState.mx * 0.4
      blob.current.rotation.x = reduced ? 0 : Math.sin(t * 0.2) * 0.2 - sceneState.my * 0.2
      blob.current.scale.setScalar(1 + Math.sin(t * 0.7) * (reduced ? 0 : 0.02) + sceneState.pulse * 0.08)
    }
    if (cage.current) {
      cage.current.rotation.y = reduced ? 0 : -t * 0.05
      cage.current.rotation.z = reduced ? 0 : t * 0.03
    }

    const m = shards.current
    if (m) {
      for (let i = 0; i < data.length; i++) {
        const d = data[i]
        const a = d.a + (reduced ? 0 : t * d.sp)
        dummy.position.set(Math.cos(a) * d.r, d.y + (reduced ? 0 : Math.sin(t * 0.4 + d.bob) * 0.5), Math.sin(a) * d.r * 0.85)
        dummy.rotation.set((reduced ? 0 : t) * d.rx, (reduced ? 0 : t) * d.ry, 0.3)
        dummy.scale.setScalar(d.s * (1 + sceneState.pulse * 0.35))
        dummy.updateMatrix()
        m.setMatrixAt(i, dummy.matrix)
      }
      m.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={group} position={[...WORLD.B]}>
      <group ref={blob}>
        <mesh material={mat}>
          <sphereGeometry args={[1, high ? 128 : 56, high ? 96 : 40]} />
        </mesh>
      </group>
      <group ref={cage}>
        <mesh>
          <icosahedronGeometry args={[4.6, 1]} />
          <meshBasicMaterial wireframe color="#648cff" transparent opacity={0.14} />
        </mesh>
      </group>
      <instancedMesh ref={shards} args={[undefined, undefined, count]} frustumCulled={false}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#14151c" metalness={1} roughness={0.22} envMapIntensity={1.2} flatShading />
      </instancedMesh>
    </group>
  )
}
