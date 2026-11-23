import type { ExperimentStatus, ProjectStatus } from '../../types'

type Kind = 'done' | 'live' | 'wip' | 'learn' | 'idea'

interface Meta {
  label: string
  kind: Kind
  /** Plain-language explanation so status is never conveyed by colour/shape alone. */
  explain: string
}

export const projectStatus: Record<ProjectStatus, Meta> = {
  live: { label: 'Live', kind: 'live', explain: 'Deployed and usable.' },
  shipped: { label: 'Shipped', kind: 'done', explain: 'Finished and delivered.' },
  'in-progress': { label: 'In progress', kind: 'wip', explain: 'Actively being built — not finished.' },
  prototype: { label: 'Prototype', kind: 'wip', explain: 'An early working version.' },
  concept: { label: 'Concept', kind: 'idea', explain: 'An idea and a design — not a finished product.' },
}

export const experimentStatus: Record<ExperimentStatus, Meta> = {
  completed: { label: 'Completed', kind: 'done', explain: 'Finished and working.' },
  'in-progress': { label: 'In progress', kind: 'wip', explain: 'Being built right now.' },
  learning: { label: 'Learning', kind: 'learn', explain: 'Something I am studying, not a finished piece.' },
  idea: { label: 'Idea', kind: 'idea', explain: 'Not started — just a question I want to test.' },
}

function Glyph({ kind }: { kind: Kind }) {
  const c = 'currentColor'
  switch (kind) {
    case 'live':
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <circle cx="5" cy="5" r="4" fill="#5eead4" />
        </svg>
      )
    case 'done':
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <circle cx="5" cy="5" r="4" fill={c} />
        </svg>
      )
    case 'wip':
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <circle cx="5" cy="5" r="3.6" fill="none" stroke={c} strokeWidth="1.2" />
          <path d="M5 1.4 A3.6 3.6 0 0 1 5 8.6 Z" fill={c} />
        </svg>
      )
    case 'learn':
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <circle cx="5" cy="5" r="3.6" fill="none" stroke={c} strokeWidth="1.2" strokeDasharray="2 1.6" />
        </svg>
      )
    default:
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <circle cx="5" cy="5" r="3.6" fill="none" stroke={c} strokeWidth="1.2" strokeDasharray="0.4 2" strokeLinecap="round" />
        </svg>
      )
  }
}

export function StatusChip({ meta, className = '' }: { meta: Meta; className?: string }) {
  return (
    <span className={`chip ${className}`}>
      <Glyph kind={meta.kind} />
      {meta.label}
    </span>
  )
}
