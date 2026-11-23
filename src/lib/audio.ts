/**
 * Optional ambient sound, synthesised with the Web Audio API (no audio files to load).
 * Never starts on its own: only after an explicit click on the sound toggle.
 */
let ctx: AudioContext | null = null
let master: GainNode | null = null
let stopTimer: number | undefined

function ensure() {
  if (ctx) return
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 520
  filter.Q.value = 0.8

  const voices: [OscillatorType, number, number][] = [
    ['sine', 55, 0.5],
    ['sine', 55.35, 0.5],
    ['triangle', 110.2, 0.16],
    ['sine', 164.8, 0.07],
    ['sine', 247.2, 0.035],
  ]
  for (const [type, freq, gain] of voices) {
    const o = ctx.createOscillator()
    o.type = type
    o.frequency.value = freq
    const g = ctx.createGain()
    g.gain.value = gain
    o.connect(g).connect(filter)
    o.start()
  }

  // slow breathing on the filter
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.06
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 180
  lfo.connect(lfoGain).connect(filter.frequency)
  lfo.start()

  filter.connect(master).connect(ctx.destination)
}

export function setAmbient(on: boolean) {
  if (on) {
    ensure()
    if (!ctx || !master) return
    window.clearTimeout(stopTimer)
    void ctx.resume()
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 2.5)
  } else if (ctx && master) {
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8)
    stopTimer = window.setTimeout(() => void ctx?.suspend(), 1000)
  }
}

/** Tiny UI tick — only audible when the visitor has switched sound on. */
export function tick(freq = 880) {
  if (!ctx || !master || ctx.state !== 'running') return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'sine'
  o.frequency.value = freq
  g.gain.setValueAtTime(0.0001, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14)
  o.connect(g).connect(ctx.destination)
  o.start()
  o.stop(ctx.currentTime + 0.16)
}
