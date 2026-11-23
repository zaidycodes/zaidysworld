import { useRef } from 'react'
import { ArrowUp, ArrowUpRight, Download, Mail } from 'lucide-react'
import { contact, socials } from '../../data/socials'
import { site } from '../../data/site'
import { useApp } from '../../store/app'
import { goTo } from '../../lib/curtain'
import { useClock } from '../../hooks/useClock'
import { Section, SectionHead } from '../../components/common/Section'
import { Reveal } from '../../components/animations/Reveal'
import { Split } from '../../components/animations/Split'
import { Magnetic } from '../../components/animations/Magnetic'

export function Contact() {
  const linkedin = socials.find((s) => s.id === 'linkedin')
  const github = socials.find((s) => s.id === 'github')
  // Primary action: email if configured, otherwise the verified LinkedIn profile.
  const primary = contact.email
    ? { href: `mailto:${contact.email}`, label: 'Email me', icon: <Mail size={16} aria-hidden="true" />, external: false }
    : linkedin
      ? { href: linkedin.url, label: 'Message me on LinkedIn', icon: <ArrowUpRight size={16} aria-hidden="true" />, external: true }
      : null

  return (
    <Section id="contact" labelledBy="contact-title" className="flex min-h-dvh flex-col justify-center py-28 md:py-40">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-obsidian/20 to-obsidian/50" aria-hidden="true" />
      <div className="container-x">
        <SectionHead
          id="contact-title"
          num="07"
          kicker="Contact"
          headline={["Let's build", 'something', 'extraordinary.']}
          lineClass={[undefined, undefined, 'serif-i']}
          className="[&_h2]:!text-[clamp(2.5rem,8.4vw,9rem)]"
        />

        <Reveal delay={0.1} className="mt-12">
          <p className="serif-i text-[clamp(1.6rem,3.4vw,3rem)] leading-tight">{contact.cta}</p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex flex-wrap items-center gap-3">
          {primary && (
            <Magnetic>
              <a
                className="btn btn-primary min-h-14 px-8"
                href={primary.href}
                {...(primary.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {primary.label}
                {primary.icon}
                {primary.external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </Magnetic>
          )}
          {github && (
            <Magnetic>
              <a className="btn min-h-14 px-8" href={github.url} target="_blank" rel="noopener noreferrer">
                GitHub <ArrowUpRight size={16} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Magnetic>
          )}
          {contact.resumeUrl && (
            <Magnetic>
              <a className="btn min-h-14 px-8" href={contact.resumeUrl} download>
                Resume <Download size={16} aria-hidden="true" />
              </a>
            </Magnetic>
          )}
        </Reveal>

        <Reveal className="mt-20 max-w-2xl">
          <ul className="hairline-t bg-obsidian/55 backdrop-blur-sm">
            {contact.email && (
              <li className="hairline-b">
                <a className="group flex min-h-16 items-center justify-between gap-4 py-4" href={`mailto:${contact.email}`}>
                  <span className="eyebrow w-24 shrink-0">Email</span>
                  <span className="flex-1 truncate text-[1.1rem] transition-transform duration-500 group-hover:translate-x-2">{contact.email}</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </li>
            )}
            {socials.map((s) => (
              <li key={s.id} className="hairline-b">
                <a
                  className="group flex min-h-16 items-center justify-between gap-4 py-4"
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="eyebrow w-24 shrink-0">{s.label}</span>
                  <span className="flex-1 truncate text-[1.1rem] transition-transform duration-500 group-hover:translate-x-2">{s.handle}</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}

/** Animated footer: giant wordmark, the tagline, a hint for the curious. */
export function Footer() {
  const time = useClock(site.timeZone)
  const clicks = useRef({ n: 0, t: 0 })

  // Touch-friendly alternative to the keyboard code: tap the wordmark five times.
  const tap = () => {
    const now = Date.now()
    clicks.current.n = now - clicks.current.t < 900 ? clicks.current.n + 1 : 1
    clicks.current.t = now
    if (clicks.current.n >= 5) {
      clicks.current.n = 0
      useApp.getState().setSecretOpen(true)
    }
  }

  return (
    <footer className="relative z-10 overflow-hidden border-t border-[var(--line)] bg-obsidian/60 pb-8 pt-16 backdrop-blur-sm md:pt-24">
      <div className="container-x">
        <div onClick={tap} className="wm select-none">
          <Split
            as="p"
            text="ZAID.WORLD"
            stagger={0.05}
            start="top 95%"
            className="display block"
            style={{ fontSize: 'clamp(3.2rem, 15.6vw, 20rem)', letterSpacing: '-0.035em', lineHeight: 0.82 }}
          />
        </div>

        <div className="mt-12 grid items-end gap-8 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="serif-i text-[clamp(1.6rem,3vw,2.6rem)] leading-none">{site.footerLine}</p>
            <p className="eyebrow mt-5 leading-relaxed">
              {site.tagline} · {site.location} · <span className="tnum text-ink">{time}</span> IST
            </p>
          </Reveal>
          <Reveal className="md:col-span-4">
            <p className="eyebrow leading-relaxed">
              Psst — try{' '}
              <span className="whitespace-nowrap text-ink" aria-label="up up down down left right left right B A">
                ↑ ↑ ↓ ↓ ← → ← → B A
              </span>
              , or tap the wordmark five times.
            </p>
          </Reveal>
          <div className="flex items-center justify-between gap-6 md:col-span-3 md:justify-end">
            <p className="eyebrow tnum">© {new Date().getFullYear()} Zaid</p>
            <button type="button" onClick={() => goTo('home', 'curtain')} className="btn !min-h-11 !px-4" aria-label="Back to top">
              Top <ArrowUp size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
