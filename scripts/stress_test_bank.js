import { generateWorld, sessionQuestions } from '../src/data/questionBank.js';
import {
  sum2,
  round1,
  fmt,
  converse
} from '../src/utils/pythagorasMath.js';

console.log('--- Starting Question Bank Stress Test (300 seeds x 100 questions = 30,000 Qs) ---');

const SEED_COUNT = 300;
let totalQuestionsTested = 0;
let totalFailures = 0;

for (let seed = 1; seed <= SEED_COUNT; seed++) {
  // Test each of the 10 worlds
  for (let worldId = 0; worldId < 10; worldId++) {
    const questions = generateWorld(worldId, seed + worldId * 7919);

    if (!Array.isArray(questions) || questions.length !== 10) {
      console.error(`Seed ${seed}, World ${worldId}: Expected exactly 10 questions, got ${questions?.length}`);
      totalFailures++;
      continue;
    }

    // Rule: Strict 10 distinct questionTexts in each world
    const questionTexts = new Set(questions.map(q => q.questionText));
    if (questionTexts.size !== 10) {
      console.error(`Seed ${seed}, World ${worldId}: Only ${questionTexts.size}/10 distinct questionTexts`);
      totalFailures++;
    }

    // World 9 mixed-review check: >= 5 distinct source worlds across 10 slots
    if (worldId === 9) {
      const sourceWorlds = new Set(
        questions.map(q => q.visualData?.sourceWorld).filter(w => w !== undefined)
      );
      if (sourceWorlds.size < 5) {
        console.error(`Seed ${seed}, World 9: Source worlds drawn < 5 (got ${sourceWorlds.size})`);
        totalFailures++;
      }
    }

    // Validate each question
    for (const q of questions) {
      totalQuestionsTested++;

      // 1. Schema integrity
      if (!q.id || !q.category || !q.questionText || !q.explanation || !q.hint1 || !q.hint2) {
        console.error(`Seed ${seed}, Q ${q.id}: Missing schema field`);
        totalFailures++;
      }

      // 2. Options validation
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        console.error(`Seed ${seed}, Q ${q.id}: Expected 4 options, got ${q.options?.length}`);
        totalFailures++;
      }

      const distinctOptions = new Set(q.options);
      if (distinctOptions.size !== 4) {
        console.error(`Seed ${seed}, Q ${q.id}: Options not distinct: ${JSON.stringify(q.options)}`);
        totalFailures++;
      }

      if (!q.options.includes(q.correctAnswer)) {
        console.error(`Seed ${seed}, Q ${q.id}: correctAnswer "${q.correctAnswer}" not in options`);
        totalFailures++;
      }

      // Check for NaN or undefined in JSON stringification
      const str = JSON.stringify(q);
      if (str.includes('NaN') || str.includes('undefined') || str.includes('null')) {
        console.error(`Seed ${seed}, Q ${q.id}: Contains NaN/undefined/null`);
        totalFailures++;
      }

      // 3. Independent mathematical recomputation
      const v = q.visualData;
      if (v) {
        if (v.calcType === 'hypotenuse' && v.a && v.b) {
          const h = Math.sqrt(sum2(v.a, v.b));
          const expected = v.isDecimal ? fmt(round1(h)) + (v.unit ? ' ' + v.unit : '') : fmt(Math.round(h)) + (v.unit ? ' ' + v.unit : '');
          if (q.correctAnswer !== expected) {
            console.error(`Seed ${seed}, Q ${q.id}: Math mismatch. Expected ${expected}, got ${q.correctAnswer}`);
            totalFailures++;
          }
        } else if (v.calcType === 'leg' && v.c && v.b) {
          const l = Math.sqrt(v.c * v.c - v.b * v.b);
          const expected = v.isDecimal ? fmt(round1(l)) + (v.unit ? ' ' + v.unit : '') : fmt(Math.round(l)) + (v.unit ? ' ' + v.unit : '');
          if (q.correctAnswer !== expected) {
            console.error(`Seed ${seed}, Q ${q.id}: Math mismatch. Expected ${expected}, got ${q.correctAnswer}`);
            totalFailures++;
          }
        } else if (v.calcType === 'converse' && Array.isArray(v.sides)) {
          const cResult = converse(v.sides);
          const expectedIsRight = cResult.isRight;
          const saysYes = q.correctAnswer.toLowerCase().startsWith('yes');
          if (saysYes !== expectedIsRight) {
            console.error(`Seed ${seed}, Q ${q.id}: Converse polarity mismatch. Sides: ${v.sides}, Expected Yes: ${expectedIsRight}`);
            totalFailures++;
          }
        }

        // Domain rule: non-whole answers must have "correct to 1 decimal place" in questionText
        if (v.isDecimal && v.needsRounding) {
          if (!q.questionText.includes('correct to 1 decimal place')) {
            console.error(`Seed ${seed}, Q ${q.id}: Decimal question missing "correct to 1 decimal place" instruction`);
            totalFailures++;
          }
        }
      }
    }
  }

  // Check sessionQuestions API for each mode
  for (const mode of ['guided', 'independent', 'timed', 'boss']) {
    const sessionQs = sessionQuestions(0, mode, seed);
    const expectedCounts = { guided: 5, independent: 10, timed: 8, boss: 5 };
    if (sessionQs.length !== expectedCounts[mode]) {
      console.error(`Seed ${seed}, Mode ${mode}: Expected ${expectedCounts[mode]} questions, got ${sessionQs.length}`);
      totalFailures++;
    }
    if (mode === 'boss') {
      const slots = sessionQs.map(q => q.slot);
      if (!slots.every(s => s >= 5 && s <= 9)) {
        console.error(`Seed ${seed}, Boss slots not in [5..9]: ${JSON.stringify(slots)}`);
        totalFailures++;
      }
    }
  }
}

console.log(`\nResults: ${totalQuestionsTested} questions verified across ${SEED_COUNT} seeds.`);
if (totalFailures === 0) {
  console.log('🎉 PASS: 0 errors found! Question bank generator fully verified.');
  process.exit(0);
} else {
  console.error(`❌ FAIL: Encountered ${totalFailures} failures.`);
  process.exit(1);
}
