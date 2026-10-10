import React, { useEffect } from 'react';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { PythagorasVisual } from '../shared/PythagorasVisual.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { wonderNarration } from '../../utils/narration.js';
import { WONDER } from '../../data/storyContent.js';

export function WonderPhase({ muted, onNext }) {
  useEffect(() => {
    if (!muted) narrate(wonderNarration(), true);
    return () => stopNarration();
  }, [muted]);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      {/* Main Wonder Glass Card */}
      <div className="w-full max-w-2xl phase-card bg-[#160b38]/95 border-2 border-purple-400/40 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col items-center text-center fade-in-up z-20 my-auto">
        {/* Glowing Phase Band */}
        <div className="phase-band phase-band--wonder w-20 h-1.5 bg-purple-400 rounded-full mb-2 shadow-[0_0_16px_rgba(192,132,252,0.85)] shrink-0" />

        <div className="flex items-center gap-2 mb-1.5 shrink-0">
          <span className="text-2xl sm:text-3xl">🔍</span>
          <span className="text-purple-300 font-display font-black text-xs sm:text-sm tracking-wider uppercase">
            Phase 1: Wonder & Curiosity
          </span>
        </div>

        <h2 className="font-display font-900 text-2xl sm:text-3xl text-purple-200 mb-2 max-w-xl shrink-0 leading-tight">
          The Mystery of the Shortcut
        </h2>

        {/* Scrollable Content Body */}
        <div className="scroll flex-1 w-full flex flex-col items-center gap-3 overflow-y-auto px-1 py-1">
          {/* Feature Visual Box */}
          <div className="w-full bg-[#1e143c]/90 border border-purple-400/30 rounded-2xl p-3 sm:p-4 flex flex-col items-center shadow-xl shrink-0">
            <div className="w-full max-w-xs h-36 sm:h-40 flex items-center justify-center mb-2">
              <PythagorasVisual type="field-diagonal" data={WONDER} compact />
            </div>
            <div className="font-display font-900 text-amber-300 text-lg sm:text-2xl mb-1">
              {WONDER.headline}
            </div>
            <p className="text-slate-100 text-sm sm:text-base max-w-lg leading-relaxed font-extrabold">
              {WONDER.body}
            </p>
          </div>

          {/* Foreman Tally Thinking Bubble */}
          <div className="flex items-center gap-3 bg-[#14082c]/85 border border-purple-500/35 rounded-2xl sm:rounded-full px-4 sm:px-5 py-2.5 w-full max-w-lg shrink-0">
            <div className="w-10 h-10 rounded-full bg-amber-400/25 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-xl shrink-0">
              🦉
            </div>
            <p className="text-amber-200 text-sm sm:text-base font-extrabold text-left leading-snug">
              "{WONDER.tallyQuestion}"
            </p>
          </div>
        </div>

        {/* Sticky/Fixed CTA outside scroll area to guarantee no clipping */}
        <div className="pt-3 w-full flex justify-center shrink-0">
          <button
            type="button"
            onClick={onNext}
            data-cta="primary"
            className="btn-gold text-base sm:text-lg font-black py-3 px-8 rounded-full flex items-center gap-2 shadow-[0_0_25px_rgba(250,204,21,0.6)] hover:scale-105 transition cursor-pointer min-h-[44px]"
          >
            <span>Open the Job Cards</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
