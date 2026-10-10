import React, { useState } from 'react';
import { Stepper, GoldBtn } from './kit.jsx';
import { playClickSound } from '../../utils/audio.js';

const CHALLENGES = [
  {
    id: 1,
    title: 'School Sports Field',
    a: 6,
    b: 8,
    correctC: 10,
    unit: 'm',
    context: 'Connect the diagonal walkway across the 6 m by 8 m field corner.'
  },
  {
    id: 2,
    title: 'Community Town Plaza',
    a: 5,
    b: 12,
    correctC: 13,
    unit: 'm',
    context: 'Stretch the support cable across the 5 m by 12 m plaza corner.'
  },
  {
    id: 3,
    title: 'Park Meadow Shortcut',
    a: 9,
    b: 12,
    correctC: 15,
    unit: 'm',
    context: 'Lay the straight footbridge across the 9 m by 12 m pond corner.'
  }
];

export function SquareLab({ onComplete }) {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const current = CHALLENGES[challengeIdx % CHALLENGES.length];
  const { a, b, correctC, unit } = current;

  // The student's slider guess for the diagonal shortcut cable c
  const [guessC, setGuessC] = useState(a + 1);
  const [status, setStatus] = useState('idle'); // 'idle' | 'short' | 'long' | 'exact'
  const [solvedCount, setSolvedCount] = useState(0);

  const sumSquares = a * a + b * b;
  const perimeter = a + b;
  const savedDist = perimeter - correctC;

  // SVG Geometry Calculation (Canvas: 420 x 220)
  const ox = 85, oy = 175; // Corner junction (90 degrees)
  const maxLeg = Math.max(a, b);
  const scale = Math.min(220 / maxLeg, 120 / a);

  // Post A (Top / North)
  const ax = ox;
  const ay = oy - a * scale;

  // Post B (Right / East)
  const bx = ox + b * scale;
  const by = oy;

  // Vector from A to B
  const dx = bx - ax;
  const dy = by - ay;

  // Calculate student's cable endpoint based on guessC
  const ratio = Math.max(0, guessC / correctC);
  const endX = ax + dx * ratio;
  const endY = ay + dy * ratio;

  const handleCheck = () => {
    playClickSound();
    if (guessC === correctC) {
      setStatus('exact');
      setSolvedCount(c => c + 1);
    } else if (guessC < correctC) {
      setStatus('short');
    } else {
      setStatus('long');
    }
  };

  const handleNextChallenge = () => {
    playClickSound();
    const nextIdx = (challengeIdx + 1) % CHALLENGES.length;
    const nextCase = CHALLENGES[nextIdx];
    setChallengeIdx(nextIdx);
    setGuessC(nextCase.a + 1);
    setStatus('idle');
  };

  return (
    <div className="flex flex-col h-full justify-between gap-2 overflow-hidden select-none">
      {/* 1. Clean Objective Header */}
      <div className="bg-[#14082e] border border-cyan-400/40 rounded-xl px-3 py-1.5 flex items-center justify-between gap-2 shrink-0">
        <div>
          <span className="text-xs uppercase font-extrabold text-cyan-300 block">
            {current.title} · Challenge #{challengeIdx + 1}
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-white">
            North <span className="text-cyan-300">a = {a} {unit}</span> · East <span className="text-orange-300">b = {b} {unit}</span>
            <span className="text-slate-300 ml-2">→ Find Shortcut <span className="text-amber-300">c = ?</span></span>
          </span>
        </div>

        <div className="text-xs font-black text-amber-300 bg-amber-400/10 border border-amber-400/40 px-2.5 py-0.5 rounded-full shrink-0">
          ⭐ Solved: {solvedCount} / {CHALLENGES.length}
        </div>
      </div>

      {/* 2. Main Visual Canvas: Crisp, Spacious Real-World Corner Simulation */}
      <div className="flex-1 min-h-[140px] sm:min-h-[170px] max-h-[235px] bg-[#0c1f17]/95 border-2 border-emerald-400/40 rounded-2xl p-2 flex items-center justify-center relative overflow-hidden shadow-inner">
        <svg
          viewBox="0 0 420 220"
          className="w-full h-full max-h-[225px]"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Corner triangle with side a ${a} and side b ${b}`}
        >
          {/* Subtle Turf Grid Background */}
          {[...Array(6)].map((_, i) => (
            <line key={`g-${i}`} x1="10" y1={30 + i * 35} x2="410" y2={30 + i * 35} stroke="#143722" strokeWidth="1" strokeDasharray="4 4" />
          ))}

          {/* North Walkway (Leg a) */}
          <line x1={ox} y1={oy} x2={ax} y2={ay} stroke="#38bdf8" strokeWidth="10" strokeLinecap="round" />
          <line x1={ox} y1={oy} x2={ax} y2={ay} stroke="#bae6fd" strokeWidth="2.5" strokeDasharray="4 3" />

          {/* East Walkway (Leg b) */}
          <line x1={ox} y1={oy} x2={bx} y2={by} stroke="#fb923c" strokeWidth="10" strokeLinecap="round" />
          <line x1={ox} y1={oy} x2={bx} y2={by} stroke="#fed7aa" strokeWidth="2.5" strokeDasharray="4 3" />

          {/* 90-Degree Right Angle Square Marker */}
          <path
            d={`M ${ox + 16} ${oy} L ${ox + 16} ${oy - 16} L ${ox} ${oy - 16}`}
            fill="rgba(255,255,255,0.2)"
            stroke="#ffffff"
            strokeWidth="2.2"
          />
          <text x={ox + 22} y={oy - 22} fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="system-ui, sans-serif">
            90°
          </text>

          {/* Target Cable Guide Line (Faint dashed hypotenuse) */}
          <line x1={ax} y1={ay} x2={bx} y2={by} stroke="rgba(250,204,21,0.25)" strokeWidth="3" strokeDasharray="5 5" />

          {/* Student's Live Cable */}
          {guessC <= correctC ? (
            <>
              {/* Actual Cable stretched from A to endX, endY */}
              <line
                x1={ax}
                y1={ay}
                x2={endX}
                y2={endY}
                stroke={status === 'exact' ? '#facc15' : '#f59e0b'}
                strokeWidth={status === 'exact' ? 8 : 6}
                strokeLinecap="round"
                filter={status === 'exact' ? 'drop-shadow(0 0 8px rgba(250,204,21,0.9))' : 'none'}
              />
              {/* If too short, draw dashed red gap to Post B */}
              {guessC < correctC && (
                <line x1={endX} y1={endY} x2={bx} y2={by} stroke="#f43f5e" strokeWidth="3" strokeDasharray="4 4" />
              )}
            </>
          ) : (
            <>
              {/* Cable extends to B and overshoots */}
              <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
              <line x1={bx} y1={by} x2={endX} y2={endY} stroke="#f43f5e" strokeWidth="5" strokeDasharray="4 3" strokeLinecap="round" />
            </>
          )}

          {/* Corner Junction Post (O) */}
          <circle cx={ox} cy={oy} r="9" fill="#1e293b" stroke="#e2e8f0" strokeWidth="2" />

          {/* Post A (Start Anchor) */}
          <circle cx={ax} cy={ay} r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
          <text x={ax} y={ay - 14} fill="#38bdf8" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">
            Post A
          </text>

          {/* Post B (Target Anchor) */}
          <circle
            cx={bx}
            cy={by}
            r={status === 'exact' ? 12 : 10}
            fill={status === 'exact' ? '#22c55e' : '#ea580c'}
            stroke="#ffffff"
            strokeWidth={2.5}
            filter={status === 'exact' ? 'drop-shadow(0 0 10px rgba(34,197,94,0.9))' : 'none'}
          />
          <text x={bx} y={by + 24} fill="#fb923c" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">
            Post B
          </text>

          {/* Side a Dimension Label (Cyan) */}
          <g transform={`translate(${ox - 42}, ${(oy + ay) / 2})`}>
            <rect x="-36" y="-12" width="72" height="24" rx="6" fill="#081426" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="0" y="4" fill="#38bdf8" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="system-ui, sans-serif">
              a = {a} {unit}
            </text>
          </g>

          {/* Side b Dimension Label (Orange) */}
          <g transform={`translate(${(ox + bx) / 2}, ${oy + 22})`}>
            <rect x="-36" y="-12" width="72" height="24" rx="6" fill="#1e0e0a" stroke="#fb923c" strokeWidth="1.5" />
            <text x="0" y="4" fill="#fb923c" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="system-ui, sans-serif">
              b = {b} {unit}
            </text>
          </g>

          {/* Cable / Hypotenuse Status Badge */}
          <g transform={`translate(${(ax + bx) / 2 + 35}, ${(ay + by) / 2 - 20})`}>
            <rect
              x="-60"
              y="-13"
              width="120"
              height="26"
              rx="7"
              fill={status === 'exact' ? '#064e3b' : status === 'short' ? '#4c0519' : status === 'long' ? '#450a0a' : '#1f1302'}
              stroke={status === 'exact' ? '#34d399' : status === 'short' || status === 'long' ? '#fb7185' : '#facc15'}
              strokeWidth="2"
            />
            <text
              x="0"
              y="4"
              fill={status === 'exact' ? '#34d399' : status === 'short' || status === 'long' ? '#fda4af' : '#facc15'}
              fontSize="12"
              fontWeight="900"
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
            >
              {status === 'exact'
                ? `✔ c = ${correctC} ${unit}!`
                : `Cable: ${guessC} ${unit}`}
            </text>
          </g>
        </svg>
      </div>

      {/* 3. Slider Control: Single Intuitive Cable Length Adjustment */}
      <div className="shrink-0 flex flex-col sm:flex-row items-center gap-2">
        <div className="flex-1 w-full">
          <Stepper
            value={guessC}
            min={a + 1}
            max={perimeter + 2}
            step={1}
            onChange={(val) => {
              setGuessC(val);
              setStatus('idle');
            }}
            label="Cable Length (c)"
            unit={` ${unit}`}
          />
        </div>

        <GoldBtn onClick={handleCheck} disabled={status === 'exact'}>
          Check Fit 🎯
        </GoldBtn>
      </div>

      {/* 4. Live Mathematical Guidance & Feedback */}
      <div className="shrink-0 flex items-center justify-between gap-2 min-h-[44px]">
        {status === 'exact' ? (
          <div className="flex-1 bg-emerald-950/90 border-2 border-emerald-400/60 rounded-xl px-3 py-2 flex items-center justify-between gap-2 text-xs sm:text-sm font-extrabold text-emerald-200">
            <span>
              🎯 <strong>Perfect Match!</strong> {a}² + {b}² = {a * a} + {b * b} = {sumSquares}, so <strong>c = √{sumSquares} = {correctC} {unit}</strong>. Saved {savedDist} {unit}!
            </span>
            <button
              type="button"
              onClick={handleNextChallenge}
              className="px-3 py-1 bg-emerald-500/30 hover:bg-emerald-500/50 border border-emerald-300 text-white rounded-lg text-xs font-black cursor-pointer transition shrink-0 min-h-[32px]"
            >
              Next Challenge →
            </button>
          </div>
        ) : status === 'short' ? (
          <div className="flex-1 bg-rose-950/90 border-2 border-rose-400/60 rounded-xl px-3 py-2 text-xs sm:text-sm font-extrabold text-rose-200 text-center">
            ⚠️ Too short! At {guessC} {unit}, the cable has a gap of {(correctC - guessC).toFixed(0)} {unit}. Hint: a² + b² = {sumSquares}, find √{sumSquares}!
          </div>
        ) : status === 'long' ? (
          <div className="flex-1 bg-rose-950/90 border-2 border-rose-400/60 rounded-xl px-3 py-2 text-xs sm:text-sm font-extrabold text-rose-200 text-center">
            ⚠️ Too long! At {guessC} {unit}, the cable overshoots by {(guessC - correctC).toFixed(0)} {unit}. Try a lower number.
          </div>
        ) : (
          <div className="flex-1 bg-[#14082e] border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-300">
            <span>
              📐 <strong>Pythagoras Rule:</strong> a² ({a * a}) + b² ({b * b}) = {sumSquares} → Shortcut c = √{sumSquares}
            </span>
            <span className="text-amber-300 font-extrabold hidden sm:inline">
              Slide cable length to fit!
            </span>
          </div>
        )}

        {/* Complete Station Button */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onComplete && onComplete();
          }}
          className="btn-gold text-xs sm:text-sm font-900 px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.6)] hover:scale-105 transition cursor-pointer min-h-[44px] shrink-0"
        >
          Complete Station ✓
        </button>
      </div>
    </div>
  );
}
