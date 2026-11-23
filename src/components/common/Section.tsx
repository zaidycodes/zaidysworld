import type { ReactNode } from 'react'
import { Split } from '../animations/Split'
import { Reveal } from '../animations/Reveal'

interface SectionProps {
  id: string
  /** id of the heading inside, for aria-labelledby */
  labelledBy: string
  className?: string
  children: ReactNode
}

/** Landmark wrapper. tabIndex -1 lets navigation move focus here without adding a tab stop. */
export function Section({ id, labelledBy, className = '', children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      tabIndex={-1}
      className={`relative outline-none ${className}`}
    >
      {children}
    </section>
  )
}

interface SectionHeadProps {
  id: string
  num: string
  kicker: string
  headline: string | string[]
  lineClass?: (string | undefined)[]
  intro?: string
  className?: string
}

/** Numbered eyebrow + oversized headline, used by every section. */
export function SectionHead({ id, num, kicker, headline, lineClass, intro, className = '' }: SectionHeadProps) {
  return (
    <header className={className}>
      <Reveal>
        <p className="eyebrow mb-6 flex items-center gap-4">
          <span className="tnum">{num}</span>
          <span className="h-px w-10 bg-current opacity-40" aria-hidden="true" />
          <span>{kicker}</span>
        </p>
      </Reveal>
      <Split as="h2" id={id} text={headline} lineClass={lineClass} className="display h-section" />
      {intro ? (
        <Reveal delay={0.15}>
          <p className="lede mt-8">{intro}</p>
        </Reveal>
      ) : null}
    </header>
  )
}
