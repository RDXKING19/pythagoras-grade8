import React, { useState, useEffect } from 'react';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { simStationIntro } from '../../utils/narration.js';
import { SquareLab } from '../simulations/SquareLab.jsx';
import { LadderRescue } from '../simulations/LadderRescue.jsx';
import { ZipLineDesigner } from '../simulations/ZipLineDesigner.jsx';

const STATIONS = [
  {
    id: 0,
    short: 'A',
    icon: '🌉',
    name: 'Shortcut Builder',
    sub: 'Diagonal cable fitting challenge',
    Comp: SquareLab
  },
  {
    id: 1,
    short: 'B',
    icon: '🪜',
    name: 'Ladder Rescue',
    sub: 'Target height slider challenge',
    Comp: LadderRescue
  },
  {
    id: 2,
    short: 'C',
    icon: '🚡',
    name: 'Zip-Line Designer',
    sub: 'Multi-step real-world construction',
    Comp: ZipLineDesigner
  }
];

export function SimulatePhase({
  muted = false,
  onNext,
  simCompleted = [false, false, false],
  onCompleteStation,
  initialStation = 0
}) {
  const [stationIdx, setStationIdx] = useState(initialStation);

  const currentStation = STATIONS[stationIdx] || STATIONS[0];
  const CurrentComp = currentStation.Comp;
  const allStationsComplete = simCompleted.slice(0, 3).every(Boolean);
  const completedCount = simCompleted.slice(0, 3).filter(Boolean).length;

  useEffect(() => {
    if (!muted) narrate(simStationIntro(stationIdx), true);
    return () => stopNarration();
  }, [stationIdx, muted]);

  const handleStationFinished = () => {
    if (onCompleteStation) {
      onCompleteStation(stationIdx);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-3 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      {/* Main Simulation Stations Card - strictly zero scrollbar */}
      <div className="w-full max-w-6xl h-full max-h-[calc(100dvh-var(--header-h)-16px)] bg-[#160b36]/95 border-2 border-purple-400/40 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-2xl backdrop-blur-md flex flex-col items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Cyan Accent Bar */}
        <div className="w-20 h-1.5 bg-cyan-400 rounded-full mb-1 shadow-[0_0_16px_rgba(56,189,248,0.85)] shrink-0" />

        {/* Card Header Title */}
        <div className="flex items-center justify-between w-full mb-1.5 shrink-0 px-1">
          <h2 className="font-display font-900 text-base sm:text-xl text-white flex items-center gap-2">
            <span className="text-lg sm:text-xl">🧰</span>
            <span>Right-Angle Workshop · 3 Training Stations</span>
          </h2>
          <span className="bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 font-extrabold text-xs sm:text-sm px-3 py-0.5 rounded-full">
            Station {stationIdx + 1} of 3
          </span>
        </div>

        {/* Horizontal Station Strip for < 1180px */}
        <div
          role="tablist"
          aria-label="Simulation Stations"
          className="flex lab:hidden w-full gap-2 mb-2 shrink-0 overflow-x-auto pb-0.5"
        >
          {STATIONS.map((st, i) => {
            const isSelected = stationIdx === i;
            const isDone = simCompleted[i];

            return (
              <button
                key={st.id}
                role="tab"
                aria-selected={isSelected}
                aria-label={`Station ${st.short}: ${st.name}`}
                onClick={() => setStationIdx(i)}
                className={`flex-1 min-w-[120px] p-2 rounded-xl border-2 flex items-center justify-between gap-1.5 transition cursor-pointer min-h-[44px] ${
                  isSelected
                    ? 'border-cyan-400 bg-[#1e2852] text-white shadow-md'
                    : 'border-white/10 bg-[#13082b]/80 text-slate-300 hover:border-cyan-400/40'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-base sm:text-lg shrink-0">{st.icon}</span>
                  <span className="font-display font-900 text-xs sm:text-sm truncate">
                    {st.short}: {st.name}
                  </span>
                </div>
                <span
                  className={`text-xs font-black px-1.5 py-0.5 rounded shrink-0 ${
                    isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {isDone ? 'Done ✓' : 'To do'}
                </span>
              </button>
            );
          })}
        </div>

        {/* 12-Column Grid (on >= 1180px) or Stacked (below) */}
        <div className="grid grid-cols-1 lab:grid-cols-12 gap-2.5 sm:gap-3 w-full items-stretch flex-1 min-h-0 overflow-hidden">
          {/* Left Column: Station Sidebar Tabs (Only on >= 1180px) */}
          <div className="hidden lab:flex lab:col-span-4 flex-col justify-between gap-2.5 shrink-0 min-h-0">
            <div role="tablist" aria-label="Workshop Stations" className="flex flex-col gap-2">
              {STATIONS.map((st, i) => {
                const isSelected = stationIdx === i;
                const isDone = simCompleted[i];

                return (
                  <button
                    key={st.id}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setStationIdx(i)}
                    className={`p-2.5 rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer min-h-[52px] ${
                      isSelected
                        ? 'border-cyan-400 bg-[#1e2852] text-white shadow-[0_0_20px_rgba(56,189,248,0.4)] scale-[1.01]'
                        : 'border-white/10 bg-[#13082b]/80 text-slate-300 hover:border-cyan-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                          isSelected ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white'
                        }`}
                      >
                        {st.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="font-display font-900 text-xs sm:text-sm leading-tight truncate">
                          Station {st.short}: {st.name}
                        </p>
                        <p className="text-xs font-semibold text-slate-300 mt-0.5 truncate">
                          {st.sub}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full shrink-0 ml-1 ${
                        isDone
                          ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {isDone ? 'Done ✓' : 'To do'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Left Gated CTA Button on >= 1180px */}
            <div className="flex flex-col gap-1 mt-1">
              <button
                type="button"
                onClick={onNext}
                disabled={!allStationsComplete}
                data-cta="primary"
                className="btn-gold font-display font-900 text-xs sm:text-sm py-2.5 px-4 shadow-[0_0_25px_rgba(250,204,21,0.65)] hover:scale-105 transition w-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
              >
                <span>Go to Practice Phase!</span>
                <span>→</span>
              </button>
              <span className="text-xs text-amber-300 font-extrabold text-center">
                {allStationsComplete
                  ? 'All 3 stations mastered! Practice unlocked.'
                  : `Complete all 3 stations to unlock Practice (${completedCount}/3 complete)`}
              </span>
            </div>
          </div>

          {/* Right Column / Main Area: Interactive Station Workspace (strictly zero scrollbar) */}
          <div className="lab:col-span-8 bg-[#13092e]/95 border-2 border-purple-400/35 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 flex flex-col justify-between shadow-inner flex-1 min-h-0 overflow-hidden">
            {/* Station Header inside Workspace */}
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">{currentStation.icon}</span>
                <div>
                  <h3 className="font-display font-900 text-sm sm:text-base text-white">
                    Station {currentStation.short}: {currentStation.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-extrabold">
                    {currentStation.sub}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                  simCompleted[stationIdx]
                    ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                    : 'bg-white/10 text-slate-300'
                }`}
              >
                {simCompleted[stationIdx] ? 'Station Complete ✓' : 'In Progress'}
              </span>
            </div>

            {/* Active Station Component (Remounts on stationIdx change) */}
            <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
              <CurrentComp key={stationIdx} onComplete={handleStationFinished} />
            </div>

            {/* Mobile / Stacked bottom CTA for < 1180px */}
            <div className="flex lab:hidden flex-col gap-1 mt-2 pt-1.5 border-t border-white/10 shrink-0">
              <button
                type="button"
                onClick={onNext}
                disabled={!allStationsComplete}
                data-cta="primary"
                className="btn-gold font-display font-900 text-xs sm:text-sm py-2 px-4 shadow-lg w-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
              >
                <span>Go to Practice Phase! →</span>
              </button>
              <span className="text-xs text-amber-300 font-extrabold text-center">
                {allStationsComplete
                  ? 'All 3 stations mastered! Practice unlocked.'
                  : `Complete all 3 stations to unlock Practice (${completedCount}/3 complete)`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
