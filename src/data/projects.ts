import type { Project } from '../types'

/**
 * Add a project by appending an object here — the list, hover preview,
 * detail overlay, deep link (#work/<id>) and tech-stack cross-links all update.
 *
 * Only list links / images you actually have. Empty fields are hidden.
 */
export const projects: Project[] = [
  {
    id: 'nexus-ai',
    title: 'NEXUS AI',
    tagline: 'An "AI operating system" — currently a concept and a landing page.',
    category: 'AI product concept',
    year: '2026',
    status: 'concept',
    description:
      'NEXUS AI is my biggest idea so far: one workspace that brings the best parts of chat assistants, notes, code editors and design tools together. It is a concept at this stage — the built part is its landing page.',
    story:
      'I wanted the landing page to feel like booting an operating system instead of reading a brochure. When I stress-tested the idea, the honest feedback was that the scope was far too wide — so the plan is to pick one or two core features and build those first.',
    features: [
      'OS-boot metaphor with an animated terminal sequence',
      'Draggable chat window',
      'SVG diagram of the "kernel"',
      'Early-access form',
    ],
    featuresLabel: 'What the landing page has',
    decisions: [
      'Single-file HTML, CSS and JavaScript — zero build step, deploys anywhere',
      'Scope narrowed on purpose: one or two core features before anything else',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'SVG'],
    links: {},
    visual: { kind: 'kernel', hue: 218 },
  },
  {
    id: 'neural-desk',
    title: 'NEURAL DESK',
    tagline: 'A spatial interface you control with your hands. Designed, not yet built.',
    category: 'Experimental interface',
    year: '2026',
    status: 'concept',
    description:
      'A browser-based spatial computing idea: your webcam tracks your hand, and your hand becomes the mouse inside a 3D environment. Includes NEURALTYPE, a floating 3D keyboard you type on with gestures.',
    story:
      'The tagline is "Your hands are the interface". The plan is to build a small prototype first rather than the full spec, and to keep every frame of camera data on the device.',
    features: [
      'Hand tracking with MediaPipe Hand Landmarker',
      'Gesture engine: pinch, palm, fist, point',
      'NEURALTYPE — a floating 3D keyboard',
      'Mouse and touch fallback when no camera is available',
      'Privacy by design: tracking runs locally in the browser',
    ],
    featuresLabel: 'Planned features',
    decisions: [
      'Prototype before spec — a small demo comes first',
      'No backend: all processing in the browser, deployable as a static site',
    ],
    stack: ['React', 'TypeScript', 'Three.js', 'React Three Fiber', 'MediaPipe'],
    links: {},
    visual: { kind: 'hand', hue: 188 },
  },
  {
    id: 'foodfusion',
    title: 'FoodFusion',
    tagline: 'A restaurant and food-delivery management system in Java.',
    category: 'Java · course project',
    year: '2026',
    status: 'in-progress',
    description:
      'My project for the Java programming course in first year at KL University: a management system for a restaurant and food-delivery flow, built with object-oriented Java.',
    story:
      'This is the project I want to be the strongest in my class — and it is also where I am learning Java properly, one class at a time.',
    stack: ['Java'],
    links: {},
    visual: { kind: 'plate', hue: 28 },
  },
  {
    id: 'zaid-luxuries',
    title: 'ZAID LUXURIES',
    tagline: 'A concept for a premium e-commerce brand.',
    category: 'Brand · e-commerce concept',
    year: '2026',
    status: 'concept',
    description:
      'A brand concept exploring what a minimal, high-end online store could feel like. It sits in the idea stage while I decide what it should sell.',
    stack: ['Brand design', 'Web'],
    links: {},
    visual: { kind: 'luxe', hue: 262 },
  },
]
