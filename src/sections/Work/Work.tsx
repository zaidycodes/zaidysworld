import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '../../data/projects'
import { isFinePointer } from '../../lib/device'
import { openProject } from '../../lib/project'
import { sceneState } from '../../lib/sceneState'
import { goTo } from '../../lib/curtain'
import { useApp } from '../../store/app'
import { Section, SectionHead } from '../../components/common/Section'
import { Reveal } from '../../components/animations/Reveal'
import { StatusChip, projectStatus } from '../../components/common/StatusChip'
import { ProjectArt } from './ProjectArt'

/** Floating preview that follows the pointer on desktop; every project's art is stacked and cross-faded. */
function HoverPreview({ active }: { active: number }) {
  const box = useRef<HTMLDivElement>(null)
  const reduced = useApp((s) => s.reducedMotion)

  useEffect(() => {
    const el = box.current
    if (!el) return
    gsap.set(el, { xPercent: 0, yPercent: -50, x: -999, y: -999 })
    const x = gsap.quickTo(el, 'x', { duration: reduced ? 0.01 : 0.6, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: reduced ? 0.01 : 0.6, ease: 'power3.out' })
    const rot = gsap.quickTo(el, 'rotation', { duration: 0.8, ease: 'power3.out' })
    let last = 0
    const move = (e: PointerEvent) => {
      const w = el.offsetWidth
      const left = e.clientX + 36 + w > window.innerWidth ? e.clientX - 36 - w : e.clientX + 36
      x(left)
      y(e.clientY)
      if (!reduced) rot(Math.max(-8, Math.min(8, (e.clientX - last) * 0.25)))
      last = e.clientX
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      gsap.killTweensOf(el)
    }
  }, [reduced])

  return (
    <div
      ref={box}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 hidden aspect-[4/3] w-[min(26vw,24rem)] overflow-hidden border border-[var(--line-strong)] bg-obsidian transition-[opacity,clip-path] duration-500 ease-[var(--ease-expo)] lg:block"
      style={{
        opacity: active >= 0 ? 1 : 0,
        clipPath: active >= 0 ? 'inset(0 0 0 0)' : 'inset(12% 12% 12% 12%)',
      }}
    >
      {projects.map((p, i) => (
        <div
          key={p.id}
          className="absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-expo)]"
          style={{ opacity: i === active ? 1 : 0, transform: i === active ? 'scale(1)' : 'scale(1.18)' }}
        >
          <ProjectArt project={p} />
        </div>
      ))}
    </div>
  )
}

export function Work() {
  const [active, setActive] = useState(-1)
  const fine = useRef(isFinePointer())

  const hover = (i: number) => {
    setActive(i)
    sceneState.hover = i
    sceneState.hue = projects[i].visual.hue
  }
  const leave = () => {
    setActive(-1)
    sceneState.hover = -1
    sceneState.hue = 222
  }
  useEffect(() => () => leave(), [])

  return (
    <Section id="work" labelledBy="work-title" className="py-28 md:py-44">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-obsidian/30 via-obsidian/55 to-obsidian/70" aria-hidden="true" />
      <div className="container-x">
        <SectionHead
          id="work-title"
          num="03"
          kicker="Selected work"
          headline={["Things I've", 'brought', 'to life.']}
          lineClass={[undefined, undefined, 'serif-i']}
        />
        <Reveal delay={0.1}>
          <p className="lede mt-10">
            Every project below is labelled for what it really is today — some are built, some are in progress, some are
            still just a concept with a design.
          </p>
        </Reveal>

        <ol className="mt-16 md:mt-24 hairline-t" onPointerLeave={leave}>
          {projects.map((p, i) => (
            <li key={p.id} className="hairline-b">
              <a
                href={`#work/${p.id}`}
                data-cursor={fine.current ? 'VIEW' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  openProject(p.id)
                }}
                onPointerEnter={(e) => e.pointerType === 'mouse' && hover(i)}
                onFocus={() => hover(i)}
                onBlur={leave}
                className="group relative block py-7 outline-offset-[-2px] md:py-11"
              >
                {/* tint that fills in on hover / focus */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 -inset-x-4 -z-10 origin-bottom scale-y-0 bg-ink/[0.045] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                />

                <div className="grid items-center gap-x-6 gap-y-5 md:grid-cols-12">
                  <p className="eyebrow tnum md:col-span-1">0{i + 1}</p>

                  <div className="md:col-span-7">
                    <h3 className="display text-[clamp(2.4rem,7.4vw,7.2rem)] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3 group-focus-visible:translate-x-3 md:group-hover:translate-x-6">
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[0.95rem] text-ink/70 md:hidden">{p.tagline}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 md:col-span-4 md:flex-col md:items-end md:gap-4 md:text-right">
                    <StatusChip meta={projectStatus[p.status]} />
                    <p className="eyebrow">
                      {p.category}
                      {p.year ? ` · ${p.year}` : ''}
                    </p>
                    <span className="eyebrow hidden items-center gap-2 text-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 md:inline-flex">
                      View project <ArrowUpRight size={14} aria-hidden="true" />
                    </span>
                  </div>

                  {/* touch + small screens: the artwork is always visible (no hover-only content) */}
                  <div className="aspect-[16/10] overflow-hidden border border-[var(--line)] md:hidden">
                    <ProjectArt project={p} />
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ol>

        <Reveal className="mt-14 flex flex-wrap items-center justify-between gap-6">
          <p className="eyebrow max-w-md leading-relaxed">
            More small things live in the lab — finished games, half-built ideas and what I am learning right now.
          </p>
          <button type="button" className="btn" onClick={() => goTo('lab')}>
            Visit the lab
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        </Reveal>
      </div>

      <HoverPreview active={active} />
    </Section>
  )
}
