import type { Chapter } from '../../types'

/** Tiny original line illustrations. They animate on hover/focus of their row (CSS only). */
export function Motif({ kind }: { kind: Chapter['motif'] }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true" className="h-24 w-24 md:h-28 md:w-28" {...common}>
      {kind === 'chess' && (
        <g>
          <rect x="14" y="14" width="92" height="92" />
          {Array.from({ length: 16 }, (_, i) => {
            const x = i % 4
            const y = Math.floor(i / 4)
            return (x + y) % 2 === 0 ? <rect key={i} x={14 + x * 23} y={14 + y * 23} width="23" height="23" fill="currentColor" stroke="none" opacity="0.9" /> : null
          })}
          <g className="motif-knight" style={{ transformOrigin: '60px 60px', transition: 'transform .9s var(--ease-expo)' }}>
            <circle cx="60" cy="60" r="11" fill="var(--color-paper)" />
            <path d="M54 66 q2 -12 8 -14 q-2 -4 2 -6 q4 4 3 10 q-1 6 -2 10 z" fill="currentColor" stroke="none" />
          </g>
        </g>
      )}
      {kind === 'pingpong' && (
        <g>
          <path d="M12 96 H108" />
          <path d="M60 96 V70 M12 70 H108" opacity="0.5" />
          <circle className="motif-ball" cx="30" cy="40" r="7" fill="currentColor" stroke="none" style={{ animation: 'bounce-ball 1.6s ease-in-out infinite', animationPlayState: 'paused' }} />
          <path d="M30 40 Q60 -6 90 40" strokeDasharray="2 5" opacity="0.5" />
        </g>
      )}
      {kind === 'film' && (
        <g>
          <rect x="30" y="8" width="60" height="104" />
          <g className="motif-film" style={{ transition: 'transform 1.2s var(--ease-expo)' }}>
            {Array.from({ length: 5 }, (_, i) => (
              <g key={i}>
                <rect x="36" y={14 + i * 20} width="6" height="9" fill="currentColor" stroke="none" />
                <rect x="78" y={14 + i * 20} width="6" height="9" fill="currentColor" stroke="none" />
                <rect x="48" y={14 + i * 20} width="24" height="16" />
              </g>
            ))}
          </g>
        </g>
      )}
      {kind === 'book' && (
        <g>
          <path d="M60 28 C44 18 26 18 14 24 V94 C26 88 44 88 60 98 C76 88 94 88 106 94 V24 C94 18 76 18 60 28 Z" />
          <path d="M60 28 V98" />
          <g className="motif-page" style={{ transformOrigin: '60px 60px', transition: 'transform 1s var(--ease-expo)' }}>
            <path d="M60 28 C74 22 90 22 100 28" opacity="0.6" />
            <path d="M60 40 C74 34 90 34 100 40" opacity="0.6" />
          </g>
        </g>
      )}
      {kind === 'loop' && (
        <g>
          <path d="M60 60 C60 30 20 30 20 60 C20 90 60 90 60 60 C60 30 100 30 100 60 C100 90 60 90 60 60 Z" />
          <circle className="motif-dot" cx="20" cy="60" r="4" fill="currentColor" stroke="none" style={{ transition: 'transform 1.2s var(--ease-expo)' }} />
        </g>
      )}
      {kind === 'build' && (
        <g>
          <rect x="14" y="74" width="40" height="32" />
          <rect x="66" y="74" width="40" height="32" />
          <rect x="40" y="42" width="40" height="32" />
          <g className="motif-top" style={{ transition: 'transform 1s var(--ease-expo)' }}>
            <rect x="40" y="10" width="40" height="32" fill="currentColor" stroke="none" opacity="0.9" />
          </g>
        </g>
      )}
    </svg>
  )
}
