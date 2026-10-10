import React, { useState, useEffect, useRef } from 'react';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { storyNarration } from '../../utils/narration.js';
import { STORY_PANELS } from '../../data/storyContent.js';

export function StoryPhase({ muted, onDone, onSlideChange, panelIndex = 0 }) {
  const [slideIdx, setSlideIdx] = useState(panelIndex);
  const [imageError, setImageError] = useState(false);
  const slide = STORY_PANELS[slideIdx] || STORY_PANELS[0];

  const slideChangeRef = useRef(onSlideChange);
  slideChangeRef.current = onSlideChange;

  useEffect(() => {
    if (slideChangeRef.current) {
      slideChangeRef.current(slideIdx + 1, STORY_PANELS.length);
    }
    setImageError(false);
  }, [slideIdx]);

  useEffect(() => {
    if (!muted) narrate(storyNarration(slideIdx), true);
    return () => stopNarration();
  }, [slideIdx, muted]);

  const goNext = () => {
    if (slideIdx < STORY_PANELS.length - 1) {
      setSlideIdx(i => i + 1);
    } else {
      onDone();
    }
  };

  const goPrev = () => {
    if (slideIdx > 0) setSlideIdx(i => i - 1);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      {/* Main Story Glass Card */}
      <div className="w-full max-w-5xl max-h-[85dvh] md:max-h-[88dvh] bg-[#160b36]/95 border-2 border-purple-400/40 rounded-3xl p-5 sm:p-6 md:p-7 shadow-2xl backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Left Column: Image Illustration or Fallback */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 h-56 sm:h-[340px] md:h-[400px] w-full bg-black/40 flex items-center justify-center shrink-0">
          {!imageError ? (
            <img
              key={slide.image}
              src={slide.image}
              alt={slide.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover rounded-3xl hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div
              style={{ backgroundColor: slide.imageBg }}
              className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
            >
              <span className="text-7xl sm:text-8xl mb-3 drop-shadow-lg">{slide.imageEmoji}</span>
              <span className="font-display font-900 text-xl sm:text-2xl text-amber-300">
                {slide.title}
              </span>
              <span className="text-xs sm:text-sm text-slate-300 mt-2">
                Job Site Card #{slide.panel}
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Narrative Typography & Callouts */}
        <div className="flex flex-col items-start text-left justify-center gap-3 sm:gap-3.5 overflow-hidden max-h-full py-1">
          {/* Phase Badge */}
          <span className="text-sm sm:text-base uppercase font-extrabold text-amber-400 tracking-wider">
            Job Card {slide.panel} of {STORY_PANELS.length}
          </span>

          {/* Slide Title */}
          <h2 className="font-display font-900 text-2xl sm:text-3xl md:text-4xl text-amber-400 leading-tight drop-shadow-md">
            {slide.title}
          </h2>

          {/* Body Narrative */}
          <p className="text-slate-100 text-sm sm:text-base md:text-lg leading-relaxed font-extrabold drop-shadow-sm">
            {slide.text}
          </p>

          {/* Pull-Quote Sparkle Pill */}
          <div className="w-full bg-[#1e0e45] border-2 border-amber-400/60 rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 text-center text-amber-300 font-display font-900 text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 shadow-lg">
            <span className="shrink-0 text-lg sm:text-xl">✨</span>
            <span className="leading-snug">"{slide.highlight}"</span>
            <span className="shrink-0 text-lg sm:text-xl">✨</span>
          </div>

          {/* Mascot Speech Bubble Pill */}
          <div className="flex items-center gap-3 w-full mt-0.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-amber-400 flex items-center justify-center text-xl sm:text-2xl shadow-lg shrink-0">
              {slide.characterEmoji}
            </div>
            <div className="bg-white text-[#0c031d] rounded-2xl px-4 sm:px-5 py-2 sm:py-2.5 font-display font-900 text-xs sm:text-sm md:text-base shadow-xl flex-1 text-left leading-snug">
              <span className="text-xs text-purple-900 font-black block uppercase mb-0.5">{slide.character}</span>
              {slide.bubble}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Row: Back, Dots, Next */}
      <div className="w-full max-w-4xl flex items-center justify-between mt-3 z-20 shrink-0">
        <button
          type="button"
          onClick={goPrev}
          disabled={slideIdx === 0}
          className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border-2 border-white/30 text-white font-display font-900 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-2.5 sm:py-3 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-xl hover:scale-105 min-h-[44px]"
        >
          ← Back
        </button>

        {/* Slide Dots */}
        <div className="flex items-center gap-2">
          {STORY_PANELS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to card ${i + 1}`}
              onClick={() => setSlideIdx(i)}
              className="rounded-full transition-all cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center"
            >
              <span
                className={`rounded-full transition-all ${
                  i === slideIdx ? 'bg-amber-400 w-8 h-2.5' : 'bg-white/25 w-2.5 h-2.5 hover:bg-white/50'
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          data-cta="primary"
          className="btn-gold font-display font-900 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow-[0_0_25px_rgba(250,204,21,0.6)] hover:scale-105 transition cursor-pointer min-h-[44px]"
        >
          <span>
            {slideIdx === STORY_PANELS.length - 1 ? 'Enter the Workshop' : 'Next Job Card'}
          </span>
          <span className="ml-1.5">→</span>
        </button>
      </div>
    </div>
  );
}
