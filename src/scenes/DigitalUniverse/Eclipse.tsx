import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Color, DoubleSide, Group, ShaderMaterial } from 'three'
import { sceneState } from '../../lib/sceneState'
import { useApp } from '../../store/app'
import { ringFrag, ringVert } from './shaders'
import { WORLD } from './layout'
import { OrbitDust } from './Particles'

function makeRing(inner: number, power: number) {
  return new ShaderMaterial({
    vertexShader: ringVert,
    fragmentShader: ringFrag,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
    fog: false,
    uniforms: {
      uTime: { value: 0 },
      uInner: { value: inner },
      uPower: { value: power },
      uHot: { value: new Color('#fff4e6') },
      uCool: { value: new Color('#648cff') },
    },
  })
}

/** World D — a black sun with a luminous accretion ring. The finale behind CONTACT. */
export function Eclipse({ high }: { high: boolean }) {
  const group = useRef<Group>(null)
  const halo = useMemo(() => makeRing(5.05, 1.25), [])
  const disk = useMemo(() => makeRing(5.9, 0.9), [])
  useEffect(
    () => () => {
      halo.dispose()
      disk.dispose()
    },
    [halo, disk],
  )

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    const vis = sceneState.f > 6.2
    g.visible = vis
    if (!vis) return
    const t = useApp.getState().reducedMotion ? 0 : clock.elapsedTime
    halo.uniforms.uTime.value = t
    disk.uniforms.uTime.value = t
    g.rotation.z = t * 0.01
    g.rotation.y = sceneState.mx * 0.08
    g.rotation.x = -sceneState.my * 0.05
  })

  return (
    <group ref={group} position={[...WORLD.D]}>
      <mesh>
        <sphereGeometry args={[5, 64, 48]} />
        <meshBasicMaterial color="#000000" fog={false} />
      </mesh>
      {/* frontal lensing halo */}
      <mesh material={halo} position={[0, 0, 0.2]}>
        <ringGeometry args={[5, 11, 160, 1]} />
      </mesh>
      {/* tilted accretion disk, correctly occluded by the sphere */}
      <group rotation-x={-1.32} rotation-y={0.1}>
        <mesh material={disk}>
          <ringGeometry args={[5.8, 17, 180, 1]} />
        </mesh>
        <group rotation-x={1.32}>
          <OrbitDust count={high ? 900 : 380} />
        </group>
      </group>
    </group>
  )
}
