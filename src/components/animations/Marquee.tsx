import type { ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  /** Seconds for one loop. */
  duration?: number
  className?: string
}

/** Seamless infinite ticker. Second copy is aria-hidden; paused entirely for reduced motion via CSS. */
export function Marquee({ children, duration = 40, className }: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className ?? ''}`}>
      <div className="marquee-track" style={{ ['--marquee-d' as string]: `${duration}s` }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
