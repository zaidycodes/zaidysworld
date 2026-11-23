/** Page sections in scroll order. `nav` points at an entry of NAV below. */
export const SECTIONS = [
  { id: 'home', nav: 0, label: 'Home' },
  { id: 'about', nav: 1, label: 'About' },
  { id: 'work', nav: 2, label: 'Work' },
  { id: 'lab', nav: 3, label: 'Experiments' },
  { id: 'stack', nav: 3, label: 'Tools' },
  { id: 'journey', nav: 4, label: 'Journey' },
  { id: 'beyond', nav: 5, label: 'Beyond' },
  { id: 'contact', nav: 6, label: 'Contact' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

export const NAV = [
  { id: 'home', num: '01', label: 'Home', hint: 'The beginning' },
  { id: 'about', num: '02', label: 'About', hint: 'Who is Zaid' },
  { id: 'work', num: '03', label: 'Work', hint: 'Things brought to life' },
  { id: 'lab', num: '04', label: 'Experiments', hint: 'The digital lab & tools' },
  { id: 'journey', num: '05', label: 'Journey', hint: 'The story so far' },
  { id: 'beyond', num: '06', label: 'Beyond', hint: 'Outside the code' },
  { id: 'contact', num: '07', label: 'Contact', hint: "Let's build" },
] as const
