import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { DirectionalLight, Object3D, PointLight, SpotLight } from 'three'
import { sceneState } from '../../lib/sceneState'
import { range, WORLD } from './layout'

/**
 * Light COUNT never changes at runtime (changing it recompiles every material → hitch).
 * Intensities are driven from scroll instead.
 */
export function Lights({ high }: { high: boolean }) {
  const rim = useRef<DirectionalLight>(null)
  const accent = useRef<PointLight>(null)
  const spot = useRef<SpotLight>(null)
  const fill = useRef<DirectionalLight>(null)
  const spotTarget = useMemo(() => {
    const o = new Object3D()
    o.position.set(WORLD.C[0], 0, -40)
    return o
  }, [])

  useFrame(({ scene }) => {
    const f = sceneState.f
    const r = sceneState.reveal
    const aVis = 1 - range(f, 2.0, 2.6)
    const bVis = range(f, 1.2, 1.9) * (1 - range(f, 5.0, 5.4))
    const cVis = range(f, 4.5, 5.2) * (1 - range(f, 6.2, 6.8))

    scene.environmentIntensity = 0.12 + r * (0.55 + aVis * 0.5 + bVis * 0.35 + cVis * 0.25)

    if (rim.current) rim.current.intensity = 3.6 * r * Math.max(aVis, bVis * 0.6)
    if (accent.current) accent.current.intensity = 26 * r * aVis * (1 + sceneState.pulse * 0.8)
    if (spot.current) spot.current.intensity = 5200 * cVis
    if (fill.current) fill.current.intensity = 0.55 * cVis
  })

  return (
    <>
      <Environment resolution={high ? 128 : 64} frames={1}>
        {/* every panel looks at the origin so reflections sweep across polished faces */}
        <Lightformer form="rect" intensity={5} position={[-9, 4, 7]} scale={[9, 7, 1]} color="#ffffff" target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={4.5} position={[9, 1, 6]} scale={[7, 9, 1]} color="#648cff" target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3} position={[0, 9, -2]} scale={[22, 2.5, 1]} color="#ffffff" target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.4} position={[0, -7, 4]} scale={[16, 3, 1]} color="#9b8cff" target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={2.2} position={[0, 0, -9]} scale={7} color="#c9ccd6" target={[0, 0, 0]} />
      </Environment>

      <directionalLight ref={rim} position={[-6, 5, -4]} color="#a9bcff" intensity={0} />
      <pointLight ref={accent} position={[3.4, -1.6, 4.2]} color="#648cff" intensity={0} distance={26} decay={2} />

      <primitive object={spotTarget} />
      <spotLight
        ref={spot}
        position={[WORLD.C[0], 14, -100]}
        target={spotTarget}
        angle={0.62}
        penumbra={1}
        decay={2}
        color="#cfd9ff"
        intensity={0}
        castShadow={high}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={2}
        shadow-camera-far={130}
        shadow-bias={-0.0006}
      />
      <directionalLight ref={fill} position={[WORLD.C[0] + 4, 8, 12]} color="#8fa6ff" intensity={0} />
    </>
  )
}
