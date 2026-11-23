import { useMemo, useState, type PointerEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { experiments } from '../../data/experiments'
import type { Experiment, ExperimentStatus } from '../../types'
import { useApp } from '../../store/app'
import { Section, SectionHead } from '../../components/common/Section'
import { Reveal } from '../../components/animations/Reveal'
import { StatusChip, experimentStatus } from '../../components/common/StatusChip'

type Filter = 'all' | ExperimentStatus
const ORDER: ExperimentStatus[] = ['completed', 'in-progress', 'learning', 'idea']

/** A status ring that reads as "how finished is this" without implying a score. */
function Ring({ status }: { status: ExperimentStatus }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true" className="shrink-0">
      <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(242,242,240,0.12)" strokeWidth="1.5" />
      {status === 'completed' && <circle cx="32" cy="32" r={r} fill="none" stroke="#648cff" strokeWidth="2" />}
      {status === 'in-progress' && (
        <g className="orbit-ring" style={{ transformOrigin: '32px 32px', ['--orbit-d' as string]: '9s' }}>
          <circle cx="32" cy="32" r={r} fill="none" stroke="#648cff" strokeWidth="2" strokeDasharray={`${c * 0.55} ${c}`} strokeLinecap="round" />
        </g>
      )}
      {status === 'learning' && (
        <g className="orbit-ring" style={{ transformOrigin: '32px 32px', ['--orbit-d' as string]: '26s' }}>
          <circle cx="32" cy="32" r={r} fill="none" stroke="#9b8cff" strokeWidth="2" strokeDasharray="4 6" />
        </g>
      )}
      {status === 'idea' && (
        <circle cx="32" cy="32" r={r} fill="none" stroke="#c9ccd6" strokeWidth="2" strokeDasharray="0.1 7" strokeLinecap="round" />
      )}
      <circle cx="32" cy="32" r="4" fill={status === 'completed' ? '#648cff' : 'none'} stroke={status === 'completed' ? 'none' : 'rgba(242,242,240,0.6)'} strokeWidth="1.2" />
    </svg>
  )
}

function Card({ e, index }: { e: Experiment; index: number }) {
  const meta = experimentStatus[e.status]
  const onMove = (ev: PointerEvent<HTMLElement>) => {
    const r = ev.currentTarget.getBoundingClientRect()
    ev.currentTarget.style.setProperty('--mx', `${ev.clientX - r.left}px`)
    ev.currentTarget.style.setProperty('--my', `${ev.clientY - r.top}px`)
  }
  const finished = e.status === 'completed'

  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        <Ring status={e.status} />
        <p className="eyebrow tnum">L-{String(index + 1).padStart(2, '0')}</p>
      </div>
      <h3 className="display mt-8 text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[0.95]">{e.title}</h3>
      <p className="mt-4 text-[0.98rem] leading-relaxed text-ink/75">{e.blurb}</p>
      <div className="mt-auto pt-8">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip meta={meta} />
          {e.tags.map((t) => (
            <span key={t} className="eyebrow rounded-full border border-[var(--line)] px-3 py-1 !text-[0.65rem]">
              {t}
            </span>
          ))}
        </div>
        <p className="mt-4 text-[0.85rem] text-ink/60">
          {finished ? 'Finished.' : 'Not finished —'} {meta.explain}
        </p>
      </div>
    </>
  )

  const cls =
    'group relative flex h-full min-h-[22rem] flex-col overflow-hidden border border-[var(--line)] bg-obsidian/70 p-6 backdrop-blur-sm transition-colors duration-500 hover:border-[var(--line-strong)] md:p-7'
  const glow = (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{ background: 'radial-gradient(360px circle at var(--mx,50%) var(--my,50%), rgba(100,140,255,0.16), transparent 70%)' }}
    />
  )

  return e.link ? (
    <a href={e.link} target="_blank" rel="noopener noreferrer" onPointerMove={onMove} className={cls}>
      {glow}
      {body}
      <ArrowUpRight size={18} aria-hidden="true" className="absolute right-6 top-14 opacity-60" />
    </a>
  ) : (
    <article onPointerMove={onMove} className={cls}>
      {glow}
      {body}
    </article>
  )
}

export function Experiments() {
  const [filter, setFilter] = useState<Filter>('all')
  const reduced = useApp((s) => s.reducedMotion)

  const counts = useMemo(() => {
    const m: Record<ExperimentStatus, number> = { completed: 0, 'in-progress': 0, learning: 0, idea: 0 }
    experiments.forEach((e) => m[e.status]++)
    return m
  }, [])
  const shown = filter === 'all' ? experiments : experiments.filter((e) => e.status === filter)
  const filters: { id: Filter; label: string; n: number }[] = [
    { id: 'all', label: 'All', n: experiments.length },
    ...ORDER.filter((s) => counts[s] > 0).map((s) => ({ id: s as Filter, label: experimentStatus[s].label, n: counts[s] })),
  ]

  return (
    <Section id="lab" labelledBy="lab-title" className="py-28 md:py-44">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-obsidian/70 via-obsidian/30 to-obsidian/60" aria-hidden="true" />
      <div className="container-x">
        <SectionHead
          id="lab-title"
          num="04"
          kicker="Digital lab"
          headline={['Always', 'experimenting.']}
          lineClass={[undefined, 'serif-i']}
        />
        <Reveal delay={0.1}>
          <p className="lede mt-10">
            A lab, not a showroom. Some of this works, some of it is half-built and some of it is only a question — and
            every card says which.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <div role="group" aria-label="Filter experiments by status" className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className="eyebrow inline-flex min-h-11 items-center gap-2 border px-4 transition-colors hover:border-ink"
                style={{
                  borderColor: filter === f.id ? 'var(--color-ink)' : 'var(--line-strong)',
                  background: filter === f.id ? 'var(--color-ink)' : 'transparent',
                  color: filter === f.id ? 'var(--color-obsidian)' : 'var(--color-ink)',
                }}
              >
                {f.label}
                <span className="tnum opacity-70">{f.n}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          <AnimatePresence mode="popLayout">
            {shown.map((e) => (
              <motion.li
                key={e.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="lg:[&:nth-child(3n+2)]:translate-y-10"
              >
                <Card e={e} index={experiments.indexOf(e)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </Section>
  )
}
