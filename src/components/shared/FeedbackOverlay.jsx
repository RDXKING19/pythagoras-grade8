import React from 'react';
import { Sheet } from './Sheet.jsx';

export function FeedbackOverlay({
  status = 'correct', // 'correct' | 'wrong' | 'badge'
  title = '',
  explanation = '',
  xpGained = 0,
  badge = null,
  onNext,
  nextLabel = 'Next Question →'
}) {
  const isCorrect = status === 'correct';
  const isBadge = status === 'badge';

  const toneBorder = isBadge
    ? 'border-amber-400 bg-[#25184a]/95 text-amber-200'
    : isCorrect
    ? 'border-emerald-400 bg-[#122828]/95 text-emerald-200'
    : 'border-rose-400 bg-[#2b1022]/95 text-rose-200';

  return (
    <Sheet
      isOpen={true}
      onClose={onNext}
      closeOnEscape={false}
      maxWidth="max-w-lg"
      className={toneBorder}
      title={title || (isBadge ? 'Badge Earned!' : isCorrect ? 'Job Done!' : 'Job Review')}
    >
      <div className="flex flex-col items-center text-center w-full">
        {/* Top Icon */}
        <div className="text-5xl sm:text-6xl mb-2">
          {isBadge ? '🎖️' : isCorrect ? '🎉' : '🔍'}
        </div>

        {/* Title */}
        <h3 className="font-display font-900 text-2xl sm:text-3xl text-white mb-2">
          {title || (isBadge ? 'Badge Unlocked!' : isCorrect ? 'Job Done! 🎯' : 'Not Quite — Check Diagram')}
        </h3>

        {/* Badge Info */}
        {badge && (
          <div className="w-full bg-amber-950/70 border border-amber-400/50 rounded-2xl p-4 mb-3 flex items-center gap-3 text-left">
            <span className="text-4xl shrink-0">{badge.icon}</span>
            <div className="min-w-0">
              <h4 className="font-display font-900 text-lg sm:text-xl text-amber-300 truncate">
                {badge.name}
              </h4>
              <p className="text-sm text-slate-200 font-extrabold leading-snug">
                {badge.description}
              </p>
            </div>
          </div>
        )}

        {/* XP Banner */}
        {isCorrect && xpGained > 0 && (
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/50 px-5 py-2 rounded-full text-amber-300 font-black text-base mb-3 shrink-0">
            <span>✨</span>
            <span>+{xpGained} XP Earned</span>
          </div>
        )}

        {/* Explanation */}
        {explanation && (
          <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 mb-5 text-left">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 mb-1">
              Foreman Tally's Explanation:
            </p>
            <p className="text-sm sm:text-base font-extrabold text-white leading-relaxed">
              {explanation}
            </p>
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={onNext}
          className="btn-gold font-display font-900 text-base sm:text-lg px-8 py-3 rounded-full shadow-lg hover:scale-105 transition cursor-pointer"
        >
          {nextLabel}
        </button>
      </div>
    </Sheet>
  );
}
