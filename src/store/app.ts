import { create } from 'zustand'
import { detectQuality, prefersReducedMotion, type Quality } from '../lib/device'

interface AppState {
  /** 'intro' while the cinematic opening is on screen, then 'world'. */
  phase: 'intro' | 'world'
  /** True once the WebGL canvas has mounted its first frame. */
  sceneReady: boolean
  /** Intro scene 3 has started: the hero wordmark may animate in. */
  heroTitle: boolean
  /** Visitor has entered the world: hero supporting UI may animate in. */
  heroReady: boolean
  /** Active NAV index (0-6). Only changes when the visitor crosses a section boundary. */
  activeNav: number
  menuOpen: boolean
  /** The light 'paper' section is under the fixed chrome (header / side index). */
  onPaper: boolean
  projectId: string | null
  secretOpen: boolean
  soundOn: boolean
  quality: Quality
  reducedMotion: boolean

  setPhase: (p: 'intro' | 'world') => void
  setSceneReady: (v: boolean) => void
  setHeroTitle: (v: boolean) => void
  setHeroReady: (v: boolean) => void
  setActiveNav: (n: number) => void
  setMenuOpen: (v: boolean) => void
  setOnPaper: (v: boolean) => void
  setProjectId: (id: string | null) => void
  setSecretOpen: (v: boolean) => void
  setSoundOn: (v: boolean) => void
  setQuality: (q: Quality) => void
}

export const useApp = create<AppState>((set) => ({
  phase: 'intro',
  sceneReady: false,
  heroTitle: false,
  heroReady: false,
  activeNav: 0,
  menuOpen: false,
  onPaper: false,
  projectId: null,
  secretOpen: false,
  soundOn: false,
  quality: detectQuality(),
  reducedMotion: prefersReducedMotion(),

  setPhase: (phase) => set({ phase }),
  setSceneReady: (sceneReady) => set({ sceneReady }),
  setHeroTitle: (heroTitle) => set({ heroTitle }),
  setHeroReady: (heroReady) => set({ heroReady }),
  setActiveNav: (activeNav) => set({ activeNav }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setOnPaper: (onPaper) => set({ onPaper }),
  setProjectId: (projectId) => set({ projectId }),
  setSecretOpen: (secretOpen) => set({ secretOpen }),
  setSoundOn: (soundOn) => set({ soundOn }),
  setQuality: (quality) => set({ quality }),
}))
