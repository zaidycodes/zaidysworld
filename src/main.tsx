import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import '@fontsource-variable/manrope'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import './styles/global.css'
import App from './App'

/**
 * Load the display fonts before the first paint of the intro so text never reflows
 * (fixes layout shift from the fallback → webfont swap). Capped so a slow network never blocks the site.
 */
const fontsReady = Promise.race([
  Promise.all([
    document.fonts.load('700 1em "Space Grotesk Variable"'),
    document.fonts.load('400 1em "Inter Variable"'),
    document.fonts.load('600 1em "Manrope Variable"'),
    document.fonts.load('italic 400 1em "Instrument Serif"'),
  ]).catch(() => undefined),
  new Promise((r) => window.setTimeout(r, 1500)),
])

fontsReady.then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
