import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { projects } from '../../data/projects'
import { socials } from '../../data/socials'
import { useApp } from '../../store/app'
import { closeProject, switchProject } from '../../lib/project'
import { lockScroll, unlockScroll } from '../../lib/scroll'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { StatusChip, projectStatus } from '../../components/common/StatusChip'
import { ProjectArt } from './ProjectArt'

const ease = [0.76, 0, 0.24, 1] as const

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } },
}
const rise: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

/** Full-screen project experience. Deep-linkable (#work/<id>), keyboard + focus managed. */
export function ProjectDetail() {
  const id = useApp((s) => s.projectId)
  const reduced = useApp((s) => s.reducedMotion)
  const project = projects.find((p) => p.id === id) ?? null
  const root = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)

  const open = !!project
  useFocusTrap(root, open, closeBtn)

  useEffect(() => {
    if (!open) return
    lockScroll()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProject()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (!useApp.getState().menuOpen) unlockScroll()
    }
  }, [open])

  // when switching project, start at the top
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [id])

  const idx = project ? projects.findIndex((p) => p.id === project.id) : -1
  const prev = idx >= 0 ? projects[(idx - 1 + projects.length) % projects.length] : null
  const next = idx >= 0 ? projects[(idx + 1) % projects.length] : null
  const github = socials.find((s) => s.id === 'github')

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="detail"
          ref={root}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-title"
          className="fixed inset-0 z-[85] bg-obsidian"
          initial={reduced ? { opacity: 0 } : { clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: reduced ? 0.15 : 0.85, ease }}
        >
          {/* sticky chrome */}
          <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-obsidian via-obsidian/85 to-transparent">
            <div className="container-x flex h-16 items-center justify-between md:h-20">
              <p className="eyebrow tnum">
                <span className="text-accent">0{idx + 1}</span> / 0{projects.length}
              </p>
              <button
                ref={closeBtn}
                type="button"
                onClick={closeProject}
                className="eyebrow inline-flex min-h-11 items-center gap-3 border border-[var(--line-strong)] px-4 text-ink hover:border-ink"
              >
                Close
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div ref={scroller} data-lenis-prevent className="h-dvh overflow-y-auto overscroll-contain">
            <motion.article key={project.id} variants={stagger} initial="hidden" animate="show" className="container-x pb-24 pt-28 md:pt-36">
              <motion.p variants={rise} className="eyebrow mb-6">
                {project.category}
                {project.year ? ` · ${project.year}` : ''}
              </motion.p>
              <motion.h2 variants={rise} id="project-title" className="display text-[clamp(3rem,11vw,11rem)]">
                {project.title}
              </motion.h2>
              <motion.p variants={rise} className="lede mt-8 !max-w-3xl text-[clamp(1.15rem,2vw,1.7rem)]">
                {project.tagline}
              </motion.p>

              <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-4">
                <StatusChip meta={projectStatus[project.status]} />
                <span className="text-sm text-ink/70">{projectStatus[project.status].explain}</span>
              </motion.div>

              {/* visual */}
              <motion.div variants={rise} className="mt-14 overflow-hidden border border-[var(--line)]">
                {project.images && project.images.length > 1 ? (
                  <ul className="grid gap-px bg-[var(--line)] md:grid-cols-2">
                    {project.images.map((im) => (
                      <li key={im.src} className="aspect-[16/10] bg-obsidian">
                        <img src={im.src} alt={im.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="aspect-[16/9] md:aspect-[21/9]">
                    <ProjectArt project={project} />
                  </div>
                )}
              </motion.div>

              <div className="mt-16 grid gap-14 lg:grid-cols-12">
                {/* story */}
                <div className="lg:col-span-7">
                  <motion.h3 variants={rise} className="eyebrow mb-5">
                    The project
                  </motion.h3>
                  <motion.p variants={rise} className="text-[clamp(1.1rem,1.6vw,1.4rem)] leading-[1.6] text-ink/90">
                    {project.description}
                  </motion.p>
                  {project.story && (
                    <motion.p variants={rise} className="mt-6 max-w-2xl text-[1.05rem] leading-[1.7] text-ink/70">
                      {project.story}
                    </motion.p>
                  )}

                  {project.features && project.features.length > 0 && (
                    <motion.div variants={rise} className="mt-14">
                      <h3 className="eyebrow mb-5">{project.featuresLabel ?? 'Features'}</h3>
                      <ul className="hairline-t">
                        {project.features.map((f, i) => (
                          <li key={f} className="hairline-b flex gap-5 py-4">
                            <span className="eyebrow tnum pt-1">0{i + 1}</span>
                            <span className="text-[1.02rem] leading-relaxed">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {project.decisions && project.decisions.length > 0 && (
                    <motion.div variants={rise} className="mt-14">
                      <h3 className="eyebrow mb-5">Technical decisions</h3>
                      <ul className="space-y-4">
                        {project.decisions.map((d) => (
                          <li key={d} className="flex gap-4 text-[1.02rem] leading-relaxed text-ink/85">
                            <span aria-hidden="true" className="mt-[0.7em] h-px w-5 shrink-0 bg-accent" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>

                {/* facts */}
                <motion.aside variants={rise} className="lg:col-span-4 lg:col-start-9" aria-label="Project facts">
                  <dl className="hairline-t">
                    <div className="hairline-b py-5">
                      <dt className="eyebrow mb-2">Status</dt>
                      <dd>{projectStatus[project.status].label}</dd>
                    </div>
                    <div className="hairline-b py-5">
                      <dt className="eyebrow mb-2">Category</dt>
                      <dd>{project.category}</dd>
                    </div>
                    {project.year && (
                      <div className="hairline-b py-5">
                        <dt className="eyebrow mb-2">Year</dt>
                        <dd className="tnum">{project.year}</dd>
                      </div>
                    )}
                    <div className="hairline-b py-5">
                      <dt className="eyebrow mb-3">Built with</dt>
                      <dd>
                        <ul className="flex flex-wrap gap-2">
                          {project.stack.map((s) => (
                            <li key={s} className="chip">
                              {s}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                    <div className="py-5">
                      <dt className="eyebrow mb-3">Links</dt>
                      <dd className="flex flex-col items-start gap-3">
                        {project.links.live && (
                          <a className="btn btn-primary" href={project.links.live} target="_blank" rel="noopener noreferrer">
                            Live demo <ArrowUpRight size={16} aria-hidden="true" />
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        )}
                        {project.links.github && (
                          <a className="btn" href={project.links.github} target="_blank" rel="noopener noreferrer">
                            Source on GitHub <ArrowUpRight size={16} aria-hidden="true" />
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        )}
                        {!project.links.live && !project.links.github && (
                          <>
                            <p className="text-sm leading-relaxed text-ink/70">
                              No public demo or repository for this one yet.
                            </p>
                            {github && (
                              <a className="btn" href={github.url} target="_blank" rel="noopener noreferrer">
                                Follow on GitHub <ArrowUpRight size={16} aria-hidden="true" />
                                <span className="sr-only"> (opens in a new tab)</span>
                              </a>
                            )}
                          </>
                        )}
                      </dd>
                    </div>
                  </dl>
                </motion.aside>
              </div>

              {/* prev / next */}
              {prev && next && projects.length > 1 && (
                <motion.nav variants={rise} aria-label="More projects" className="mt-24 grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => switchProject(prev.id)}
                    className="group flex min-h-28 flex-col items-start gap-3 bg-obsidian p-6 text-left transition-colors hover:bg-charcoal"
                  >
                    <span className="eyebrow inline-flex items-center gap-2">
                      <ArrowLeft size={14} aria-hidden="true" /> Previous
                    </span>
                    <span className="display text-[clamp(1.6rem,3.4vw,3rem)] transition-transform duration-500 group-hover:-translate-x-1">{prev.title}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => switchProject(next.id)}
                    className="group flex min-h-28 flex-col items-start gap-3 bg-obsidian p-6 text-left transition-colors hover:bg-charcoal md:items-end md:text-right"
                  >
                    <span className="eyebrow inline-flex items-center gap-2">
                      Next <ArrowRight size={14} aria-hidden="true" />
                    </span>
                    <span className="display text-[clamp(1.6rem,3.4vw,3rem)] transition-transform duration-500 group-hover:translate-x-1">{next.title}</span>
                  </button>
                </motion.nav>
              )}
            </motion.article>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
