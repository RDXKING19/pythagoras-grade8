# PythagoQuest Audio & Narration Pipeline

This document outlines the architecture and workflow of the custom text-to-speech audio narration pipeline used in the **PythagoQuest (Grade 8 · Pythagoras' Theorem in the Real World)** educational module. The system is designed to provide high-quality, synchronized, and engaging narration using ElevenLabs exclusively.

## Overview
The application utilizes an ElevenLabs-only audio pipeline:
1. **Pre-generation:** Known educational scripts (phase text, story paragraphs, and static explanations) are pre-generated offline using a Node.js script (`npm run generate-audio`) and stored as static `.mp3` assets in `public/assets/audio/` to ensure zero-latency playback on all devices.
2. **Dynamic Generation:** If a text string hasn't been pre-generated (e.g., procedurally generated questions during Practice / Boss Battles), the client fetches dynamically via ElevenLabs API (or the serverless `/api/elevenlabs` proxy).
3. **No Browser Speech Fallback:** To maintain a consistent, premium experience, there is **strictly no fallback** to the browser's built-in Web Speech API (`speechSynthesis`). If an audio file is missing and no API key is provided, the engine simply skips narration silently so the user can continue smoothly.
4. **Synchronization:** The frontend audio engine parses an array of segments, eagerly preloading upcoming segments to eliminate latency gaps between sentences.
5. **Exact Spoken Parity:** All spoken text is transformed via `speak(text)` in `src/utils/speak.js`, expanding symbols (`a²`, `√`, `≈`, `3-4-5`, `10 000`, `1 d.p.`, `$18`, `13-m`) into full natural language.

---

## 1. Voice Profile & Settings

- **Voice Provider:** ElevenLabs
- **Voice Name:** Alice (Clear, Engaging Educator)
- **Voice ID:** `Xb7hH8MSUJpSbSDYk0k2`
- **Model:** `eleven_multilingual_v2`

Different **speech styles** map to specific ElevenLabs emotional settings (`stability`, `similarity_boost`, `style`) optimized for lower-secondary learners (ages 13–14):
- `statement` / `instruction`: Standard warmth and clarity.
- `question`: Inquisitive pitch and deliberate pacing.
- `encouragement`: Warm, upbeat, and motivating.
- `emphasis`: Deliberate, clear articulation for key mathematical formulas.
- `thinking`: Thoughtful and reflective.
- `celebration`: Upbeat, celebratory tone for completing stations and defeating bosses.

---

## 2. Pipeline Components

### A. Offline Generation (`scripts/generate_audio.js`)
This script automates the creation of static audio files for all fixed phase narrations:
- It extracts phrases via `getAllNarration()` in `src/utils/narration.js`.
- Checks against `src/utils/audioMap.js` and skips existing files unless `--force` is passed.
- Supports `--check` mode (`npm run check-audio`) to verify audio map parity without hitting the API.
- Reads `VITE_ELEVENLABS_API_KEY` from `.env.local` or environment.
- Saves generated `.mp3` files into `public/assets/audio/` and rewrites `src/utils/audioMap.js`.

### B. Audio Mapping (`src/utils/audioMap.js`)
Auto-generated module that exports the `audioMap` dictionary:
- **Key:** The exact string of text to be spoken (output of `speak()`).
- **Value:** The relative path to the pre-generated `.mp3` file (e.g., `/assets/audio/audio_priya_follows_the_edges..._0.mp3`).

### C. Audio Cleanup (`scripts/clean_audio.js`)
Maintains a clean repository by scanning `public/assets/audio/` and removing any `.mp3` files not actively referenced in `audioMap.js`.

### D. Spoken Transformation (`src/utils/speak.js`)
Ensures mathematical formulas and notation are pronounced correctly:
- `a² + b² = c²` → `"a squared plus b squared equals c squared"`
- `√73 ≈ 8.5 m` → `"the square root of seventy-three is approximately eight point five metres"`
- `13-m ladder` → `"thirteen-metre ladder"`
- `10 000` → `"ten thousand"`
- `3-4-5` → `"three, four, five"`
- `1 d.p.` → `"one decimal place"`
- `$18` → `"eighteen dollars"`

### E. Frontend Audio Engine (`src/utils/audio.js`)
- `getAudioUrl`: Resolves static audio map URL, otherwise queries `/api/elevenlabs` proxy (or direct API if key present).
- `narrate`: Plays sequential speech segments with next-item preloading.
- `playClickSound`: Provides responsive auditory tactile feedback for buttons and options.
- `stopNarration` / `setMuted`: Controls mute and playback state.
