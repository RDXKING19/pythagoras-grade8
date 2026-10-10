import { STORY_PANELS } from '../data/storyContent.js';
import { checkBadges } from './badgeEngine.js';
import { setMuted } from './audio.js';
import { SIM_STATION_COUNT } from '../config/app.config.js';

export const INITIAL_STATE = {
  phase: 'intro', // 'intro' | 'wonder' | 'story' | 'simulate' | 'practice' | 'reflect'
  storyPanel: 0,
  simStation: 0,
  simCompleted: Array(SIM_STATION_COUNT).fill(false),
  worldResults: Array(10).fill(null),
  bossWins: Array(10).fill(false),
  xp: 0,
  streak: 0,
  bestStreak: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  bossesDefeated: 0,
  badges: [],
  badgeQueue: [],
  audioEnabled: true,
  journeyComplete: false
};

/**
 * Runs checkBadges on the newly computed state, appends new badges to state.badges,
 * and tracks them in state.badgeQueue.
 */
export function withBadges(nextState) {
  const newBadges = checkBadges(nextState);
  if (newBadges.length === 0) return nextState;

  const newBadgeIds = newBadges.map(b => b.id);
  const updatedBadges = Array.from(new Set([...nextState.badges, ...newBadgeIds]));

  return {
    ...nextState,
    badges: updatedBadges,
    badgeQueue: [...(nextState.badgeQueue || []), ...newBadges]
  };
}

export function appReducer(state, action) {
  let nextState;

  switch (action.type) {
    case 'SET_PHASE':
      nextState = { ...state, phase: action.payload };
      break;

    case 'NEXT_STORY_PANEL': {
      if (state.storyPanel >= STORY_PANELS.length - 1) {
        nextState = { ...state, phase: 'simulate', storyPanel: 0 };
      } else {
        nextState = { ...state, storyPanel: state.storyPanel + 1 };
      }
      break;
    }

    case 'PREV_STORY_PANEL':
      nextState = { ...state, storyPanel: Math.max(0, state.storyPanel - 1) };
      break;

    case 'ADVANCE_SIM_STATION':
      nextState = { ...state, simStation: Math.min(SIM_STATION_COUNT - 1, state.simStation + 1) };
      break;

    case 'PREV_SIM_STATION':
      nextState = { ...state, simStation: Math.max(0, state.simStation - 1) };
      break;

    case 'COMPLETE_SIM_STATION': {
      const idx = action.payload !== undefined ? action.payload : state.simStation;
      const updated = [...state.simCompleted];
      updated[idx] = true;
      nextState = { ...state, simCompleted: updated };
      break;
    }

    case 'ANSWER_CORRECT': {
      const nextStreak = state.streak + 1;
      const nextBest = Math.max(state.bestStreak, nextStreak);
      const earnedXP = action.payload?.xpDelta || 10;

      nextState = {
        ...state,
        xp: state.xp + earnedXP,
        streak: nextStreak,
        bestStreak: nextBest,
        totalCorrect: state.totalCorrect + 1,
        totalAnswered: state.totalAnswered + 1
      };
      break;
    }

    case 'ANSWER_INCORRECT':
      nextState = {
        ...state,
        streak: 0,
        totalAnswered: state.totalAnswered + 1
      };
      break;

    case 'UNLOCK_BADGE': {
      const badgeId = action.payload;
      if (state.badges.includes(badgeId)) return state;
      nextState = { ...state, badges: [...state.badges, badgeId] };
      break;
    }

    case 'UPDATE_WORLD_RESULT': {
      const { worldIdx, stars, bossWon } = action.payload;
      const newResults = [...state.worldResults];
      const newBossWins = [...state.bossWins];
      let newBossesDefeated = state.bossesDefeated;

      if (stars !== undefined && worldIdx !== undefined) {
        newResults[worldIdx] = Math.max(newResults[worldIdx] || 0, stars);
      }

      if (bossWon && worldIdx !== undefined) {
        if (!newBossWins[worldIdx]) {
          newBossWins[worldIdx] = true;
          newBossesDefeated += 1;
        }
      }

      nextState = {
        ...state,
        worldResults: newResults,
        bossWins: newBossWins,
        bossesDefeated: newBossesDefeated
      };
      break;
    }

    case 'COMPLETE_PHASE': {
      if (action.payload === 'practice') {
        nextState = { ...state, phase: 'reflect' };
      } else if (action.payload === 'reflect') {
        nextState = {
          ...state,
          journeyComplete: true
        };
      } else {
        nextState = state;
      }
      break;
    }

    case 'TOGGLE_AUDIO': {
      const nextAudio = !state.audioEnabled;
      setMuted(!nextAudio);
      return { ...state, audioEnabled: nextAudio };
    }

    case 'RESET_SESSION':
      return { ...INITIAL_STATE, audioEnabled: state.audioEnabled };

    default:
      return state;
  }

  return withBadges(nextState);
}
