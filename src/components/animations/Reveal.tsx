import { useLayoutEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../../store/app'

gsap.registerPlugin(ScrollTrigger)

interface RevealProps {
  children: ReactNode
  as?: ElementType
  className?: string
  style?: CSSProperties
  delay?: number
  y?: number
  start?: string
}

/** Fade + rise on scroll. Content stays fully visible when motion is reduced. */
export function Reveal({
  children,
  as: Tag = 'div',
  className,
  style,
  delay = 0,
  y = 36,
  start = 'top 90%',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useApp((s) => s.reducedMotion)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    gsap.set(el, { opacity: 0, y })
    let tween: gsap.core.Tween | null = null
    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        tween = gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', delay })
      },
    })
    return () => {
      st.kill()
      tween?.kill()
      gsap.set(el, { clearProps: 'opacity,transform' })
    }
  }, [reduced, delay, y, start])

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  )
}
