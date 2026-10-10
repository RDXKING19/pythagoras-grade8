import React, { useRef, useState } from 'react';
import { useHeaderHeight } from '../hooks/useHeaderHeight.js';
import { Sheet } from './shared/Sheet.jsx';

export function TopNav({
  phase,
  _completed = {},
  muted = false,
  onToggleMute,
  onHome,
  onGoPhase,
  slideInfo,
  hasProgress = false
}) {
  const headerRef = useRef(null);
  useHeaderHeight(headerRef);

  const [showConfirmHome, setShowConfirmHome] = useState(false);

  const phases = [
    { num: '01', key: 'wonder', label: 'Wonder', icon: '🔍' },
    { num: '02', key: 'story', label: 'Story', icon: '📖' },
    { num: '03', key: 'simulate', label: 'Simulate', icon: '🧪' },
    { num: '04', key: 'practice', label: 'Practice', icon: '🎮' },
    { num: '05', key: 'reflect', label: 'Reflect', icon: '📝' }
  ];

  const handleHomeClick = () => {
    if (hasProgress) {
      setShowConfirmHome(true);
    } else {
      onHome();
    }
  };

  const confirmReset = () => {
    setShowConfirmHome(false);
    onHome();
  };

  return (
    <>
      <header
        ref={headerRef}
        className="w-full fixed top-0 left-0 right-0 px-3 sm:px-5 py-2 sm:py-3 flex flex-col items-center z-50 pointer-events-none select-none"
        style={{
          paddingLeft: 'max(0.75rem, env(safe-area-inset-left))',
          paddingRight: 'max(0.75rem, env(safe-area-inset-right))'
        }}
      >
        {/* Main Navbar Row */}
        <div className="w-full flex flex-wrap items-center justify-between pointer-events-none max-w-7xl gap-2">
          {/* Top Left: Home Button */}
          <button
            type="button"
            onClick={handleHomeClick}
            aria-label="Return to Intro or Home"
            className="pointer-events-auto bg-[#180c3c]/90 hover:bg-[#25145b] border border-white/25 text-white font-display font-extrabold text-sm sm:text-base px-3.5 sm:px-4 py-2 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105 shrink-0 min-h-[44px] min-w-[44px]"
          >
            <span className="text-base sm:text-lg">🏠</span>
            <span className="font-black tracking-wide">Home</span>
          </button>

          {/* Center: Phase Capsule on Medium and Wide screens (>= 768px) */}
          <nav
            aria-label="Learning phases"
            className="hidden md:flex pointer-events-auto bg-[#160a36]/95 border border-white/20 rounded-full px-2 sm:px-3 py-1.5 shadow-2xl backdrop-blur-md items-center gap-1 sm:gap-2 shrink-0"
          >
            {phases.map((p, idx) => {
              const isActive = phase === p.key;

              return (
                <React.Fragment key={p.key}>
                  {idx > 0 && <span className="w-1.5 h-[2px] bg-white/20 shrink-0" />}

                  <button
                    type="button"
                    onClick={() => onGoPhase(p.key)}
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={`Phase ${p.num}: ${p.label}`}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-full font-display font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all duration-200 cursor-pointer shrink-0 min-h-[44px] ${
                      isActive
                        ? 'bg-[#3b1c8c] text-white border-2 border-white shadow-[0_0_16px_rgba(255,255,255,0.45)] scale-105'
                        : 'bg-transparent text-slate-200 hover:text-white border border-transparent hover:border-white/10'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-white/15 text-slate-200'
                      }`}
                    >
                      {p.num}
                    </span>
                    <span className="text-sm">{p.icon}</span>
                    <span
                      className={`font-black tracking-tight text-xs sm:text-sm ${
                        isActive ? 'inline' : 'hidden nav:inline'
                      }`}
                    >
                      {p.label}
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Right Controls: Sound Pill + ✕ Close */}
          <div className="pointer-events-auto flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleMute}
              aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
              className={`px-3 sm:px-4 py-2 rounded-full font-display font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all duration-200 cursor-pointer border shadow-lg hover:scale-105 shrink-0 min-h-[44px] ${
                muted
                  ? 'bg-rose-950/80 border-rose-400/50 text-rose-300'
                  : 'bg-emerald-950/80 border-emerald-400/50 text-emerald-300'
              }`}
            >
              <span className="text-base">{muted ? '🔇' : '🔊'}</span>
              <span className="font-black hidden sm:inline">{muted ? 'Muted' : 'Sound On'}</span>
            </button>

            <button
              type="button"
              onClick={handleHomeClick}
              aria-label="Reset Session or Exit"
              className="w-11 h-11 rounded-full bg-purple-900/80 hover:bg-purple-800 border border-white/20 text-white font-black text-base flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 shrink-0 min-h-[44px] min-w-[44px]"
            >
              ✕
            </button>
          </div>

          {/* Mobile Phase Capsule (Row 2 on < 768px) */}
          <nav
            aria-label="Learning phases mobile"
            className="flex md:hidden pointer-events-auto bg-[#160a36]/95 border border-white/20 rounded-full px-2 py-1 shadow-2xl backdrop-blur-md items-center justify-center gap-1 w-full mt-1.5 order-3 shrink-0"
          >
            {phases.map((p, idx) => {
              const isActive = phase === p.key;

              return (
                <React.Fragment key={p.key}>
                  {idx > 0 && <span className="w-1 h-[2px] bg-white/20 shrink-0" />}
                  <button
                    type="button"
                    onClick={() => onGoPhase(p.key)}
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={`Phase ${p.num}: ${p.label}`}
                    className={`px-2 py-1.5 rounded-full font-display font-black text-xs flex items-center gap-1 transition-all duration-200 cursor-pointer shrink-0 min-h-[44px] ${
                      isActive
                        ? 'bg-[#3b1c8c] text-white border-2 border-white shadow-[0_0_12px_rgba(255,255,255,0.45)]'
                        : 'bg-transparent text-slate-300'
                    }`}
                  >
                    <span className="text-xs">{p.icon}</span>
                    {isActive ? (
                      <span className="font-black tracking-tight text-xs">{p.label}</span>
                    ) : (
                      <span className="text-xs opacity-75">{p.num}</span>
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Story Slide Progress Track Bar */}
        {slideInfo && (
          <div className="pointer-events-auto mt-2 w-full max-w-xl flex items-center gap-3 fade-in-up order-4 shrink-0 px-2">
            <div className="flex-1 bg-white/15 h-2.5 sm:h-3 rounded-full overflow-hidden shadow-inner border border-white/10">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(250,204,21,0.8)]"
                style={{ width: `${(slideInfo.current / slideInfo.total) * 100}%` }}
              />
            </div>
            <span className="font-display font-black text-xs sm:text-sm text-white shrink-0">
              Job Card {slideInfo.current} of {slideInfo.total}
            </span>
          </div>
        )}
      </header>

      {/* Confirmation Sheet for Home / Exit */}
      {showConfirmHome && (
        <Sheet
          isOpen={true}
          onClose={() => setShowConfirmHome(false)}
          maxWidth="max-w-md"
          title="Return to Workshop Entrance?"
        >
          <div className="flex flex-col items-center text-center p-2">
            <span className="text-5xl mb-3">⚠️</span>
            <h3 className="font-display font-900 text-xl sm:text-2xl text-white mb-2">
              Return Home?
            </h3>
            <p className="text-slate-200 text-sm mb-6 leading-relaxed font-extrabold">
              Your active progress in this session will be reset if you return to the home entrance.
            </p>
            <div className="flex items-center gap-3 w-full justify-center">
              <button
                type="button"
                onClick={() => setShowConfirmHome(false)}
                className="btn-secondary py-2.5 px-5 text-sm sm:text-base rounded-full min-h-[44px]"
              >
                Stay on Site
              </button>
              <button
                type="button"
                onClick={confirmReset}
                className="btn-gold py-2.5 px-6 text-sm sm:text-base rounded-full shadow-lg min-h-[44px]"
              >
                Return Home 🚪
              </button>
            </div>
          </div>
        </Sheet>
      )}
    </>
  );
}
