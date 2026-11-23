import type { Milestone } from '../types'

/**
 * Timeline. Only milestones that actually happened.
 * Add earlier chapters (first line of code, first website...) here when you want them shown.
 */
export const journey: Milestone[] = [
  {
    id: 'school',
    date: '2026',
    title: 'Finished school',
    text: 'Completed Class 12 and set the direction: computer science, and building things on the side.',
    state: 'past',
  },
  {
    id: 'klu',
    date: 'Aug 2026',
    title: 'Started B.Tech CSE',
    text: 'Joined KL University, Vijayawada, in the Computer Science Engineering programme (batch 2026–2030).',
    state: 'past',
  },
  {
    id: 'nexus',
    date: '2026',
    title: 'First big idea: NEXUS AI',
    text: 'Designed an "AI operating system" concept and built its OS-boot landing page.',
    state: 'past',
  },
  {
    id: 'games',
    date: '2026',
    title: 'Two browser games',
    text: 'Built TowerSiege and Monkey Runner with p5.js — my first complete things to play.',
    state: 'past',
  },
  {
    id: 'midterms',
    date: 'Sep 2026',
    title: 'First college exams',
    text: 'Mid-terms on the honours pathway — a first real lesson in planning my time.',
    state: 'past',
  },
  {
    id: 'hackathon',
    date: '2 Nov 2026',
    title: 'Java Skill Hackathon',
    text: 'A college hackathon at KLU, and a push to get comfortable with Java under a deadline.',
    state: 'past',
  },
  {
    id: 'now',
    date: 'Now',
    title: 'Java, DSA and this site',
    text: 'Getting Java fundamentals solid before DSA, while building ZAID.WORLD to learn 3D and motion.',
    state: 'now',
  },
  {
    id: 'year1',
    date: 'Year 1 goal',
    title: 'DSA, MERN and an MVP',
    text: 'Data structures and algorithms, the MERN stack, and a first real version of one core idea.',
    state: 'next',
  },
  {
    id: 'later',
    date: 'Later',
    title: 'AI, then a startup',
    text: 'AI and machine learning in the second year, with the long-term aim of founding an AI startup.',
    state: 'next',
  },
]
