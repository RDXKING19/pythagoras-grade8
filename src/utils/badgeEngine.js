import { WORLDS } from '../config/worlds.config.js';

export const BADGES = [
  {
    id: 'first_correct',
    name: 'First Beam Placed',
    icon: '🧱',
    description: 'Placed your first correct beam on the job site!'
  },
  {
    id: 'streak_5',
    name: 'Steady Scaffold',
    icon: '🔥',
    description: 'Built a streak of 5 correct measurements in a row!'
  },
  {
    id: 'streak_10',
    name: 'Skyline Streak',
    icon: '🏙️',
    description: 'Soaring high with a streak of 10 consecutive correct answers!'
  },
  {
    id: 'sim_all',
    name: 'Fully Equipped Foreman',
    icon: '🧰',
    description: 'Mastered all 3 training stations in the Right-Angle Workshop!'
  },
  {
    id: 'world_3star',
    name: 'Triple-Check Approved',
    icon: '⭐⭐⭐',
    description: 'Scored a perfect 3 stars in a job site district!'
  },
  {
    id: 'boss_won',
    name: 'Site Boss Beaten',
    icon: '🏆',
    description: 'Proved your engineering skills and conquered a site boss battle!'
  },
  {
    id: 'answered_20',
    name: 'Persistent Plumb Line',
    icon: '📏',
    description: 'Tackled 20 or more practice questions on the field!'
  },
  {
    id: 'journey_complete',
    name: 'Chief Site Engineer',
    icon: '🎖️',
    description: 'Completed the full 5-phase mission and certified your mastery!'
  }
];

// 10 Boss trophies
export const BOSS_TROPHIES = WORLDS.map(w => ({
  id: `boss_${w.id}`,
  name: w.boss.reward,
  icon: w.boss.emoji,
  description: `Defeated ${w.boss.name} in ${w.name}`
}));

export const ALL_BADGES = [...BADGES, ...BOSS_TROPHIES];

/**
 * Checks all badge criteria against the full reducer state.
 * Returns array of newly unlocked badge objects.
 */
export function checkBadges(state = {}) {
  const currentBadges = new Set(state.badges || []);
  const newlyUnlocked = [];

  const addIfNew = (badge) => {
    if (badge && !currentBadges.has(badge.id)) {
      newlyUnlocked.push(badge);
      currentBadges.add(badge.id);
    }
  };

  const totalCorrect = state.totalCorrect || 0;
  const totalAnswered = state.totalAnswered || 0;
  const bestStreak = Math.max(state.bestStreak || 0, state.streak || 0);
  const simCompleted = state.simCompleted || [];
  const worldResults = state.worldResults || [];
  const bossesDefeated = state.bossesDefeated || 0;
  const bossWins = state.bossWins || [];

  if (totalCorrect >= 1) {
    addIfNew(BADGES.find(b => b.id === 'first_correct'));
  }

  if (bestStreak >= 5) {
    addIfNew(BADGES.find(b => b.id === 'streak_5'));
  }

  if (bestStreak >= 10) {
    addIfNew(BADGES.find(b => b.id === 'streak_10'));
  }

  if (simCompleted.length >= 3 && simCompleted.slice(0, 3).every(Boolean)) {
    addIfNew(BADGES.find(b => b.id === 'sim_all'));
  }

  if (worldResults.some(r => r === 3)) {
    addIfNew(BADGES.find(b => b.id === 'world_3star'));
  }

  if (bossesDefeated >= 1) {
    addIfNew(BADGES.find(b => b.id === 'boss_won'));
  }

  if (totalAnswered >= 20) {
    addIfNew(BADGES.find(b => b.id === 'answered_20'));
  }

  if (state.journeyComplete) {
    addIfNew(BADGES.find(b => b.id === 'journey_complete'));
  }

  // Check boss trophies
  for (let i = 0; i < 10; i++) {
    if (bossWins[i]) {
      addIfNew(BOSS_TROPHIES.find(b => b.id === `boss_${i}`));
    }
  }

  return newlyUnlocked;
}
