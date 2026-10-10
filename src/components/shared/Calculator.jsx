import React, { useReducer, useEffect } from 'react';
import { playClickSound } from '../../utils/audio.js';
import {
  INITIAL_CALC_STATE,
  calcReducer,
  fmtDisplay
} from '../../utils/calculatorEngine.js';

export function Calculator({ isOpen = false, onClose }) {
  const [state, dispatch] = useReducer(calcReducer, INITIAL_CALC_STATE);
  const { acc, op, entry } = state;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key >= '0' && e.key <= '9') {
        playClickSound();
        dispatch({ type: 'DIGIT', digit: e.key });
      } else if (e.key === '.') {
        playClickSound();
        dispatch({ type: 'DOT' });
      } else if (e.key === '+' || e.key === '-') {
        playClickSound();
        dispatch({ type: 'OP', op: e.key === '-' ? '−' : '+' });
      } else if (e.key === '*') {
        playClickSound();
        dispatch({ type: 'OP', op: '×' });
      } else if (e.key === '/') {
        playClickSound();
        dispatch({ type: 'OP', op: '÷' });
      } else if (e.key === 'Enter' || e.key === '=') {
        playClickSound();
        dispatch({ type: 'EQUALS' });
      } else if (e.key === 'Backspace') {
        playClickSound();
        dispatch({ type: 'BACKSPACE' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pressDigit = (d) => {
    playClickSound();
    dispatch({ type: 'DIGIT', digit: d });
  };

  const pressDot = () => {
    playClickSound();
    dispatch({ type: 'DOT' });
  };

  const pressBackspace = () => {
    playClickSound();
    dispatch({ type: 'BACKSPACE' });
  };

  const pressClear = () => {
    playClickSound();
    dispatch({ type: 'CLEAR' });
  };

  const pressOp = (nextOp) => {
    playClickSound();
    dispatch({ type: 'OP', op: nextOp });
  };

  const pressEquals = () => {
    playClickSound();
    dispatch({ type: 'EQUALS' });
  };

  const pressSquare = () => {
    playClickSound();
    dispatch({ type: 'SQUARE' });
  };

  const pressSqrt = () => {
    playClickSound();
    dispatch({ type: 'SQRT' });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="calc-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in-up"
    >
      <div className="w-full max-w-xs bg-[#160a36] border-2 border-amber-400/60 rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧮</span>
            <span id="calc-title" className="font-display font-900 text-base text-amber-300">
              Tally's Calculator
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Calculator"
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-lg flex items-center justify-center cursor-pointer transition"
          >
            ✕
          </button>
        </div>

        {/* Display */}
        <div className="bg-[#0b041a] border border-white/20 rounded-2xl p-3 text-right overflow-hidden shadow-inner">
          <div className="text-xs text-slate-400 font-mono h-4">
            {acc !== null && op ? `${fmtDisplay(acc)} ${op}` : ''}
          </div>
          <div className="font-mono font-black text-2xl text-white truncate">
            {entry}
          </div>
        </div>

        {/* Keypad Grid (Buttons strictly >= 44px x 44px) */}
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1: x², √, ⌫, C */}
          <button onClick={pressSquare} className="min-w-[44px] min-h-[44px] rounded-xl bg-purple-900/80 hover:bg-purple-800 text-amber-300 font-display font-black text-base cursor-pointer">x²</button>
          <button onClick={pressSqrt} className="min-w-[44px] min-h-[44px] rounded-xl bg-purple-900/80 hover:bg-purple-800 text-amber-300 font-display font-black text-base cursor-pointer">√</button>
          <button onClick={pressBackspace} className="min-w-[44px] min-h-[44px] rounded-xl bg-purple-900/80 hover:bg-purple-800 text-rose-300 font-display font-black text-base cursor-pointer">⌫</button>
          <button onClick={pressClear} className="min-w-[44px] min-h-[44px] rounded-xl bg-rose-950 border border-rose-500/50 hover:bg-rose-900 text-rose-200 font-display font-black text-base cursor-pointer">C</button>

          {/* Row 2: 7, 8, 9, ÷ */}
          <button onClick={() => pressDigit('7')} className="min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-black text-lg cursor-pointer">7</button>
          <button onClick={() => pressDigit('8')} className="min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-black text-lg cursor-pointer">8</button>
          <button onClick={() => pressDigit('9')} className="min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-black text-lg cursor-pointer">9</button>
          <button onClick={() => pressOp('÷')} className="min-w-[44px] min-h-[44px] rounded-xl bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900 text-cyan-200 font-display font-black text-lg cursor-pointer">÷</button>

          {/* Row 3: 4, 5, 6, × */}
          <button onClick={() => pressDigit('4')} className="min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-black text-lg cursor-pointer">4</button>
          <button onClick={() => pressDigit('5')} className="min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-black text-lg cursor-pointer">5</button>
          <button onClick={() => pressDigit('6')} className="min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-black text-lg cursor-pointer">6</button>
          <button onClick={() => pressOp('×')} className="min-w-[44px] min-h-[44px] rounded-xl bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900 text-cyan-200 font-display font-black text-lg cursor-pointer">×</button>

          {/* Row 4: 1, 2, 3, − */}
          <button onClick={() => pressDigit('1')} className="min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-black text-lg cursor-pointer">1</button>
          <button onClick={() => pressDigit('2')} className="min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-black text-lg cursor-pointer">2</button>
          <button onClick={() => pressDigit('3')} className="min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-black text-lg cursor-pointer">3</button>
          <button onClick={() => pressOp('−')} className="min-w-[44px] min-h-[44px] rounded-xl bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900 text-cyan-200 font-display font-black text-lg cursor-pointer">−</button>

          {/* Row 5: 0, ., =, + */}
          <button onClick={() => pressDigit('0')} className="min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-black text-lg cursor-pointer">0</button>
          <button onClick={pressDot} className="min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-black text-lg cursor-pointer">.</button>
          <button onClick={pressEquals} className="min-w-[44px] min-h-[44px] rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-black text-lg cursor-pointer shadow-md">=</button>
          <button onClick={() => pressOp('+')} className="min-w-[44px] min-h-[44px] rounded-xl bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900 text-cyan-200 font-display font-black text-lg cursor-pointer">+</button>
        </div>
      </div>
    </div>
  );
}
