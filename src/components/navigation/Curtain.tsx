import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { curtain } from '../../lib/curtain'

const COLS = 5

/** Full-screen section transition: columns sweep in, the page jumps underneath, columns sweep out. */
export function Curtain() {
  const root = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLParagraphElement>(null)
  const busy = useRef(false)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const cols = Array.from(el.querySelectorAll<HTMLElement>('[data-col]'))
    gsap.set(el, { visibility: 'hidden' })
    gsap.set(cols, { scaleY: 0, transformOrigin: 'bottom' })

    curtain.run = (text, mid) => {
      if (busy.current) {
        mid()
        return
      }
      busy.current = true
      if (label.current) label.current.textContent = text
      gsap.set(el, { visibility: 'visible' })
      gsap
        .timeline({
          onComplete: () => {
            gsap.set(el, { visibility: 'hidden' })
            busy.current = false
          },
        })
        .set(cols, { transformOrigin: 'bottom' })
        .to(cols, { scaleY: 1, duration: 0.55, ease: 'expo.inOut', stagger: 0.05 })
        .fromTo(label.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }, '-=0.2')
        .call(mid)
        .to(label.current, { opacity: 0, duration: 0.25 }, '+=0.2')
        .set(cols, { transformOrigin: 'top' })
        .to(cols, { scaleY: 0, duration: 0.6, ease: 'expo.inOut', stagger: 0.05 }, '-=0.05')
    }
    return () => {
      curtain.run = null
      gsap.killTweensOf([el, label.current, ...cols])
    }
  }, [])

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] flex">
      {Array.from({ length: COLS }, (_, i) => (
        <div key={i} data-col className="h-full flex-1 bg-charcoal" style={{ borderRight: i < COLS - 1 ? '1px solid rgba(242,242,240,0.06)' : 'none' }} />
      ))}
      <p ref={label} className="display absolute inset-0 flex items-center justify-center px-6 text-center text-[clamp(1.6rem,5vw,3.5rem)] text-ink opacity-0" />
    </div>
  )
}
