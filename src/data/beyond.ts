import type { Chapter } from '../types'

export const beyond = {
  headline: ["There's more", 'to the story.'],
  lede: 'Code is only one of the ways I think. Here are the others.',
  chapters: [
    {
      id: 'chess',
      title: 'Chess',
      line: 'Still a beginner, learning to check for blunders before every move.',
      motif: 'chess',
    },
    {
      id: 'tt',
      title: 'Table tennis',
      line: 'Sundays are for the table. Fast reflexes, no screens.',
      motif: 'pingpong',
    },
    {
      id: 'film',
      title: 'Films & series',
      line: 'Breaking Bad, Taxi Driver, Money Heist — I like taking stories apart to see how they work.',
      motif: 'film',
    },
    {
      id: 'books',
      title: 'Books',
      line: 'Read 1984 and keep going back to it. Ideas about power and persuasion stick with me.',
      motif: 'book',
    },
    {
      id: 'ideas',
      title: 'Paradoxes',
      line: 'The Fermi paradox, simulation theory, bootstrap loops — questions with no clean answer.',
      motif: 'loop',
    },
    {
      id: 'build',
      title: 'Building things',
      line: 'Entrepreneurship, product ideas and the habit of turning a thought into something you can open.',
      motif: 'build',
    },
  ] satisfies Chapter[],
  marquee: ['Chess', 'Table tennis', 'Film', 'Books', 'Paradoxes', 'Startups'],
}
