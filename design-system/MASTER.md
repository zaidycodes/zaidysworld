# ZAID.WORLD — Design System (MASTER)

> Design brief written before code, per the ui-ux-pro-max workflow. The user's own
> brand rules (palette, fonts, tone) override the skill's generic tables.

## Brief
- **Product:** personal portfolio, treated as an interactive "digital universe", not a template.
- **Pattern:** Cinematic intro → single long scroll with 8 sections, each in its own "world".
- **Style:** Dark Mode (OLED) + Exaggerated Minimalism + Kinetic Typography + Parallax Storytelling.
  One style across the site; the *Beyond* section flips to "paper" as a deliberate editorial break.
- **Dials:** Variance 8 · Motion 8 · Density 3 (spacious, huge type, lots of negative space).
- **Why it fits:** an aspiring creative technologist needs to show ambition *and* restraint.
- **Anti-patterns to avoid:** purple-gradient-everywhere, random floating glass cards, emoji icons,
  fake stats/testimonials, hover-only actions, animation that blocks input.

## Worlds (3D) → Sections
| World | Sections | Look |
|-------|----------|------|
| A · Futuristic space | 01 Home, 02 About | Obsidian void, infinite starfield, metallic **Z monolith**, cinematic rim light |
| B · Abstract digital universe | 03 Work, 04 Lab, 04 Tools | Liquid-chrome morphing form, drifting shards, wire cage, reacts to project hover |
| C · Cinematic architecture | 05 Journey | Monumental pillar corridor, reflective floor, light slit; camera = scroll |
| — · Paper (editorial) | 06 Beyond | Soft-white paper, serif display, no canvas |
| D · Eclipse | 07 Contact | Black sun, accretion ring, orbiting dust |

## Tokens
| Token | Value | Use |
|-------|-------|-----|
| `--color-obsidian` | `#050506` | primary background |
| `--color-charcoal` | `#101014` | surfaces |
| `--color-ink` | `#F2F2F0` | primary text |
| `--color-mute` | `#898990` | secondary text (5.8:1 on obsidian) |
| `--color-accent` | `#648CFF` | accent (button label on accent = obsidian, 6.6:1) |
| `--color-violet` | `#9B8CFF` | occasional highlight |
| `--color-silver` | `#C9CCD6` | occasional highlight |
| `--color-paper` | `#F2F2F0` | Beyond section background |
| `--color-paper-ink` | `#0B0B0D` | Beyond text; mute on paper `#55555C` |

Spacing: 4/8 rhythm. Container max `88rem`, 16px mobile gutter / 40px desktop.
Radius: 0–2px only (sharp architecture), pills only for status chips.
Borders: 1px at `rgba(242,242,240,.12)`.

## Typography
- **Display:** Space Grotesk (700, tight tracking, uppercase, oversized `clamp()`).
- **Editorial accent:** Instrument Serif (italic) — used for emphasis words and the Beyond section.
- **Body:** Inter. **UI/labels:** Manrope (uppercase, +0.14em tracking).
- Body ≥ 16px, line-height 1.6, line length ≤ 68ch.

## Motion
- Durations: micro 180ms · UI 420ms · section 900–1400ms. Enter: `power3.out` / `expo.out`.
- Only `transform` and `opacity` are animated (plus clip-path on overlays).
- Reduced-motion: no smooth-scroll, no scrub, no auto-rotation, intro collapses to its final frame.
- Everything interruptible; intro has a persistent **Skip** and `Esc`.

## Accessibility
- Skip link, semantic landmarks, one `h1`, sequential headings, 2px focus rings,
  focus trap in overlays, `aria-current` on active nav, 44px minimum targets.
- Custom cursor only on `(hover:hover) and (pointer:fine)`; native cursor everywhere else.
- Every interaction that exists on hover also exists on focus/click.

## Content rule
Only real information. Unknown details live in `src/data/*` as optional fields; the UI hides
anything that is empty instead of showing fake placeholders.
