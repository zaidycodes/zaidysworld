import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SECTIONS } from '../data/sections'
import { useApp } from '../store/app'
import { sceneState } from './sceneState'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null
let tops: number[] = []
let docMax = 1
let cleanup: (() => void) | null = null

export const getLenis = () => lenis

/** Cache the document offset of every section (pin-spacers included). */
export function measureSections() {
  const sy = window.scrollY
  // Sections that aren't mounted yet inherit the document end so they never win the "active" test.
  const end = document.documentElement.scrollHeight
  tops = SECTIONS.map((s) => {
    const el = document.getElementById(s.id)
    return el ? el.getBoundingClientRect().top + sy : end
  })
  for (let i = 1; i < tops.length; i++) tops[i] = Math.max(tops[i], tops[i - 1])
  docMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
}

/** Translate raw scroll into the float section index used by the 3D camera rig. */
function onScroll(y: number, velocity: number) {
  const n = tops.length
  if (!n) return
  let f = 0
  if (y <= tops[0]) f = 0
  else if (y >= tops[n - 1]) {
    f = n - 1 + Math.min(1, (y - tops[n - 1]) / Math.max(1, docMax - tops[n - 1]))
  } else {
    for (let i = 0; i < n - 1; i++) {
      if (y >= tops[i] && y < tops[i + 1]) {
        f = i + (y - tops[i]) / Math.max(1, tops[i + 1] - tops[i])
        break
      }
    }
  }
  sceneState.f = f
  sceneState.progress = Math.min(1, Math.max(0, y / docMax))
  sceneState.velocity = velocity

  // Active nav index: section that owns the viewport's upper-middle.
  const probe = y + window.innerHeight * 0.45
  let cur = 0
  for (let i = 0; i < n; i++) if (tops[i] <= probe) cur = i
  const nav = SECTIONS[cur].nav
  if (useApp.getState().activeNav !== nav) useApp.getState().setActiveNav(nav)
}

export function initScroll(reduced: boolean) {
  if (lenis) return cleanup ?? (() => {})
  lenis = new Lenis({
    lerp: reduced ? 1 : 0.085,
    smoothWheel: !reduced,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.3,
  })
  const l = lenis
  l.on('scroll', (e: Lenis) => {
    ScrollTrigger.update()
    onScroll(e.scroll, e.velocity)
  })
  const raf = (time: number) => l.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  let rafId = 0
  const remeasure = () => {
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      measureSections()
      onScroll(window.scrollY, 0)
    })
  }
  const ro = new ResizeObserver(remeasure)
  ro.observe(document.body)
  window.addEventListener('resize', remeasure)
  ScrollTrigger.addEventListener('refresh', remeasure)
  remeasure()

  cleanup = () => {
    cancelAnimationFrame(rafId)
    ro.disconnect()
    window.removeEventListener('resize', remeasure)
    ScrollTrigger.removeEventListener('refresh', remeasure)
    gsap.ticker.remove(raf)
    l.destroy()
    lenis = null
    cleanup = null
  }
  return cleanup
}

export function lockScroll() {
  document.documentElement.classList.add('is-locked')
  lenis?.stop()
}
export function unlockScroll() {
  document.documentElement.classList.remove('is-locked')
  lenis?.start()
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

export function scrollToSection(id: string, immediate = false) {
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY
  if (lenis) {
    lenis.scrollTo(y, { immediate, duration: 1.6, easing: easeOutExpo, force: true })
  } else {
    window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' })
  }
  // Move keyboard / screen-reader focus with the visitor.
  el.focus({ preventScroll: true })
}
