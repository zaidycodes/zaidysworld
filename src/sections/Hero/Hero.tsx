import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { site } from '../../data/site'
import { useApp } from '../../store/app'
import { goTo } from '../../lib/curtain'
import { useClock } from '../../hooks/useClock'
import { Split } from '../../components/animations/Split'
import { Magnetic } from '../../components/animations/Magnetic'
import { Section } from '../../components/common/Section'

export function Hero() {
  const heroTitle = useApp((s) => s.heroTitle)
  const heroReady = useApp((s) => s.heroReady)
  const reduced = useApp((s) => s.reducedMotion)
  const ui = useRef<HTMLDivElement>(null)
  const time = useClock(site.timeZone)

  // Supporting UI comes in after the visitor enters the world.
  useEffect(() => {
    const el = ui.current
    if (!el || reduced) return
    const parts = el.querySelectorAll('[data-in]')
    if (!heroReady) {
      gsap.set(parts, { opacity: 0, y: 28 })
      return
    }
    const tw = gsap.to(parts, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, delay: 0.1 })
    return () => {
      tw.kill()
    }
  }, [heroReady, reduced])

  return (
    <Section id="home" labelledBy="hero-title" className="flex min-h-dvh flex-col">
      <div className="container-x flex flex-1 flex-col pb-8 pt-24 md:pb-12 md:pt-28">
        <div ref={ui} className="flex flex-1 flex-col">
          <div data-in className="flex items-start justify-between gap-6">
            <p className="eyebrow leading-relaxed">
              <span className="text-ink">{site.hero.status}</span>
              <br />
              {site.role}
            </p>
            <p className="eyebrow tnum hidden text-right leading-relaxed sm:block">
              {site.location}
              <br />
              <span className="text-ink">{time}</span> IST
            </p>
          </div>

          <div className="flex flex-1 items-center py-6">
            <h1 id="hero-title" className="m-0 w-full">
              <Split
                text="ZAID."
                trigger="manual"
                play={heroTitle}
                stagger={0.07}
                className="display hero-word block"
              />
              <span className="sr-only"> — developer, creator, builder, future founder</span>
            </h1>
          </div>

          <div className="grid items-end gap-8 md:grid-cols-12">
            <div data-in className="md:col-span-6 lg:col-span-5">
              <p className="lede mb-7 max-w-md">{site.hero.blurb}</p>
              <div className="flex flex-wrap gap-3">
                <Magnetic>
                  <button type="button" className="btn btn-primary" onClick={() => goTo('work')}>
                    Explore my work
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </Magnetic>
                <Magnetic>
                  <button type="button" className="btn" onClick={() => goTo('about')}>
                    About me
                  </button>
                </Magnetic>
              </div>
            </div>

            <div data-in className="hidden justify-self-end md:col-span-1 md:col-start-12 md:block">
              <button
                type="button"
                onClick={() => goTo('about')}
                className="eyebrow group flex min-h-11 flex-col items-center gap-3 text-ink"
                aria-label="Scroll to the next section"
              >
                <span>Scroll</span>
                <span className="relative block h-14 w-px overflow-hidden bg-[var(--line)]" aria-hidden="true">
                  <span className="absolute inset-0 bg-ink" style={{ animation: 'scroll-cue 2.2s var(--ease-expo) infinite' }} />
                </span>
                <ArrowDown size={14} aria-hidden="true" className="opacity-70" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
