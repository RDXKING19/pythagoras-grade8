import React, { useState, useEffect, useRef } from 'react';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { KingdomMap } from '../gamification/KingdomMap.jsx';
import { QuestionRenderer } from '../quiz/QuestionRenderer.jsx';
import { BossBattleModal } from '../quiz/BossBattleModal.jsx';
import { FeedbackOverlay } from '../shared/FeedbackOverlay.jsx';
import { BadgesModal } from '../gamification/BadgesModal.jsx';
import { Calculator } from '../shared/Calculator.jsx';
import { sessionQuestions } from '../../data/questionBank.js';
import { WORLDS } from '../../config/worlds.config.js';
import { calcStars, calcXP } from '../../utils/scoring.js';
import { narrate, playClickSound } from '../../utils/audio.js';
import {
  playCorrectNarration,
  playWrongNarration,
  playHint1Narration,
  playHint2Narration,
  districtCompleteNarration,
  bossWinNarration
} from '../../utils/narration.js';
import {
  CALCULATOR_ENABLED,
  TIMER_SECONDS
} from '../../config/app.config.js';

const MODES = [
  { id: 'guided', name: 'Guided Practice', icon: '🧭', questions: 5, hints: true, timed: false, lives: null },
  { id: 'independent', name: 'Independent Practice', icon: '📝', questions: 10, hints: false, timed: false, lives: null },
  { id: 'timed', name: 'Timed Challenge', icon: '⏱️', questions: 8, hints: false, timed: true, lives: null },
  { id: 'boss', name: 'Boss Battle', icon: '⚔️', questions: 5, hints: false, timed: false, lives: 3 }
];

export function PlayPhase({
  muted = false,
  xp = 0,
  streak = 0,
  _bestStreak = 0,
  badges = [],
  worldResults = Array(10).fill(null),
  onUpdateScore,
  onGoReflect
}) {
  const [selectedMode, setSelectedMode] = useState('independent');
  const [activeWorld, setActiveWorld] = useState(null); // null = map view, number = quiz view
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [correctInSession, setCorrectInSession] = useState(0);
  const [showBossIntro, setShowBossIntro] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const timerRef = useRef(null);

  const totalStars = worldResults.reduce((a, b) => a + (b || 0), 0);
  const anyWorldHasStars = worldResults.some(r => r != null && r > 0);

  // Timer effect for Timed Challenge Mode (Question-scoped)
  useEffect(() => {
    if (activeWorld !== null && selectedMode === 'timed' && !feedback && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleTimeOut();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [activeWorld, selectedMode, feedback, timeLeft]);

  const handleTimeOut = () => {
    if (feedback) return;
    const q = questions[qIdx];
    if (!q) return;

    if (!muted) narrate(playWrongNarration(), true);
    if (onUpdateScore) {
      onUpdateScore({ isCorrect: false });
    }

    setFeedback({
      status: 'wrong',
      title: 'Time is up! ⏱️',
      explanation: `Time expired on this job card. ${q.explanation}`
    });
  };

  const startWorldSession = (worldIdx, modeId = selectedMode) => {
    const seed = Date.now();
    const sessionList = sessionQuestions(worldIdx, modeId, seed);

    setQuestions(sessionList);
    setQIdx(0);
    setSelectedOption(null);
    setFeedback(null);
    setHintLevel(0);
    setCorrectInSession(0);
    setTimeLeft(TIMER_SECONDS);
    setLives(modeId === 'boss' ? 3 : null);

    if (modeId === 'boss') {
      setShowBossIntro(true);
    } else {
      setActiveWorld(worldIdx);
    }
  };

  const handleOptionSelect = (option) => {
    playClickSound();
    if (selectedOption !== null || feedback !== null) return;
    setSelectedOption(option);

    const q = questions[qIdx];
    const isCorrect = option === q.correctAnswer;

    if (isCorrect) {
      const nextCorrect = correctInSession + 1;
      setCorrectInSession(nextCorrect);
      const earnedXP = calcXP({ attempts: 1, hintsUsed: hintLevel, streak: streak + 1 });

      if (!muted) narrate(playCorrectNarration(nextCorrect), true);

      if (onUpdateScore) {
        onUpdateScore({
          xpDelta: earnedXP,
          isCorrect: true
        });
      }

      setFeedback({
        status: 'correct',
        title: 'Job done! 🎯',
        explanation: q.explanation,
        xpGained: earnedXP
      });
    } else {
      let remainingLives = lives;
      if (selectedMode === 'boss') {
        remainingLives = Math.max(0, lives - 1);
        setLives(remainingLives);
      }

      if (!muted) narrate(playWrongNarration(), true);

      if (onUpdateScore) {
        onUpdateScore({
          isCorrect: false
        });
      }

      setFeedback({
        status: 'wrong',
        title: 'Not quite — check the diagram 🔍',
        explanation: q.explanation
      });
    }
  };

  const handleNextQuestionOrFinish = () => {
    const isBossDead = selectedMode === 'boss' && lives <= 0;

    if (isBossDead) {
      // Boss defeated the player
      setFeedback(null);
      setActiveWorld(null);
      return;
    }

    if (qIdx < questions.length - 1) {
      setQIdx(i => i + 1);
      setSelectedOption(null);
      setFeedback(null);
      setHintLevel(0);
      setTimeLeft(TIMER_SECONDS);
    } else {
      // Finish Session
      finishQuizSession(correctInSession);
    }
  };

  const finishQuizSession = (finalCorrect) => {
    const starsEarned = calcStars(finalCorrect);
    const bossWon = selectedMode === 'boss' && (lives === null || lives > 0) && finalCorrect >= 5;

    if (onUpdateScore) {
      onUpdateScore({
        worldIdx: activeWorld,
        stars: starsEarned,
        bossWon
      });
    }

    if (bossWon) {
      const currentBoss = WORLDS[activeWorld]?.boss;
      if (!muted && currentBoss) narrate(bossWinNarration(currentBoss.name), true);
    } else if (starsEarned > 0) {
      const currentWorld = WORLDS[activeWorld];
      if (!muted && currentWorld) narrate(districtCompleteNarration(currentWorld.name, starsEarned), true);
    }

    setFeedback(null);
    setActiveWorld(null);
  };

  const handleUseHint = () => {
    if (hintLevel < 2) {
      const nextLevel = hintLevel + 1;
      setHintLevel(nextLevel);
      const q = questions[qIdx];
      if (!muted && q) {
        if (nextLevel === 1) narrate(playHint1Narration(q), true);
        if (nextLevel === 2) narrate(playHint2Narration(q), true);
      }
    }
  };

  const currentWorldObj = activeWorld !== null ? WORLDS[activeWorld] : null;

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 md:p-5 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      {/* Main Glass Card */}
      <div className="w-full max-w-6xl phase-card bg-[#160b38]/95 border-2 border-purple-400/40 rounded-3xl p-3 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Glowing Green Phase Band */}
        <div className="phase-band phase-band--play w-20 h-1.5 bg-emerald-400 rounded-full mb-1.5 shadow-[0_0_16px_rgba(74,222,128,0.85)] shrink-0" />

        {/* Header Stats Bar */}
        <div className="w-full flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10 shrink-0 px-1">
          {/* Left Title / World info */}
          <div className="flex items-center gap-2 min-w-0">
            {activeWorld === null ? (
              <>
                <span className="text-xl sm:text-2xl">🎮</span>
                <div className="min-w-0">
                  <h2 className="font-display font-900 text-sm sm:text-lg md:text-xl text-white truncate">
                    Practice Job Sites
                  </h2>
                  <p className="text-xs text-slate-300 font-extrabold truncate hidden sm:block">
                    10 worlds · Need 1★ in World n to unlock World n+1
                  </p>
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setActiveWorld(null)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-display font-bold text-xs sm:text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer transition min-h-[44px]"
              >
                <span>← Map</span>
                <span className="text-amber-300 font-black">
                  · W{activeWorld + 1}: {currentWorldObj?.name}
                </span>
              </button>
            )}
          </div>

          {/* Right Stats Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Calculator Button (if enabled) */}
            {CALCULATOR_ENABLED && activeWorld !== null && (
              <button
                type="button"
                onClick={() => setShowCalculator(true)}
                aria-label="Open Tally's Calculator"
                title="Tally's Calculator"
                className="bg-[#24134d] hover:bg-[#341b70] border border-amber-400/50 text-amber-300 font-display font-bold text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer transition shadow-md min-h-[44px]"
              >
                <span>🧮</span>
                <span className="hidden sm:inline font-black">Calc</span>
              </button>
            )}

            {/* Stars pill */}
            <div className="bg-[#1e1044] border border-amber-400/40 text-amber-300 font-display font-black text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-full flex items-center gap-1">
              <span>⭐</span>
              <span>{totalStars} / 30</span>
            </div>

            {/* Badges Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowBadgesModal(true)}
              aria-label="View Engineering Badges"
              className="bg-[#1e1044] hover:bg-[#2c1760] border border-purple-400/40 text-purple-200 font-display font-black text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer transition min-h-[44px]"
            >
              <span>🎖️</span>
              <span className="hidden sm:inline">{badges.length} Badges</span>
            </button>

            {/* Collapsed phone chip vs separate chips */}
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="bg-[#1e1044] border border-orange-400/40 text-orange-300 font-display font-black text-xs sm:text-sm px-2.5 py-1.5 rounded-full flex items-center gap-1">
                <span>🔥</span>
                <span>{streak}</span>
              </div>
              <div className="bg-[#1e1044] border border-cyan-400/40 text-cyan-300 font-display font-black text-xs sm:text-sm px-2.5 py-1.5 rounded-full flex items-center gap-1">
                <span>✨</span>
                <span>{xp} XP</span>
              </div>
            </div>

            {/* Phone single stats chip */}
            <div className="flex sm:hidden bg-[#1e1044] border border-purple-400/40 text-slate-100 font-display font-black text-xs px-2.5 py-1 rounded-full">
              🔥 {streak} · ✨ {xp}
            </div>
          </div>
        </div>

        {/* ---------------- VIEW A: WORLD MAP & MODE SELECTOR ---------------- */}
        {activeWorld === null && (
          <div className="w-full flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
            {/* Mode Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5 shrink-0">
              {MODES.map(m => {
                const isSelected = selectedMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedMode(m.id);
                    }}
                    className={`py-2 px-3 rounded-xl border-2 font-display text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer min-h-[44px] ${
                      isSelected
                        ? 'border-emerald-400 bg-[#162d38] text-white shadow-[0_0_15px_rgba(74,222,128,0.4)] font-900 scale-[1.01]'
                        : 'border-white/10 bg-[#13082b]/80 text-slate-300 hover:border-emerald-400/40 font-bold'
                    }`}
                  >
                    <span className="text-base">{m.icon}</span>
                    <span className="truncate">{m.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Kingdom Map 10-World Grid */}
            <div className="flex-1 min-h-0 w-full overflow-y-auto px-1 py-1">
              <KingdomMap
                worldResults={worldResults}
                onSelectWorld={idx => startWorldSession(idx, selectedMode)}
              />
            </div>

            {/* Footer with Go to Reflect Phase button */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-300 font-extrabold hidden sm:inline">
                {anyWorldHasStars ? 'You can proceed to Reflect anytime or continue practicing!' : 'Earn at least 1★ to unlock further worlds.'}
              </span>
              <button
                type="button"
                onClick={onGoReflect}
                className="btn-gold font-display font-900 text-xs sm:text-sm py-2.5 px-6 rounded-full shadow-lg hover:scale-105 transition cursor-pointer ml-auto min-h-[44px]"
              >
                <span>Go to Reflect Phase →</span>
              </button>
            </div>
          </div>
        )}

        {/* ---------------- VIEW B: ACTIVE QUIZ VIEW ---------------- */}
        {activeWorld !== null && questions[qIdx] && (
          <div className="w-full flex-1 min-h-0 flex flex-col justify-between overflow-y-auto px-1">
            {/* Top Sub-Bar: Question Index, Timer / Lives, Hint Button */}
            <div className="w-full flex items-center justify-between mb-2 shrink-0">
              {/* Question progress */}
              <span className="font-display font-900 text-xs sm:text-sm text-slate-200">
                Job Card {qIdx + 1} of {questions.length}
              </span>

              {/* Mode-specific indicators */}
              <div className="flex items-center gap-2">
                {selectedMode === 'boss' && (
                  <div className="flex items-center gap-1 bg-rose-950/80 border border-rose-500/50 px-3 py-1 rounded-full text-xs font-black text-rose-300">
                    <span>❤️</span>
                    <span>{lives} Lives</span>
                  </div>
                )}

                {selectedMode === 'timed' && (
                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border ${
                      timeLeft <= 10
                        ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                        : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                    }`}
                  >
                    <span>⏱️</span>
                    <span>{timeLeft}s</span>
                  </div>
                )}

                {selectedMode === 'guided' && (
                  <button
                    type="button"
                    onClick={handleUseHint}
                    disabled={hintLevel >= 2}
                    className="bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-300 font-display font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer transition disabled:opacity-40 min-h-[44px]"
                  >
                    <span>💡</span>
                    <span>{hintLevel === 0 ? 'Need Clue?' : hintLevel === 1 ? 'Clue #2' : 'Clues Used'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Question Renderer Component */}
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center my-auto">
              <QuestionRenderer
                question={questions[qIdx]}
                selectedOption={selectedOption}
                onSelectOption={handleOptionSelect}
                showHints={selectedMode === 'guided'}
                hintLevel={hintLevel}
                disabled={feedback !== null}
              />
            </div>
          </div>
        )}
      </div>

      {/* ---------------- MODALS & OVERLAYS ---------------- */}

      {/* Boss Intro Modal */}
      {showBossIntro && (
        <BossBattleModal
          boss={WORLDS[activeWorld]?.boss}
          lives={3}
          onStart={() => {
            setShowBossIntro(false);
          }}
          onClose={() => {
            setShowBossIntro(false);
            setActiveWorld(null);
          }}
        />
      )}

      {/* Feedback Overlay */}
      {feedback && (
        <FeedbackOverlay
          status={feedback.status}
          title={feedback.title}
          explanation={feedback.explanation}
          xpGained={feedback.xpGained || 0}
          badge={feedback.badge || null}
          onNext={handleNextQuestionOrFinish}
          nextLabel={
            selectedMode === 'boss' && lives <= 0
              ? 'Conclude Battle ↩'
              : qIdx < questions.length - 1
              ? 'Next Job Card →'
              : 'Complete Site Mission! 🏆'
          }
        />
      )}

      {/* Badges Modal */}
      {showBadgesModal && (
        <BadgesModal
          unlockedBadges={badges}
          onClose={() => setShowBadgesModal(false)}
        />
      )}

      {/* Tally's Calculator Dialog */}
      {showCalculator && (
        <Calculator
          isOpen={true}
          onClose={() => setShowCalculator(false)}
        />
      )}
    </div>
  );
}
