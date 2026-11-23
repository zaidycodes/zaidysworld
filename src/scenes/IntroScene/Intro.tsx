import { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowRight, SkipForward } from 'lucide-react'
import { site } from '../../data/site'
import { useApp } from '../../store/app'
import { sceneState } from '../../lib/sceneState'
import { lockScroll, unlockScroll } from '../../lib/scroll'
import { Magnetic } from '../../components/animations/Magnetic'

/**
 * Cinematic opening.
 *  1 · black + "EVERYTHING STARTS WITH AN IDEA." while particles emerge
 *  2 · the monolith emerges from darkness
 *  3 · hero wordmark + roles + statement
 *  4 · ENTER MY WORLD
 * A persistent Skip button and Esc always work; reduced-motion jumps straight to the final frame.
 */
export function Intro() {
  const phase = useApp((s) => s.phase)
  const reduced = useApp((s) => s.reducedMotion)
  const root = useRef<HTMLDivElement>(null)
  const bg = useRef<HTMLDivElement>(null)
  const idea = useRef<HTMLParagraphElement>(null)
  const loader = useRef<HTMLDivElement>(null)
  const roles = useRef<HTMLUListElement>(null)
  const statement = useRef<HTMLParagraphElement>(null)
  const enter = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const done = useRef(false)

  const finish = useCallback((instant: boolean) => {
    if (done.current) return
    done.current = true
    tl.current?.kill()
    const st = useApp.getState()
    const el = root.current
    const complete = () => {
      sceneState.reveal = 1
      sceneState.particles = 1
      st.setHeroTitle(true)
      st.setPhase('world')
      st.setHeroReady(true)
      unlockScroll()
    }
    if (!el || instant) {
      complete()
      return
    }
    // exit: copy lifts away, world takes over
    gsap
      .timeline({ onComplete: complete })
      .to([roles.current, statement.current, enter.current], {
        yPercent: -30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.in',
        stagger: 0.05,
      })
      .to(el, { opacity: 0, duration: 0.4, ease: 'power1.out' }, '-=0.25')
  }, [])

  useEffect(() => {
    const st = useApp.getState()
    const hashLink = window.location.hash.startsWith('#work/')
    lockScroll()

    // Deep link into a project → don't make the visitor sit through the intro.
    if (hashLink) {
      sceneState.reveal = 1
      sceneState.particles = 1
      done.current = true
      st.setHeroTitle(true)
      st.setPhase('world')
      st.setHeroReady(true)
      unlockScroll()
      return
    }

    const bgEl = bg.current
    const q = (n: Element | null) => (n ? Array.from(n.children) : [])
    if (reduced) {
      // Collapse to the final frame; one click to enter.
      gsap.set(bgEl, { opacity: 0 })
      gsap.set(idea.current, { opacity: 0 })
      sceneState.reveal = 1
      sceneState.particles = 1
      st.setHeroTitle(true)
      return
    }

    gsap.set([roles.current && q(roles.current), statement.current, enter.current], { opacity: 0 })
    gsap.set(idea.current?.querySelectorAll('.split-char') ?? [], { yPercent: 120 })

    const t = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.current = t

    // SCENE 1 — black, one line of text, particles surface
    t.to(idea.current?.querySelectorAll('.split-char') ?? [], { yPercent: 0, duration: 1.1, stagger: 0.028, ease: 'expo.out' }, 0.35)
    t.to(sceneState, { particles: 1, duration: 4.2, ease: 'power1.inOut' }, 0.6)

    // Gate: hold on the black frame until the lazy 3D chunk has painted (never longer than ~4.6s).
    // A thin loader appears only when we actually have to wait.
    t.addPause(2.4, () => {
      const s = useApp.getState()
      if (s.sceneReady || s.quality === 'none') {
        t.resume()
        return
      }
      gsap.to(loader.current, { opacity: 1, duration: 0.4 })
      const started = performance.now()
      const poll = window.setInterval(() => {
        const c = useApp.getState()
        if (c.sceneReady || c.quality === 'none' || done.current || performance.now() - started > 4600) {
          window.clearInterval(poll)
          gsap.to(loader.current, { opacity: 0, duration: 0.3 })
          if (!done.current) t.resume()
        }
      }, 120)
    })

    // SCENE 2 — the monolith emerges from darkness
    t.to(idea.current, { opacity: 0, duration: 0.8, ease: 'power2.in' }, 3.1)
    t.to(bgEl, { opacity: 0, duration: 2.0, ease: 'power2.inOut' }, 3.2)
    t.to(sceneState, { reveal: 1, duration: 3.2, ease: 'power2.inOut' }, 3.3)

    // SCENE 3 — brand reveal (hero wordmark is real page content; roles + statement are intro copy)
    t.call(() => useApp.getState().setHeroTitle(true), [], 5.0)
    t.to(q(roles.current), { opacity: 1, y: 0, duration: 0.9, stagger: 0.16 }, 5.9)
    t.fromTo(statement.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1 }, 6.6)

    // SCENE 4 — enter
    t.fromTo(enter.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, 7.4)

    return () => {
      t.kill()
    }
    // intentionally run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Esc skips; Enter/Space on the button is native.
  useEffect(() => {
    if (phase !== 'intro') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, finish])

  if (phase === 'world') return null

  return (
    <div ref={root} className="fixed inset-0 z-[90] flex flex-col" role="dialog" aria-label="Introduction" aria-modal="false">
      {/* scene 1 backdrop: pure black, fades away in scene 2 */}
      <div ref={bg} aria-hidden="true" className="absolute inset-0 bg-obsidian" />

      <div className="relative flex items-start justify-between p-4 md:p-10">
        <p className="eyebrow">{site.brand}</p>
        <button
          type="button"
          onClick={() => finish(true)}
          className="eyebrow group inline-flex min-h-11 items-center gap-2 border border-[var(--line)] px-4 text-ink transition-colors hover:border-ink focus-visible:border-ink"
        >
          Skip intro
          <SkipForward size={14} aria-hidden="true" />
        </button>
      </div>

      {/* SCENE 1 text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
        <p
          ref={idea}
          className="font-ui text-[0.78rem] font-semibold uppercase tracking-[0.34em] text-ink md:text-sm"
        >
          <span className="sr-only">{site.intro.idea}</span>
          <span aria-hidden="true" className="inline">
            {site.intro.idea.split(' ').map((w, wi, a) => (
              <span key={wi}>
                <span className="split-word">
                  {Array.from(w).map((c, ci) => (
                    <span key={ci} className="split-char">
                      {c}
                    </span>
                  ))}
                </span>
                {wi < a.length - 1 ? ' ' : null}
              </span>
            ))}
          </span>
        </p>
      </div>

      {/* thin loader — only ever shown if the 3D chunk is slow */}
      <div ref={loader} aria-hidden="true" className="absolute bottom-10 left-1/2 w-40 -translate-x-1/2 opacity-0">
        <div className="h-px w-full overflow-hidden bg-[var(--line)]">
          <div className="h-full w-1/3 bg-accent" style={{ animation: 'marquee 1.2s linear infinite' }} />
        </div>
      </div>

      {/* SCENES 3 + 4 — copy under the hero wordmark */}
      <div className="container-x pointer-events-none relative mt-auto pb-8 md:pb-14">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <ul
              ref={roles}
              aria-label="Roles"
              className="display flex flex-wrap gap-x-5 gap-y-1 text-[clamp(1.05rem,2.3vw,1.9rem)] leading-tight tracking-tight"
            >
              {site.intro.roles.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p ref={statement} className="font-ui mt-5 max-w-xl text-[0.78rem] font-semibold uppercase leading-[1.7] tracking-[0.14em] text-ink/80 md:text-[0.82rem]">
              {site.intro.statement[0]}
              <br />
              {site.intro.statement[1]}
            </p>
          </div>
          <div ref={enter} className="pointer-events-auto md:col-span-5 md:justify-self-end">
            <Magnetic>
              <button type="button" onClick={() => finish(false)} className="btn btn-primary min-h-14 px-8" data-cursor="">
                <span aria-hidden="true">[</span>
                Enter my world
                <ArrowRight size={16} aria-hidden="true" />
                <span aria-hidden="true">]</span>
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </div>
  )
}
