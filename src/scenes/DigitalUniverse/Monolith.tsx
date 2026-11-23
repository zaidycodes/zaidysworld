import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EdgesGeometry, ExtrudeGeometry, Group, MathUtils, Shape } from 'three'
import { sceneState } from '../../lib/sceneState'
import { useApp } from '../../store/app'

/** The signature object: a bevelled metallic "Z" monolith. */
function makeZ() {
  const s = new Shape()
  const pts: [number, number][] = [
    [-1.1, 1.5],
    [1.1, 1.5],
    [1.1, 0.95],
    [-0.15, -0.95],
    [1.1, -0.95],
    [1.1, -1.5],
    [-1.1, -1.5],
    [-1.1, -0.95],
    [0.15, 0.95],
    [-1.1, 0.95],
  ]
  s.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1])
  s.closePath()
  const g = new ExtrudeGeometry(s, {
    depth: 0.62,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.05,
    bevelSegments: 4,
    curveSegments: 1,
  })
  g.center()
  return g
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export function Monolith() {
  const group = useRef<Group>(null)
  const geo = useMemo(makeZ, [])
  const edges = useMemo(() => new EdgesGeometry(geo, 28), [geo])
  useEffect(
    () => () => {
      geo.dispose()
      edges.dispose()
    },
    [geo, edges],
  )

  useFrame(({ clock }, dt) => {
    const g = group.current
    if (!g) return
    const vis = sceneState.f < 2.4
    g.visible = vis
    if (!vis) return
    const reduced = useApp.getState().reducedMotion
    const t = clock.elapsedTime
    const r = easeOut(sceneState.reveal)
    g.scale.setScalar(0.8 + 0.2 * r + sceneState.pulse * 0.04)
    const sway = reduced ? 0 : Math.sin(t * 0.3) * 0.18
    // resting pose is a 3/4 view so the bevels and depth read immediately
    const ry = -0.58 + sceneState.mx * 0.38 + sway + Math.min(sceneState.f, 1.2) * 0.9
    const rx = 0.1 - sceneState.my * 0.16 + (reduced ? 0 : Math.sin(t * 0.4) * 0.04)
    g.rotation.y = MathUtils.damp(g.rotation.y, ry, 3, dt)
    g.rotation.x = MathUtils.damp(g.rotation.x, rx, 3, dt)
    g.position.y = reduced ? 0 : Math.sin(t * 0.6) * 0.12
  })

  return (
    <group ref={group}>
      <mesh geometry={geo} castShadow>
        <meshPhysicalMaterial
          color="#5a5f70"
          metalness={1}
          roughness={0.13}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={1.25}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#648cff" transparent opacity={0.35} toneMapped={false} />
      </lineSegments>
    </group>
  )
}
