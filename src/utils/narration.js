import { speak } from './speak.js';
import { WONDER, STORY_PANELS } from '../data/storyContent.js';

export const say = text => ({ text, style: 'statement' });
export const ask = text => ({ text, style: 'question' });
export const cheer = text => ({ text, style: 'encouragement' });
export const emphasize = text => ({ text, style: 'emphasis' });
export const think = text => ({ text, style: 'thinking' });
export const celebrate = text => ({ text, style: 'celebration' });

export function wonderNarration() {
  return [
    say(speak(WONDER.body)),
    ask(speak(WONDER.tallyQuestion))
  ];
}

export function storyNarration(panelIdx) {
  const panel = STORY_PANELS[panelIdx] || STORY_PANELS[0];
  return [
    say(speak(panel.text)),
    emphasize(speak(panel.highlight))
  ];
}

export function simStationIntro(stationIdx) {
  const intros = [
    "Welcome to the Square Lab. Build real squares on the three sides of a right-angled triangle and watch the areas add up.",
    "Welcome to Ladder Rescue. Slide the foot of the ladder to the right distance so the top reaches the window target.",
    "Welcome to the Zip-Line Designer. Solve multi-step engineering challenges by building the right-angled triangle step by step."
  ];
  return [say(speak(intros[stationIdx] || intros[0]))];
}

export function playQuestionNarration(question) {
  return [say(speak(question.questionText))];
}

export function playCorrectNarration(n = 1) {
  const cheers = [
    "Job done! That measurement is spot on.",
    "Brilliant! The right angle holds strong.",
    "Outstanding calculation! Keep that streak building.",
    "Perfect work! You nailed that side length.",
    "Solid engineering! That answer fits like a charm."
  ];
  return [cheer(cheers[(n - 1) % cheers.length])];
}

export function playWrongNarration() {
  return [think("Not quite — take another close look at the diagram and check whether to add or subtract.")];
}

export function playHint1Narration(question) {
  return [say(speak(question.hint1))];
}

export function playHint2Narration(question) {
  return [say(speak(question.hint2))];
}

export function districtCompleteNarration(worldName = 'this district', stars = 3) {
  return [celebrate(`Fantastic job finishing ${worldName} with ${stars} stars! Your apprenticeship is progressing rapidly.`)];
}

export function bossStartNarration(bossName = 'The Boss') {
  return [say(`Site boss challenge! ${bossName} has challenged your measurements. Solve five jobs with three lives to claim victory!`)];
}

export function bossWinNarration(bossName = 'The Boss') {
  return [celebrate(`Incredible engineering! You conquered ${bossName} and earned the site trophy!`)];
}

export function reflectNarration() {
  return [say("Welcome to the Site Debrief. Review key right-angle concepts and inspect your engineering scorecard.")];
}

export function reflectCompleteNarration() {
  return [celebrate("Mission accomplished! You have officially certified as Chief Site Engineer in real-world Pythagoras!")];
}

/**
 * Returns all static narration phrases that can be pre-rendered as MP3s.
 */
export function getAllNarration() {
  const list = [];
  const add = (segments) => {
    segments.forEach(s => {
      if (s && s.text && !list.some(item => item.text === s.text)) {
        list.push(s);
      }
    });
  };

  // Wonder
  add(wonderNarration());

  // All 6 Story Panels
  for (let i = 0; i < STORY_PANELS.length; i++) {
    add(storyNarration(i));
  }

  // 3 Simulation Intros
  for (let i = 0; i < 3; i++) {
    add(simStationIntro(i));
  }

  // Reflect
  add(reflectNarration());
  add(reflectCompleteNarration());

  // Fixed feedback & cheer phrases
  for (let i = 1; i <= 5; i++) {
    add(playCorrectNarration(i));
  }
  add(playWrongNarration());

  return list;
}
