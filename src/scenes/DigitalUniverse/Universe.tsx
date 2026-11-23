import { Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Fog } from 'three'
import { sceneState } from '../../lib/sceneState'
import { useApp } from '../../store/app'
import { CameraRig } from './CameraRig'
import { Lights } from './Lights'
import { Monolith } from './Monolith'
import { AbstractWorld } from './AbstractWorld'
import { Corridor } from './Corridor'
import { Eclipse } from './Eclipse'
import { InteractiveDust, Stars } from './Particles'

/** Decays one-shot pulses so interactions glow and settle without React state. */
function Ticker() {
  useFrame((_, dt) => {
    sceneState.pulse *= Math.pow(0.04, dt)
    if (sceneState.pulse < 0.001) sceneState.pulse = 0
  })
  return null
}

/** One persistent canvas for the whole site; the camera travels between four worlds. */
export default function Universe({ quality }: { quality: 'high' | 'low' }) {
  const high = quality === 'high'
  return (
    <Canvas
      dpr={high ? [1, 1.75] : [1, 1.25]}
      shadows={high}
      gl={{ antialias: high, alpha: false, powerPreference: 'high-performance' }}
      camera={{ fov: 42, near: 0.1, far: 400, position: [0, 0.3, 9.8] }}
      style={{ position: 'absolute', inset: 0 }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor('#050506')
        scene.fog = new Fog('#050506', 10, 82)
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          useApp.getState().setQuality('none')
        })
        useApp.getState().setSceneReady(true)
      }}
    >
      <Suspense fallback={null}>
        <Lights high={high} />
        <CameraRig />
        <Ticker />
        <Stars count={high ? 2200 : 850} />
        <InteractiveDust count={high ? 700 : 260} />
        <Monolith />
        <AbstractWorld high={high} />
        <Corridor high={high} />
        <Eclipse high={high} />
      </Suspense>
    </Canvas>
  )
}
