import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

import { speak } from '../src/utils/speak.js';
import {
  triplesWithin,
  decimalTriples,
  decimalHypCases,
  decimalLegCases,
  hypDistractors,
  legDistractors
} from '../src/utils/pythagorasMath.js';
import { makeReport, LADDER_CASES, ZIPLINE_SCENES } from '../src/data/stationData.js';
import { createRNG } from '../src/utils/rng.js';
import { WONDER } from '../src/data/storyContent.js';
import { BADGES, BOSS_TROPHIES } from '../src/utils/badgeEngine.js';
import { appReducer, INITIAL_STATE } from '../src/utils/reducer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');

console.log('--- Running PythagoQuest Unit Tests & Integrity Verifications ---');

// 1. speak() Transformation Tests (PRD §11.1 & TRD §8.2)
console.log('\n[1/7] Testing speak() audio transform...');
{
  const s1 = speak('60² + 80² = 3600 + 6400 = 10 000');
  assert(s1.includes('sixty squared plus eighty squared equals'), `Unexpected: ${s1}`);
  assert(s1.includes('ten thousand'), `Unexpected: ${s1}`);

  const s2 = speak('√73 ≈ 8.5 m');
  assert(s2.includes('the square root of seventy-three is approximately eight point five metres'), `Unexpected: ${s2}`);

  const s3 = speak('A 13-m ladder');
  assert(s3.includes('thirteen-metre ladder'), `Unexpected: ${s3}`);

  const s4 = speak('$112.50');
  assert(s4.includes('one hundred and twelve dollars and fifty cents'), `Unexpected: ${s4}`);

  const s5 = speak('a 3-4-5 rope');
  assert(s5.includes('three, four, five'), `Unexpected: ${s5}`);

  const s6 = speak('1 d.p.');
  assert(s6.includes('one decimal place'), `Unexpected: ${s6}`);

  console.log('✔ speak() rules verified.');
}

// 2. Pythagoras Math Pools & Helpers Tests
console.log('\n[2/7] Testing pythagorasMath pools & helpers...');
{
  const triples = triplesWithin(5, 100);
  assert(triples.length >= 25, `Expected >= 25 triples, got ${triples.length}`);

  const ladderTriples = triplesWithin(5, 30);
  assert(ladderTriples.length === 10, `Expected 10 ladder triples <= 30, got ${ladderTriples.length}`);

  const decTriples = decimalTriples(60);
  assert(decTriples.length >= 15, `Expected >= 15 decimal triples, got ${decTriples.length}`);

  const hypCases = decimalHypCases(2, 20);
  assert(hypCases.length >= 100, `Expected >= 100 hyp cases, got ${hypCases.length}`);

  const legCases = decimalLegCases(5, 30);
  assert(legCases.length >= 200, `Expected >= 200 leg cases, got ${legCases.length}`);

  // Test distractor generation
  const hDist = hypDistractors(3, 4, 5);
  assert(hDist.length === 3, 'Expected 3 distractors');

  const lDist = legDistractors(13, 5, 12);
  assert(lDist.length === 3, 'Expected 3 distractors');

  console.log('✔ pythagorasMath pools verified.');
}

// 3. Station D makeReport Error Detection (3 000 cases)
console.log('\n[3/7] Testing Station D makeReport (3,000 cases)...');
{
  const errorTypes = ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7'];
  let checked = 0;
  for (let i = 0; i < 3000; i++) {
    const rng = createRNG(1000 + i);
    const errType = errorTypes[i % errorTypes.length];
    const report = makeReport(rng, errType);

    assert(report.lines.length === 4, 'Report should have 4 lines');
    assert(report.faultyIndex >= 0 && report.faultyIndex < 4, 'Faulty index in range');
    assert(report.fixes.length === 3, 'Should provide 3 fix options');
    assert(report.fixes.includes(report.correctFix), 'Correct fix must be in options');
    checked++;
  }
  console.log(`✔ Verified ${checked} Station D reports.`);
}

// 4. Station Data Validations
console.log('\n[4/7] Testing station data integrity (LADDER_CASES, ZIPLINE_SCENES)...');
{
  for (const c of LADDER_CASES) {
    assert(c.d * c.d + c.h * c.h === c.L * c.L, `Invalid ladder triple: ${JSON.stringify(c)}`);
  }

  assert(ZIPLINE_SCENES.length === 4, 'Expected 4 zipline scenes');
  for (const s of ZIPLINE_SCENES) {
    assert(s.steps.length === 3, `Scene ${s.id} should have 3 steps`);
    for (const step of s.steps) {
      assert(step.options.includes(step.correct), `Step ${step.prompt} correct answer not in options`);
    }
  }

  // WONDER diagram parity
  assert(WONDER.legA * WONDER.legA + WONDER.legB * WONDER.legB === WONDER.hypotenuse * WONDER.hypotenuse);
  assert(WONDER.headline.includes(String(WONDER.legA)));
  assert(WONDER.headline.includes(String(WONDER.legB)));

  console.log('✔ Station and story content numbers verified.');
}

// 5. Gamification & Reducer Badge Unlock Walkthrough (All 8 + 10 Boss Trophies)
console.log('\n[5/7] Testing full badge unlocking & reducer state...');
{
  let state = INITIAL_STATE;

  // 1. first_correct
  state = appReducer(state, { type: 'ANSWER_CORRECT', payload: { xpDelta: 10 } });
  assert(state.badges.includes('first_correct'), 'first_correct should unlock');

  // 2. streak_5
  for (let i = 0; i < 4; i++) {
    state = appReducer(state, { type: 'ANSWER_CORRECT', payload: { xpDelta: 10 } });
  }
  assert(state.badges.includes('streak_5'), 'streak_5 should unlock');

  // 3. streak_10
  for (let i = 0; i < 5; i++) {
    state = appReducer(state, { type: 'ANSWER_CORRECT', payload: { xpDelta: 10 } });
  }
  assert(state.badges.includes('streak_10'), 'streak_10 should unlock');

  // 4. sim_all
  state = appReducer(state, { type: 'COMPLETE_SIM_STATION', payload: 0 });
  state = appReducer(state, { type: 'COMPLETE_SIM_STATION', payload: 1 });
  state = appReducer(state, { type: 'COMPLETE_SIM_STATION', payload: 2 });
  assert(state.badges.includes('sim_all'), 'sim_all should unlock');

  // 5. world_3star
  state = appReducer(state, { type: 'UPDATE_WORLD_RESULT', payload: { worldIdx: 0, stars: 3 } });
  assert(state.badges.includes('world_3star'), 'world_3star should unlock');

  // 6. boss_won + boss_0 trophy
  state = appReducer(state, { type: 'UPDATE_WORLD_RESULT', payload: { worldIdx: 0, stars: 3, bossWon: true } });
  assert(state.badges.includes('boss_won'), 'boss_won should unlock');
  assert(state.badges.includes('boss_0'), 'boss_0 should unlock');

  // Unlock remaining 9 boss trophies
  for (let w = 1; w < 10; w++) {
    state = appReducer(state, { type: 'UPDATE_WORLD_RESULT', payload: { worldIdx: w, stars: 3, bossWon: true } });
    assert(state.badges.includes(`boss_${w}`), `boss_${w} should unlock`);
  }

  // 7. answered_20
  while (state.totalAnswered < 20) {
    state = appReducer(state, { type: 'ANSWER_CORRECT', payload: { xpDelta: 10 } });
  }
  assert(state.badges.includes('answered_20'), 'answered_20 should unlock');

  // 8. journey_complete
  state = appReducer(state, { type: 'COMPLETE_PHASE', payload: 'reflect' });
  assert(state.badges.includes('journey_complete'), 'journey_complete should unlock');

  // Check that all 8 core badges and 10 boss trophies are unlocked
  for (const b of BADGES) {
    assert(state.badges.includes(b.id), `Badge ${b.id} missing`);
  }
  for (const t of BOSS_TROPHIES) {
    assert(state.badges.includes(t.id), `Boss trophy ${t.id} missing`);
  }

  console.log(`✔ All 18 badges & boss trophies verified! (Total badges in state: ${state.badges.length})`);
}

// 6. Calculator Reducer Integrity Tests (TRD §5.8 & §12.2)
console.log('\n[6/7] Testing Calculator reducer arithmetic...');
{
  const { INITIAL_CALC_STATE, calcReducer } = await import('../src/utils/calculatorEngine.js');

  // Test 1: 3 x² + 8 x² = √ -> 8.5440037
  let cState = INITIAL_CALC_STATE;
  cState = calcReducer(cState, { type: 'DIGIT', digit: '3' });
  cState = calcReducer(cState, { type: 'SQUARE' }); // 3² = 9
  assert.strictEqual(cState.entry, '9');

  cState = calcReducer(cState, { type: 'OP', op: '+' });
  cState = calcReducer(cState, { type: 'DIGIT', digit: '8' });
  cState = calcReducer(cState, { type: 'SQUARE' }); // 8² = 64
  assert.strictEqual(cState.entry, '64');

  cState = calcReducer(cState, { type: 'EQUALS' }); // 9 + 64 = 73
  assert.strictEqual(cState.entry, '73');

  cState = calcReducer(cState, { type: 'SQRT' }); // √73 = 8.5440037
  assert.strictEqual(cState.entry, '8.5440037', `Expected 8.5440037, got ${cState.entry}`);

  // Test 2: √ of negative number -> Error
  cState = INITIAL_CALC_STATE;
  cState = calcReducer(cState, { type: 'DIGIT', digit: '4' });
  cState = calcReducer(cState, { type: 'OP', op: '−' });
  cState = calcReducer(cState, { type: 'DIGIT', digit: '9' });
  cState = calcReducer(cState, { type: 'EQUALS' }); // -5
  assert.strictEqual(cState.entry, '-5');
  cState = calcReducer(cState, { type: 'SQRT' });
  assert.strictEqual(cState.entry, 'Error');

  // Test 3: Chained immediate-execution operations (2 + 3 × 4 = 20)
  cState = INITIAL_CALC_STATE;
  cState = calcReducer(cState, { type: 'DIGIT', digit: '2' });
  cState = calcReducer(cState, { type: 'OP', op: '+' });
  cState = calcReducer(cState, { type: 'DIGIT', digit: '3' });
  cState = calcReducer(cState, { type: 'OP', op: '×' }); // 2 + 3 = 5, op: '×'
  assert.strictEqual(cState.entry, '5');
  cState = calcReducer(cState, { type: 'DIGIT', digit: '4' });
  cState = calcReducer(cState, { type: 'EQUALS' }); // 5 × 4 = 20
  assert.strictEqual(cState.entry, '20');

  console.log('✔ Calculator reducer verified (3 x² + 8 x² = √ → 8.5440037, √ negative, chained ops).');
}

// 7. Authoring & Code Integrity Lint Checks
console.log('\n[7/7] Checking code integrity & authoring constraints...');
{
  function scanDir(dir) {
    let files = [];
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        files = files.concat(scanDir(full));
      } else if (/\.(jsx?|css|html)$/.test(item.name)) {
        files.push(full);
      }
    }
    return files;
  }

  const srcFiles = scanDir(SRC_DIR);

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);

    // Rule: No speechSynthesis under any circumstance
    assert(!content.includes('speechSynthesis'), `speechSynthesis found in ${rel}`);

    // Rule: No leftover MOE branding
    assert(!/\bMOE\b/.test(content), `Found 'MOE' in ${rel}`);

    // Rule: No small text-10px / text-11px
    assert(!content.includes('text-[10px]'), `Found text-[10px] in ${rel}`);
    assert(!content.includes('text-[11px]'), `Found text-[11px] in ${rel}`);

    // Rule: No vh-based card height (use dvh)
    assert(!/max-h-\[\d+vh\]/.test(content), `Found vh max-height in ${rel} (use dvh)`);

    // Rule: No CSS zoom
    assert(!/zoom\s*:/.test(content), `Found CSS zoom in ${rel}`);
  }

  // Verify all simulation station files are imported in SimulatePhase.jsx (no orphans)
  const simPhaseContent = fs.readFileSync(path.join(SRC_DIR, 'components', 'phases', 'SimulatePhase.jsx'), 'utf8');
  const simDir = path.join(SRC_DIR, 'components', 'simulations');
  for (const sf of fs.readdirSync(simDir)) {
    if (sf.endsWith('.jsx') && sf !== 'kit.jsx') {
      const baseName = sf.replace('.jsx', '');
      assert(simPhaseContent.includes(baseName), `Orphan simulation file: ${sf} is not imported in SimulatePhase.jsx`);
    }
  }

  console.log(`✔ Code integrity scan passed across ${srcFiles.length} source files with 0 orphan simulations.`);
}

console.log('\n🎉 ALL UNIT TESTS & SYSTEM CHECKS PASSED SUCCESSFULLY!\n');
