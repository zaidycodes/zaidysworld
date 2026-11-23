# ZAID.WORLD

Immersive personal portfolio — React + Vite + TypeScript + Tailwind v4, one persistent Three.js (R3F) scene, GSAP + ScrollTrigger, Lenis smooth scroll, Framer Motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build locally
```

## ✋ Things only Zaid can fill in (placeholders)

Nothing on the site is invented. Where real info is missing, a config field is left **empty** and the UI simply hides that element (or falls back honestly). Fill these in and the site updates itself — no component edits needed.

| What | Where | What happens today |
| --- | --- | --- |
| **Email address** | `src/data/socials.ts` → `contact.email` | Empty → no email button/row. The primary Contact button falls back to "Message me on LinkedIn". Once set: "Email me" (mailto) button + email row appear. |
| **Résumé PDF** | Drop `resume.pdf` into `public/`, then `src/data/socials.ts` → `contact.resumeUrl = '/resume.pdf'` | Empty → no Résumé button. |
| **Live site URL** | `src/data/site.ts` → `siteUrl` (e.g. `https://zaid.world`) **and** the two `og:image` / `twitter:image` URLs plus `og:url` in `index.html` | Social share previews need absolute URLs, so set these right after deploying. |
| **Project screenshots** | `src/data/projects.ts` → `images: ['/projects/nexus-1.jpg', …]` (files in `public/projects/`) | Empty → each project shows a generated abstract artwork, not a fake screenshot. |
| **Project links** | `src/data/projects.ts` → `links: { live, github }` | Empty → project page says "No public demo or repository for this one yet." |
| **More Journey milestones** | `src/data/journey.ts` | Only milestones that are true today are listed. |
| **GitHub / LinkedIn URLs** | `src/data/socials.ts` | Built from the handle `zaidycodes` you gave. **Please open both links once and confirm they are right** (LinkedIn especially — the `/in/<handle>` pattern is assumed). |

### Honest labelling (keep it that way)

Every project and experiment carries a status — `concept`, `in-progress`, `built`/`completed`, `learning`, `idea` — shown as a text + glyph chip (never colour alone). Nexus AI, Neural Desk and Zaid Luxuries are labelled **concept**; FoodFusion is **in progress** (Java course project). Change `status` in `src/data/projects.ts` when something genuinely ships. There are no testimonials, clients, awards, revenue or stats anywhere.

## Where content lives

All copy is in `src/data/` — components never hard-code personal content.

| File | Controls |
| --- | --- |
| `site.ts` | brand, tagline, hero/about copy, intro lines, location, timezone |
| `sections.ts` | the 01–07 navigation + which section belongs to which nav item |
| `projects.ts` | Work list + project detail pages (story, features, decisions, stack, status) |
| `experiments.ts` | the lab cards (filterable by status) |
| `skills.ts` | tools & stack, grouped as *building / learning / exploring* (no fake % bars) |
| `journey.ts` | timeline (past / now / next) |
| `beyond.ts` | the editorial "Beyond code" chapters |
| `socials.ts` | contact + social links |

**Add a project:** add an object to the array in `projects.ts` (copy an existing one). `visual.kind` is `kernel | hand | plate | luxe` (generative artwork) and `visual.hue` is a 0–360 hue that also tints the 3D scene when the row is hovered. Deep link is automatic: `/#work/<id>`.

## Structure

```
src/
  data/            all content (above)
  sections/        Hero, About, Work (+ProjectDetail), Experiments, Skills, Journey, Beyond, Contact+Footer
  scenes/
    DigitalUniverse/  the single R3F canvas: 4 worlds, camera rig, shaders, particles, CSS fallback
    IntroScene/       4-scene cinematic intro (Skip + Esc always available)
    Secret/           easter-egg room
  components/        animations (Split, Reveal, Magnetic, Cursor, Marquee), navigation, common
  lib/               scroll (Lenis↔GSAP), curtain transitions, audio, device/quality detection
  store/app.ts       zustand (phase, menu, project, quality…)
```

The 3D scene is lazy-loaded and reads a plain mutable `sceneState` inside `useFrame`, so scrolling causes **zero React re-renders**. Camera path = keyframes in `scenes/DigitalUniverse/layout.ts`.

## Signature features

- **Intro** — 4 scenes; *Skip* button or `Esc` at any time; deep links (`/#work/<id>`) skip it; reduced-motion users get the final frame.
- **Navigation** — floating top bar + fullscreen overlay menu with curtain transitions, side index on desktop.
- **Custom cursor** & **magnetic buttons** — only on devices with a fine pointer + hover.
- **Ambient sound** — synthesized in the browser, **off by default**, toggled from the header.
- **Easter egg** — press `↑ ↑ ↓ ↓ ← → ← → B A`, or tap the footer wordmark five times (works on touch).
- **Project detail experience** — fullscreen overlay with hash deep links, prev/next, focus trap, `Esc` to close.

## Performance & resilience

- Quality tiers (`high` / `low` / `none`) picked from device capability; phones get fewer particles and lower pixel ratio.
- No WebGL, or GPU context lost → automatic static CSS backdrop; the whole site stays usable.
- Procedural lighting/environment — no external HDR downloads. Fonts are self-hosted (`@fontsource`).
- `prefers-reduced-motion`: marquees and orbits stop, transitions become near-instant, the intro collapses to its final frame.

## Accessibility

Skip link, landmarks, one `h1`, real headings, `aria-current` on nav, focus traps + focus return in dialogs, visible focus ring everywhere, 44px touch targets, status never conveyed by colour alone, content inert behind the intro/menu.

## Verified

Checked in headless Chrome (software WebGL) at 1440×900 and 390×844: production build, no console errors/warnings, no horizontal overflow, intro skip, project open/close/deep-link, menu + curtain navigation, easter egg, tab order, reduced-motion, and a no-WebGL run. **Not** yet tested on real phones / a real GPU — do a quick pass on your own phone after deploying.

## Deploy

Static site — `npm run build`, upload `dist/` to Vercel / Netlify / GitHub Pages. Then set `siteUrl` and the absolute OG URLs (see table above).
