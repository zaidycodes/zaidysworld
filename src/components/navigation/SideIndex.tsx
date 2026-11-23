import { NAV } from '../../data/sections'
import { useApp } from '../../store/app'
import { goTo } from '../../lib/curtain'

/**
 * Desktop section index. Number + animated tick; the label slides out on hover or focus.
 * Always keyboard reachable; `aria-current` marks the active section.
 */
export function SideIndex() {
  const phase = useApp((s) => s.phase)
  const active = useApp((s) => s.activeNav)
  const visible = phase === 'world'
  const onPaper = useApp((s) => s.onPaper)

  return (
    <nav
      aria-label="Sections"
      className={`fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 pl-5 transition-opacity duration-700 lg:block ${onPaper ? 'on-paper' : ''}`}
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
      aria-hidden={!visible}
    >
      <ol className="flex flex-col gap-0.5">
        {NAV.map((n, i) => {
          const isActive = i === active
          return (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  goTo(n.id)
                }}
                aria-current={isActive ? 'true' : undefined}
                tabIndex={visible ? 0 : -1}
                className="group flex min-h-9 items-center gap-3 outline-offset-2"
                style={{ color: 'var(--color-ink)' }}
              >
                <span
                  aria-hidden="true"
                  className="block h-px origin-left bg-current transition-all duration-500 ease-[var(--ease-expo)]"
                  style={{ width: isActive ? 34 : 14, opacity: isActive ? 1 : 0.4 }}
                />
                <span className="eyebrow tnum transition-colors" style={{ color: isActive ? 'var(--color-accent)' : undefined, opacity: isActive ? 1 : 0.75 }}>
                  {n.num}
                </span>
                <span className="eyebrow max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-500 ease-[var(--ease-expo)] group-hover:max-w-40 group-hover:opacity-100 group-focus-visible:max-w-40 group-focus-visible:opacity-100" style={{ color: 'inherit' }}>
                  {n.label}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
