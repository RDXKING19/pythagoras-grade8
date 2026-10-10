import React from 'react';
import { playClickSound } from '../../utils/audio.js';

const TONES = {
  cyan:    'border-cyan-400 bg-cyan-950/80 text-cyan-100 shadow-[0_0_16px_rgba(56,189,248,0.45)]',
  amber:   'border-amber-400 bg-amber-950/80 text-amber-100 shadow-[0_0_16px_rgba(251,191,36,0.45)]',
  emerald: 'border-emerald-400 bg-emerald-950/80 text-emerald-100 shadow-[0_0_16px_rgba(52,211,153,0.45)]',
  rose:    'border-rose-400 bg-rose-950/80 text-rose-100 shadow-[0_0_16px_rgba(244,63,94,0.45)]',
  purple:  'border-purple-400 bg-purple-950/80 text-purple-100 shadow-[0_0_16px_rgba(168,85,247,0.45)]',
  ghost:   'border-white/20 border-dashed bg-white/5 text-white/40'
};

export function Panel({ children, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center gap-2.5 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-3 sm:p-3.5 shadow-xl flex-1 min-h-0 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

export function Node({ tone = 'cyan', children, w = 'w-24', className = '' }) {
  return (
    <div
      className={`${w} min-h-[44px] h-12 rounded-2xl border-2 font-display font-900 text-lg sm:text-xl flex items-center justify-center text-center transition-all duration-300 ${TONES[tone] || TONES.cyan} ${className}`}
    >
      {children}
    </div>
  );
}

export function Msg({ tone = 'emerald', children }) {
  const cls = {
    emerald: 'bg-emerald-950/90 text-emerald-300 border-emerald-400/60 shadow-[0_0_14px_rgba(52,211,153,0.3)]',
    rose: 'bg-rose-950/90 text-rose-300 border-rose-400/60 shadow-[0_0_14px_rgba(244,63,94,0.3)]',
    amber: 'bg-amber-950/90 text-amber-200 border-amber-400/50 shadow-[0_0_14px_rgba(251,191,36,0.3)]',
    cyan: 'bg-cyan-950/90 text-cyan-200 border-cyan-400/50 shadow-[0_0_14px_rgba(56,189,248,0.3)]'
  }[tone] || 'bg-cyan-950/90 text-cyan-200 border-cyan-400/50';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full px-4 py-2.5 rounded-2xl border-2 text-sm sm:text-base font-900 text-center fade-in-up shrink-0 ${cls}`}
    >
      {children}
    </div>
  );
}

export const GoldBtn = ({ children, onClick, disabled = false, className = '' }) => (
  <button
    type="button"
    onClick={() => {
      playClickSound();
      onClick && onClick();
    }}
    disabled={disabled}
    className={`btn-gold text-sm sm:text-base font-900 px-6 py-2.5 shadow-lg hover:scale-105 transition cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export const GhostBtn = ({ children, onClick, disabled = false, active = false, className = '' }) => (
  <button
    type="button"
    onClick={() => {
      playClickSound();
      onClick && onClick();
    }}
    disabled={disabled}
    className={`min-h-[44px] min-w-[44px] font-display font-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl border transition cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
      active
        ? 'bg-cyan-400 text-slate-950 border-cyan-200 shadow-[0_0_14px_rgba(56,189,248,0.6)]'
        : 'bg-purple-900/80 hover:bg-purple-800 border-purple-400/50 text-purple-100'
    } ${className}`}
  >
    {children}
  </button>
);

/**
 * Accessible Stepper & Slider Control with full 44px touch targets.
 */
export function Stepper({
  value,
  min = 1,
  max = 12,
  step = 1,
  onChange,
  label = 'Value',
  unit = ''
}) {
  const dec = () => {
    playClickSound();
    onChange(Math.max(min, value - step));
  };
  const inc = () => {
    playClickSound();
    onChange(Math.min(max, value + step));
  };

  return (
    <div className="w-full flex items-center gap-2 sm:gap-2.5 bg-[#13082b]/80 border border-white/15 px-3 py-1.5 rounded-2xl shrink-0">
      <span className="font-display font-900 text-xs sm:text-sm text-slate-200 min-w-[105px] shrink-0 truncate">
        {label}: <span className="text-amber-300 font-mono text-sm sm:text-base">{value}{unit}</span>
      </span>

      {/* Decrease button: strictly >= 44px */}
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xl flex items-center justify-center transition disabled:opacity-30 cursor-pointer shrink-0"
      >
        −
      </button>

      {/* Native Range Slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 min-w-[40px] accent-amber-400 cursor-pointer h-2 min-h-[44px]"
      />

      {/* Increase button: strictly >= 44px */}
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xl flex items-center justify-center transition disabled:opacity-30 cursor-pointer shrink-0"
      >
        +
      </button>
    </div>
  );
}
