import {
  fmt,
  hypDistractors,
  legDistractors
} from '../utils/pythagorasMath.js';
import { createRNG } from '../utils/rng.js';
import { pickSlots } from '../utils/slots.js';
import { WORLDS } from '../config/worlds.config.js';

export const DISTRICTS = WORLDS.map(w => ({
  id: w.id,
  name: w.name,
  icon: w.emoji,
  accent: w.accent,
  conceptFocus: w.conceptFocus,
  description: w.description,
  boss: w.boss
}));

// Helper to shuffle options and ensure uniqueness
function makeOptions(correctVal, distractorVals, rng) {
  const cStr = fmt(correctVal);
  const seen = new Set([cStr]);
  const opts = [cStr];

  for (const d of distractorVals) {
    const s = fmt(d);
    if (!seen.has(s) && d > 0) {
      seen.add(s);
      opts.push(s);
    }
  }

  // Fallbacks if not 4
  let offset = 1;
  while (opts.length < 4) {
    const candidate = Number(correctVal) + offset;
    const candStr = fmt(candidate);
    if (!seen.has(candStr) && candidate > 0) {
      seen.add(candStr);
      opts.push(candStr);
    }
    offset = offset > 0 ? -offset : -offset + 1;
  }

  return rng.shuffle(opts);
}

// -------------------------------------------------------------
// WORLD 0: Spotter's Lookout (Identify Hypotenuse & Equation)
// 10 Distinct Scenarios & Questions
// -------------------------------------------------------------
function genWorld0(slot, rng) {
  switch (slot) {
    case 0: {
      const options = rng.shuffle(['The ladder', 'The brick wall', 'The ground level', 'The corner junction']);
      return {
        category: 'identify-hypotenuse',
        visual: 'ladder-wall',
        questionText: `[Job #1] A 13 m fire rescue ladder leans against a brick building on level ground. Which component forms the hypotenuse?`,
        options,
        correctAnswer: 'The ladder',
        explanation: "The ladder is opposite the 90° angle between wall and ground: it is the longest side and the hypotenuse.",
        hint1: "Look for the side lying directly opposite the 90° right angle.",
        hint2: "The sloping ladder is the longest part of the triangle.",
        visualData: { L: 13, h: 12, d: 5, unit: 'm', unknown: '' }
      };
    }
    case 1: {
      const correct = 'p² + q² = r²';
      const options = rng.shuffle([correct, 'p² + r² = q²', 'q² + r² = p²', 'p + q = r²']);
      return {
        category: 'pythagoras-equation',
        visual: 'right-triangle',
        questionText: `[Job #2] In a right-angled triangle with legs p and q meeting at 90° and hypotenuse r, which equation is correct?`,
        options,
        correctAnswer: correct,
        explanation: "Pythagoras' theorem states that (leg a)² + (leg b)² = (hypotenuse c)², so p² + q² = r².",
        hint1: "The two shorter legs add together on one side.",
        hint2: "The hypotenuse r stands alone on the right-hand side.",
        visualData: { a: 3, b: 4, c: 5, unit: 'cm', unknown: 'none' }
      };
    }
    case 2: {
      const options = rng.shuffle(['The sloping riding surface', 'The vertical ramp height', 'The horizontal ground run', 'The safety railing']);
      return {
        category: 'identify-hypotenuse',
        visual: 'ramp',
        questionText: `[Job #3] A skatepark launch ramp has a 1.2 m vertical rise and a 1.6 m horizontal run. Which part is the hypotenuse?`,
        options,
        correctAnswer: 'The sloping riding surface',
        explanation: "The sloping ramp surface connects the top and bottom opposite the right angle, making it the hypotenuse.",
        hint1: "Find the surface that slopes diagonally.",
        hint2: "The slope is opposite the perpendicular corner.",
        visualData: { rise: 1.2, run: 1.6, length: 2.0, unit: 'm' }
      };
    }
    case 3: {
      const options = rng.shuffle(['Side c (15 cm)', 'Side a (9 cm)', 'Side b (12 cm)', 'The 90° vertex']);
      return {
        category: 'identify-sides',
        visual: 'identify-sides',
        questionText: `[Job #4] A right-angled triangle has sides of 9 cm, 12 cm, and 15 cm. Which side is the hypotenuse?`,
        options,
        correctAnswer: 'Side c (15 cm)',
        explanation: "15 cm is the longest side and lies directly opposite the 90° square symbol: it is the hypotenuse.",
        hint1: "The hypotenuse is always the longest side of a right triangle.",
        hint2: "Compare 9, 12, and 15: which is greatest?",
        visualData: { a: 9, b: 12, c: 15, unit: 'cm' }
      };
    }
    case 4: {
      const options = rng.shuffle(['The steel stay wire', 'The vertical mast', 'The horizontal boom', 'The boat deck']);
      return {
        category: 'identify-hypotenuse',
        visual: 'right-triangle',
        questionText: `[Job #5] On a sailing yacht, a vertical mast and horizontal boom meet at 90°, supported by a taut steel stay wire. Which part is the hypotenuse?`,
        options,
        correctAnswer: 'The steel stay wire',
        explanation: "The stay wire connects the mast top to the boom end opposite the 90° joint: it is the hypotenuse.",
        hint1: "Identify the diagonal cable holding the rig together.",
        hint2: "The stay wire spans opposite the 90° mast-boom corner.",
        visualData: { a: 8, b: 15, c: 17, unit: 'm' }
      };
    }
    case 5: {
      const correct = '5² + 12² = 13²';
      const options = rng.shuffle([correct, '5² + 13² = 12²', '12² + 13² = 5²', '5 × 12 = 13²']);
      return {
        category: 'pythagoras-equation',
        visual: 'right-triangle',
        questionText: `[Job #6] A right triangle has side lengths of 5 m, 12 m, and 13 m. Which equation demonstrates Pythagoras' theorem?`,
        options,
        correctAnswer: correct,
        explanation: "5² + 12² = 25 + 144 = 169 = 13². The two shorter legs squared equal the square of the longest side 13.",
        hint1: "Add the squares of the two shorter sides (5 and 12).",
        hint2: "25 + 144 = 169 = 13².",
        visualData: { a: 5, b: 12, c: 13, unit: 'm' }
      };
    }
    case 6: {
      const options = rng.shuffle(['The diagonal screen line', 'The horizontal width', 'The vertical height', 'The outer plastic bezel']);
      return {
        category: 'identify-hypotenuse',
        visual: 'rect-diagonal',
        questionText: `[Job #7] A computer monitor has a width of 40 cm and a height of 30 cm with a 50 cm diagonal. Which measurement is the hypotenuse?`,
        options,
        correctAnswer: 'The diagonal screen line',
        explanation: "The diagonal bisects the rectangular monitor into two right-angled triangles opposite the 90° corners: it is the hypotenuse.",
        hint1: "Screen sizes are measured corner-to-corner.",
        hint2: "The 50 cm diagonal is opposite the screen's 90° corner.",
        visualData: { w: 40, h: 30, c: 50, unit: 'cm' }
      };
    }
    case 7: {
      const options = rng.shuffle(['The sloping timber rafter', 'The vertical king post', 'The horizontal ceiling tie', 'The apex nail plate']);
      return {
        category: 'identify-hypotenuse',
        visual: 'rafter',
        questionText: `[Job #8] In an attic roof truss, a vertical king post meets a horizontal ceiling tie at 90°. Which beam forms the hypotenuse?`,
        options,
        correctAnswer: 'The sloping timber rafter',
        explanation: "The sloping rafter connects the tie beam to the apex opposite the 90° angle, forming the hypotenuse.",
        hint1: "Find the angled beam that supports the roof slope.",
        hint2: "The rafter spans opposite the right-angled king post junction.",
        visualData: { halfSpan: 12, rise: 5, c: 13, unit: 'm' }
      };
    }
    case 8: {
      const options = rng.shuffle(['The diagonal gravel shortcut', 'The North street sidewalk', 'The East avenue sidewalk', 'The traffic signal post']);
      return {
        category: 'identify-hypotenuse',
        visual: 'route-compare',
        questionText: `[Job #9] Two perpendicular streets meet at an intersection. A diagonal gravel path cuts across the park between them. Which route is the hypotenuse?`,
        options,
        correctAnswer: 'The diagonal gravel shortcut',
        explanation: "The diagonal path cuts straight across opposite the 90° corner intersection: it represents the hypotenuse.",
        hint1: "Which path takes the direct straight line?",
        hint2: "The diagonal shortcut faces the perpendicular turn.",
        visualData: { a: 30, b: 40, c: 50, unit: 'm' }
      };
    }
    case 9:
    default: {
      const correct = 'Side AC';
      const options = rng.shuffle([correct, 'Side AB', 'Side BC', 'Vertex B']);
      return {
        category: 'identify-sides',
        visual: 'right-triangle',
        questionText: `[Job #10] In triangle ABC, angle B is a right angle (90°). Which side is the hypotenuse?`,
        options,
        correctAnswer: correct,
        explanation: "The side lying directly across from vertex B (the 90° angle) is side AC, which is the hypotenuse.",
        hint1: "The hypotenuse never touches the 90° right angle vertex.",
        hint2: "Angle B is 90°, so the opposite side is AC.",
        visualData: { a: 6, b: 8, c: 10, unit: 'cm', unknown: 'c' }
      };
    }
  }
}

// -------------------------------------------------------------
// WORLD 1: Hypotenuse Harbour (Find Hypotenuse - Whole Triples)
// 10 Distinct Nautical & Harbour Problems
// -------------------------------------------------------------
function genWorld1(slot, rng) {
  const contexts = [
    { text: `A dockyard container yard is 6 m wide and 8 m long. What is the length of the straight diagonal path across it?`, a: 6, b: 8, c: 10, type: 'field-diagonal' },
    { text: `A cargo ship mast of height 12 m has a deck support wire anchored 5 m out from the base. How long is the wire?`, a: 5, b: 12, c: 13, type: 'ladder-wall' },
    { text: `A triangular sailboat mainsail has perpendicular edges measuring 9 m and 12 m. What is the length of the outer diagonal edge?`, a: 9, b: 12, c: 15, type: 'right-triangle' },
    { text: `A harbour crane lifting arm spans a horizontal reach of 15 m and vertical height of 8 m. What is the length of the diagonal steel brace?`, a: 8, b: 15, c: 17, type: 'right-triangle' },
    { text: `A marina swimming pontoon measures 12 m wide by 16 m long. What is the distance between opposite diagonal corners?`, a: 12, b: 16, c: 20, type: 'rect-diagonal' },
    { text: `A floating harbour solar panel frame has a horizontal base of 24 m and vertical rise of 7 m. What is the length of the mounting slope?`, a: 7, b: 24, c: 25, type: 'ramp' },
    { text: `A dry dock maintenance gangway spans a horizontal distance of 20 m and vertical height of 15 m. How long is the walkway ramp?`, a: 15, b: 20, c: 25, type: 'ramp' },
    { text: `A shipping pallet measures 10 m by 24 m. What is the length of a diagonal steel reinforcement strap?`, a: 10, b: 24, c: 26, type: 'rect-diagonal' },
    { text: `A lighthouse beacon tower is 36 m tall with a power line pegged 15 m out on the rocky shore. How long is the power cable?`, a: 15, b: 36, c: 39, type: 'ladder-wall' },
    { text: `A harbour ferry loading ramp rises 1.8 m vertically over a horizontal run of 2.4 m. What is the length of the sloping ramp?`, a: 1.8, b: 2.4, c: 3.0, type: 'ramp' }
  ];

  const ctx = contexts[slot % contexts.length];
  const { a, b, c, type, text } = ctx;
  const dist = hypDistractors(a, b, c);
  const options = makeOptions(c, dist, rng).map(v => `${v} m`);

  return {
    category: 'find-hypotenuse-whole',
    visual: type,
    questionText: `[Job #${slot + 1}] ${text}`,
    options,
    correctAnswer: `${c} m`,
    explanation: `${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}; √${c * c} = ${c} m. To find the hypotenuse, square both legs, add them, and take the square root.`,
    hint1: "Square both perpendicular legs, then add the two squares together.",
    hint2: `${a}² + ${b}² = ${a * a + b * b}. Now take the square root.`,
    visualData: { a, b, c, unknown: 'c', unit: 'm', rise: a, run: b, length: c, L: c, h: b, d: a, w: b }
  };
}

// -------------------------------------------------------------
// WORLD 2: Missing-Leg Mountain (Find Shorter Side - Whole)
// 10 Distinct Mountain & Rescue Problems
// -------------------------------------------------------------
function genWorld2(slot, rng) {
  const contexts = [
    { text: `A firefighter rescue ladder of length 13 m leans against a vertical cliff with its foot 5 m from the base. How high up does it reach?`, c: 13, b: 5, a: 12, type: 'ladder-wall' },
    { text: `A radio transmission tower is held by a 17 m guy wire anchored 8 m from the tower base. How tall is the tower?`, c: 17, b: 8, a: 15, type: 'ladder-wall' },
    { text: `A mountain ski trail slopes down along a 25 m hillside path over a horizontal run of 24 m. What is the vertical drop?`, c: 25, b: 24, a: 7, type: 'ramp' },
    { text: `An alpine flagpole halyard rope is 15 m long and pegged 12 m up the pole. How far from the base is the rope pegged on the ground?`, c: 15, b: 12, a: 9, type: 'ladder-wall' },
    { text: `An underground mine ventilation shaft is 26 m long and reaches a vertical depth of 24 m. What is the horizontal setback distance?`, c: 26, b: 24, a: 10, type: 'ramp' },
    { text: `A mountain lookout tower ladder is 10 m long and reaches a platform 8 m high. How far out from the tower is the ladder foot?`, c: 10, b: 8, a: 6, type: 'ladder-wall' },
    { text: `A suspension footbridge stay cable is 20 m long with a deck horizontal span of 16 m. What is the vertical height of the suspension tower?`, c: 20, b: 16, a: 12, type: 'right-triangle' },
    { text: `A weather balloon tether cable is 25 m long and held 7 m horizontally from the ground trailer. What is the altitude of the balloon?`, c: 25, b: 7, a: 24, type: 'ladder-wall' },
    { text: `An avalanche barrier diagonal timber strut is 15 m long and supports a barrier 9 m high. What is its horizontal base distance?`, c: 15, b: 9, a: 12, type: 'right-triangle' },
    { text: `A mountain observatory staircase has a 13 m sloping banister spanning a vertical rise of 12 m. What is the horizontal floor run?`, c: 13, b: 12, a: 5, type: 'ramp' }
  ];

  const ctx = contexts[slot % contexts.length];
  const { c, b, a, type, text } = ctx;
  const dist = legDistractors(c, b, a);
  const options = makeOptions(a, dist, rng).map(v => `${v} m`);

  return {
    category: 'find-leg-whole',
    visual: type,
    questionText: `[Job #${slot + 1}] ${text}`,
    options,
    correctAnswer: `${a} m`,
    explanation: `The hypotenuse is ${c} m, so subtract: ${c}² − ${b}² = ${c * c} − ${b * b} = ${a * a}; √${a * a} = ${a} m.`,
    hint1: "The sloping line is the hypotenuse! To find a shorter side, you must subtract.",
    hint2: `${c}² − ${b}² = ${c * c - b * b}. Now take the square root.`,
    visualData: { L: c, d: b, h: a, a, b, c, unknown: 'a', unit: 'm', rise: a, run: b, length: c }
  };
}

// -------------------------------------------------------------
// WORLD 3: Round-It-Right Reef (Decimal Answers to 1 d.p.)
// 10 Distinct Marine Science & Scuba Problems
// -------------------------------------------------------------
function genWorld3(slot, rng) {
  const items = [
    { text: `A scuba research team swims along a diagonal transect between two coral outcrops with perpendicular legs of 5 m and 8 m. What is the diagonal distance? (1 d.p.)`, a: 5, b: 8, isHyp: true, type: 'right-triangle' },
    { text: `An underwater robotic camera travels 7 m east and 11 m north across a reef seabed. What is its straight-line distance from the start? (1 d.p.)`, a: 7, b: 11, isHyp: true, type: 'route-compare' },
    { text: `A coral conservation floating grid measures 6 m by 14 m. What is the length of its diagonal cable? (1 d.p.)`, a: 6, b: 14, isHyp: true, type: 'rect-diagonal' },
    { text: `A dolphin observation tower has a horizontal setback of 9 m and a vertical deck height of 4 m. What is the direct sightline distance? (1 d.p.)`, a: 4, b: 9, isHyp: true, type: 'right-triangle' },
    { text: `A marine research boat sail has perpendicular edges of 4 m and 9 m. What is the length of the outer diagonal leech edge? (1 d.p.)`, a: 4, b: 9, isHyp: true, type: 'right-triangle' },
    { text: `A scientific buoy anchor line is 16 m long with a seabed horizontal drift of 7 m. How deep is the water? (1 d.p.)`, c: 16, b: 7, isHyp: false, type: 'ladder-wall' },
    { text: `A sunken shipwreck mooring cable is 19 m long and the seabed anchor is 8 m horizontally from the hull. What is the water depth? (1 d.p.)`, c: 19, b: 8, isHyp: false, type: 'ladder-wall' },
    { text: `A tidal reef walkway ramp has a sloping length of 11 m and a horizontal span of 9 m. What is the vertical height gained? (1 d.p.)`, c: 11, b: 9, isHyp: false, type: 'ramp' },
    { text: `An ocean floor sensor tether cable is 22 m long with a horizontal offset of 13 m. What is the depth of the sensor? (1 d.p.)`, c: 22, b: 13, isHyp: false, type: 'ladder-wall' },
    { text: `A mangrove boardwalk diagonal support strut is 14 m long with a horizontal span of 11 m. How high up does the strut reach? (1 d.p.)`, c: 14, b: 11, isHyp: false, type: 'right-triangle' }
  ];

  const item = items[slot % items.length];

  if (item.isHyp) {
    const { a, b, text, type } = item;
    const h2 = a * a + b * b;
    const exact = Math.sqrt(h2);
    const ans = Number(exact.toFixed(1));
    const dist = hypDistractors(a, b, ans);
    const options = makeOptions(ans, dist, rng).map(v => `${v} m`);

    return {
      category: 'decimal-hypotenuse',
      visual: type,
      questionText: `[Job #${slot + 1}] ${text}`,
      options,
      correctAnswer: `${ans} m`,
      explanation: `${a}² + ${b}² = ${a * a} + ${b * b} = ${h2}; √${h2} ≈ ${ans} m (rounded to 1 decimal place).`,
      hint1: "Square both legs, add them together, then find the square root.",
      hint2: `√(${a}² + ${b}²) = √${h2} ≈ ${ans} m.`,
      visualData: { a, b, c: ans, unknown: 'c', unit: 'm', w: b, h: a }
    };
  } else {
    const { c, b, text, type } = item;
    const l2 = c * c - b * b;
    const exact = Math.sqrt(l2);
    const ans = Number(exact.toFixed(1));
    const dist = legDistractors(c, b, ans);
    const options = makeOptions(ans, dist, rng).map(v => `${v} m`);

    return {
      category: 'decimal-leg',
      visual: type,
      questionText: `[Job #${slot + 1}] ${text}`,
      options,
      correctAnswer: `${ans} m`,
      explanation: `The line is the hypotenuse, so subtract: ${c}² − ${b}² = ${c * c} − ${b * b} = ${l2}; √${l2} ≈ ${ans} m.`,
      hint1: "Subtract the squares since the cable length is the hypotenuse.",
      hint2: `√(${c}² − ${b}²) = √${l2} ≈ ${ans} m.`,
      visualData: { L: c, d: b, h: ans, a: ans, b, c, unknown: 'a', unit: 'm', run: b, rise: ans, length: c }
    };
  }
}

// -------------------------------------------------------------
// WORLD 4: Square-Corner Site (Converse of Pythagoras)
// 10 Distinct Trade & Craft Corner Tests
// -------------------------------------------------------------
function genWorld4(slot, rng) {
  const cases = [
    { trade: "A bricklayer laying a patio foundation", s: [3, 4, 5], isRight: true, unit: "m" },
    { trade: "A carpenter framing a timber door opening", s: [6, 8, 11], isRight: false, unit: "cm" },
    { trade: "A sports groundskeeper checking a soccer corner flag", s: [5, 12, 13], isRight: true, unit: "m" },
    { trade: "A floor tiler installing large marble tiles", s: [9, 40, 41], isRight: true, unit: "cm" },
    { trade: "A landscape gardener aligning stone garden borders", s: [8, 15, 18], isRight: false, unit: "m" },
    { trade: "A roofer inspecting roof truss timber angles", s: [7, 24, 25], isRight: true, unit: "m" },
    { trade: "A metal fabricator welding a steel gate corner", s: [10, 24, 28], isRight: false, unit: "cm" },
    { trade: "A paving contractor setting driveway formwork", s: [20, 21, 29], isRight: true, unit: "m" },
    { trade: "A cabinetmaker fitting a kitchen corner cupboard", s: [12, 35, 37], isRight: true, unit: "cm" },
    { trade: "A boundary surveyor checking property fence pegs", s: [14, 48, 52], isRight: false, unit: "m" }
  ];

  const item = cases[slot % cases.length];
  const { trade, s, isRight, unit } = item;
  const sSorted = [...s].sort((x, y) => x - y);
  const [a, b, c] = sSorted;
  const lhs = a * a + b * b;
  const rhs = c * c;

  const correctStr = isRight
    ? `Yes, because ${a}² + ${b}² = ${rhs} = ${c}²`
    : `No, because ${a}² + ${b}² = ${lhs} ≠ ${rhs}`;

  const foils = isRight
    ? [
        `No, because ${a} + ${b} is greater than ${c}`,
        `No, because ${c}² is greater than ${a}²`,
        `Cannot tell without using a 360° protractor`
      ]
    : [
        `Yes, because ${a}² + ${b}² = ${c}²`,
        `Yes, because ${a} + ${b} is greater than ${c}`,
        `Yes, because ${c}² − ${b}² = ${a}²`
      ];

  const options = rng.shuffle([correctStr, ...foils]);

  return {
    category: 'converse-square-check',
    visual: 'converse-check',
    questionText: `[Job #${slot + 1}] ${trade} measures boundary lengths of ${s[0]} ${unit}, ${s[1]} ${unit}, and ${s[2]} ${unit}. Does the corner form a true 90° right angle?`,
    options,
    correctAnswer: correctStr,
    explanation: isRight
      ? `${a}² + ${b}² = ${a * a} + ${b * b} = ${lhs} = ${rhs} = ${c}². By the converse of Pythagoras' theorem, the corner is a true 90° right angle.`
      : `${a}² + ${b}² = ${a * a} + ${b * b} = ${lhs}, but ${c}² = ${rhs}. Since ${lhs} ≠ ${rhs}, the corner is not a right angle.`,
    hint1: "Calculate a² + b² using the two smaller numbers and compare to c².",
    hint2: `${a}² + ${b}² = ${lhs}, while ${c}² = ${rhs}.`,
    visualData: { sides: s, notToScale: true, unit }
  };
}

// -------------------------------------------------------------
// WORLD 5: Ramp & Ladder Row (Real-World Ladders and Ramps)
// 10 Distinct Real-World Architectural Problems
// -------------------------------------------------------------
function genWorld5(slot, rng) {
  const problems = [
    { text: `A hospital accessibility ramp rises 0.6 m vertically over a horizontal run of 0.8 m. What is the length of the sloping ramp?`, a: 0.6, b: 0.8, c: 1.0, type: 'ramp', isHyp: true },
    { text: `A painting contractor leans a 13 m ladder against a house, reaching 12 m up the wall. How far is the ladder foot from the wall base?`, c: 13, a: 12, b: 5, type: 'ladder-wall', isHyp: false },
    { text: `A skatepark launch ramp rises 1.2 m vertically over a horizontal run of 1.6 m. What is the length of the sloping surface?`, a: 1.2, b: 1.6, c: 2.0, type: 'ramp', isHyp: true },
    { text: `A window cleaner uses a 10 m ladder to reach an 8 m high window ledge. How far from the wall must the ladder foot be placed?`, c: 10, a: 8, b: 6, type: 'ladder-wall', isHyp: false },
    { text: `A warehouse forklift loading ramp rises 1.5 m over a horizontal floor run of 2.0 m. How long is the ramp incline?`, a: 1.5, b: 2.0, c: 2.5, type: 'ramp', isHyp: true },
    { text: `An emergency fire brigade extension ladder is 25 m long and reaches a 24 m apartment balcony. How far from the building is the truck base?`, c: 25, a: 24, b: 7, type: 'ladder-wall', isHyp: false },
    { text: `A marina boat trailer slipway rises 0.9 m vertically over a horizontal run of 1.2 m. What is the length of the sloping slipway?`, a: 0.9, b: 1.2, c: 1.5, type: 'ramp', isHyp: true },
    { text: `An electrician leans a 15 m ladder against an outdoor pole, reaching 12 m high. What is the distance from the pole base to the ladder foot?`, c: 15, a: 12, b: 9, type: 'ladder-wall', isHyp: false },
    { text: `A stadium accessibility ramp rises 2.1 m over a horizontal run of 2.8 m. What is the length of the ramp surface?`, a: 2.1, b: 2.8, c: 3.5, type: 'ramp', isHyp: true },
    { text: `A roofing specialist leans a 17 m ladder against roof eaves 15 m high. How far from the wall is the ladder foot?`, c: 17, a: 15, b: 8, type: 'ladder-wall', isHyp: false }
  ];

  const p = problems[slot % problems.length];
  if (p.isHyp) {
    const { a, b, c, text, type } = p;
    const dist = hypDistractors(a, b, c);
    const options = makeOptions(c, dist, rng).map(v => `${v} m`);
    return {
      category: 'ramp-application',
      visual: type,
      questionText: `[Job #${slot + 1}] ${text}`,
      options,
      correctAnswer: `${c} m`,
      explanation: `${a}² + ${b}² = ${(a * a).toFixed(2)} + ${(b * b).toFixed(2)} = ${(c * c).toFixed(2)}; √${(c * c).toFixed(2)} = ${c} m.`,
      hint1: "The sloping surface is the hypotenuse: square, add, then square root.",
      hint2: `${a}² + ${b}² = ${(c * c).toFixed(2)}.`,
      visualData: { rise: a, run: b, length: c, unknown: 'c', unit: 'm' }
    };
  } else {
    const { c, a, b, text, type } = p;
    const dist = legDistractors(c, a, b);
    const options = makeOptions(b, dist, rng).map(v => `${v} m`);
    return {
      category: 'ladder-application',
      visual: type,
      questionText: `[Job #${slot + 1}] ${text}`,
      options,
      correctAnswer: `${b} m`,
      explanation: `The ladder is the hypotenuse: ${c}² − ${a}² = ${c * c} − ${a * a} = ${b * b}; √${b * b} = ${b} m.`,
      hint1: "The ladder is the hypotenuse, so subtract the squares to find the base distance.",
      hint2: `${c}² − ${a}² = ${b * b}.`,
      visualData: { L: c, d: b, h: a, unknown: 'b', unit: 'm' }
    };
  }
}

// -------------------------------------------------------------
// WORLD 6: Fit-It Factory (Rectangle Diagonals & Will it Fit)
// 10 Distinct Dimension & Clearance Challenges
// -------------------------------------------------------------
function genWorld6(slot, rng) {
  const problems = [
    { text: `A high-definition television screen measures 60 cm high by 80 cm wide. What is the screen's diagonal measurement?`, a: 60, b: 80, c: 100, unit: 'cm', isFit: false },
    { text: `A shipping container floor measures 15 m by 20 m. Can a 26 m steel pipe lie completely flat inside along the diagonal?`, a: 15, b: 20, c: 25, itemLen: 26, unit: 'm', isFit: true },
    { text: `An architectural glass tabletop measures 90 cm wide by 120 cm long. What is the tabletop diagonal length?`, a: 90, b: 120, c: 150, unit: 'cm', isFit: false },
    { text: `A delivery van cargo floor measures 160 cm wide by 300 cm long. Can a 330 cm rolled carpet lie flat diagonally?`, a: 160, b: 300, c: 340, itemLen: 330, unit: 'cm', isFit: true },
    { text: `A framed art gallery poster measures 50 cm high by 120 cm wide. What is the length of its diagonal hanging wire?`, a: 50, b: 120, c: 130, unit: 'cm', isFit: false },
    { text: `A rectangular elevator car floor is 150 cm by 200 cm. Can a 245 cm step ladder lie completely flat on the floor?`, a: 150, b: 200, c: 250, itemLen: 245, unit: 'cm', isFit: true },
    { text: `A workshop metal tool tray measures 21 cm wide by 28 cm long. What is the length of a diagonal compartment divider?`, a: 21, b: 28, c: 35, unit: 'cm', isFit: false },
    { text: `A bedroom doorway frame measures 80 cm wide by 150 cm high. Can a 165 cm folding table pass through along the diagonal?`, a: 80, b: 150, c: 170, itemLen: 165, unit: 'cm', isFit: true },
    { text: `A steel storage locker door measures 40 cm wide by 75 cm high. What is the length of its diagonal reinforcement bar?`, a: 40, b: 75, c: 85, unit: 'cm', isFit: false },
    { text: `A wooden garden planter box floor measures 70 cm by 240 cm. Can a 255 cm bamboo stake lie completely flat inside?`, a: 70, b: 240, c: 250, itemLen: 255, unit: 'cm', isFit: true }
  ];

  const p = problems[slot % problems.length];
  if (!p.isFit) {
    const { a, b, c, unit, text } = p;
    const dist = hypDistractors(a, b, c);
    const options = makeOptions(c, dist, rng).map(v => `${v} ${unit}`);
    return {
      category: 'rectangle-diagonal',
      visual: 'rect-diagonal',
      questionText: `[Job #${slot + 1}] ${text}`,
      options,
      correctAnswer: `${c} ${unit}`,
      explanation: `The diagonal divides the rectangle into two right triangles: ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}; √${c * c} = ${c} ${unit}.`,
      hint1: "Use Pythagoras' theorem with the width and height as legs.",
      hint2: `${a}² + ${b}² = ${c * c}. Now take the square root.`,
      visualData: { w: b, h: a, unknown: 'c', unit }
    };
  } else {
    const { a, b, c, itemLen, unit, text } = p;
    const fits = itemLen <= c;
    const correct = fits
      ? `Yes, because the diagonal is ${c} ${unit}, which is longer than ${itemLen} ${unit}`
      : `No, because the diagonal is only ${c} ${unit}, which is shorter than ${itemLen} ${unit}`;

    const foils = fits
      ? [
          `No, because the sides are only ${a} ${unit} and ${b} ${unit}`,
          `No, because ${itemLen} exceeds the average side length`,
          `Cannot tell without knowing object thickness`
        ]
      : [
          `Yes, because ${itemLen} is less than ${a} + ${b}`,
          `Yes, if placed at a 45 degree angle`,
          `Cannot tell without knowing object weight`
        ];

    const options = rng.shuffle([correct, ...foils]);
    return {
      category: 'fit-check',
      visual: 'rect-diagonal',
      questionText: `[Job #${slot + 1}] ${text}`,
      options,
      correctAnswer: correct,
      explanation: `The maximum internal straight-line distance is the diagonal: √(${a}² + ${b}²) = ${c} ${unit}. Since ${itemLen} ${unit} ${fits ? '≤' : '>'} ${c} ${unit}, it ${fits ? 'fits flat' : 'cannot lie flat'}.`,
      hint1: "Calculate the rectangle diagonal first using Pythagoras.",
      hint2: `Diagonal = √(${a}² + ${b}²) = ${c} ${unit}. Compare this to ${itemLen} ${unit}.`,
      visualData: { w: b, h: a, c, unknown: 'c', unit }
    };
  }
}

// -------------------------------------------------------------
// WORLD 7: Shortcut City (Displacement & Route Comparison)
// 10 Distinct Navigation & Route Problems
// -------------------------------------------------------------
function genWorld7(slot, rng) {
  const problems = [
    { text: `Priya walks 60 m east and 80 m north along city sidewalks. Jun Kai takes the straight diagonal park path. How much distance does Jun Kai save?`, a: 60, b: 80, c: 100, isDiff: true, unit: 'm' },
    { text: `A delivery drone flies directly from the dispatch depot, traveling 5 km east and 12 km north. What is its direct displacement from the depot?`, a: 5, b: 12, c: 13, isDiff: false, unit: 'km' },
    { text: `A runner jogs 90 m along one park boundary and 120 m along a perpendicular path. How much distance is saved by taking the direct diagonal shortcut?`, a: 90, b: 120, c: 150, isDiff: true, unit: 'm' },
    { text: `A courier bike travels 7 km south and 24 km west across town. What is its straight-line distance from the starting location?`, a: 7, b: 24, c: 25, isDiff: false, unit: 'km' },
    { text: `Hikers walk 8 km east and 15 km north around a nature reserve boundary. How much distance does cutting straight across the diagonal save?`, a: 8, b: 15, c: 17, isDiff: true, unit: 'km' },
    { text: `A coastguard patrol boat sails 9 nautical miles east and 40 nautical miles north. What is its direct straight-line distance back to harbour?`, a: 9, b: 40, c: 41, isDiff: false, unit: 'NM' },
    { text: `A cyclist rides 12 km north and 16 km east along roads. How many kilometres does taking the direct diagonal trail save?`, a: 12, b: 16, c: 20, isDiff: true, unit: 'km' },
    { text: `An airport taxiway connects runway thresholds situated 200 m east and 210 m north. What is the straight diagonal taxiway distance?`, a: 200, b: 210, c: 290, isDiff: false, unit: 'm' },
    { text: `An electric scooter travels 10 km south and 24 km east across campus. What is its straight-line displacement from the charging station?`, a: 10, b: 24, c: 26, isDiff: false, unit: 'km' },
    { text: `A golf cart drives 150 m along a fairway and 200 m along a dogleg turn. How much distance is saved by driving straight diagonally from tee to green?`, a: 150, b: 200, c: 250, isDiff: true, unit: 'm' }
  ];

  const p = problems[slot % problems.length];
  const { a, b, c, isDiff, unit, text } = p;

  if (isDiff) {
    const edgesSum = a + b;
    const saved = edgesSum - c;
    const dist = [c, edgesSum, saved + 10];
    const options = makeOptions(saved, dist, rng).map(v => `${v} ${unit}`);
    return {
      category: 'shortcut-difference',
      visual: 'route-compare',
      questionText: `[Job #${slot + 1}] ${text}`,
      options,
      correctAnswer: `${saved} ${unit}`,
      explanation: `Edge route = ${a} + ${b} = ${edgesSum} ${unit}. Diagonal shortcut = √(${a}² + ${b}²) = ${c} ${unit}. Distance saved = ${edgesSum} − ${c} = ${saved} ${unit}.`,
      hint1: "First calculate the diagonal shortcut with Pythagoras, then subtract it from the two edges.",
      hint2: `Shortcut = ${c} ${unit}. Edge sum = ${edgesSum} ${unit}.`,
      visualData: { a, b, c, saved, show: 'both', unit }
    };
  } else {
    const dist = hypDistractors(a, b, c);
    const options = makeOptions(c, dist, rng).map(v => `${v} ${unit}`);
    return {
      category: 'compass-displacement',
      visual: 'grid-displacement',
      questionText: `[Job #${slot + 1}] ${text}`,
      options,
      correctAnswer: `${c} ${unit}`,
      explanation: `The perpendicular directions form a 90° right angle: ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}; √${c * c} = ${c} ${unit}.`,
      hint1: "The straight-line path forms the hypotenuse between the two perpendicular directions.",
      hint2: `${a}² + ${b}² = ${c * c}.`,
      visualData: { east: a, north: b, c, unit }
    };
  }
}

// -------------------------------------------------------------
// WORLD 8: Zip-Line Park (Multi-Step Real World Problems)
// 10 Distinct Multi-Step Construction & Cost Problems
// -------------------------------------------------------------
function genWorld8(slot, rng) {
  const problems = [
    { text: `A forest canopy zip-line runs from a 20 m tower to an 8 m pole 16 m away on level ground. How long is the zip-line cable?`, kind: 'zipline', tw: 20, pl: 8, gap: 16, drop: 12, ans: 20, unit: 'm' },
    { text: `A rectangular farm gate is 1.5 m wide and 2.0 m high. A diagonal steel brace costs $18 per metre. What is the total cost of the brace?`, kind: 'cost', w: 1.5, h: 2.0, diag: 2.5, rate: 18, ans: 45 },
    { text: `A timber gable roof truss has a half-span of 12 m and a rise of 5 m. Two matching sloping rafters are required. What is the total timber length needed for both rafters?`, kind: 'rafters', span: 12, rise: 5, single: 13, ans: 26, unit: 'm' },
    { text: `An adventure playground rope bridge connects an 18 m treehouse to a 10 m landing deck situated 15 m away. What is the length of the bridge rope?`, kind: 'zipline', tw: 18, pl: 10, gap: 15, drop: 8, ans: 17, unit: 'm' },
    { text: `A warehouse cantilever shelf frame measures 2.4 m deep and 1.8 m high. Steel support cable costs $25 per metre. What is the total cable cost?`, kind: 'cost', w: 2.4, h: 1.8, diag: 3.0, rate: 25, ans: 75 },
    { text: `An A-frame chalet roof has a half-span of 8 m and a central vertical height of 15 m. How many metres of timber are needed for both sloping rafters?`, kind: 'rafters', span: 8, rise: 15, single: 17, ans: 34, unit: 'm' },
    { text: `A mountain river zip-line spans from a 35 m cliff top to an 11 m rock landing 32 m across the gorge. How long is the cable?`, kind: 'zipline', tw: 35, pl: 11, gap: 32, drop: 24, ans: 40, unit: 'm' },
    { text: `A barn sliding door is 3.0 m wide by 4.0 m high. Diagonal steel reinforcement strap costs $14 per metre. What is the total strap cost?`, kind: 'cost', w: 3.0, h: 4.0, diag: 5.0, rate: 14, ans: 70 },
    { text: `A cottage gable roof section has a half-span of 9 m and a rise of 12 m. How much timber is needed for both sloping rafters?`, kind: 'rafters', span: 9, rise: 12, single: 15, ans: 30, unit: 'm' },
    { text: `An eco-park zip-flyer line links a 25 m launch deck to a 9 m receiving post 30 m away. How long is the flyer cable?`, kind: 'zipline', tw: 25, pl: 9, gap: 30, drop: 16, ans: 34, unit: 'm' }
  ];

  const p = problems[slot % problems.length];

  if (p.kind === 'zipline') {
    const { tw, pl, gap, drop, ans, unit, text } = p;
    const dist = [drop + gap, Math.round(Math.hypot(tw, gap)), ans + 8];
    const options = makeOptions(ans, dist, rng).map(v => `${v} ${unit}`);
    return {
      category: 'multi-step-zipline',
      visual: 'zipline',
      questionText: `[Job #${slot + 1}] ${text}`,
      options,
      correctAnswer: `${ans} ${unit}`,
      explanation: `Step 1: Vertical drop = ${tw} − ${pl} = ${drop} ${unit}. Step 2: Cable length = √(${drop}² + ${gap}²) = √(${drop * drop} + ${gap * gap}) = ${ans} ${unit}.`,
      hint1: "First calculate the vertical height difference (drop), then use Pythagoras with the horizontal gap.",
      hint2: `Drop = ${drop} ${unit}. Now find √(${drop}² + ${gap}²).`,
      visualData: { towerH: tw, poleH: pl, gap, length: ans, unit }
    };
  } else if (p.kind === 'cost') {
    const { w, h, diag, rate, ans, text } = p;
    const dist = [ans + 18, ans - 9, Math.round(w * h * rate)];
    const options = makeOptions(ans, dist, rng).map(v => `$${v}`);
    return {
      category: 'multi-step-cost',
      visual: 'rect-diagonal',
      questionText: `[Job #${slot + 1}] ${text}`,
      options,
      correctAnswer: `$${ans}`,
      explanation: `Step 1: Diagonal length = √(${w}² + ${h}²) = ${diag} m. Step 2: Total cost = ${diag} m × $${rate}/m = $${ans}.`,
      hint1: "Step 1: calculate the diagonal length. Step 2: multiply length by price per metre.",
      hint2: `Diagonal = ${diag} m. Total cost = ${diag} × $${rate}.`,
      visualData: { w, h, c: diag, unknown: 'c', unit: 'm' }
    };
  } else {
    const { span, rise, single, ans, unit, text } = p;
    const dist = [single, ans + 8, single * 3];
    const options = makeOptions(ans, dist, rng).map(v => `${v} ${unit}`);
    return {
      category: 'multi-step-total',
      visual: 'rafter',
      questionText: `[Job #${slot + 1}] ${text}`,
      options,
      correctAnswer: `${ans} ${unit}`,
      explanation: `Step 1: One rafter = √(${span}² + ${rise}²) = ${single} ${unit}. Step 2: Both rafters = ${single} × 2 = ${ans} ${unit}.`,
      hint1: "Calculate the length of one sloping rafter, then multiply by 2 for both sides.",
      hint2: `One rafter = ${single} ${unit}. Total for two rafters = ${single} × 2.`,
      visualData: { halfSpan: span, rise, c: single, unit }
    };
  }
}

// -------------------------------------------------------------
// WORLD 9: Blueprint Tower (Grand Mixed Review & Reasonableness)
// 10 Distinct Comprehensive Exam Review Problems
// -------------------------------------------------------------
function genWorld9(slot, rng) {
  switch (slot) {
    case 0: {
      const options = rng.shuffle([
        "The hypotenuse must always be longer than both legs",
        "7 is an odd number",
        "The hypotenuse must equal 5 + 12",
        "The hypotenuse must be shorter than both legs"
      ]);
      return {
        category: 'reasonableness-check',
        visual: 'right-triangle',
        questionText: `[Job #1] A student claims that a right-angled triangle with legs 5 cm and 12 cm has a hypotenuse of 7 cm. Why is this impossible without calculating?`,
        options,
        correctAnswer: "The hypotenuse must always be longer than both legs",
        explanation: "In every right triangle, the hypotenuse is opposite the 90° angle and is strictly the longest side. A hypotenuse of 7 cm is shorter than the 12 cm leg, which is impossible (correct hypotenuse is 13 cm).",
        hint1: "Which side is always the longest in any right-angled triangle?",
        hint2: "The hypotenuse must exceed every leg.",
        visualData: { a: 5, b: 12, c: 13, unit: 'cm', sourceWorld: 0 }
      };
    }
    case 1: {
      const options = rng.shuffle([
        "No, because the ladder is the hypotenuse and must be longer than the wall height",
        "Yes, if the ladder foot is placed 1 m from the wall",
        "Yes, if the ladder is angled at exactly 45 degrees",
        "Cannot tell without knowing the ladder material"
      ]);
      return {
        category: 'reasonableness-ladder',
        visual: 'ladder-wall',
        questionText: `[Job #2] Can a 10 m ladder leaning against a vertical wall reach a window that is 11 m high?`,
        options,
        correctAnswer: "No, because the ladder is the hypotenuse and must be longer than the wall height",
        explanation: "The ladder acts as the hypotenuse. Since the hypotenuse must exceed the vertical leg, a 10 m ladder can never reach higher than 10 m on a vertical wall.",
        hint1: "Can a leg of a right-angled triangle be longer than its hypotenuse?",
        hint2: "The ladder is the hypotenuse.",
        visualData: { L: 10, h: 11, d: 3, unit: 'm', sourceWorld: 1 }
      };
    }
    case 2: {
      const options = rng.shuffle(["8 cm", "22.7 cm", "2 cm", "64 cm"]);
      return {
        category: 'algebraic-pythagoras',
        visual: 'right-triangle',
        questionText: `[Job #3] In a right-angled triangle, leg x and leg 15 cm have hypotenuse 17 cm, so x² + 15² = 17². Solve for leg x:`,
        options,
        correctAnswer: "8 cm",
        explanation: "x² = 17² − 15² = 289 − 225 = 64; x = √64 = 8 cm.",
        hint1: "Subtract 15² from 17², then take the square root.",
        hint2: "289 − 225 = 64.",
        visualData: { a: 8, b: 15, c: 17, unknown: 'a', unit: 'cm', sourceWorld: 2 }
      };
    }
    case 3: {
      const options = rng.shuffle(["15 m", "21 m", "3 m", "225 m"]);
      return {
        category: 'algebraic-pythagoras',
        visual: 'right-triangle',
        questionText: `[Job #4] Solve for hypotenuse x when x² = 9² + 12²:`,
        options,
        correctAnswer: "15 m",
        explanation: "x² = 81 + 144 = 225; x = √225 = 15 m.",
        hint1: "Add 81 and 144, then find the square root.",
        hint2: "√225 = 15.",
        visualData: { a: 9, b: 12, c: 15, unknown: 'c', unit: 'm', sourceWorld: 3 }
      };
    }
    case 4: {
      const options = rng.shuffle(["25 m", "35 m", "5 m", "300 m"]);
      return {
        category: 'shadow-geometry',
        visual: 'right-triangle',
        questionText: `[Job #5] A 20 m tree casts a 15 m horizontal shadow on level ground. What is the straight-line distance from the treetop to the tip of the shadow?`,
        options,
        correctAnswer: "25 m",
        explanation: "Tree height and shadow form perpendicular legs: 15² + 20² = 225 + 400 = 625; √625 = 25 m.",
        hint1: "The vertical tree and horizontal ground form a 90° right angle.",
        hint2: "15² + 20² = 625. Now find the square root.",
        visualData: { a: 20, b: 15, c: 25, unit: 'm', sourceWorld: 4 }
      };
    }
    case 5: {
      const correct = "Yes, because 14² + 48² = 2500 = 50²";
      const options = rng.shuffle([
        correct,
        "No, because 14 + 48 is greater than 50",
        "No, because 50 is an even number",
        "Cannot tell without a protractor"
      ]);
      return {
        category: 'converse-verification',
        visual: 'converse-check',
        questionText: `[Job #6] An engineering blueprint shows a triangular bracket with side lengths of 14 cm, 48 cm, and 50 cm. Does it contain a 90° right angle?`,
        options,
        correctAnswer: correct,
        explanation: "14² + 48² = 196 + 2304 = 2500 = 50². Since the sum of the squares matches 50², the bracket is right-angled.",
        hint1: "Calculate 14² + 48² and compare to 50².",
        hint2: "196 + 2304 = 2500 = 50².",
        visualData: { sides: [14, 48, 50], notToScale: true, unit: 'cm', sourceWorld: 5 }
      };
    }
    case 6: {
      const options = rng.shuffle(["12.2 m", "17.0 m", "3.0 m", "149 m"]);
      return {
        category: 'decimal-accuracy',
        visual: 'rect-diagonal',
        questionText: `[Job #7] A rectangular courtyard is 7 m wide and 10 m long. What is the diagonal distance across the courtyard? (Round to 1 d.p.)`,
        options,
        correctAnswer: "12.2 m",
        explanation: "7² + 10² = 49 + 100 = 149; √149 ≈ 12.206 m, which rounds to 12.2 m.",
        hint1: "Square 7 and 10, add them, then find the square root.",
        hint2: "√149 ≈ 12.2 m.",
        visualData: { w: 10, h: 7, c: 12.2, unit: 'm', sourceWorld: 6 }
      };
    }
    case 7: {
      const options = rng.shuffle(["10 m", "50 m", "2 m", "100 m"]);
      return {
        category: 'ladder-safety',
        visual: 'ladder-wall',
        questionText: `[Job #8] A 26 m fire ladder is set against an apartment wall so that its top reaches exactly 24 m up. How far from the building is the foot of the ladder?`,
        options,
        correctAnswer: "10 m",
        explanation: "The ladder is the hypotenuse: 26² − 24² = 676 − 576 = 100; √100 = 10 m.",
        hint1: "Subtract the square of the wall height from the square of the ladder length.",
        hint2: "676 − 576 = 100.",
        visualData: { L: 26, h: 24, d: 10, unit: 'm', unknown: 'b', sourceWorld: 7 }
      };
    }
    case 8: {
      const options = rng.shuffle(["12 m", "29 m", "41 m", "9 m"]);
      return {
        category: 'route-savings',
        visual: 'route-compare',
        questionText: `[Job #9] A student walks 20 m east and then 21 m north along sidewalks. How much distance would be saved by walking straight diagonally?`,
        options,
        correctAnswer: "12 m",
        explanation: "Sidewalk route = 20 + 21 = 41 m. Diagonal shortcut = √(20² + 21²) = √(400 + 441) = √841 = 29 m. Saved = 41 − 29 = 12 m.",
        hint1: "Calculate the diagonal shortcut (√841 = 29 m), then subtract it from the two sidewalk edges (41 m).",
        hint2: "41 − 29 = 12 m.",
        visualData: { a: 20, b: 21, c: 29, saved: 12, unit: 'm', sourceWorld: 8 }
      };
    }
    case 9:
    default: {
      const options = rng.shuffle(["34 m", "46 m", "14 m", "1156 m"]);
      return {
        category: 'multi-step-construction',
        visual: 'zipline',
        questionText: `[Job #10] A twin-platform zip-line runs from a 26 m tower to a 10 m pole across a 30 m horizontal gap. What is the length of the cable?`,
        options,
        correctAnswer: "34 m",
        explanation: "Drop = 26 − 10 = 16 m. Cable length = √(16² + 30²) = √(256 + 900) = √1156 = 34 m.",
        hint1: "First subtract the pole height from the tower height to find the drop (16 m).",
        hint2: "Now compute √(16² + 30²) = √1156.",
        visualData: { towerH: 26, poleH: 10, gap: 30, length: 34, unit: 'm', sourceWorld: 9 }
      };
    }
  }
}

const WORLD_GENERATORS = [
  genWorld0, genWorld1, genWorld2, genWorld3, genWorld4,
  genWorld5, genWorld6, genWorld7, genWorld8, genWorld9
];

/**
 * Generates all 10 questions for a given world using a seeded RNG.
 * Enforces:
 * - exactly 10 questions (slots 0..9)
 * - exactly 10 distinct questionText strings
 */
export function generateWorld(worldId, seed = Date.now()) {
  const rng = createRNG(seed);
  const generator = WORLD_GENERATORS[worldId] || genWorld0;
  const questions = [];
  const seenTexts = new Set();

  for (let slot = 0; slot < 10; slot++) {
    let q = generator(slot, rng);
    let attempts = 0;
    while (seenTexts.has(q.questionText) && attempts < 10) {
      q = generator(slot, rng);
      attempts++;
    }
    seenTexts.add(q.questionText);
    questions.push({
      ...q,
      id: `w${worldId}_q${slot}_${seed}`,
      districtId: worldId,
      slot
    });
  }

  return questions;
}

/**
 * Generates the full 100-question bank across all 10 worlds.
 */
export function generateBank(seed = 12345) {
  const bank = [];
  for (let w = 0; w < 10; w++) {
    bank.push(...generateWorld(w, seed + w * 1000));
  }
  return bank;
}

/**
 * Generates sampled questions for an active practice session.
 */
export function sessionQuestions(worldId, modeId, seed = Date.now()) {
  const rng = createRNG(seed);
  const worldQs = generateWorld(worldId, seed);
  const slots = pickSlots(modeId, rng);
  return slots.map(s => worldQs[s]);
}
