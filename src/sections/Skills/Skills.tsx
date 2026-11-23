import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { skillLevels, skills } from '../../data/skills'
import { projects } from '../../data/projects'
import type { Skill, SkillLevel } from '../../types'
import { openProject } from '../../lib/project'
import { Section, SectionHead } from '../../components/common/Section'
import { Reveal } from '../../components/animations/Reveal'

const LEVELS: SkillLevel[] = ['building', 'learning', 'exploring']
const RING: Record<SkillLevel, { r: number; d: number }> = {
  building: { r: 19, d: 80 },
  learning: { r: 30, d: 110 },
  exploring: { r: 41, d: 150 },
}

/** Three concentric orbits — inner = things I have built with, outer = still exploring. No scores. */
function Orbit({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div
      aria-hidden="true"
      className="orbit-wrap relative mx-auto hidden aspect-square w-full max-w-[42rem] overflow-clip lg:block"
      style={{ containerType: 'inline-size' }}
    >
      {LEVELS.map((lv) => (
        <div
          key={lv}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            width: `${RING[lv].r * 2}cqw`,
            height: `${RING[lv].r * 2}cqw`,
            borderColor: 'var(--line)',
            borderStyle: lv === 'exploring' ? 'dashed' : 'solid',
          }}
        />
      ))}

      <div className="absolute left-1/2 top-1/2 grid size-[11cqw] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[var(--line-strong)] bg-obsidian/80 backdrop-blur-sm">
        <span className="display text-[3.4cqw]">Z</span>
      </div>

      {LEVELS.map((lv) => {
        const group = skills.filter((s) => s.level === lv)
        return (
          <div
            key={lv}
            className="orbit-ring absolute inset-0"
            style={{ ['--orbit-d' as string]: `${RING[lv].d}s`, animationDirection: lv === 'learning' ? 'reverse' : 'normal' }}
          >
            {group.map((s, i) => {
              const th = (360 / group.length) * i + (lv === 'learning' ? 20 : lv === 'exploring' ? 45 : 0)
              const on = s.id === selected
              return (
                <div
                  key={s.id}
                  className="absolute left-1/2 top-1/2"
                  style={{ transform: `rotate(${th}deg) translateX(${RING[lv].r}cqw) rotate(${-th}deg)` }}
                >
                  <div
                    className="orbit-node"
                    style={{
                      ['--orbit-d' as string]: `${RING[lv].d}s`,
                      animationDirection: lv === 'learning' ? 'reverse' : 'normal',
                    }}
                  >
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => onSelect(s.id)}
                      data-cursor=""
                      className="eyebrow -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border px-3.5 py-2 transition-colors"
                      style={{
                        pointerEvents: 'auto',
                        background: on ? 'var(--color-accent)' : 'rgba(5,5,6,0.85)',
                        color: on ? '#050506' : 'var(--color-ink)',
                        borderColor: on ? 'var(--color-accent)' : 'var(--line-strong)',
                      }}
                    >
                      {s.name}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function Detail({ skill }: { skill: Skill }) {
  const related = skill.projects.map((id) => projects.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p)
  return (
    <div aria-live="polite" className="border border-[var(--line)] bg-obsidian/75 p-6 backdrop-blur-sm md:p-8">
      <p className="eyebrow mb-5 flex items-center gap-3">
        <span className="size-2 rotate-45 bg-accent" aria-hidden="true" />
        {skillLevels[skill.level].label}
      </p>
      <h3 className="display text-[clamp(2.2rem,4.6vw,4.2rem)]">{skill.name}</h3>
      <p className="mt-5 text-[1.12rem] leading-snug text-ink/90">{skill.summary}</p>
      <div className="mt-7">
        <p className="eyebrow mb-2">How I use it</p>
        <p className="text-[0.98rem] leading-relaxed text-ink/75">{skill.usage}</p>
      </div>
      <div className="mt-7">
        <p className="eyebrow mb-3">Related projects</p>
        {related.length ? (
          <ul className="flex flex-wrap gap-2">
            {related.map((p) => (
              <li key={p.id}>
                <button type="button" onClick={() => openProject(p.id)} className="btn !min-h-11 !px-4">
                  {p.title}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[0.95rem] text-ink/60">Not used in a public project yet.</p>
        )}
      </div>
    </div>
  )
}

export function Skills() {
  const [selected, setSelected] = useState('react')
  const current = skills.find((s) => s.id === selected) ?? skills[0]

  return (
    <Section id="stack" labelledBy="stack-title" className="py-28 md:py-44">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-obsidian/60 to-obsidian/85" aria-hidden="true" />
      <div className="container-x">
        <SectionHead
          id="stack-title"
          num="04"
          kicker="Tools"
          headline={['Tools are just', 'the beginning.']}
          lineClass={[undefined, 'serif-i']}
        />
        <Reveal delay={0.1}>
          <p className="lede mt-10">
            No percentage bars. Tools are grouped by where I honestly am with them: things I have built with, things I am
            studying right now, and things I am just starting to explore.
          </p>
        </Reveal>

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Detail skill={current} />

            <div className="mt-8 space-y-8">
              {LEVELS.map((lv) => (
                <Reveal key={lv}>
                  <h3 className="eyebrow mb-1 text-ink">{skillLevels[lv].label}</h3>
                  <p className="mb-3 text-[0.85rem] text-ink/55">{skillLevels[lv].blurb}</p>
                  <ul className="flex flex-wrap gap-2">
                    {skills
                      .filter((s) => s.level === lv)
                      .map((s) => (
                        <li key={s.id}>
                          <button
                            type="button"
                            aria-pressed={s.id === selected}
                            onClick={() => setSelected(s.id)}
                            className="eyebrow inline-flex min-h-11 items-center border px-4 transition-colors hover:border-ink"
                            style={{
                              background: s.id === selected ? 'var(--color-accent)' : 'transparent',
                              color: s.id === selected ? '#050506' : 'var(--color-ink)',
                              borderColor: s.id === selected ? 'var(--color-accent)' : 'var(--line-strong)',
                            }}
                          >
                            {s.name}
                          </button>
                        </li>
                      ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <Orbit selected={selected} onSelect={setSelected} />
          </div>
        </div>
      </div>
    </Section>
  )
}
