import type { Skill } from '../types'

/**
 * Skill levels are honest categories, never scores:
 *  building  = I have made things with it
 *  learning  = actively studying it right now
 *  exploring = early experiments / on the list
 */
export const skillLevels = {
  building: { label: 'Building with', blurb: 'Things I have already made with it.' },
  learning: { label: 'Learning', blurb: 'Actively studying it right now.' },
  exploring: { label: 'Exploring', blurb: 'Early experiments and next on the list.' },
} as const

export const skills: Skill[] = [
  {
    id: 'html',
    name: 'HTML',
    level: 'building',
    summary: 'The foundation of everything I put on the web.',
    usage: 'Structure for every page, including the single-file NEXUS AI landing page.',
    projects: ['nexus-ai'],
  },
  {
    id: 'css',
    name: 'CSS',
    level: 'building',
    summary: 'Layout, animation and the look of things.',
    usage: 'Styling and motion on my landing pages and game pages.',
    projects: ['nexus-ai'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    level: 'building',
    summary: 'The language I think in when I prototype.',
    usage: 'Interactivity, p5.js games and the NEXUS AI terminal and draggable chat window.',
    projects: ['nexus-ai'],
  },
  {
    id: 'react',
    name: 'React',
    level: 'building',
    summary: 'My go-to for interfaces with real state.',
    usage: 'This site, plus the front-end for my next product ideas.',
    projects: ['neural-desk'],
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    level: 'building',
    summary: 'Version control and building in public.',
    usage: 'Where the work lives while it is still rough.',
    projects: [],
  },
  {
    id: 'p5',
    name: 'p5.js',
    level: 'building',
    summary: 'Creative coding for quick, playful experiments.',
    usage: 'Two browser games: TowerSiege and Monkey Runner.',
    projects: [],
  },
  {
    id: 'python',
    name: 'Python',
    level: 'learning',
    summary: 'Basics so far: functions and file handling.',
    usage: 'Small scripts while I work towards AI and ML in later years.',
    projects: [],
  },
  {
    id: 'java',
    name: 'Java',
    level: 'learning',
    summary: 'Studying the fundamentals right now.',
    usage: 'Course work, and the FoodFusion management system.',
    projects: ['foodfusion'],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    level: 'learning',
    summary: 'Learning to trust the compiler.',
    usage: 'The language for this site and the Neural Desk plan.',
    projects: ['neural-desk'],
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    level: 'learning',
    summary: 'Utility-first styling, getting faster with it.',
    usage: 'Layout and tokens on this site.',
    projects: [],
  },
  {
    id: 'threejs',
    name: 'Three.js',
    level: 'exploring',
    summary: '3D on the web — the reason this site exists.',
    usage: 'The 3D worlds behind this page, and the Neural Desk concept.',
    projects: ['neural-desk'],
  },
  {
    id: 'gsap',
    name: 'GSAP',
    level: 'exploring',
    summary: 'Scroll-driven and choreographed animation.',
    usage: 'Intro, typography and scroll scenes here.',
    projects: [],
  },
]
