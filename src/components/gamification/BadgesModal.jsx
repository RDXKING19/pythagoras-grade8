import React from 'react';
import { Sheet } from '../shared/Sheet.jsx';
import { BADGES, BOSS_TROPHIES, ALL_BADGES } from '../../utils/badgeEngine.js';

export function BadgesModal({ unlockedBadges = [], onClose }) {
  const unlockedSet = new Set(unlockedBadges);

  return (
    <Sheet
      isOpen={true}
      onClose={onClose}
      maxWidth="max-w-3xl"
      title="Engineering Badges & Trophies"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl">🎖️</span>
          <div>
            <h2 className="font-display font-900 text-xl sm:text-2xl text-white">
              Engineering Badges & Trophies
            </h2>
            <p className="text-xs sm:text-sm text-amber-300 font-extrabold">
              {unlockedSet.size} of {ALL_BADGES.length} Badges & Trophies Unlocked
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close Badges Modal"
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Section 1: Core Badges (8 fixed) */}
      <div className="mb-4">
        <h3 className="font-display font-900 text-sm sm:text-base text-slate-300 uppercase tracking-wider mb-2">
          Site Mastery Badges (8)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BADGES.map(b => {
            const isUnlocked = unlockedSet.has(b.id);
            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border-2 flex items-center gap-3.5 transition-all duration-300 ${
                  isUnlocked
                    ? 'border-amber-400/60 bg-[#25154c]/90 text-white shadow-md'
                    : 'border-white/10 bg-[#100726]/50 text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked ? 'bg-amber-400/20 border border-amber-400/40' : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {isUnlocked ? b.icon : '🔒'}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h4 className="font-display font-900 text-sm sm:text-base leading-tight truncate">
                    {b.name}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Boss Trophies (10 worlds) */}
      <div>
        <h3 className="font-display font-900 text-sm sm:text-base text-slate-300 uppercase tracking-wider mb-2">
          Boss Battle Trophies (10)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BOSS_TROPHIES.map(b => {
            const isUnlocked = unlockedSet.has(b.id);
            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border-2 flex items-center gap-3.5 transition-all duration-300 ${
                  isUnlocked
                    ? 'border-rose-400/60 bg-[#2b1030]/90 text-white shadow-md'
                    : 'border-white/10 bg-[#100726]/50 text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked ? 'bg-rose-400/20 border border-rose-400/40' : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {isUnlocked ? b.icon : '🔒'}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h4 className="font-display font-900 text-sm sm:text-base leading-tight truncate text-rose-200">
                    {b.name}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Sheet>
  );
}
