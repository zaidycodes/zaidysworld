import { useId } from 'react'
import type { Project } from '../../types'

interface Props {
  project: Project
  className?: string
}

/**
 * Original generative artwork per project (no stock imagery). It stands in until real screenshots
 * are added to `project.images`; when they exist the first one is shown instead.
 */
export function ProjectArt({ project, className = '' }: Props) {
  const uid = useId().replace(/:/g, '')
  const { kind, hue } = project.visual
  const c1 = `hsl(${hue} 85% 68%)`
  const c2 = `hsl(${(hue + 40) % 360} 75% 62%)`
  const dim = `hsl(${hue} 40% 40% / 0.45)`
  const img = project.images?.[0]

  if (img) {
    return <img src={img.src} alt={img.alt} loading="lazy" decoding="async" className={`h-full w-full object-cover ${className}`} />
  }

  return (
    <svg
      viewBox="0 0 400 300"
      role="img"
      aria-label={`Abstract artwork for ${project.title}`}
      className={`h-full w-full ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`bg${uid}`} cx="50%" cy="46%" r="75%">
          <stop offset="0" stopColor={`hsl(${hue} 60% 22%)`} />
          <stop offset="0.55" stopColor={`hsl(${hue} 40% 9%)`} />
          <stop offset="1" stopColor="#050506" />
        </radialGradient>
        <linearGradient id={`ln${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <filter id={`gl${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="400" height="300" fill={`url(#bg${uid})`} />
      <g stroke={dim} strokeWidth="0.6" fill="none" opacity="0.7">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="300" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} />
        ))}
      </g>

      {kind === 'kernel' && (
        <g fill="none" stroke={`url(#ln${uid})`} strokeWidth="1.4" filter={`url(#gl${uid})`}>
          <circle cx="200" cy="140" r="30" fill={`hsl(${hue} 80% 60% / 0.18)`} />
          <circle cx="200" cy="140" r="58" strokeDasharray="3 5" />
          <circle cx="200" cy="140" r="88" />
          <circle cx="200" cy="140" r="118" strokeDasharray="1 6" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4 + 0.2
            const x1 = 200 + Math.cos(a) * 30
            const y1 = 140 + Math.sin(a) * 30
            const x2 = 200 + Math.cos(a) * 88
            const y2 = 140 + Math.sin(a) * 88
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} />
                <rect x={x2 - 5} y={y2 - 5} width="10" height="10" fill="#050506" />
              </g>
            )
          })}
          {[72, 112, 52, 92].map((w, i) => (
            <rect key={i} x="28" y={236 + i * 11} width={w} height="3" fill={c1} stroke="none" opacity={0.85 - i * 0.15} />
          ))}
        </g>
      )}

      {kind === 'hand' && (
        <g fill="none" stroke={`url(#ln${uid})`} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" filter={`url(#gl${uid})`}>
          <circle cx="200" cy="150" r="128" strokeDasharray="2 7" opacity="0.6" />
          <circle cx="200" cy="150" r="96" opacity="0.35" />
          <path d="M200 262 L165 232 L178 176 L202 168 L226 174 L246 188 Z" fill={`hsl(${hue} 80% 60% / 0.1)`} />
          <polyline points="165,232 138,206 118,178 104,152" />
          <polyline points="178,176 172,134 168,104 166,76" />
          <polyline points="202,168 202,118 203,82 204,50" />
          <polyline points="226,174 231,131 234,101 236,74" />
          <polyline points="246,188 257,156 265,132 271,110" />
          {[
            [200, 262], [165, 232], [138, 206], [118, 178], [104, 152],
            [178, 176], [172, 134], [168, 104], [166, 76],
            [202, 168], [202, 118], [203, 82], [204, 50],
            [226, 174], [231, 131], [234, 101], [236, 74],
            [246, 188], [257, 156], [265, 132], [271, 110],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3.4" fill="#050506" />
          ))}
          <path d="M104 152 Q135 100 166 76" strokeDasharray="2 5" opacity="0.7" />
        </g>
      )}

      {kind === 'plate' && (
        <g fill="none" stroke={`url(#ln${uid})`} strokeWidth="1.4" filter={`url(#gl${uid})`}>
          <circle cx="200" cy="158" r="104" />
          <circle cx="200" cy="158" r="86" strokeDasharray="2 6" />
          <circle cx="200" cy="158" r="58" fill={`hsl(${hue} 80% 60% / 0.14)`} />
          <path d="M156 160 Q200 118 244 160" />
          <path d="M162 176 Q200 150 238 176" opacity="0.6" />
          {/* fork */}
          <path d="M70 70 V120 M80 70 V120 M90 70 V120 M70 120 Q80 138 90 120 M80 138 V250" />
          {/* knife */}
          <path d="M330 70 Q352 110 330 160 V250 M330 70 V160" />
          {/* steam */}
          <path d="M176 60 q-10 -12 0 -24 t0 -24" opacity="0.6" />
          <path d="M200 66 q-10 -12 0 -24 t0 -24" opacity="0.8" />
          <path d="M224 60 q-10 -12 0 -24 t0 -24" opacity="0.6" />
        </g>
      )}

      {kind === 'luxe' && (
        <g fill="none" stroke={`url(#ln${uid})`} strokeWidth="1" filter={`url(#gl${uid})`}>
          <rect x="60" y="34" width="280" height="232" />
          <rect x="72" y="46" width="256" height="208" opacity="0.45" />
          {Array.from({ length: 11 }, (_, i) => (
            <line key={i} x1={60 + i * 28} y1="266" x2={150 + i * 28} y2="34" opacity="0.18" />
          ))}
          <circle cx="200" cy="150" r="72" />
          <circle cx="200" cy="150" r="64" opacity="0.4" />
          <text
            x="200"
            y="178"
            textAnchor="middle"
            fontFamily="'Instrument Serif', serif"
            fontStyle="italic"
            fontSize="92"
            fill={`url(#ln${uid})`}
            stroke="none"
          >
            ZL
          </text>
        </g>
      )}
    </svg>
  )
}
