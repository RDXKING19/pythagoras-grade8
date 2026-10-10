
// Station A Confirmation Question
export const STATION_A_CONFIRMATION = {
  prompt: "In a right-angled triangle, the area of the square on the hypotenuse equals…",
  options: [
    "the sum of the areas of the squares on the other two sides",
    "the sum of the other two sides",
    "the product of the other two sides",
    "double the longer side"
  ],
  correct: "the sum of the areas of the squares on the other two sides",
  explanation: "Pythagoras' theorem states that a² + b² = c²: the area of the square on the hypotenuse equals the sum of the areas of the squares on the legs."
};

// Station B Ladder Cases: [Ladder Length L, Wall Height h, Ground Distance d]
// Validated: d² + h² = L²
export const LADDER_CASES = [
  { L: 13, h: 12, d: 5 },
  { L: 10, h: 8, d: 6 },
  { L: 17, h: 15, d: 8 },
  { L: 25, h: 24, d: 7 },
  { L: 15, h: 12, d: 9 },
  { L: 26, h: 24, d: 10 }
];

// Validate all ladder cases
LADDER_CASES.forEach(c => {
  if (c.d * c.d + c.h * c.h !== c.L * c.L) {
    throw new Error(`Invalid ladder case: ${JSON.stringify(c)}`);
  }
});

// Station C Scenes
export const ZIPLINE_SCENES = [
  {
    id: 'zipline',
    title: 'Park Zip-Line Cable',
    visual: 'zipline',
    visualData: { towerH: 20, poleH: 8, gap: 16, unit: 'm' },
    needs: ['subtract'],
    steps: [
      {
        prompt: "How far does the line drop between the 20 m tower and the 8 m pole?",
        options: ["12 m", "20 m", "8 m", "28 m"],
        correct: "12 m",
        explain: "Vertical drop = 20 m − 8 m = 12 m. That forms leg a of the right triangle."
      },
      {
        prompt: "Which equation finds the zip-line cable length L across the 16 m gap?",
        options: ["12² + 16² = L²", "12 + 16 = L", "16² − 12² = L²", "20² + 16² = L²"],
        correct: "12² + 16² = L²",
        explain: "The cable is the hypotenuse opposite the right angle, so add the squares of 12 m and 16 m."
      },
      {
        prompt: "What is the final cable length L?",
        options: ["20 m", "28 m", "144 m", "400 m"],
        correct: "20 m",
        explain: "12² + 16² = 144 + 256 = 400. √400 = 20 m."
      }
    ]
  },
  {
    id: 'gate-brace',
    title: 'Workshop Gate Diagonal',
    visual: 'rect-diagonal',
    visualData: { w: 1.5, h: 2.0, unit: 'm', object: 'gate' },
    needs: ['cost'],
    steps: [
      {
        prompt: "Which side of the right-angled triangle is the diagonal brace?",
        options: ["The hypotenuse", "Leg a", "Leg b", "The right angle"],
        correct: "The hypotenuse",
        explain: "The diagonal spans across opposite corners opposite the right angle: it is the hypotenuse."
      },
      {
        prompt: "Which equation finds the brace length c for a 1.5 m by 2.0 m gate?",
        options: ["1.5² + 2.0² = c²", "1.5 + 2.0 = c", "2.0² − 1.5² = c²", "1.5 × 2.0 = c"],
        correct: "1.5² + 2.0² = c²",
        explain: "Both legs are known, so square and add: 1.5² + 2.0² = 2.25 + 4.0 = 6.25 = c²."
      },
      {
        prompt: "At $18 per metre, what does the 2.5 m steel brace cost?",
        options: ["$45", "$36", "$63", "$112.50"],
        correct: "$45",
        explain: "Length = √6.25 = 2.5 m. Total cost = 2.5 × $18 = $45."
      }
    ]
  },
  {
    id: 'rafter',
    title: 'Gable Roof Rafters',
    visual: 'rafter',
    visualData: { halfSpan: 12, rise: 5, unit: 'm' },
    needs: ['total'],
    steps: [
      {
        prompt: "Identify the two perpendicular legs of the roof half-section:",
        options: ["12 m and 5 m", "12 m and 13 m", "5 m and 24 m", "24 m and 12 m"],
        correct: "12 m and 5 m",
        explain: "The half-span (12 m) and rise (5 m) meet at a 90° right angle."
      },
      {
        prompt: "Which equation gives the length of one sloping rafter c?",
        options: ["5² + 12² = c²", "12² − 5² = c²", "5 + 12 = c", "5 × 12 = c²"],
        correct: "5² + 12² = c²",
        explain: "The rafter is the hypotenuse: 5² + 12² = 25 + 144 = 169 = c², so c = 13 m."
      },
      {
        prompt: "How much total timber is needed for both sloping rafters?",
        options: ["26 m", "13 m", "34 m", "169 m"],
        correct: "26 m",
        explain: "One rafter is 13 m; two identical rafters need 13 × 2 = 26 m of timber."
      }
    ]
  },
  {
    id: 'two-leg-route',
    title: 'Park Orienteering Shortcut',
    visual: 'route-compare',
    visualData: { a: 8, b: 15, unit: 'm', show: 'both' },
    needs: ['subtract'],
    steps: [
      {
        prompt: "How far did you walk outward along the two perpendicular edges (8 m east, 15 m north)?",
        options: ["23 m", "17 m", "30 m", "120 m"],
        correct: "23 m",
        explain: "Outward edge distance = 8 m + 15 m = 23 m."
      },
      {
        prompt: "Is the 17 m return route straight along the hypotenuse?",
        options: [
          "Yes, because 8² + 15² = 64 + 225 = 289 = 17²",
          "No, because 8 + 15 > 17",
          "Yes, because 17 is an odd number",
          "No, because 17² − 15² = 8"
        ],
        correct: "Yes, because 8² + 15² = 64 + 225 = 289 = 17²",
        explain: "By Pythagoras, 8² + 15² = 289 = 17², confirming the straight path is the hypotenuse."
      },
      {
        prompt: "How many metres did the straight return route save compared to walking the edges?",
        options: ["6 m", "17 m", "23 m", "8 m"],
        correct: "6 m",
        explain: "Distance saved = 23 m (edges) − 17 m (hypotenuse) = 6 m."
      }
    ]
  }
];

// Station D Seeded Error Reports
export function makeReport(rng, errorType) {
  switch (errorType) {
    case 'E1': { // add instead of subtract for leg
      const c = 13, b = 5;
      return {
        type: 'E1',
        title: "Trainee Report #101: Ladder Wall Height",
        lines: [
          { tag: 'Given', text: `Ladder L = ${c} m, base distance b = ${b} m` },
          { tag: 'Equation', text: `h² = ${c}² + ${b}² = 169 + 25 = 194` },
          { tag: 'Working', text: `h = √194 ≈ 13.9 m` },
          { tag: 'Answer', text: `The ladder reaches 13.9 m up the wall.` }
        ],
        faultyIndex: 1,
        fixes: [
          `h² = ${c}² − ${b}² = 169 − 25 = 144`,
          `h = ${c} + ${b} = 18 m`,
          `h² = ${c} × ${b} = 65`
        ],
        correctFix: `h² = ${c}² − ${b}² = 169 − 25 = 144`,
        why: "To find a leg, subtract the other leg's square from the hypotenuse's square. Adding makes the wall taller than the ladder!"
      };
    }

    case 'E2': { // forgot the square root
      const a = 60, b = 80, c = 100;
      return {
        type: 'E2',
        title: "Trainee Report #102: Field Shortcut",
        lines: [
          { tag: 'Given', text: `Field edges a = ${a} m, b = ${b} m` },
          { tag: 'Equation', text: `c² = ${a}² + ${b}² = 3600 + 6400 = 10 000` },
          { tag: 'Working', text: `c = 10 000 m` },
          { tag: 'Answer', text: `The shortcut is 10 000 m long.` }
        ],
        faultyIndex: 2,
        fixes: [
          `c = √10 000 = ${c} m`,
          `c = 10 000 ÷ 2 = 5000 m`,
          `c = 10 000² m`
        ],
        correctFix: `c = √10 000 = ${c} m`,
        why: "10 000 is c², not c. You must take the square root to find the actual side length."
      };
    }

    case 'E3': { // hypotenuse treated as a leg
      const L = 15, h = 12;
      return {
        type: 'E3',
        title: "Trainee Report #103: Ladder Foot Setback",
        lines: [
          { tag: 'Given', text: `Ladder L = ${L} m, wall height reaches h = ${h} m` },
          { tag: 'Equation', text: `${L}² + ${h}² = d²` },
          { tag: 'Working', text: `225 + 144 = 369, so d = √369 ≈ 19.2 m` },
          { tag: 'Answer', text: `Set the ladder foot 19.2 m from the wall.` }
        ],
        faultyIndex: 1,
        fixes: [
          `d² = ${L}² − ${h}² = 225 − 144 = 81`,
          `d = ${L} − ${h} = 3 m`,
          `d² = ${L}² + ${h}² = 369`
        ],
        correctFix: `d² = ${L}² − ${h}² = 225 − 144 = 81`,
        why: "The ladder L is the hypotenuse! The equation must isolate the unknown leg: d² = L² − h²."
      };
    }

    case 'E4': { // squaring slip (e.g. 5² = 10)
      return {
        type: 'E4',
        title: "Trainee Report #104: Timber Diagonal",
        lines: [
          { tag: 'Given', text: `Leg a = 5 cm, leg b = 12 cm` },
          { tag: 'Equation', text: `c² = 5² + 12²` },
          { tag: 'Working', text: `5² = 10 and 12² = 24, so c² = 10 + 24 = 34` },
          { tag: 'Answer', text: `c = √34 ≈ 5.8 cm` }
        ],
        faultyIndex: 2,
        fixes: [
          `5² = 25 and 12² = 144, so c² = 25 + 144 = 169`,
          `5² = 50 and 12² = 120, so c² = 170`,
          `5² = 15 and 12² = 36, so c² = 51`
        ],
        correctFix: `5² = 25 and 12² = 144, so c² = 25 + 144 = 169`,
        why: "Squaring means multiplying a number by itself, not by 2! 5² = 5 × 5 = 25 and 12² = 12 × 12 = 144."
      };
    }

    case 'E5': { // added lengths not squares
      return {
        type: 'E5',
        title: "Trainee Report #105: Corner Tile Pathway",
        lines: [
          { tag: 'Given', text: `Legs a = 3 m, b = 4 m` },
          { tag: 'Equation', text: `c = a + b = 3 + 4` },
          { tag: 'Working', text: `c = 7 m` },
          { tag: 'Answer', text: `The straight path is 7 m.` }
        ],
        faultyIndex: 1,
        fixes: [
          `c² = 3² + 4² = 9 + 16 = 25, so c = √25 = 5 m`,
          `c = 3 × 4 = 12 m`,
          `c² = 3 + 4 = 7 m`
        ],
        correctFix: `c² = 3² + 4² = 9 + 16 = 25, so c = √25 = 5 m`,
        why: "You cannot add side lengths directly; you must add the squares of the sides, then take the square root."
      };
    }

    case 'E6': { // converse concluded wrongly
      return {
        type: 'E6',
        title: "Trainee Report #106: Corner Square Verification",
        lines: [
          { tag: 'Given', text: `Corner sides measured: 7 cm, 24 cm, 25 cm` },
          { tag: 'Equation', text: `7² + 24² = 49 + 576 = 625` },
          { tag: 'Working', text: `25² = 625, and 625 = 625` },
          { tag: 'Answer', text: `Since the squares match, the corner is NOT right-angled.` }
        ],
        faultyIndex: 3,
        fixes: [
          `Since 7² + 24² = 25², the corner IS a true right angle.`,
          `Since 7 + 24 ≠ 25, the corner cannot be square.`,
          `The corner is 180° because the numbers are equal.`
        ],
        correctFix: `Since 7² + 24² = 25², the corner IS a true right angle.`,
        why: "By the converse of Pythagoras' theorem, when a² + b² = c² the triangle IS right-angled."
      };
    }

    case 'E7':
    default: { // rounding slip
      return {
        type: 'E7',
        title: "Trainee Report #107: Ramp Sloping Surface",
        lines: [
          { tag: 'Given', text: `Ramp rise = 3 m, run = 8 m` },
          { tag: 'Equation', text: `c² = 3² + 8² = 9 + 64 = 73` },
          { tag: 'Working', text: `c = √73 = 8.5440...` },
          { tag: 'Answer', text: `Rounding to 1 decimal place: c ≈ 8.6 m` }
        ],
        faultyIndex: 3,
        fixes: [
          `Rounding to 1 decimal place: c ≈ 8.5 m`,
          `Rounding to 1 decimal place: c ≈ 9.0 m`,
          `Rounding to 1 decimal place: c ≈ 8.54 m`
        ],
        correctFix: `Rounding to 1 decimal place: c ≈ 8.5 m`,
        why: "8.544... rounds down to 8.5 because the digit in the hundredths place is 4 (< 5)."
      };
    }
  }
}
