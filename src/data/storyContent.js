export const WONDER = {
  legA: 60,
  legB: 80,
  hypotenuse: 100,
  unknown: 'c',
  unit: 'm',
  headline: "Edges: 60 m + 80 m = 140 m · Shortcut = ?",
  body: "Priya follows the edges of a 60 m by 80 m school field. Jun Kai cuts straight across the middle. Can we find out how long his shortcut is without walking it?",
  tallyQuestion: "What if you could measure a path you never walked?"
};

export const STORY_PANELS = [
  {
    panel: 1,
    id: 'shortcut-problem',
    title: 'The Shortcut Problem',
    text: 'At the Right-Angle Works, apprentices Priya and Jun Kai race across their school field, which is 60 m long and 80 m wide. Priya walks the two edges meeting at the right angle, called the legs. Jun Kai cuts straight across the opposite side, called the hypotenuse.',
    highlight: 'The hypotenuse is the longest side of a right-angled triangle, opposite the right angle.',
    character: 'Jun Kai',
    characterEmoji: '👦',
    bubble: 'I only walked the hypotenuse, and I still got here first!',
    image: '/assets/story/story_1.png',
    alt: 'Priya pointing across the 60 m by 80 m field diagonal shortcut with Jun Kai taking notes.',
    imageBg: '#2e1065',
    imageEmoji: '🏃'
  },
  {
    panel: 2,
    id: 'squares-on-sides',
    title: 'Squares on the Sides',
    text: 'Foreman Tally lays square floor tiles along the sides of a triangle with legs 3 m and 4 m. The leg squares hold 9 and 16 tiles. The square on the hypotenuse holds exactly 25 tiles: 9 + 16 = 25.',
    highlight: 'In any right-angled triangle, a² + b² = c², where c is the hypotenuse.',
    character: 'Foreman Tally',
    characterEmoji: '🦉',
    bubble: 'Add the two small squares and you get the big square. Every time!',
    image: '/assets/story/story_2.png',
    alt: 'Foreman Tally showing square tile grids of 9, 16, and 25 on the sides of a 3-4-5 right triangle.',
    imageBg: '#172554',
    imageEmoji: '📐'
  },
  {
    panel: 3,
    id: 'unknown-sides',
    title: 'Finding Unknown Sides',
    text: 'To find the hypotenuse, add the squares: 60² + 80² = 10 000, so √10 000 = 100 m. To find a shorter leg, subtract: a 13-m ladder with foot 5 m out reaches √(13² − 5²) = √144 = 12 m up the wall.',
    highlight: 'Add the squares for the hypotenuse; subtract the squares for a shorter leg.',
    character: 'Priya',
    characterEmoji: '👧',
    bubble: 'Add to find the longest side, subtract to find a leg!',
    image: '/assets/story/story_3.png',
    alt: 'Priya checking calculations with blueprints while Jun Kai steadies a 13 m ladder.',
    imageBg: '#14532d',
    imageEmoji: '🪜'
  },
  {
    panel: 4,
    id: 'build-it-right',
    title: 'Build It Right',
    text: 'Builders check corners using a 3-4-5 rope: since 30² + 40² = 50², the corner is square. Remember the four moves: Draw and label the triangle, identify the unknown, calculate, and check your answer. Now enter the workshop!',
    highlight: 'Draw it, label it, calculate it, and check it.',
    character: 'Foreman Tally',
    characterEmoji: '🦉',
    bubble: 'Hard hats on, apprentices. The Workshop is open!',
    image: '/assets/story/story_4.png',
    alt: 'Foreman Tally welcoming apprentices at the Right-Angle Works workshop entrance.',
    imageBg: '#1e1b4b',
    imageEmoji: '🧰'
  }
];
