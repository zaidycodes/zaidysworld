import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { isFinePointer } from '../../lib/device'
import { useApp } from '../../store/app'

/**
 * Subtle custom cursor: a dot and a lagging ring.
 * Elements can opt in to a labelled state with data-cursor="VIEW".
 * Only mounted on (hover:hover) and (pointer:fine) — touch keeps the native cursor.
 */
export function Cursor() {
  const [enabled] = useState(() => isFinePointer())
  const reduced = useApp((s) => s.reducedMotion)
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!enabled) return
    const d = dot.current
    const r = ring.current
    const l = label.current
    if (!d || !r || !l) return

    document.documentElement.classList.add('has-cursor')
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 })

    const dx = gsap.quickTo(d, 'x', { duration: 0.08, ease: 'none' })
    const dy = gsap.quickTo(d, 'y', { duration: 0.08, ease: 'none' })
    const rx = gsap.quickTo(r, 'x', { duration: reduced ? 0.01 : 0.5, ease: 'power3.out' })
    const ry = gsap.quickTo(r, 'y', { duration: reduced ? 0.01 : 0.5, ease: 'power3.out' })

    let visible = false
    const show = () => {
      if (visible) return
      visible = true
      gsap.to([d, r], { opacity: 1, duration: 0.3 })
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      show()
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const hide = () => {
      visible = false
      gsap.to([d, r], { opacity: 0, duration: 0.3 })
    }

    const setState = (kind: 'idle' | 'link' | 'label', text = '') => {
      l.textContent = text
      if (kind === 'label') {
        gsap.to(r, { scale: 2.3, backgroundColor: '#648cff', borderColor: '#648cff', duration: 0.5, ease: 'expo.out' })
        gsap.to(l, { opacity: 1, scale: 1 / 2.3, duration: 0.4 })
        gsap.to(d, { scale: 0, duration: 0.3 })
      } else if (kind === 'link') {
        gsap.to(r, { scale: 1.5, backgroundColor: 'rgba(100,140,255,0)', borderColor: '#648cff', duration: 0.4, ease: 'expo.out' })
        gsap.to(l, { opacity: 0, duration: 0.2 })
        gsap.to(d, { scale: 1, duration: 0.3 })
      } else {
        gsap.to(r, { scale: 1, backgroundColor: 'rgba(100,140,255,0)', borderColor: 'rgba(242,242,240,0.55)', duration: 0.4, ease: 'expo.out' })
        gsap.to(l, { opacity: 0, duration: 0.2 })
        gsap.to(d, { scale: 1, duration: 0.3 })
      }
    }

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (!t || !t.closest) return
      const lab = t.closest<HTMLElement>('[data-cursor]')
      if (lab) return setState('label', lab.dataset.cursor)
      if (t.closest('a,button,[role="button"],summary,input,textarea,select,label')) return setState('link')
      setState('idle')
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('mouseover', over, { passive: true })
    document.documentElement.addEventListener('mouseleave', hide)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('mouseover', over)
      document.documentElement.removeEventListener('mouseleave', hide)
      document.documentElement.classList.remove('has-cursor')
      gsap.killTweensOf([d, r, l])
    }
  }, [enabled, reduced])

  if (!enabled) return null
  return (
    <>
      <div
        ref={ring}
        aria-hidden="true"
        className="cursor-ring flex items-center justify-center rounded-full"
        style={{ width: 38, height: 38, border: '1px solid rgba(242,242,240,0.55)' }}
      >
        <span
          ref={label}
          className="font-ui text-[9px] font-extrabold uppercase tracking-[0.14em] text-obsidian opacity-0"
        />
      </div>
      <div
        ref={dot}
        aria-hidden="true"
        className="cursor-dot rounded-full bg-ink"
        style={{ width: 6, height: 6 }}
      />
    </>
  )
}
