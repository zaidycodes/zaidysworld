import { useEffect } from 'react'
import { useApp } from '../store/app'

const SEQ = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

/**
 * ↑ ↑ ↓ ↓ ← → ← → B A  — opens the secret room.
 * Passive: never prevents default, ignores form fields and any modifier combo, so it can't
 * collide with browser, OS or assistive-technology shortcuts.
 */
export function useKonami() {
  useEffect(() => {
    let i = 0
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (k === SEQ[i]) {
        i++
        if (i === SEQ.length) {
          i = 0
          useApp.getState().setSecretOpen(true)
        }
      } else {
        i = k === SEQ[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
