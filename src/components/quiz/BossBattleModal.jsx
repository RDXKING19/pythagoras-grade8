import React from 'react';
import { Sheet } from '../shared/Sheet.jsx';

export function BossBattleModal({ boss, lives = 3, onStart, onClose }) {
  if (!boss) return null;

  return (
    <Sheet
      isOpen={true}
      onClose={onClose}
      maxWidth="max-w-lg"
      className="border-rose-500/60 bg-[#200b3b]/95"
      title={`Boss Battle: ${boss.name}`}
    >
      <div className="flex flex-col items-center text-center">
        {/* Boss Avatar */}
        <div className="w-24 h-24 rounded-full bg-rose-950/80 border-2 border-rose-400 text-6xl flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(244,63,94,0.6)] animate-pulse">
          {boss.emoji}
        </div>

        {/* Badge Banner */}
        <div className="bg-rose-950/80 border border-rose-400/50 text-rose-300 text-xs font-bold px-4 py-1 rounded-full mb-2 tracking-wide uppercase">
          🚨 SITE BOSS CHALLENGE
        </div>
        <h2 className="font-display font-900 text-2xl sm:text-3xl md:text-4xl text-white mb-2">
          {boss.name}
        </h2>

        <p className="text-slate-200 text-sm sm:text-base mb-4 leading-relaxed font-extrabold">
          This site contractor has challenged your calculations! Answer 5 difficult jobs with 3 lives to conquer the job site and earn the <span className="text-amber-300 font-bold font-display">"{boss.reward}"</span> trophy!
        </p>

        {/* Lives indicator */}
        <div className="flex items-center gap-2 mb-6 bg-black/40 px-5 py-2 rounded-full border border-white/10">
          <span className="text-xs font-bold text-slate-300 uppercase mr-1">Apprentice Lives:</span>
          {Array.from({ length: lives }).map((_, i) => (
            <span key={i} className="text-2xl text-rose-400">
              ❤️
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 w-full justify-center">
          <button
            onClick={onClose}
            className="btn-secondary text-sm sm:text-base py-3 px-6 rounded-full"
          >
            Fall Back
          </button>
          <button
            onClick={onStart}
            className="btn-gold text-base sm:text-lg py-3 px-8 rounded-full shadow-[0_0_25px_rgba(250,204,21,0.6)] hover:scale-105 transition cursor-pointer"
          >
            Engage Boss! ⚔️
          </button>
        </div>
      </div>
    </Sheet>
  );
}
