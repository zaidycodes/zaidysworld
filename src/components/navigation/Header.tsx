import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Menu, Volume2, VolumeX } from 'lucide-react'
import { NAV } from '../../data/sections'
import { site } from '../../data/site'
import { useApp } from '../../store/app'
import { goTo } from '../../lib/curtain'
import { sceneState } from '../../lib/sceneState'
import { setAmbient } from '../../lib/audio'

/** Minimal top bar: wordmark · current location · sound · menu. Hidden until the visitor enters. */
export function Header() {
  const phase = useApp((s) => s.phase)
  const active = useApp((s) => s.activeNav)
  const soundOn = useApp((s) => s.soundOn)
  const setSoundOn = useApp((s) => s.setSoundOn)
  const menuOpen = useApp((s) => s.menuOpen)
  const setMenuOpen = useApp((s) => s.setMenuOpen)
  const onPaper = useApp((s) => s.onPaper)
  const bar = useRef<HTMLDivElement>(null)
  const current = NAV[active]

  // Scroll progress hairline, updated on GSAP's ticker (no React state).
  useEffect(() => {
    const el = bar.current
    if (!el) return
    const setX = gsap.quickSetter(el, 'scaleX')
    const tick = () => setX(sceneState.progress)
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  const toggleSound = () => {
    const next = !soundOn
    setSoundOn(next)
    setAmbient(next)
  }

  const visible = phase === 'world'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-opacity duration-700 ${onPaper ? 'on-paper' : ''}`}
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
      aria-hidden={!visible}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 md:h-28"
        style={{ background: onPaper ? 'linear-gradient(#f2f2f0 0%, #f2f2f0f5 45%, #f2f2f000 100%)' : 'linear-gradient(#050506 0%, #050506f2 50%, #05050600 100%)' }}
      />
      <div ref={bar} aria-hidden="true" className="absolute left-0 top-0 h-px w-full origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
      <div className="container-x relative flex h-16 items-center justify-between md:h-20">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            goTo('home')
          }}
          className="font-display text-sm font-bold uppercase tracking-[0.08em] text-ink"
          aria-label={`${site.brand} — back to top`}
          tabIndex={visible ? 0 : -1}
        >
          ZAID<span className="text-accent">.</span>WORLD
        </a>

        <p className="eyebrow hidden items-center gap-3 md:flex" aria-live="off">
          <span className="tnum text-accent">{current.num}</span>
          <span className="h-px w-6 bg-current opacity-40" aria-hidden="true" />
          <span className="text-ink">{current.label}</span>
        </p>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? 'Turn ambient sound off' : 'Turn ambient sound on'}
            tabIndex={visible ? 0 : -1}
            className="grid size-11 place-items-center text-ink transition-colors hover:text-accent"
          >
            {soundOn ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            tabIndex={visible ? 0 : -1}
            className="eyebrow group inline-flex min-h-11 items-center gap-3 border border-[var(--line-strong)] px-4 text-ink transition-colors hover:border-ink"
          >
            <span>Menu</span>
            <Menu size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}
