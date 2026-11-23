import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'
import { AdditiveBlending, Group, InstancedMesh, Object3D, ShaderMaterial } from 'three'
import { sceneState } from '../../lib/sceneState'
import { glowFrag, glowVert } from './shaders'
import { WORLD } from './layout'

const Z0 = -30
const Z1 = -98
const STEP = 6.8

/** World C — monumental pillar corridor, reflective floor, a single slit of light at the far end. */
export function Corridor({ high }: { high: boolean }) {
  const group = useRef<Group>(null)
  const pillars = useRef<InstancedMesh>(null)
  const beams = useRef<InstancedMesh>(null)

  const pillarData = useMemo(() => {
    const out: { x: number; z: number; h: number }[] = []
    let k = 0
    for (let z = Z0; z >= Z1; z -= STEP) {
      const h = 30 + ((k * 7) % 5) * 2
      out.push({ x: -7.6, z, h }, { x: 7.6, z, h })
      k++
    }
    return out
  }, [])
  const beamData = useMemo(() => {
    const out: number[] = []
    for (let z = Z0 - STEP / 2; z >= Z1; z -= STEP * 2) out.push(z)
    return out
  }, [])

  useEffect(() => {
    const d = new Object3D()
    const p = pillars.current
    if (p) {
      pillarData.forEach((it, i) => {
        d.position.set(it.x, it.h / 2, it.z)
        d.scale.set(2.5, it.h, 2.5)
        d.updateMatrix()
        p.setMatrixAt(i, d.matrix)
      })
      p.instanceMatrix.needsUpdate = true
    }
    const b = beams.current
    if (b) {
      beamData.forEach((z, i) => {
        d.position.set(0, 13.5, z)
        d.scale.set(17, 1.1, 1.8)
        d.updateMatrix()
        b.setMatrixAt(i, d.matrix)
      })
      b.instanceMatrix.needsUpdate = true
    }
  }, [pillarData, beamData])

  const glow = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: glowVert,
        fragmentShader: glowFrag,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        fog: false,
        uniforms: { uAlpha: { value: 0.9 } },
      }),
    [],
  )
  useEffect(() => () => glow.dispose(), [glow])

  useFrame(() => {
    const g = group.current
    if (!g) return
    g.visible = sceneState.f > 4.5 && sceneState.f < 6.7
  })

  return (
    <group ref={group} position={[...WORLD.C]}>
      <instancedMesh ref={pillars} args={[undefined, undefined, pillarData.length]} castShadow receiveShadow frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0c0d11" metalness={0.35} roughness={0.55} />
      </instancedMesh>
      <instancedMesh ref={beams} args={[undefined, undefined, beamData.length]} castShadow receiveShadow frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0a0b0e" metalness={0.4} roughness={0.5} />
      </instancedMesh>

      <mesh rotation-x={-Math.PI / 2} position={[0, 0, (Z0 + Z1) / 2 - 6]} receiveShadow>
        <planeGeometry args={[46, 150]} />
        {high ? (
          <MeshReflectorMaterial
            blur={[320, 90]}
            resolution={512}
            mixBlur={1}
            mixStrength={22}
            roughness={0.92}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#09090c"
            metalness={0.55}
            mirror={0.55}
          />
        ) : (
          <meshStandardMaterial color="#0a0a0e" metalness={0.6} roughness={0.35} />
        )}
      </mesh>

      {/* the slit of light */}
      <mesh position={[0, 15, Z1 - 2]}>
        <planeGeometry args={[1.5, 34]} />
        <meshBasicMaterial color="#ffffff" fog={false} toneMapped={false} />
      </mesh>
      <mesh position={[0, 15, Z1 - 1.5]} material={glow}>
        <planeGeometry args={[18, 40]} />
      </mesh>
      <mesh position={[0, 0.02, Z1 + 6]} rotation-x={-Math.PI / 2} material={glow}>
        <planeGeometry args={[7, 70]} />
      </mesh>
    </group>
  )
}
