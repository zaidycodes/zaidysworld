import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from './store/app'
import { initScroll } from './lib/scroll'
import { usePointer } from './hooks/usePointer'
import { DigitalUniverse } from './scenes/DigitalUniverse'
import { Intro } from './scenes/IntroScene/Intro'
import { Header } from './components/navigation/Header'
import { SideIndex } from './components/navigation/SideIndex'
import { MenuOverlay } from './components/navigation/MenuOverlay'
import { Curtain } from './components/navigation/Curtain'
import { Cursor } from './components/animations/Cursor'
import { Hero } from './sections/Hero/Hero'
import { About } from './sections/About/About'
import { Work } from './sections/Work/Work'
import { ProjectDetail } from './sections/Work/ProjectDetail'
import { Experiments } from './sections/Experiments/Experiments'
import { Skills } from './sections/Skills/Skills'
import { Journey } from './sections/Journey/Journey'
import { Beyond } from './sections/Beyond/Beyond'
import { Contact, Footer } from './sections/Contact/Contact'
import { Secret } from './scenes/Secret/Secret'
import { useKonami } from './hooks/useKonami'
import { projectIdFromHash } from './lib/project'
import { NAV } from './data/sections'
import { projects } from './data/projects'
import { site } from './data/site'

gsap.registerPlugin(ScrollTrigger)

/** Tab title follows where the visitor is. Isolated so its subscriptions never re-render the app tree. */
function TitleSync() {
  const phase = useApp((s) => s.phase)
  const activeNav = useApp((s) => s.activeNav)
  const projectId = useApp((s) => s.projectId)
  useEffect(() => {
    const project = projectId ? projects.find((p) => p.id === projectId) : undefined
    document.title = project
      ? `${project.title} — Work — ${site.brand}`
      : activeNav === 0 || phase !== 'world'
        ? site.title
        : `${NAV[activeNav].label} — ${site.brand}`
  }, [activeNav, projectId, phase])
  return null
}

export default function App() {
  const phase = useApp((s) => s.phase)
  const reduced = useApp((s) => s.reducedMotion)
  usePointer()
  useKonami()

  useEffect(() => initScroll(reduced), [reduced])


  // Deep links (#work/<id>) and the browser's back / forward buttons drive the project overlay.
  useEffect(() => {
    const sync = () => useApp.getState().setProjectId(projectIdFromHash(window.location.hash))
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  // Section heights change once fonts load → recompute every trigger.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <>
      <a
        href="#content"
        className="eyebrow fixed left-4 top-4 z-[120] -translate-y-24 bg-ink px-4 py-3 text-obsidian focus:translate-y-0"
      >
        Skip to content
      </a>

      <TitleSync />
      <DigitalUniverse />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <Header />
      <SideIndex />

      {/* While the intro plays the page behind it is inert. */}
      <main
        id="content"
        tabIndex={-1}
        className="relative z-10 outline-none"
        inert={phase === 'intro' ? true : undefined}
      >
        <Hero />
        <About />
        <Work />
        <Experiments />
        <Skills />
        <Journey />
        <Beyond />
        <Contact />
      </main>
      <Footer />

      <ProjectDetail />
      <MenuOverlay />
      <Curtain />
      <Secret />
      <Intro />
      <Cursor />
    </>
  )
}
