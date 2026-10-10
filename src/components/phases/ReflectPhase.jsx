import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { narrate, stopNarration, playClickSound } from '../../utils/audio.js';
import { reflectNarration, reflectCompleteNarration } from '../../utils/narration.js';
import { RECAP_QUESTIONS } from '../../data/recapQuestions.js';
import { WORLDS } from '../../config/worlds.config.js';
import { ALL_BADGES } from '../../utils/badgeEngine.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';

export function ReflectPhase({
  xp = 0,
  stars = 0,
  bestStreak = 0,
  badges = [],
  worldResults = Array(10).fill(null),
  muted = false,
  onComplete
}) {
  const [recapIdx, setRecapIdx] = useState(0);
  const [recapAnswers, setRecapAnswers] = useState({});
  const [recapCompleted, setRecapCompleted] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [recapFeedback, setRecapFeedback] = useState(null);

  const reducedMotion = useReducedMotion();
  const minLength = 10;
  const currentRecapQ = RECAP_QUESTIONS[recapIdx];

  useEffect(() => {
    if (!muted) narrate(reflectNarration(), true);
    return () => stopNarration();
  }, [muted]);

  const handleRecapSelect = (opt) => {
    playClickSound();
    const isCorrect = opt === currentRecapQ.correct;
    setRecapAnswers(prev => ({ ...prev, [currentRecapQ.id]: opt }));

    if (isCorrect) {
      setRecapFeedback({ status: 'correct', text: currentRecapQ.explanation });
    } else {
      setRecapFeedback({ status: 'wrong', text: `Review the rule: ${currentRecapQ.explanation}` });
    }
  };

  const handleNextRecap = () => {
    setRecapFeedback(null);
    if (recapIdx < RECAP_QUESTIONS.length - 1) {
      setRecapIdx(i => i + 1);
    } else {
      setRecapCompleted(true);
    }
  };

  const handleSubmit = () => {
    if (!muted) narrate(reflectCompleteNarration(), true);
    if (!reducedMotion) {
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch {
        // Ignore
      }
    }
    onComplete();
  };

  const charCount = reflectionText.trim().length;

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 md:p-5 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      <div className="w-full max-w-4xl phase-card bg-[#160b38]/95 border-2 border-purple-400/40 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col items-center fade-in-up z-20 my-auto overflow-y-auto">
        {/* Indigo Accent Bar */}
        <div className="w-20 h-1.5 bg-indigo-400 rounded-full mb-2 shadow-[0_0_16px_rgba(129,140,248,0.85)] shrink-0" />

        {/* Header */}
        <h2 className="font-display font-900 text-xl sm:text-2xl md:text-3xl text-white mb-3 flex items-center gap-2.5 shrink-0">
          <span className="text-2xl sm:text-3xl">📝</span>
          <span>Site Debrief & Engineering Scorecard</span>
        </h2>

        {/* ---------------- PART 1: 3-QUESTION CONCEPTUAL RECAP ---------------- */}
        {!recapCompleted && (
          <div className="w-full bg-[#1e1044]/95 border-2 border-purple-400/40 rounded-2xl p-3 sm:p-5 flex flex-col items-center gap-3 mb-3 shrink-0 fade-in-up">
            <div className="w-full flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
                📐 Engineering Concept Check (Question {recapIdx + 1} of 3)
              </span>
              <span className="text-xs sm:text-sm text-slate-300 font-extrabold hidden sm:inline">
                Right-Angle Foundations
              </span>
            </div>

            <p className="font-display font-900 text-base sm:text-lg md:text-xl text-white text-center leading-snug">
              {currentRecapQ.q}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
              {currentRecapQ.options.map((opt, i) => {
                const isSelected = recapAnswers[currentRecapQ.id] === opt;
                const isCorrect = opt === currentRecapQ.correct;
                const showResult = isSelected && recapFeedback;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleRecapSelect(opt)}
                    className={`p-3 rounded-xl border-2 font-display text-xs sm:text-sm text-left transition cursor-pointer min-h-[44px] ${
                      showResult
                        ? isCorrect
                          ? 'border-emerald-400 bg-emerald-950/80 text-white font-bold'
                          : 'border-rose-400 bg-rose-950/80 text-white font-bold'
                        : isSelected
                        ? 'border-amber-400 bg-[#32175c] text-white font-bold'
                        : 'border-white/15 bg-white/5 text-slate-200 hover:border-cyan-400'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {recapFeedback && (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between mt-1 gap-2 pt-1 border-t border-white/10">
                <span className={`text-xs sm:text-sm font-extrabold text-center sm:text-left ${recapFeedback.status === 'correct' ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {recapFeedback.text}
                </span>
                <button
                  type="button"
                  onClick={handleNextRecap}
                  className="btn-gold text-xs sm:text-sm font-black py-2 px-5 rounded-full shrink-0 min-h-[44px]"
                >
                  {recapIdx < RECAP_QUESTIONS.length - 1 ? 'Next Question →' : 'View Final Scorecard ✓'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------- PART 2: SCORECARD & REFLECTION (Visible when recap completed) ---------------- */}
        {recapCompleted && (
          <div className="w-full flex flex-col items-center fade-in-up">
            {/* Top 3 Score Cards */}
            <div className="grid grid-cols-3 gap-2.5 w-full mb-3 shrink-0">
              <div className="bg-[#1a0e42]/95 border-2 border-purple-400/35 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-lg">
                <span className="text-xl sm:text-2xl mb-0.5">✨</span>
                <span className="font-display font-900 text-xl sm:text-3xl text-amber-400">{xp}</span>
                <span className="text-xs font-900 text-slate-200">Total XP</span>
              </div>

              <div className="bg-[#1a0e42]/95 border-2 border-purple-400/35 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-lg">
                <span className="text-xl sm:text-2xl mb-0.5">⭐</span>
                <span className="font-display font-900 text-xl sm:text-3xl text-amber-400">{stars} / 30</span>
                <span className="text-xs font-900 text-slate-200">Stars</span>
              </div>

              <div className="bg-[#1a0e42]/95 border-2 border-purple-400/35 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-lg">
                <span className="text-xl sm:text-2xl mb-0.5">🔥</span>
                <span className="font-display font-900 text-xl sm:text-3xl text-amber-400">{bestStreak}</span>
                <span className="text-xs font-900 text-slate-200">Best Streak</span>
              </div>
            </div>

            {/* World Results Strip */}
            <div className="w-full flex flex-col items-center mb-3 shrink-0">
              <span className="text-xs font-900 text-amber-400 tracking-wider uppercase mb-1">
                JOB SITE RESULTS
              </span>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 w-full">
                {WORLDS.map((w, idx) => {
                  const res = worldResults[idx];
                  return (
                    <div
                      key={w.id}
                      className="bg-[#1a0e42]/80 border border-purple-400/30 rounded-xl p-1.5 flex flex-col items-center justify-between text-center min-h-[48px] shadow-sm"
                    >
                      <span className="text-xs font-black text-slate-300">W{idx + 1}</span>
                      <span className="text-xs font-900 text-amber-400 mt-0.5">
                        {res != null && res > 0 ? `${res}★` : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Badges Row */}
            <div className="w-full flex items-center justify-between bg-[#1a0e42]/80 border border-purple-400/30 rounded-xl p-2 mb-3 shrink-0">
              <span className="text-xs font-black text-slate-300 uppercase">
                Badges Earned ({badges.length})
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {badges.slice(0, 8).map(bId => {
                  const badgeObj = ALL_BADGES.find(b => b.id === bId);
                  return (
                    <span key={bId} title={badgeObj?.name} className="text-lg">
                      {badgeObj?.icon || '🎖️'}
                    </span>
                  );
                })}
                {badges.length > 8 && (
                  <span className="text-xs text-amber-300 font-bold">+{badges.length - 8}</span>
                )}
              </div>
            </div>

            {/* Reflection Textarea to Foreman Tally */}
            <div className="w-full flex items-start gap-3 mb-3 shrink-0">
              <div className="w-12 h-12 rounded-full bg-[#1e0e4a] border-2 border-amber-400 flex items-center justify-center text-2xl shadow-lg shrink-0 mt-1">
                🦉
              </div>

              <div className="flex-1 flex flex-col text-left">
                <h3 className="font-display font-900 text-xs sm:text-sm md:text-base text-white mb-1 leading-tight">
                  Explain to Foreman Tally how you know whether to add or subtract the squares:
                </h3>

                <div className="w-full bg-[#0e0626] border-2 border-purple-400/40 rounded-2xl p-2.5 flex flex-col relative shadow-inner">
                  <textarea
                    rows="3"
                    value={reflectionText}
                    onChange={e => setReflectionText(e.target.value)}
                    placeholder="Dear Foreman Tally, to find a hypotenuse I add the squares because…"
                    className="w-full bg-transparent text-sm sm:text-base font-extrabold text-white placeholder-slate-400 outline-none resize-none font-sans"
                  />
                  <div className="text-xs font-black text-slate-300 text-right mt-0.5">
                    {charCount} / {minLength} min characters
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Lesson Button */}
            <button
              type="button"
              disabled={charCount < minLength}
              onClick={handleSubmit}
              data-cta="primary"
              className="btn-gold font-display font-900 text-sm sm:text-base px-8 py-3 rounded-full shadow-[0_0_25px_rgba(250,204,21,0.65)] hover:scale-105 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 min-h-[44px]"
            >
              Complete Site Mission! 🎖️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CelebrationScreen({ xp, stars, _bestStreak, _muted, onRestart }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!reducedMotion) {
      try {
        confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 } });
      } catch {
        // Ignore
      }
    }
  }, [reducedMotion]);

  return (
    <div className="w-full h-full flex-1 min-h-0 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none z-20 bg-[#0c0424]">
      <FloatingSymbols />

      <div className="w-full max-w-md phase-card bg-[#160b38]/95 border-2 border-purple-400/40 rounded-3xl flex flex-col items-center text-center fade-in-up z-30 my-auto py-6 px-6 shadow-2xl">
        <span className="text-6xl mb-2 animate-bounce">🎖️🦉</span>

        <div className="bg-[#1c0d38] border border-amber-400/40 text-amber-300 text-xs font-black px-4 py-1 rounded-full mb-2 uppercase tracking-wider">
          Mastery Certified
        </div>

        <h1 className="font-display font-900 text-2xl sm:text-3xl text-white mb-2">
          Chief Site Engineer!
        </h1>

        <p className="text-slate-200 text-xs sm:text-sm mb-4 leading-relaxed font-extrabold">
          You've mastered Pythagoras' theorem — finding hypotenuses, finding shorter sides, testing for right angles and solving real-world jobs across all 10 worlds!
        </p>

        {/* Scoreboard summary */}
        <div className="grid grid-cols-2 gap-3 w-full mb-5">
          <div className="bg-[#1e1342] border border-purple-400/30 rounded-2xl p-2.5 text-center">
            <span className="text-xs text-slate-300 font-bold block">TOTAL XP</span>
            <span className="font-display font-900 text-2xl text-amber-300">{xp}</span>
          </div>
          <div className="bg-[#1e1342] border border-purple-400/30 rounded-2xl p-2.5 text-center">
            <span className="text-xs text-slate-300 font-bold block">TOTAL STARS</span>
            <span className="font-display font-900 text-2xl text-amber-300">{stars} / 30</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onRestart}
          data-cta="primary"
          className="btn-gold font-display font-900 text-base py-3 px-8 rounded-full shadow-xl hover:scale-105 transition cursor-pointer min-h-[44px]"
        >
          Build Again 🚀
        </button>
      </div>
    </div>
  );
}
