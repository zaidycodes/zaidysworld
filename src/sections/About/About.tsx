import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Plus } from 'lucide-react'
import { site } from '../../data/site'
import { useApp } from '../../store/app'
import { Section, SectionHead } from '../../components/common/Section'
import { Reveal } from '../../components/animations/Reveal'
import { Marquee } from '../../components/animations/Marquee'

gsap.registerPlugin(ScrollTrigger)

/** Words brighten as the visitor reads — scroll-scrubbed, content fully readable when motion is reduced. */
function ScrubParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useApp((s) => s.reducedMotion)
  const words = useMemo(() => text.split(' '), [text])

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      const w = el.querySelectorAll('.w')
      gsap.set(w, { opacity: 0.38 })
      gsap.to(w, {
        opacity: 1,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: 0.6 },
      })
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <p ref={ref} className="max-w-3xl text-[clamp(1.35rem,2.7vw,2.5rem)] font-medium leading-[1.22] tracking-[-0.02em]">
      {words.map((w, i) => (
        <span key={i} className="w inline-block">
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}

function Principle({
  index,
  title,
  text,
  open,
  onToggle,
}: {
  index: number
  title: string
  text: string
  open: boolean
  onToggle: () => void
}) {
  const uid = useId()
  return (
    <li className="hairline-b first:border-t first:border-t-[var(--line)]">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${uid}-panel`}
          id={`${uid}-btn`}
          onClick={onToggle}
          className="group flex min-h-20 w-full items-center gap-5 py-5 text-left"
        >
          <span className="eyebrow tnum w-8 shrink-0 text-accent">0{index + 1}</span>
          <span className="display flex-1 text-[clamp(1.7rem,4vw,3.4rem)] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2">
            {title}
          </span>
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center border border-[var(--line-strong)] transition-all duration-500 group-hover:border-ink"
            style={{ transform: open ? 'rotate(45deg)' : 'none' }}
          >
            <Plus size={18} />
          </span>
        </button>
      </h3>
      <div
        id={`${uid}-panel`}
        role="region"
        aria-labelledby={`${uid}-btn`}
        className="grid transition-[grid-template-rows] duration-700 ease-[var(--ease-expo)]"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="max-w-xl pb-7 pl-[3.25rem] text-[1.02rem] leading-[1.7] text-ink/75">{text}</p>
        </div>
      </div>
    </li>
  )
}

export function About() {
  const a = site.about
  const [open, setOpen] = useState(0)

  return (
    <Section id="about" labelledBy="about-title" className="py-28 md:py-44">
      {/* keeps copy legible while the monolith sits on the right */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian/85 via-obsidian/55 to-transparent lg:from-obsidian/70 lg:via-obsidian/25" aria-hidden="true" />

      <div className="container-x">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHead
              id="about-title"
              num="02"
              kicker="About"
              headline={a.headline}
              lineClass={[undefined, undefined, 'serif-i']}
            />

            <div className="mt-16 md:mt-24">
              <ScrubParagraph text={a.statement} />
            </div>

            <ul className="mt-20 md:mt-28" aria-label="Principles">
              {a.principles.map((p, i) => (
                <Principle
                  key={p.id}
                  index={i}
                  title={p.title}
                  text={p.text}
                  open={open === i}
                  onToggle={() => setOpen(open === i ? -1 : i)}
                />
              ))}
            </ul>

            <Reveal className="mt-20 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3">
              {[
                ['Studying', `${site.role}`],
                ['Years', site.period],
                ['Based in', site.location],
              ].map(([k, v]) => (
                <div key={k} className="bg-obsidian/80 p-6 backdrop-blur-sm">
                  <p className="eyebrow mb-3">{k}</p>
                  <p className="text-[1.05rem] leading-snug">{v}</p>
                </div>
              ))}
            </Reveal>

            <Reveal className="mt-14 max-w-xl">
              <p className="eyebrow mb-4">The long game</p>
              <p className="text-[1.1rem] leading-[1.65] text-ink/85">{a.ambition}</p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* what is happening right now */}
      <div className="mt-24 md:mt-36 hairline-t hairline-b bg-obsidian/60 py-5 backdrop-blur-sm">
        <p className="sr-only">Right now: {a.now.join('; ')}.</p>
        <Marquee duration={46} className="select-none">
          {a.now.map((n) => (
            <span key={n} className="display flex items-center gap-8 whitespace-nowrap pr-8 text-[clamp(1.2rem,2.4vw,2rem)] text-ink/90" aria-hidden="true">
              {n}
              <span className="size-2 rotate-45 bg-accent" />
            </span>
          ))}
        </Marquee>
      </div>
    </Section>
  )
}
