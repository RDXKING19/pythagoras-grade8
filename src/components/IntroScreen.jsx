import React from 'react';
import { FloatingSymbols } from './shared/FloatingSymbols.jsx';

export function IntroScreen({ onBegin }) {
  return (
    <div className="w-full h-full flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-y-auto select-none z-10">
      <FloatingSymbols />

      {/* Main Intro Content Card */}
      <div className="relative w-full max-w-4xl flex flex-col items-center text-center fade-in-up z-20 my-auto py-2">
        {/* Topic Pill Badge */}
        <div className="bg-[#1c0d38] border-2 border-amber-400/50 text-amber-300 text-xs sm:text-sm font-black px-5 py-1 rounded-full shadow-lg mb-2 tracking-wide shrink-0">
          ✨ Grade 8 · Geometry & Measurement
        </div>

        {/* Title */}
        <h1 className="font-display font-900 text-3xl sm:text-5xl md:text-6xl text-white text-center leading-tight tracking-tight mb-2 shrink-0">
          Pythagoras' Theorem
          <span className="text-[#facc15] font-900 block drop-shadow-[0_0_24px_rgba(250,204,21,0.65)]">
            in the Real World
          </span>
        </h1>

        {/* Mascot Avatar & Speech Pill */}
        <div className="flex items-center gap-2.5 mb-2.5 shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#facc15] p-0.5 shadow-[0_0_20px_rgba(250,204,21,0.7)] flex items-center justify-center text-xl shrink-0">
            📐
          </div>
          <div className="bg-white rounded-full px-5 py-1 text-[#0c031d] font-display font-900 text-xs sm:text-sm md:text-base shadow-lg">
            Ready to build it right? 🎉
          </div>
        </div>

        {/* Subtitle text */}
        <p className="text-slate-200 text-xs sm:text-sm md:text-base max-w-2xl text-center leading-relaxed mb-3 font-extrabold drop-shadow-sm shrink-0 px-2">
          Join Priya and Jun Kai at the Right-Angle Works to measure ladders, ramps, shortcuts and diagonals — without ever picking up a tape measure.
        </p>

        {/* YOUR LEARNING JOURNEY Flow Card */}
        <div className="w-full max-w-3xl bg-[#14082c]/95 border-2 border-purple-400/40 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md flex flex-col items-center mb-3 shrink-0">
          <p className="text-[#facc15] text-xs sm:text-sm font-display font-900 tracking-wider text-center mb-2.5 uppercase">
            YOUR LEARNING JOURNEY
          </p>

          {/* Top Row: Wonder -> Story -> Simulate */}
          <div className="flex items-center justify-center gap-3 sm:gap-8 w-full mb-2 flex-wrap">
            {/* Wonder */}
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-purple-400 bg-purple-950/90 text-purple-200 flex items-center justify-center text-sm sm:text-base shadow-[0_0_14px_rgba(192,132,252,0.6)] mb-1">
                🔍
              </div>
              <p className="font-display font-900 text-white text-xs sm:text-sm leading-tight">Wonder</p>
              <p className="text-slate-300 text-xs font-semibold">Spark curiosity</p>
            </div>
            <span className="text-amber-400 font-black text-xs sm:text-sm">→</span>

            {/* Story */}
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-amber-400 bg-amber-950/90 text-amber-200 flex items-center justify-center text-sm sm:text-base shadow-[0_0_14px_rgba(251,191,36,0.6)] mb-1">
                📖
              </div>
              <p className="font-display font-900 text-white text-xs sm:text-sm leading-tight">Story</p>
              <p className="text-slate-300 text-xs font-semibold">Hear the tale</p>
            </div>
            <span className="text-amber-400 font-black text-xs sm:text-sm">→</span>

            {/* Simulate */}
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-teal-400 bg-teal-950/90 text-teal-200 flex items-center justify-center text-sm sm:text-base shadow-[0_0_14px_rgba(45,212,191,0.6)] mb-1">
                🧪
              </div>
              <p className="font-display font-900 text-white text-xs sm:text-sm leading-tight">Simulate</p>
              <p className="text-slate-300 text-xs font-semibold">Interactive labs</p>
            </div>
          </div>

          {/* Bottom Row: Practice -> Reflect */}
          <div className="flex items-center justify-center gap-5 sm:gap-12 w-full flex-wrap">
            {/* Practice */}
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-emerald-400 bg-emerald-950/90 text-emerald-200 flex items-center justify-center text-sm sm:text-base shadow-[0_0_14px_rgba(52,211,153,0.6)] mb-1">
                🎮
              </div>
              <p className="font-display font-900 text-white text-xs sm:text-sm leading-tight">Practice</p>
              <p className="text-slate-300 text-xs font-semibold">10 game worlds</p>
            </div>
            <span className="text-amber-400 font-black text-xs sm:text-sm">→</span>

            {/* Reflect */}
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-indigo-400 bg-indigo-950/90 text-indigo-200 flex items-center justify-center text-sm sm:text-base shadow-[0_0_14px_rgba(129,140,248,0.6)] mb-1">
                📝
              </div>
              <p className="font-display font-900 text-white text-xs sm:text-sm leading-tight">Reflect</p>
              <p className="text-slate-300 text-xs font-semibold">Debrief & awards</p>
            </div>
          </div>
        </div>

        {/* Begin CTA Button */}
        <button
          type="button"
          onClick={onBegin}
          data-cta="primary"
          className="btn-gold text-base sm:text-lg font-black py-3 px-10 sm:px-12 mb-3 shadow-[0_0_30px_rgba(250,204,21,0.8)] hover:scale-105 transition cursor-pointer shrink-0 min-h-[44px]"
        >
          🚀 Begin Your Journey!
        </button>

        {/* 3 Bottom Feature Cards (1-up on phone, 3-up on sm+) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl shrink-0">
          <div className="bg-[#14082c]/95 border-2 border-purple-400/35 rounded-2xl p-3 flex flex-col items-center justify-center text-center w-full shadow-lg min-h-[80px]">
            <span className="text-2xl mb-1">🪜</span>
            <span className="font-display font-900 text-white text-sm sm:text-base leading-tight">Real Jobs</span>
            <span className="text-slate-300 text-xs font-semibold mt-0.5 leading-tight">Ladders, ramps & shortcuts</span>
          </div>

          <div className="bg-[#14082c]/95 border-2 border-purple-400/35 rounded-2xl p-3 flex flex-col items-center justify-center text-center w-full shadow-lg min-h-[80px]">
            <span className="text-2xl mb-1">🧰</span>
            <span className="font-display font-900 text-white text-sm sm:text-base leading-tight">Simulations</span>
            <span className="text-slate-300 text-xs font-semibold mt-0.5 leading-tight">4 interactive workshops</span>
          </div>

          <div className="bg-[#14082c]/95 border-2 border-purple-400/35 rounded-2xl p-3 flex flex-col items-center justify-center text-center w-full shadow-lg min-h-[80px]">
            <span className="text-2xl mb-1">🎮</span>
            <span className="font-display font-900 text-white text-sm sm:text-base leading-tight">10 Game Worlds</span>
            <span className="text-slate-300 text-xs font-semibold mt-0.5 leading-tight">XP, streaks & boss battles</span>
          </div>
        </div>
      </div>
    </div>
  );
}
