# PythagoQuest — Grade 8 · Pythagoras' Theorem in the Real World

**PythagoQuest** is an interactive, gamified mathematics learning module designed for Grade 8 (Singapore Sec 2) students. It guides learners through discovering, applying, and mastering **Pythagoras' Theorem ($a^2 + b^2 = c^2$)** through authentic real-world engineering and repair jobs.

Apprentices **Priya** (who measures everything twice) and **Jun Kai** (who always looks for the shortcut) work at the **Right-Angle Works**, mentored by **Foreman Tally the Owl** 🦉.

---

## 🌟 Key Features

1. **Five-Phase Learning Journey:**
   - **01 Wonder:** *The Mystery of the Shortcut* — hook scenario on a 60 m × 80 m school field.
   - **02 Story:** 6 interactive illustrated job cards building conceptual foundation and the 4-step method.
   - **03 Simulate:** *Right-Angle Workshop* — 4 interactive training stations.
   - **04 Practice:** 10 procedural job-site worlds across 4 practice modes (Guided, Independent, Timed, Boss Battle).
   - **05 Reflect:** 3-question conceptual debrief, engineering scorecard, and personal reflection letter to Foreman Tally.

2. **4 Interactive Simulation Workshops (`SimulatePhase`):**
   - **Station A — Square Lab 📐:** Concept discovery lab building unit-tile squares on triangle sides with a dynamic "Bend the Corner" angle slider (acute, 90°, obtuse).
   - **Station B — Ladder Rescue 🪜:** Build-to-target challenge solving ladder reach and foot distances using subtraction ($d^2 = L^2 - h^2$).
   - **Station C — Zip-Line Designer 🚡:** Multi-step composite construction solving drop heights, cable lengths, and timber bracing costs.
   - **Station D — Site Inspector 📋:** Error-detective lab identifying and correcting realistic trainee calculation slips (e.g., adding instead of subtracting, forgetting square roots, rounding slips).

3. **Gamification & Mastery:**
   - 10 distinct job-site worlds with custom bosses and reward badges.
   - Star rating system (1★ to 3★ per world), streaks, and dynamic XP calculations.
   - 18 collectible badges (8 trigger badges + 10 boss trophies) tracked via a centralized badge engine.

4. **Built-in Tally's Calculator 🧮:**
   - Dedicated square ($x^2$) and square root ($\sqrt{}$) functions, arithmetic operations, and 8-digit precision.

5. **Audio & Narration Pipeline:**
   - Voice: ElevenLabs Alice (`Xb7hH8MSUJpSbSDYk0k2`) with `eleven_multilingual_v2`.
   - Strict 1:1 parity between on-screen text and spoken audio via `speak()` transform.
   - Pre-generated static `.mp3` assets with zero-latency playback.
   - **No browser speech fallback:** runs silently if unconfigured, eliminating robotic voices.

---

## 🚀 Getting Started

### Prerequisites
- Node.js $\ge 20$
- npm $\ge 10$

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Starts the local development server at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🧪 Testing & Verification

- **Question Bank Stress Test (30,000 Questions across 300 Seeds):**
  ```bash
  npm run test:bank
  ```
  Validates that every question has 4 distinct options, valid Pythagorean triples, correct 1 d.p. rounding safety, and distinct problem texts.

- **Unit Tests & Integrity Verification:**
  ```bash
  npm run test:units
  ```
  Tests `speak()` audio rules, math pools, Station D error detection (3,000 cases), calculator arithmetic reducer, full 18-badge unlocks, and authoring constraints (no `speechSynthesis`, no `vh` viewport bugs, no small text, zero orphan simulation files).

- **Code Linting:**
  ```bash
  npm run lint
  ```
  Runs `oxlint` across all source files.

---

## 🎙️ Audio Management

- **Verify Audio Map Parity:**
  ```bash
  npm run check-audio
  ```
- **Generate Offline Audio (requires ElevenLabs API key in `.env.local`):**
  ```bash
  npm run generate-audio
  ```
- **Clean Orphaned Audio Files:**
  ```bash
  npm run clean-audio
  ```

---

## 🎨 Story Art Brief (1024 × 1024 Placeholders)

Placeholder graphics can be regenerated using:
```bash
npm run gen:art-placeholders
```

The production art brief for the 6 story panels (PRD §13):
1. **Panel 1 — The Shortcut Problem:** Aerial view of a 60 m × 80 m school field with Priya running along the edges and Jun Kai cutting across the diagonal.
2. **Panel 2 — Squares on the Sides:** Workshop floor with 3 m, 4 m, and 5 m square tile grids laid on a right triangle showing 9 + 16 = 25 tiles.
3. **Panel 3 — Finding the Longest Side:** Field diagram with diagonal marked "100 m", stopwatch on the grass, and Priya holding a calculator.
4. **Panel 4 — Finding a Shorter Side:** Wall with a 13 m ladder, foot 5 m out, reaching a 12 m window, with Jun Kai steadying the base.
5. **Panel 5 — Is the Corner Square?:** Builder's 3-4-5 rope (30 cm, 40 cm, 50 cm marks) laid across a wooden corner frame.
6. **Panel 6 — Build It Right:** Workshop entrance with safety hard hats and glowing icons for field, ladder, ramp, and zip-line.

---

## 📁 Project Structure

```
├── api/
│   └── elevenlabs.js                # Serverless proxy for ElevenLabs
├── docs/
│   ├── PythagoQuest_PRD.md          # Product Requirements Document
│   ├── PythagoQuest_TRD.md          # Technical Requirements Document
│   └── audio_generation_pipeline.md # Audio pipeline architecture
├── public/
│   ├── assets/
│   │   ├── audio/                   # Static pre-generated narration files
│   │   └── story/                   # 6 story panel PNG illustrations
│   └── favicon.svg                  # SVG Right-Angle Works Favicon
├── scripts/
│   ├── clean_audio.js               # Prune unreferenced audio files
│   ├── generate_audio.js            # Batch synthesize narration with ElevenLabs
│   ├── placeholder_art.js           # Generates true 1024x1024 PNGs
│   ├── stress_test_bank.js          # 30,000-question generator test
│   └── unit_tests.js                # Full suite of unit & integrity tests
└── src/
    ├── components/
    │   ├── phases/                  # Wonder, Story, Simulate, Play, Reflect
    │   ├── simulations/             # SquareLab, LadderRescue, ZipLine, SiteInspector
    │   ├── quiz/                    # QuestionRenderer, BossBattleModal
    │   ├── gamification/            # KingdomMap, BadgesModal, StarRating
    │   └── shared/                  # PythagorasVisual, Calculator, TopNav, Feedback
    ├── config/                      # Worlds, characters, app, and audio settings
    ├── data/                        # Question bank, station data, story text
    ├── hooks/                       # useAudio, useHeaderHeight, useViewport, etc.
    ├── styles/                      # design-tokens.css, globals.css
    └── utils/                       # pythagorasMath, calculatorEngine, badgeEngine, reducer
```

---

## 📄 License
Private & Confidential — Intellia Global Education.
