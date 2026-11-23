/**
 * Static backdrop used when WebGL is unavailable (or the GPU context is lost).
 * Pure CSS, no JS — the site stays beautiful and fully usable.
 */
export function Fallback() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-obsidian">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 12% 22%, #fff 50%, transparent 51%),radial-gradient(1px 1px at 78% 14%, #c9ccd6 50%, transparent 51%),radial-gradient(1.5px 1.5px at 34% 68%, #fff 50%, transparent 51%),radial-gradient(1px 1px at 88% 72%, #9b8cff 50%, transparent 51%),radial-gradient(1px 1px at 56% 40%, #fff 50%, transparent 51%),radial-gradient(1.5px 1.5px at 22% 88%, #648cff 50%, transparent 51%),radial-gradient(1px 1px at 66% 90%, #fff 50%, transparent 51%)',
          backgroundSize: '420px 420px, 380px 380px, 520px 520px, 460px 460px, 340px 340px, 600px 600px, 400px 400px',
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(100,140,255,0.22), rgba(155,140,255,0.08) 40%, transparent 68%)',
          filter: 'blur(6px)',
        }}
      />
      <div
        className="absolute left-[72%] top-[34%] font-display font-bold leading-none text-transparent md:top-1/2 md:-translate-y-1/2"
        style={{
          fontSize: 'min(62vmin, 34rem)',
          WebkitTextStroke: '1.5px rgba(201,204,214,0.35)',
          transform: 'translate(-50%, -50%) skewX(-6deg)',
          filter: 'drop-shadow(0 0 40px rgba(100,140,255,0.25))',
        }}
      >
        Z
      </div>
    </div>
  )
}
