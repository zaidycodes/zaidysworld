import type { Experiment } from '../types'

/** The digital lab. Add an item and it appears in the field with its status ring. */
export const experiments: Experiment[] = [
  {
    id: 'towersiege',
    title: 'TowerSiege',
    blurb: 'A physics-based browser game made with p5.js, bundled into one self-contained HTML file.',
    status: 'completed',
    tags: ['p5.js', 'game', 'physics'],
  },
  {
    id: 'monkey-runner',
    title: 'Monkey Runner',
    blurb: 'An endless-runner browser game, also p5.js, packaged to run offline from a single file.',
    status: 'completed',
    tags: ['p5.js', 'game'],
  },
  {
    id: 'flowcharts',
    title: 'Algorithm flowcharts',
    blurb: 'Factorial, swap, prime and even/odd flowcharts, drawn as clean SVG diagrams for a design-thinking course.',
    status: 'completed',
    tags: ['SVG', 'algorithms'],
  },
  {
    id: 'zaid-world',
    title: 'ZAID.WORLD',
    blurb: 'This site. A scroll-driven 3D world built to learn React Three Fiber, GSAP and Lenis properly.',
    status: 'in-progress',
    tags: ['Three.js', 'GSAP', 'React'],
  },
  {
    id: 'risc-v',
    title: 'RISC-V & logic circuits',
    blurb: 'Writing assembly in Ripes and building digital circuits in Logisim for the digital design course.',
    status: 'learning',
    tags: ['RISC-V', 'Logisim'],
  },
  {
    id: 'java-dsa',
    title: 'Java → DSA',
    blurb: 'Getting Java fundamentals solid before data structures and algorithms starts in the next trimester.',
    status: 'learning',
    tags: ['Java', 'DSA'],
  },
  {
    id: 'hand-tracking',
    title: 'Hand tracking in the browser',
    blurb: 'An idea to test: can a webcam and MediaPipe drive a 3D scene smoothly on a student laptop?',
    status: 'idea',
    tags: ['MediaPipe', 'WebGL'],
  },
]
