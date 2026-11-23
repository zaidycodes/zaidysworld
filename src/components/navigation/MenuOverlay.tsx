import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowUpRight, X } from 'lucide-react'
import { NAV } from '../../data/sections'
import { site } from '../../data/site'
import { socials } from '../../data/socials'
import { useApp } from '../../store/app'
import { goTo } from '../../lib/curtain'
import { lockScroll, unlockScroll } from '../../lib/scroll'
import { useFocusTrap } from '../../hooks/useFocusTrap'

/** Fullscreen navigation. Clip-path reveal, staggered items, focus trap, Esc to close. */
export function MenuOverlay() {
  const open = useApp((s) => s.menuOpen)
  const setOpen = useApp((s) => s.setMenuOpen)
  const active = useApp((s) => s.activeNav)
  const reduced = useApp((s) => s.reducedMotion)
  const [mounted, setMounted] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)

  useFocusTrap(root, mounted, closeBtn)

  useEffect(() => {
    const el = root.current
    if (open) {
      setMounted(true)
      lockScroll()
    }
    if (!el) return
    const items = el.querySelectorAll('[data-item]')
    if (open) {
      gsap.killTweensOf([el, items])
      if (reduced) {
        gsap.set(el, { clipPath: 'inset(0 0 0 0)', visibility: 'visible' })
        gsap.set(items, { opacity: 1, y: 0 })
        return
      }
      gsap.set(el, { visibility: 'visible' })
      gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'expo.inOut' })
      gsap.fromTo(items, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.06, delay: 0.35 })
    } else if (mounted) {
      gsap.killTweensOf([el, items])
      const done = () => {
        gsap.set(el, { visibility: 'hidden' })
        setMounted(false)
        // projects may still hold the scroll lock
        if (!useApp.getState().projectId && useApp.getState().phase === 'world') unlockScroll()
      }
      if (reduced) done()
      else gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.7, ease: 'expo.inOut', onComplete: done })
    }
  }, [open, reduced, mounted])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  const choose = (id: string) => {
    setOpen(false)
    // let the menu start closing, then run the curtain transition
    window.setTimeout(() => goTo(id, 'curtain'), reduced ? 0 : 260)
  }

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!open}
      inert={!open ? true : undefined}
      className="fixed inset-0 z-[80] flex flex-col bg-obsidian"
      style={{ visibility: 'hidden', clipPath: 'inset(0 0 100% 0)' }}
    >
      <div className="container-x flex h-16 shrink-0 items-center justify-between md:h-20">
        <p className="eyebrow">Navigate</p>
        <button
          ref={closeBtn}
          type="button"
          onClick={() => setOpen(false)}
          className="eyebrow inline-flex min-h-11 items-center gap-3 border border-[var(--line-strong)] px-4 text-ink hover:border-ink"
        >
          Close
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Main" className="container-x flex flex-1 flex-col justify-center overflow-y-auto py-4">
        <ol className="flex flex-col">
          {NAV.map((n, i) => {
            const dim = hover !== null && hover !== i
            return (
              <li key={n.id} className="hairline-b overflow-hidden first:border-t first:border-t-[var(--line)]">
                <a
                  data-item
                  href={`#${n.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    choose(n.id)
                  }}
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-current={active === i ? 'true' : undefined}
                  className="group flex min-h-14 items-baseline gap-4 py-2 transition-opacity duration-500 md:gap-8 md:py-2 [@media(min-height:820px)]:md:py-3"
                  style={{ opacity: dim ? 0.28 : 1 }}
                >
                  <span className="eyebrow tnum w-8 shrink-0 text-accent md:w-12">{n.num}</span>
                  <span className="display text-[clamp(2.1rem,min(7.4vw,9.2vh),6.2rem)] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-3 group-focus-visible:translate-x-3 md:group-hover:translate-x-6">
                    {n.label}
                  </span>
                  <span className="eyebrow ml-auto hidden text-right md:block">{n.hint}</span>
                  <ArrowUpRight size={22} aria-hidden="true" className="hidden shrink-0 self-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block" />
                </a>
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="container-x flex shrink-0 flex-wrap items-center justify-between gap-4 pb-6 pt-4 md:pb-8">
        <p className="eyebrow">
          {site.brand} · {site.tagline}
        </p>
        <ul className="flex gap-5">
          {socials.map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="eyebrow link-u inline-flex min-h-11 items-center text-ink">
                {s.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
