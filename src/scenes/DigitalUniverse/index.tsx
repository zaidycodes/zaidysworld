import { lazy, Suspense } from 'react'
import { useApp } from '../../store/app'
import { ErrorBoundary } from '../../components/common/ErrorBoundary'
import { Fallback } from './Fallback'

// The entire 3D stack (three, r3f, drei, shaders) lives in this lazy chunk.
const Universe = lazy(() => import('./Universe'))

/** Fixed, full-viewport backdrop behind all content. Never intercepts pointer events. */
export function DigitalUniverse() {
  const quality = useApp((s) => s.quality)
  const setQuality = useApp((s) => s.setQuality)
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-obsidian">
      {quality === 'none' ? (
        <Fallback />
      ) : (
        <ErrorBoundary fallback={<Fallback />} onError={() => setQuality('none')}>
          <Suspense fallback={<Fallback />}>
            <Universe quality={quality} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  )
}
