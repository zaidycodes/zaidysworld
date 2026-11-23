import type { Social } from '../types'

/**
 * Contact configuration.
 *  - Handles below were provided by Zaid; the URLs are the standard profile URLs for those handles.
 *  - `email` and `resumeUrl` are intentionally EMPTY: fill them in and the buttons appear
 *    automatically (resume: drop a PDF in /public and set e.g. "/Zaid-Resume.pdf").
 */
export const contact = {
  email: '',
  resumeUrl: '',
  cta: 'Have an idea? Let’s make it real.',
}

export const socials: Social[] = [
  { id: 'github', label: 'GitHub', handle: '@zaidycodes', url: 'https://github.com/zaidycodes' },
  { id: 'linkedin', label: 'LinkedIn', handle: '@zaidycodes', url: 'https://www.linkedin.com/in/zaidycodes' },
]
