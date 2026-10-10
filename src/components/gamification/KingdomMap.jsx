import React from 'react';
import { WORLDS } from '../../config/worlds.config.js';
import { UNLOCK_RULE } from '../../config/app.config.js';
import { StarRating } from './StarRating.jsx';

export function KingdomMap({
  worldResults = Array(10).fill(null),
  onSelectWorld
}) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* 10 Worlds Grid: 5x2 on >= 1024px, 2x5 on smaller */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4 w-full p-1 overflow-y-auto max-h-[62dvh]">
        {WORLDS.map((w, idx) => {
          // World 0 is open; World n is unlocked if previous world has >= 1 star
          const prevStars = idx > 0 ? worldResults[idx - 1] : 3;
          const isUnlocked = idx === 0 || (prevStars != null && UNLOCK_RULE(prevStars));
          const stars = worldResults[idx] || 0;
          const hasPlayed = worldResults[idx] != null;

          return (
            <button
              key={w.id}
              type="button"
              disabled={!isUnlocked}
              onClick={() => isUnlocked && onSelectWorld(idx)}
              style={{
                borderColor: isUnlocked ? `${w.accent}80` : 'rgba(255,255,255,0.12)'
              }}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all duration-300 min-h-[145px] sm:min-h-[160px] min-w-[44px] ${
                isUnlocked
                  ? 'bg-[#14082c]/95 hover:scale-105 cursor-pointer shadow-xl'
                  : 'bg-[#100724]/40 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="w-full flex items-center justify-between text-xs font-black text-slate-300">
                <span className="bg-white/10 px-2 py-0.5 rounded-md text-xs">W{idx + 1}</span>
                <span style={{ color: w.accent }} className="font-bold text-xs">
                  {isUnlocked ? (hasPlayed ? `${stars}★` : 'OPEN') : 'LOCKED'}
                </span>
              </div>

              <span className="text-4xl sm:text-5xl my-1 drop-shadow-md">
                {isUnlocked ? w.emoji : '🔒'}
              </span>

              <div className="w-full">
                <span className="font-display font-900 text-white text-sm leading-tight line-clamp-1 block">
                  {w.name}
                </span>
                <span className="text-xs text-slate-300 block line-clamp-1 mt-0.5">
                  {w.boss.name}
                </span>
              </div>

              {/* Star Rating or Status */}
              <div className="mt-1">
                {isUnlocked ? (
                  hasPlayed ? (
                    <StarRating stars={stars} size="sm" />
                  ) : (
                    <span className="text-emerald-400 text-xs font-900">Start Jobs →</span>
                  )
                ) : (
                  <span className="text-slate-400 text-xs font-bold">Needs 1★ in W{idx}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
