export const SCALE = 10; // decimal contexts are stored as integer tenths
export const sum2 = (a, b) => a * a + b * b;
export const isSquare = n => Number.isInteger(n) && n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;
export const isTriple = ([a, b, c]) => a > 0 && b > 0 && a * a + b * b === c * c;

export const BASE_TRIPLES = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [12, 35, 37],
  [9, 40, 41]
];
export const MULTIPLIERS = [1, 2, 3, 4, 5, 10];

/** all whole-number triples (legs ascending, de-duplicated) with hypotenuse in [minC, maxC] */
export function triplesWithin(minC, maxC) {
  const out = [];
  for (const base of BASE_TRIPLES) {
    for (const k of MULTIPLIERS) {
      const t = base.map(x => x * k);
      if (t[2] >= minC && t[2] <= maxC) out.push(t);
    }
  }
  return [...new Map(out.map(t => [t.join('-'), t])).values()].sort((x, y) => x[2] - y[2]);
}

/** decimal triples as integer tenths, at least one side non-integer in metres; e.g. [9,12,15] = 0.9, 1.2, 1.5 */
export function decimalTriples(maxTenthsC = 60) {
  const out = [];
  for (const base of [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]) {
    for (let k = 1; k <= 12; k++) {
      const t = base.map(x => x * k);
      if (t[2] <= maxTenthsC && t.some(x => x % 10 !== 0)) out.push(t);
    }
  }
  return [...new Map(out.map(t => [t.join('-'), t])).values()];
}

export const round1 = x => Math.round(x * 10 + 1e-9) / 10;

/** rounding-safe: x*10 is not within 0.05 of a .5 boundary (avoids 1 d.p. disputes and float error) */
export function roundSafe(x) {
  const t = x * 10;
  const f = t - Math.floor(t);
  return Math.abs(f - 0.5) > 0.05;
}

export const fmt = x => (Number.isInteger(x) ? String(x) : x.toFixed(1));
export const fmtExact = x => String(Number(x.toFixed(2)));

export function decimalHypCases(minLeg = 2, maxLeg = 20) {
  const out = [];
  for (let a = minLeg; a <= maxLeg; a++) {
    for (let b = a + 1; b <= maxLeg; b++) {
      const h2 = sum2(a, b);
      if (isSquare(h2)) continue;
      const c = Math.sqrt(h2);
      if (!roundSafe(c)) continue;
      out.push({ a, b, h2, c, ans: round1(c) });
    }
  }
  return out;
}

export function decimalLegCases(minC = 5, maxC = 30) {
  const out = [];
  for (let c = minC; c <= maxC; c++) {
    for (let b = 2; b < c; b++) {
      const l2 = c * c - b * b;
      if (l2 < 4 || isSquare(l2)) continue;
      const a = Math.sqrt(l2);
      if (!roundSafe(a)) continue;
      out.push({ c, b, l2, a, ans: round1(a) });
    }
  }
  return out;
}

/** distractors that model real misconceptions (never random numbers) */
export function hypDistractors(a, b, correct) {
  const candidates = [
    a + b,
    sum2(a, b),
    round1(Math.sqrt(Math.abs(b * b - a * a))),
    correct + 1,
    correct - 1,
    correct + 2,
    correct - 2
  ];
  return pick3(candidates, correct);
}

export function legDistractors(c, b, correct) {
  const candidates = [
    round1(Math.sqrt(c * c + b * b)),
    c - b,
    c * c - b * b,
    correct + 1,
    correct - 1,
    correct + 2,
    correct - 2
  ];
  return pick3(candidates, correct);
}

function pick3(cands, correct) {
  const seen = new Set([fmt(correct)]);
  const out = [];
  for (const x of cands) {
    if (!(x > 0)) continue;
    const s = fmt(x);
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(x);
    if (out.length === 3) break;
  }
  return out;
}

export function converse(sides) {
  const s = [...sides].sort((x, y) => x - y);
  const lhs = s[0] ** 2 + s[1] ** 2;
  const rhs = s[2] ** 2;
  return { isRight: lhs === rhs, longest: s[2], lhs, rhs };
}

/** "not right" case: perturb one side of a triple; must satisfy triangle inequality and not be a triple */
export function notRightPerturb(rng, [a, b, c]) {
  for (let t = 0; t < 50; t++) {
    const i = rng.int(0, 2);
    const d = rng.pick([-3, -2, -1, 1, 2, 3]);
    const s = [a, b, c];
    s[i] += d;
    if (s.some(x => x < 2)) continue;
    const [x, y, z] = [...s].sort((p, q) => p - q);
    if (x + y <= z || x * x + y * y === z * z) continue;
    return s;
  }
  return null;
}
