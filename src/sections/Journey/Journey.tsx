import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { journey } from '../../data/journey'
import type { Milestone } from '../../types'
import { useApp } from '../../store/app'
import { Section, SectionHead } from '../../components/common/Section'
import { Reveal } from '../../components/animations/Reveal'

gsap.registerPlugin(ScrollTrigger)

const STATE_LABEL: Record<Milestone['state'], string> = { past: 'Done', now: 'Now', next: 'Ahead' }

function Marker({ state }: { state: Milestone['state'] }) {
  return (
    <span aria-hidden="true" className="absolute -left-8 top-9 grid size-4 -translate-x-1/2 place-items-center md:-left-12">
      {state === 'now' && (
        <span className="absolute size-4 rounded-full bg-accent" style={{ animation: 'pulse-ring 2.4s var(--ease-soft) infinite' }} />
      )}
      <span
        className="relative block size-3 rounded-full border"
        style={{
          background: state === 'next' ? 'var(--color-obsidian)' : state === 'now' ? 'var(--color-accent)' : 'var(--color-ink)',
          borderColor: state === 'next' ? 'var(--color-mute)' : state === 'now' ? 'var(--color-accent)' : 'var(--color-ink)',
          borderStyle: state === 'next' ? 'dashed' : 'solid',
        }}
      />
    </span>
  )
}

/** Vertical timeline. The line fills with scroll while the camera walks the corridor behind it. */
export function Journey() {
  const root = useRef<HTMLOListElement>(null)
  const fill = useRef<HTMLDivElement>(null)
  const reduced = useApp((s) => s.reducedMotion)

  useLayoutEffect(() => {
    const list = root.current
    const line = fill.current
    if (!list || !line) return
    if (reduced) {
      gsap.set(line, { scaleY: 1 })
      return
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: { trigger: list, start: 'top 60%', end: 'bottom 60%', scrub: 0.5 },
        },
      )
    }, list)
    return () => ctx.revert()
  }, [reduced])

  return (
    <Section id="journey" labelledBy="journey-title" className="pb-40 pt-28 md:pt-44">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-obsidian/85 via-obsidian/20 to-transparent" aria-hidden="true" />
      <div className="container-x">
        <SectionHead
          id="journey-title"
          num="05"
          kicker="Journey"
          headline={['The story is', 'still being', 'written.']}
          lineClass={[undefined, undefined, 'serif-i']}
        />
        <Reveal delay={0.1}>
          <p className="lede mt-10">Only real milestones. The first chapters are short — that is the honest part of being at the start.</p>
        </Reveal>

        <ol ref={root} className="relative mt-24 max-w-3xl pl-8 md:pl-12">
          <div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-[var(--line)]" />
          <div ref={fill} aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px origin-top bg-accent" style={{ transform: 'scaleY(0)' }} />

          {journey.map((m) => (
            <li key={m.id} className="relative flex min-h-[34vh] items-center py-8 md:min-h-[40vh]">
              <Marker state={m.state} />
              <Reveal y={48} className="w-full">
                <article className="border border-[var(--line)] bg-obsidian/60 p-6 backdrop-blur-md md:p-8" style={{ borderStyle: m.state === 'next' ? 'dashed' : 'solid' }}>
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <p className="display tnum text-[clamp(1.5rem,3vw,2.6rem)] text-accent">{m.date}</p>
                    <span className="chip">{STATE_LABEL[m.state]}</span>
                  </div>
                  <h3 className="display text-[clamp(1.5rem,3.2vw,2.8rem)] leading-[0.95]">{m.title}</h3>
                  <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-ink/75">{m.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
