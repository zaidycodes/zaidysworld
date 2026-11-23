import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../../store/app'
import { lockScroll, unlockScroll } from '../../lib/scroll'
import { useFocusTrap } from '../../hooks/useFocusTrap'

interface P {
  x: number
  y: number
  vx: number
  vy: number
  tx: number
  ty: number
  c: number
}

/** The hidden room: particles assemble into ZAID and scatter away from the pointer. */
function Field() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useApp((s) => s.reducedMotion)

  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    let raf = 0
    let parts: P[] = []
    const mouse = { x: -999, y: -999 }
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const build = () => {
      w = window.innerWidth
      h = window.innerHeight
      cv.width = w * dpr
      cv.height = h * dpr
      cv.style.width = `${w}px`
      cv.style.height = `${h}px`
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const o = off.getContext('2d')!
      const size = Math.min(w * 0.3, 300)
      o.fillStyle = '#fff'
      o.font = `700 ${size}px 'Space Grotesk Variable', sans-serif`
      o.textAlign = 'center'
      o.textBaseline = 'middle'
      o.fillText('ZAID', w / 2, h / 2 - h * 0.04)
      const data = o.getImageData(0, 0, w, h).data
      const step = w < 640 ? 5 : 6
      const targets: [number, number][] = []
      for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) if (data[(y * w + x) * 4 + 3] > 140) targets.push([x, y])
      parts = targets.map(([tx, ty]) => ({
        x: reduced ? tx : Math.random() * w,
        y: reduced ? ty : Math.random() * h,
        vx: 0,
        vy: 0,
        tx,
        ty,
        c: Math.random(),
      }))
    }

    const frame = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < 110 * 110) {
          const d = Math.sqrt(d2) || 1
          const f = (110 - d) / 110
          p.vx += (dx / d) * f * 3.2
          p.vy += (dy / d) * f * 3.2
        }
        p.vx += (p.tx - p.x) * 0.045
        p.vy += (p.ty - p.y) * 0.045
        p.vx *= 0.86
        p.vy *= 0.86
        p.x += p.vx
        p.y += p.vy
        ctx.fillStyle = p.c < 0.7 ? '#f2f2f0' : p.c < 0.9 ? '#648cff' : '#9b8cff'
        ctx.fillRect(p.x, p.y, 2.2, 2.2)
      }
      raf = requestAnimationFrame(frame)
    }

    const move = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const leave = () => {
      mouse.x = mouse.y = -999
    }

    build()
    if (reduced) {
      frame()
      cancelAnimationFrame(raf)
    } else raf = requestAnimationFrame(frame)
    window.addEventListener('resize', build)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', build)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerleave', leave)
    }
  }, [reduced])

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0" />
}

export function Secret() {
  const open = useApp((s) => s.secretOpen)
  const setOpen = useApp((s) => s.setSecretOpen)
  const root = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  useFocusTrap(root, open, closeBtn)

  useEffect(() => {
    if (!open) return
    lockScroll()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (!useApp.getState().menuOpen && !useApp.getState().projectId) unlockScroll()
    }
  }, [open, setOpen])

  if (!open) return null
  return (
    <div ref={root} role="dialog" aria-modal="true" aria-label="Secret room" className="fixed inset-0 z-[110] bg-obsidian">
      <Field />
      <div className="pointer-events-none absolute inset-x-0 top-0 container-x flex h-16 items-center justify-between md:h-20">
        <p className="eyebrow text-accent">Access granted</p>
        <button
          ref={closeBtn}
          type="button"
          onClick={() => setOpen(false)}
          className="eyebrow pointer-events-auto inline-flex min-h-11 items-center gap-3 border border-[var(--line-strong)] px-4 text-ink hover:border-ink"
        >
          Exit <X size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 container-x pb-10 text-center md:pb-14">
        <p className="serif-i text-[clamp(1.6rem,3.4vw,3rem)]">You found the hidden room.</p>
        <p className="eyebrow mt-4">Curiosity is the whole point · Move your cursor through it · Esc to leave</p>
      </div>
    </div>
  )
}
