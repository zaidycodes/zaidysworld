import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { isFinePointer } from '../../lib/device'
import { useApp } from '../../store/app'

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

/** Pulls its child gently toward the cursor. Disabled on touch and for reduced motion. */
export function Magnetic({ children, strength = 0.32, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useApp((s) => s.reducedMotion)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || !isFinePointer()) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [reduced, strength])

  return (
    <div ref={ref} className={`inline-block ${className ?? ''}`}>
      {children}
    </div>
  )
}
