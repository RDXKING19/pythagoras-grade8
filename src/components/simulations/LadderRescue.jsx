import React, { useState } from 'react';
import { Stepper, GoldBtn, Msg } from './kit.jsx';
import { PythagorasVisual } from '../shared/PythagorasVisual.jsx';
import { LADDER_CASES } from '../../data/stationData.js';
import { playClickSound } from '../../utils/audio.js';

export function LadderRescue({ onComplete }) {
  const [caseIdx, setCaseIdx] = useState(0);
  const currentCase = LADDER_CASES[caseIdx % LADDER_CASES.length];
  const { L, h, d } = currentCase;

  const [guess, setGuess] = useState(1);
  const [hits, setHits] = useState(0);
  const [attemptsInRound, setAttemptsInRound] = useState(0);
  const [status, setStatus] = useState('idle'); // 'idle' | 'close' | 'exact' | 'miss'
  const [isCompleted, setIsCompleted] = useState(false);

  // Compute live height from current slider foot distance
  const currentH2 = Math.max(0, L * L - guess * guess);
  const liveHeight = Math.sqrt(currentH2);
  const heightDiff = Math.abs(liveHeight - h);

  const handleCheck = () => {
    playClickSound();
    setAttemptsInRound(a => a + 1);

    if (guess === d) {
      setStatus('exact');
      const nextHits = hits + 1;
      setHits(nextHits);
      if (nextHits >= 3) {
        setIsCompleted(true);
      }
    } else if (heightDiff <= 1.0) {
      setStatus('close');
    } else {
      setStatus('miss');
    }
  };

  const handleNextLadder = () => {
    playClickSound();
    setCaseIdx(i => i + 1);
    setGuess(1);
    setAttemptsInRound(0);
    setStatus('idle');
  };

  return (
    <div className="flex flex-col h-full justify-between gap-2 overflow-hidden">
      {/* Objective Header */}
      <div className="bg-[#14082e] border border-cyan-400/40 rounded-xl px-3 py-1.5 flex items-center justify-between gap-2 shrink-0">
        <div>
          <span className="text-xs uppercase font-extrabold text-cyan-300 block">
            Rescue Job #{caseIdx + 1}
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-white">
            Ladder = <span className="text-amber-300">{L} m</span> · Target Window = <span className="text-emerald-300">{h} m</span>
          </span>
        </div>
        <div className="text-xs font-black text-amber-300 bg-amber-400/10 border border-amber-400/40 px-2.5 py-0.5 rounded-full shrink-0">
          ⭐ Rescued: {hits} / 3
        </div>
      </div>

      {/* Main Visual Display */}
      <div className="flex-1 min-h-[140px] sm:min-h-[170px] max-h-[235px] bg-[#120726]/90 border-2 border-cyan-400/40 rounded-2xl p-2 flex items-center justify-center relative overflow-hidden shadow-inner">
        <PythagorasVisual
          type="ladder-wall"
          data={{ L, d: guess, h: Number(liveHeight.toFixed(1)), unit: 'm', unknown: null }}
        />
      </div>

      {/* Slider Control */}
      <div className="shrink-0 flex flex-col sm:flex-row items-center gap-2">
        <div className="flex-1 w-full">
          <Stepper
            value={guess}
            min={1}
            max={L - 1}
            step={1}
            onChange={setGuess}
            label="Foot Distance (d)"
            unit=" m"
          />
        </div>
        <GoldBtn onClick={handleCheck} disabled={status === 'exact'}>
          Check Distance 🎯
        </GoldBtn>
      </div>

      {/* Live Readout & Mathematical Guidance */}
      <div className="bg-[#1a0f3d] border border-white/10 rounded-xl px-3 py-1.5 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm font-bold text-slate-200 gap-1.5 shrink-0">
        <div>
          Current Reach: <span className="text-cyan-300 font-mono text-sm sm:text-base font-black">{liveHeight.toFixed(1)} m</span>
          <span className="text-slate-300 ml-2">({L}² − {guess}² = {L * L - guess * guess})</span>
        </div>

        {heightDiff <= 1.0 && status !== 'exact' && (
          <span className="text-amber-300 font-black animate-pulse text-xs">
            ⚠️ Within 1 m of the target!
          </span>
        )}
      </div>

      {/* Feedback Messages */}
      {status === 'exact' && (
        <Msg tone="emerald">
          🎯 Exact hit! The ladder reaches exactly {h} m. ({L}² − {d}² = {h}²)
        </Msg>
      )}

      {status === 'close' && (
        <Msg tone="amber">
          Close! You're within 1 metre, but safety requires an exact fit. Calculate: d² = {L}² − {h}².
        </Msg>
      )}

      {status === 'miss' && (
        <Msg tone="rose">
          Missed window! {attemptsInRound >= 2 ? `The ladder is hypotenuse: subtract d² = ${L}² − ${h}².` : "Adjust foot distance so d² + h² = L²."}
        </Msg>
      )}

      {/* Success Next / Complete Station Button */}
      {status === 'exact' && !isCompleted && (
        <div className="flex justify-end shrink-0">
          <GoldBtn onClick={handleNextLadder}>
            Next Ladder Case ({hits}/3) →
          </GoldBtn>
        </div>
      )}

      {isCompleted && (
        <div className="bg-emerald-950/90 border-2 border-emerald-400/60 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-2.5 shrink-0 fade-in-up">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">🎉</span>
            <div>
              <h4 className="font-display font-900 text-emerald-300 text-xs sm:text-sm">
                Ladder Rescue Complete!
              </h4>
              <p className="text-xs text-slate-200 font-extrabold">
                You achieved 3 exact hits by finding shorter sides with subtraction.
              </p>
            </div>
          </div>
          <GoldBtn onClick={onComplete}>
            Complete Station ✓
          </GoldBtn>
        </div>
      )}
    </div>
  );
}
