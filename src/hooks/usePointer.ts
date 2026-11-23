import { useEffect } from 'react'
import { sceneState } from '../lib/sceneState'

/** Normalised pointer (-1…1) → sceneState. Written outside React: no re-renders. */
export function usePointer() {
  useEffect(() => {
    const move = (e: PointerEvent) => {
      sceneState.mx = (e.clientX / window.innerWidth) * 2 - 1
      sceneState.my = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
}
