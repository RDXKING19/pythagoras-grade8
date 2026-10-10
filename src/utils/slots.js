const SPREAD = {
  guided: [0, 2, 4, 6, 8],
  independent: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  timed: [1, 2, 3, 4, 5, 6, 7, 8],
  boss: [5, 6, 7, 8, 9]
};

export function pickSlots(modeId, rng) {
  const base = SPREAD[modeId] || SPREAD.independent;
  if (modeId === 'independent' || modeId === 'boss') return base;
  const used = new Set();
  return base.map(s => {
    let t = Math.min(9, Math.max(0, s + (rng ? rng.int(-1, 1) : 0)));
    while (used.has(t)) t = (t + 1) % 10;
    used.add(t);
    return t;
  }).sort((a, b) => a - b);
}
