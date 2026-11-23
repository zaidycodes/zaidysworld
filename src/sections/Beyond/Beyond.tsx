import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { beyond } from '../../data/beyond'
import { useApp } from '../../store/app'
import { Split } from '../../components/animations/Split'
import { Reveal } from '../../components/animations/Reveal'
import { Marquee } from '../../components/animations/Marquee'
import { Motif } from './Motifs'

gsap.registerPlugin(ScrollTrigger)

/**
 * A deliberate change of world: soft paper, serif display, editorial rows.
 * While this section is under the header, the fixed chrome flips to dark ink (store.onPaper).
 */
export function Beyond() {
  const root = useRef<HTMLElement>(null)
  const reduced = useApp((s) => s.reducedMotion)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 44px',
        end: 'bottom 44px',
        onToggle: (self) => useApp.getState().setOnPaper(self.isActive),
      })
      if (!reduced) {
        // paper unfurls as it arrives
        gsap.fromTo(
          el,
          { clipPath: 'inset(7vh 4vw 0 4vw)' },
          {
            clipPath: 'inset(0vh 0vw 0 0vw)',
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 100%', end: 'top 30%', scrub: true },
          },
        )
      }
    }, el)
    return () => {
      ctx.revert()
      useApp.getState().setOnPaper(false)
    }
  }, [reduced])

  return (
    <section
      ref={root}
      id="beyond"
      aria-labelledby="beyond-title"
      tabIndex={-1}
      className="paper relative z-20 overflow-hidden py-28 outline-none md:py-44"
    >
      <div className="container-x">
        <Reveal>
          <p className="eyebrow mb-8 flex items-center gap-4">
            <span className="tnum">06</span>
            <span className="h-px w-10 bg-current opacity-40" aria-hidden="true" />
            <span>Beyond code</span>
          </p>
        </Reveal>

        <Split
          as="h2"
          id="beyond-title"
          text={beyond.headline}
          lineClass={[undefined, 'serif-i']}
          className="serif text-[clamp(3.4rem,12.5vw,13rem)] leading-[0.88] tracking-[-0.035em]"
        />
        <Reveal delay={0.1}>
          <p className="mt-10 max-w-md text-[1.15rem] leading-relaxed text-paper-mute">{beyond.lede}</p>
        </Reveal>

        <ol className="mt-20 md:mt-32">
          {beyond.chapters.map((c, i) => (
            <li key={c.id} className="group/row border-t border-paper-ink/20 last:border-b">
              <Reveal y={40}>
                <article
                  tabIndex={0}
                  aria-label={`${c.title}. ${c.line}`}
                  className="group relative grid items-center gap-x-8 gap-y-4 py-9 outline-offset-[-3px] md:grid-cols-12 md:py-12"
                >
                  <p className="eyebrow tnum md:col-span-1">0{i + 1}</p>
                  <h3 className="serif text-[clamp(2.6rem,7.2vw,7rem)] leading-[0.9] transition-all duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3 group-hover:italic group-focus-visible:translate-x-3 group-focus-visible:italic md:col-span-6">
                    {c.title}
                  </h3>
                  <p className="max-w-sm text-[1.02rem] leading-relaxed text-paper-mute md:col-span-4">{c.line}</p>
                  <div className="beyond-motif text-paper-ink md:col-span-1 md:justify-self-end">
                    <Motif kind={c.motif} />
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-24 border-y border-paper-ink/20 py-5 md:mt-36">
        <p className="sr-only">Interests: {beyond.marquee.join(', ')}.</p>
        <Marquee duration={36} className="select-none">
          {beyond.marquee.map((w) => (
            <span key={w} aria-hidden="true" className="serif-i flex items-center gap-10 whitespace-nowrap pr-10 text-[clamp(2rem,5vw,4.5rem)]">
              {w}
              <span className="size-2 rounded-full bg-paper-ink" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
