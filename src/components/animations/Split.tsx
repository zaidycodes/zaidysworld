import { useLayoutEffect, useRef, type CSSProperties, type ElementType } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../../store/app'

gsap.registerPlugin(ScrollTrigger)

interface SplitProps {
  id?: string
  /** One string, or an array where each entry is its own line. */
  text: string | string[]
  as?: ElementType
  className?: string
  style?: CSSProperties
  /** `scroll` plays when scrolled into view, `manual` plays when `play` becomes true. */
  trigger?: 'scroll' | 'manual'
  play?: boolean
  delay?: number
  stagger?: number
  start?: string
  /** Optional per-line class names (e.g. to italicise one line in serif). */
  lineClass?: (string | undefined)[]
}

/**
 * Masked per-character reveal. The accessible name lives on the wrapper;
 * the animated spans are aria-hidden so screen readers read the sentence once.
 */
export function Split({
  id,
  text,
  as: Tag = 'span',
  className,
  style,
  trigger = 'scroll',
  play = true,
  delay = 0,
  stagger = 0.032,
  start = 'top 88%',
  lineClass,
}: SplitProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useApp((s) => s.reducedMotion)
  const lines = Array.isArray(text) ? text : [text]
  const label = lines.join(' ')
  const tl = useRef<gsap.core.Tween | null>(null)
  const st = useRef<ScrollTrigger | null>(null)

  // Hide before first paint, then reveal.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const chars = el.querySelectorAll('.split-char')
    gsap.set(chars, { yPercent: 118 })

    const run = () => {
      tl.current = gsap.to(chars, {
        yPercent: 0,
        duration: 1.15,
        ease: 'expo.out',
        stagger: { each: stagger, from: 'start' },
        delay,
      })
    }
    if (trigger === 'scroll') {
      st.current = ScrollTrigger.create({ trigger: el, start, once: true, onEnter: run })
    }
    return () => {
      st.current?.kill()
      tl.current?.kill()
      gsap.set(chars, { clearProps: 'transform' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, label])

  useLayoutEffect(() => {
    if (trigger !== 'manual' || !play || reduced) return
    const el = ref.current
    if (!el) return
    const chars = el.querySelectorAll('.split-char')
    tl.current = gsap.to(chars, {
      yPercent: 0,
      duration: 1.2,
      ease: 'expo.out',
      stagger: { each: stagger, from: 'start' },
      delay,
    })
    return () => {
      tl.current?.kill()
    }
  }, [play, trigger, reduced, delay, stagger])

  return (
    <Tag ref={ref} id={id} className={className} style={style}>
      <span className="sr-only">{label}</span>
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" className={`block ${lineClass?.[li] ?? ''}`}>
          {line.split(' ').map((word, wi, arr) => (
            <span key={wi}>
              <span className="split-word">
                {Array.from(word).map((ch, ci) => (
                  <span key={ci} className="split-char">
                    {ch}
                  </span>
                ))}
              </span>
              {wi < arr.length - 1 ? ' ' : null}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
