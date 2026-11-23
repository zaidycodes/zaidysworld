import { NAV } from '../data/sections'
import { useApp } from '../store/app'
import { scrollToSection } from './scroll'
import { sceneState } from './sceneState'
import { tick } from './audio'

type Runner = (label: string, mid: () => void) => void

/** Registered by the <Curtain /> overlay component. */
export const curtain: { run: Runner | null } = { run: null }

/**
 * Navigate to a section.
 *  smooth  → Lenis glide (side index, CTAs)
 *  curtain → full-screen wipe + instant jump (menu overlay)
 */
export function goTo(id: string, mode: 'smooth' | 'curtain' = 'smooth') {
  const reduced = useApp.getState().reducedMotion
  const item = NAV.find((n) => n.id === id)
  sceneState.pulse = 1
  tick(660)
  if (mode === 'curtain' && !reduced && curtain.run) {
    curtain.run(item ? `${item.num} — ${item.label}` : id, () => scrollToSection(id, true))
  } else {
    scrollToSection(id, reduced)
  }
}
