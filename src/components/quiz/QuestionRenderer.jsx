import React from 'react';
import { PythagorasVisual } from '../shared/PythagorasVisual.jsx';
import { playClickSound } from '../../utils/audio.js';

export function QuestionRenderer({
  question,
  selectedOption = null,
  onSelectOption,
  showHints = false,
  hintLevel = 0,
  onUseHint,
  disabled = false
}) {
  if (!question) return null;

  return (
    <div className="w-full flex flex-col items-center gap-2.5 sm:gap-3 max-w-3xl sm:max-w-4xl my-auto">
      {/* Concept Focus Pill */}
      <div className="inline-flex items-center gap-2 bg-[#2a1752] border border-purple-400/50 px-3.5 py-1 rounded-full text-purple-200 text-xs sm:text-sm font-bold uppercase tracking-wider shrink-0 shadow-sm">
        <span>📐</span>
        <span>{question.category ? question.category.replace(/-/g, ' ') : 'Pythagoras Challenge'}</span>
      </div>

      {/* Main Question Text */}
      <h3 className="font-display font-900 text-base sm:text-xl md:text-2xl text-white text-center leading-snug max-w-3xl shrink-0 px-2">
        {question.questionText}
      </h3>

      {/* Visual Diagram Box (Crisp, High-Contrast & Visible) */}
      <div className="w-full max-w-xl sm:max-w-2xl h-48 sm:h-56 md:h-64 max-h-[34dvh] bg-gradient-to-b from-[#180b3a]/95 to-[#0e0524]/95 border-2 border-purple-400/40 rounded-2xl sm:rounded-3xl p-2 sm:p-3 flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.25)] relative overflow-hidden shrink-0">
        <PythagorasVisual type={question.visual} data={question.visualData} />
      </div>

      {/* Hint Banner (if active in Guided Mode) */}
      {hintLevel > 0 && (
        <div className="w-full max-w-2xl bg-amber-950/70 border border-amber-400/60 rounded-xl p-2.5 sm:p-3 text-left fade-in-up shrink-0">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase mb-1">
            <span>💡</span>
            <span>Foreman Tally's Clue #{hintLevel}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-100 font-extrabold leading-snug">
            {hintLevel === 1 ? question.hint1 : question.hint2}
          </p>
        </div>
      )}

      {/* 4 Options Grid */}
      <div
        role="radiogroup"
        aria-label="Answer options"
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-2xl sm:max-w-3xl shrink-0"
      >
        {question.options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          return (
            <button
              key={idx}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => {
                playClickSound();
                onSelectOption(opt);
              }}
              className={`min-h-[48px] py-2.5 sm:py-3 px-3.5 sm:px-5 rounded-2xl border-2 font-display font-900 text-xs sm:text-sm md:text-base flex items-center justify-between text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'border-amber-400 bg-[#351b68] text-white shadow-[0_0_18px_rgba(250,204,21,0.5)] scale-[1.01]'
                  : 'border-white/15 bg-[#170b33]/90 text-slate-100 hover:border-amber-400/50 hover:bg-[#201042]'
              } disabled:cursor-not-allowed`}
            >
              <span className="flex-1 font-bold leading-snug pr-2">{opt}</span>
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-xs sm:text-sm font-black text-amber-300 shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hint Trigger Button (for Guided mode) */}
      {showHints && hintLevel < 2 && (
        <button
          type="button"
          onClick={onUseHint}
          disabled={disabled}
          className="text-xs sm:text-sm text-amber-300 hover:text-amber-200 font-extrabold flex items-center gap-1.5 underline cursor-pointer mt-0.5 shrink-0 min-h-[44px]"
        >
          <span>💡 Need a hint? ({2 - hintLevel} remaining)</span>
        </button>
      )}
    </div>
  );
}
