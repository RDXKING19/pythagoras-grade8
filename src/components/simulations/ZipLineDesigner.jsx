import React, { useState } from 'react';
import { GoldBtn, Msg } from './kit.jsx';
import { PythagorasVisual } from '../shared/PythagorasVisual.jsx';
import { ZIPLINE_SCENES } from '../../data/stationData.js';
import { playClickSound } from '../../utils/audio.js';

export function ZipLineDesigner({ onComplete }) {
  // We draw 2 complementary scenes (scene 0: subtract, scene 1: cost)
  const [sceneIdx, setSceneIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [scenesFinished, setScenesFinished] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const scene = ZIPLINE_SCENES[sceneIdx % ZIPLINE_SCENES.length];
  const step = scene.steps[stepIdx];

  const handleSelectOption = (opt) => {
    playClickSound();
    setSelectedOpt(opt);
    const isCorrect = opt === step.correct;

    if (isCorrect) {
      setFeedback({ status: 'correct', text: step.explain });
    } else {
      setFeedback({ status: 'wrong', text: "Check your reasoning. Look closely at the triangle edges!" });
    }
  };

  const handleNextStep = () => {
    playClickSound();
    setSelectedOpt(null);
    setFeedback(null);

    if (stepIdx < scene.steps.length - 1) {
      setStepIdx(s => s + 1);
    } else {
      // Scene completed
      const nextDone = scenesFinished + 1;
      setScenesFinished(nextDone);

      if (nextDone >= 2) {
        setIsCompleted(true);
      } else {
        // Move to next scene (scene 1)
        setSceneIdx(1);
        setStepIdx(0);
      }
    }
  };

  return (
    <div className="flex flex-col h-full justify-between gap-2 overflow-hidden">
      {/* Header Info */}
      <div className="bg-[#14082e] border border-cyan-400/40 rounded-xl px-3 py-1.5 flex items-center justify-between gap-2 shrink-0">
        <div>
          <span className="text-xs uppercase font-extrabold text-cyan-300 block">
            Construction · Scene {scenesFinished + 1} of 2
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-white">
            {scene.title}
          </span>
        </div>
        <div className="text-xs font-black text-amber-300 bg-amber-400/10 border border-amber-400/40 px-2.5 py-0.5 rounded-full shrink-0">
          Step {stepIdx + 1} of 3
        </div>
      </div>

      {/* Main Visual Display */}
      <div className="flex-1 min-h-[140px] sm:min-h-[170px] max-h-[230px] bg-[#120726]/90 border-2 border-cyan-400/40 rounded-2xl p-2 flex items-center justify-center relative overflow-hidden shadow-inner">
        <PythagorasVisual
          type={scene.visual}
          data={scene.visualData}
        />
      </div>

      {/* Step Prompt & Options */}
      <div className="bg-[#190d3d] border border-purple-400/35 rounded-2xl p-2.5 sm:p-3 flex flex-col gap-2 shrink-0">
        <p className="font-display font-900 text-xs sm:text-sm text-white">
          <span className="text-amber-400 mr-1.5">Step {stepIdx + 1}:</span>
          {step.prompt}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {step.options.map((opt, i) => {
            const isSelected = selectedOpt === opt;
            const isCorrect = opt === step.correct;

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className={`p-2.5 rounded-xl border-2 font-display text-xs sm:text-sm text-left transition cursor-pointer min-h-[44px] flex items-center justify-between gap-2 ${
                  isSelected
                    ? isCorrect
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-200 shadow-md'
                      : 'bg-rose-950 border-rose-400 text-rose-200'
                    : 'bg-black/40 border-white/15 text-slate-100 hover:border-cyan-400/60 hover:bg-[#201042]'
                }`}
              >
                <span className="flex-1 font-bold leading-snug">{opt}</span>
                <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-black text-cyan-300 shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
              </button>
            );
          })}
        </div>

        {feedback && (
          <Msg tone={feedback.status === 'correct' ? 'emerald' : 'rose'}>
            {feedback.text}
          </Msg>
        )}

        {feedback && feedback.status === 'correct' && (
          <div className="flex justify-end mt-0.5">
            <GoldBtn onClick={handleNextStep}>
              {stepIdx < scene.steps.length - 1 ? 'Next Step →' : 'Complete Design Case →'}
            </GoldBtn>
          </div>
        )}
      </div>

      {/* Overall Completion Banner */}
      {isCompleted && (
        <div className="bg-emerald-950/90 border-2 border-emerald-400/60 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-2.5 shrink-0 fade-in-up">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">🎉</span>
            <div>
              <h4 className="font-display font-900 text-emerald-300 text-xs sm:text-sm">
                Zip-Line Designer Complete!
              </h4>
              <p className="text-xs text-slate-200 font-extrabold">
                You built multi-step real-world models and solved drop heights and costs.
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
