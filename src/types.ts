export type ProjectStatus = 'live' | 'shipped' | 'in-progress' | 'prototype' | 'concept'
export type ExperimentStatus = 'completed' | 'in-progress' | 'learning' | 'idea'
export type VisualKind = 'plate' | 'kernel' | 'hand' | 'luxe'
export type SkillLevel = 'building' | 'learning' | 'exploring'

export interface Project {
  id: string
  title: string
  tagline: string
  category: string
  /** Free text, e.g. "2026". Leave empty to hide. */
  year: string
  status: ProjectStatus
  description: string
  story?: string
  features?: string[]
  /** Label shown above the features list (e.g. "Planned features"). */
  featuresLabel?: string
  decisions?: string[]
  stack: string[]
  links: { live?: string; github?: string }
  /** Generative artwork used until real screenshots are added. */
  visual: { kind: VisualKind; hue: number }
  /** Real screenshots: put files in /public/projects and list their paths here. */
  images?: { src: string; alt: string }[]
}

export interface Experiment {
  id: string
  title: string
  blurb: string
  status: ExperimentStatus
  tags: string[]
  link?: string
}

export interface Skill {
  id: string
  name: string
  level: SkillLevel
  /** One honest line about where this tool stands for Zaid. */
  summary: string
  usage: string
  projects: string[] // project ids
}

export interface Milestone {
  id: string
  date: string
  title: string
  text: string
  state: 'past' | 'now' | 'next'
}

export interface Chapter {
  id: string
  title: string
  line: string
  motif: 'chess' | 'pingpong' | 'film' | 'book' | 'loop' | 'build'
}

export interface Social {
  id: string
  label: string
  handle: string
  url: string
}
