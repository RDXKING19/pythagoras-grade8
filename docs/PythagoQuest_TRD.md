# PythagoQuest — Grade 8 · Pythagoras' Theorem: Real-World Applications (TRD)

**Companion to:** `PythagoQuest_PRD.md` · **Repo name:** `G8-PythagoQuest-main`
**Clone source:** `angle-on-line-g7-main` (shipped AngleQuest build, supplied as the UI/UX, layout and viewport reference). Overrides the default `G2-Money-Money-main` under the TRD blueprint's "newer sibling as clone source" clause.
**Section order (per blueprint):** 1 Reference Analysis Notes → 2 Tech Stack → 3 Folder Structure → 4 State Management → 5 Component Specs → 6 Data Layer → 7 Simulate Station Specs → 8 Audio Pipeline → 9 Gamification → 10 Design Tokens & Viewport → 11 Build / Deploy → 12 QA Plan → 13 Delivery Checklist → 14 Risks.

**How this document was verified.** The reference zip was unpacked, installed, built, linted, stress-tested, and rendered in headless Chromium at 1366×768, 1024×768, 768×1024 and 390×844 with layout metrics captured. The reference was also rebuilt on the blueprint's dependency versions. The number-generation design in §6 was prototyped (three worlds, 300 seeds, 9 000 questions, 0 problems) and the math helpers in §6.4 are the *tested* code, not pseudo-code. Statements below that were **not** verified are marked *(unverified)*.

---

## 1. Reference Analysis Notes

Rule applied throughout: **take UI/UX, layout, component-chrome and architecture patterns from the reference; where the reference contradicts a fixed rule in the PRD/TRD blueprints or has a defect, the blueprint/fix wins and the reference's version is not cloned.**

### 1.1 Blueprint §1 gotcha check — results against the actual repo

| # | Blueprint gotcha | Finding in `angle-on-line-g7-main` | Action |
|---|---|---|---|
| 1 | Dead duplicate `src/features/*` | **Not present.** `App.jsx` imports from `./components/*`. But there *are* orphans (see 1.3 #1) | Do not clone orphan files |
| 2 | Hard-coded story-panel count | **Fixed in the components:** `StoryPhase` and reducer `NEXT_STORY_PANEL` use `STORY_PANELS.length`. **Not fixed:** `ADVANCE_SIM_STATION` uses `Math.min(3, …)` and `simCompleted` is `[false,false,false,false]` | Panels = 6, read from `STORY_PANELS.length`. Station count from a `SIM_STATION_COUNT` constant |
| 3 | Static vs procedural bank | **Procedural, seeded** (`createRNG`, `generateQuestion`, `generateBank(seed)`), with `scripts/stress_test_bank.js` (300 seeds × 100 = 30 000 Qs; **passes**). But `PlayPhase` bypasses the bank: it calls `generateQuestion(world, i, rng)` per session, so Guided Practice always gets template slots 0–4. Stress test only requires ≥ 7 of 10 distinct texts per world (blueprint intent: 10) | Keep procedural + harness; add slot sampling (§6.6); require 10/10 distinct |
| 4 | Viewport clipping | **Partly fixed:** `100dvh`, measured `--header-h` via `ResizeObserver`, `main.app-main { padding-top }`. **Still broken:** cards use `vh` (`94vh/92vh/90vh`); nav capsule overflows below ~1340 px; Wonder CTA clipped at 1366×768; Simulate tabs collide below ~1180 px; phone Story unusable | §10 |
| 5 | Leftover branding | `index.html` is clean for AngleQuest. On-screen leftovers that must be rewritten: `ReflectPhase` celebration "Singapore MOE Grade 7 Geometry Mastered!", `PlayPhase` "10 MOE Geometry Districts", "case/detective" copy everywhere, README directory tree titled `angles on line g7/`, `docs/audio_generation_pipeline.md` titled "Place Value…" | Rewrite all; grep gate (§13) |

### 1.2 Reference stack versus blueprint

| Item | Reference `package.json` | Blueprint | Decision (verified) |
|---|---|---|---|
| React / ReactDOM | 18.3.1 | ^19.2.7 | **Use blueprint.** Reference code builds unmodified on React 19.3.0 |
| Vite / plugin-react | 5.4 / 4.3 | ^8.1.0 / ^6.0.2 | **Use blueprint.** Built on Vite 8.3.3 + plugin-react 6.1.2 in 1 s |
| Tailwind | 3.4.17 | ^3.4.4 | Same major; resolved 3.4.19 |
| framer-motion | listed, **never imported** | ^12.42.0 | Keep **and use** (§5.9): panel/overlay transitions with reduced-motion |
| lucide-react | listed, **never imported** | ^1.22.0 | **Drop** (no use). Calculator and nav use emoji/SVG like the rest of the app |
| canvas-confetti | used in Reflect | not in blueprint | **Keep** |
| dotenv, node-fetch | listed, **never imported** (`generate_audio.js` reads `.env.local` by hand and uses Node's global `fetch`) | listed | **Drop** both; Node ≥ 20 required (`engines`) |
| oxlint | no script (a `.oxlintrc.json` exists) | ^1.69.0 | Add `lint` script. Reference lint output: 6 unused-variable warnings, 0 errors |
| Bundle | 287 kB JS / 86.8 kB gzip (old stack) | — | 366.5 kB / **108.9 kB gzip** on the new stack; budget ≤ 120 kB gzip (§12) |

### 1.3 Defects found in the reference (do not clone) — traced to code

| # | Defect | Where | Fix in this build |
|---|---|---|---|
| 1 | `CaseFileDetective.jsx` (the Error-Detective station) is **never imported**; `SimulatePhase` wires `RadiantPointLab` as Station D | `SimulatePhase.jsx` L5–8, L32–38 | Wire exactly the four archetypes (§7); no orphan files; lint rule + CI grep |
| 2 | **Only 4 of 8 badges can unlock.** `PlayPhase.handleOptionSelect` calls `checkBadges({ totalCorrect: (onUpdateScore.totalCorrect \|\| 0) + 1, totalAnswered: (onUpdateScore.totalAnswered \|\| 0) + 1, streak, bestStreak, badges })` — `onUpdateScore` is a *function*, so both are always 1; `simCompleted`, `worldResults`, `bossesDefeated` are not passed. Boss reward badges (`WORLDS[i].boss.reward`) are never granted | `PlayPhase.jsx` L116–123, `badgeEngine.js` | `checkBadges(fullReducerState)`, run after every state change that can trigger a badge (§9) |
| 3 | Story narration is a hand-written paraphrase of the on-screen text (spoken ≠ shown) | `narration.js` `STORY` vs `storyContent.js` | Narration derived from content fields via `speak()` (§8.2) |
| 4 | `ProtractorWorkshop` tracks `pointermove`/`pointerup` on a wrapper div only (no pointer capture); a drag that leaves the wrapper stalls | `ProtractorWorkshop.jsx` | `setPointerCapture` on the handle (§7.0) |
| 5 | 32 px −/+ buttons, 11 px labels, 10 px labels on world cards | `kit.jsx`, `SimulatePhase.jsx`, `KingdomMap.jsx` | ≥ 44 px / ≥ 13 px (§10.4) |
| 6 | Accessibility baseline is almost nil: **1** `aria-`/`role=` attribute in the whole `src` | grep | §10.5 |
| 7 | **Real ElevenLabs API key committed** in `.env.local.example`; `.gitignore`'s `*.local` does not match `.env.local.example` | `.env.local.example` | Placeholder only; secret-scan gate; owner must rotate the key (PRD O9) |
| 8 | Client code POSTs to `/api/elevenlabs` when no key is set, but **no `api/` function ships** → dynamic narration silently fails in production | `utils/audio.js` `fetchDynamic` | Ship `api/elevenlabs.js` (§8.4) |
| 9 | Each story image exists twice (`.png` and `.jpg`), both JPEG data (the `.png` files are mislabelled); 9.2 MB total | `public/assets/story` | One file per panel, correctly typed, ≤ 250 kB (§13) |
| 10 | Wonder diagram draws 135° while text says 132° | `WonderPhase.jsx` / `AngleVisual` `road-sign` default | Diagram and copy built from one data object; automated check (§12) |
| 11 | `useViewport` hook unused; `LOAD_QUESTIONS`, `UNLOCK_BADGE`, `NEXT_STORY_PANEL`, `PREV_STORY_PANEL`, `ADVANCE_SIM_STATION`, `PREV_SIM_STATION`, `CLEAR_FEEDBACK` dispatched nowhere | `App.jsx`, hooks | Keep the blueprint's action names but each must be either dispatched or deleted (§4) |
| 12 | Question text prefixed "In case #n…" purely to make texts distinct | `questionBank.js` W0 | Distinctness comes from genuinely different scenes/numbers |
| 13 | `README` states "Vite 5", directory tree for a different folder name | `README.md` | Rewrite |

### 1.4 Reference patterns explicitly **adopted**
Glass-card/phase-band system; phase colour tokens; fluid `clamp()` type/space tokens; `TopNav` structure (Home · capsule · Sound · ✕, story progress row, confirm-reset modal) **made responsive**; `FloatingSymbols` background (re-skinned); Story carousel (image + text + pull-quote + bubble, dots, image-error fallback to `imageBg`/`imageEmoji`); Simulate shell and `kit.jsx` chrome (`Panel`, `Node`, `Msg`, `GoldBtn`, `GhostBtn`, slider); Practice mode tabs, `KingdomMap` grid with ≥ 1★ unlock, stats pills; `BossBattleModal`, `FeedbackOverlay`, `BadgesModal`, `StarRating`; `useHeaderHeight`; seeded `createRNG`; `calcStars` / `calcXP` (**this resolves the earlier open question R2 — the XP formula is now available and is reused verbatim**); audio engine (`getAudioUrl` static → live → silent, preload of next segment, click sound, no browser speech — `grep speechSynthesis` returns nothing); `generate_audio.js` deriving phrases from `getAllNarration()`; `clean_audio.js`; `stress_test_bank.js` (extended).

### 1.5 File disposition (reference → target)

| Reference file | Disposition |
|---|---|
| `src/App.jsx` | **Modify** (§4) |
| `src/main.jsx`, `index.css` | Reuse |
| `src/components/TopNav.jsx` | **Modify** (responsive, §10.3) |
| `src/components/IntroScreen.jsx` | **Modify** (copy + responsive stacking) |
| `src/components/phases/WonderPhase.jsx` | **Modify** (content, scroll/CTA rules) |
| `.../StoryPhase.jsx` | **Modify** (stacked layout, scroll area, counter, narration source) |
| `.../SimulatePhase.jsx` | **Modify** (4 new stations, stacked strip, status chips) |
| `.../PlayPhase.jsx` | **Modify** (bank sampling, full-state badge check, calculator, timer scope, boss results) |
| `.../ReflectPhase.jsx` | **Modify** (new recap, copy, badges listed) |
| `src/components/quiz/QuestionRenderer.jsx`, `BossBattleModal.jsx` | **Modify** (visual import; sizes; sheet on phone) |
| `src/components/shared/FeedbackOverlay.jsx`, `Mascot.jsx`, `FloatingSymbols.jsx` | Modify copy/symbols; sheet on phone |
| `src/components/shared/AngleVisual.jsx` (673 lines) | **Replace** with `PythagorasVisual.jsx` (§6.7) |
| `src/components/gamification/KingdomMap.jsx`, `StarRating.jsx`, `BadgesModal.jsx` | Modify (sizes; boss trophies; copy) |
| `src/components/simulations/kit.jsx` | Modify (44 px targets; `Stepper`) |
| `src/components/simulations/{ProtractorWorkshop, MatchTheMissingAngle, IntersectionPuzzle, RadiantPointLab, CaseFileDetective}.jsx` | **Do not clone**; four new stations (§7) |
| `src/config/{worlds,characters}.config.js` | **Modify** (PRD §9.1, §6) |
| `src/config/audio.config.js`, `utils/audio.js`, `hooks/useAudio.js`, `hooks/useHeaderHeight.js`, `utils/{rng,shuffle,scoring}.js` | Reuse (audio.js: add reduced-motion-independent notes in §8; no logic change) |
| `src/hooks/useViewport.js` | Modify (breakpoints per §10.2) and **use it** |
| `src/utils/angleMath.js` | **Replace** with `pythagorasMath.js` (§6.4) |
| `src/utils/narration.js` | **Rewrite** (§8.2) |
| `src/utils/badgeEngine.js` | **Modify** (strings + boss trophies + full-state check) |
| `src/utils/audioMap.js` | Auto-generated |
| `src/data/{storyContent,questionBank}.js` | **Rewrite** |
| `src/styles/{design-tokens,globals}.css` | Modify (§10) |
| `scripts/{generate_audio,clean_audio}.js` | Reuse (generate: add `--check`) |
| `scripts/stress_test_bank.js` | **Extend** (§12.1) |
| `scripts/generate_story_art.js` (683 lines of hand-drawn SVG) | **Do not clone**; replace with a ~60-line placeholder generator (§13) |
| `docs/*`, `README.md` | Rewrite |
| `public/assets/story/*`, `audio/*` | Regenerate |
| `public/favicon.svg` | Re-draw |
| `.env.local.example` | **Rewrite — placeholder only** |
| `vercel.json`, `.oxlintrc.json`, `.gitignore` | Reuse; `.gitignore` adds `.env*` with `!.env.local.example` |

---

## 2. Tech Stack

```json
{
  "name": "pythago-quest",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "engines": { "node": ">=20" },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "generate-audio": "node scripts/generate_audio.js",
    "clean-audio": "node scripts/clean_audio.js",
    "check-audio": "node scripts/generate_audio.js --check",
    "test:bank": "node scripts/stress_test_bank.js",
    "test:units": "node scripts/unit_tests.js",
    "test:layout": "node scripts/layout_audit.js",
    "lint": "oxlint",
    "gen:art-placeholders": "node scripts/placeholder_art.js"
  },
  "dependencies": {
    "canvas-confetti": "^1.9.4",
    "framer-motion": "^12.42.0",
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.2",
    "autoprefixer": "^10.5.2",
    "oxlint": "^1.69.0",
    "playwright-core": "^1.50.0",
    "postcss": "^8.5.16",
    "tailwindcss": "^3.4.4",
    "vite": "^8.1.0"
  }
}
```
All blueprint versions exist in the npm registry (checked) and the reference code built on them (§1.2). `playwright-core` is a dev-only dependency for `test:layout` (§12.5). `vite.config.js` (`base: '/'`, `server.port 3000`), `postcss.config.js`, `vercel.json` (`/((?!assets/|api/).*)` → `/`) are reused. `tailwind.config.js` keeps the reference's `fontFamily`, enlarged `fontSize` scale and phase/world colours; update `world0…world9` to PRD §9.1 and add `screens: { xs: '390px', lg2: '1180px', nav: '1360px' }` (§10.2).

---

## 3. Folder Structure

```
G8-PythagoQuest-main/
├── api/elevenlabs.js                         # NEW serverless proxy (Vercel) — §8.4
├── public/{favicon.svg, assets/{audio/, story/}}     # story_1.png … story_6.png (1024×1024)
├── scripts/
│   ├── generate_audio.js  clean_audio.js     # reuse (+ --check)
│   ├── stress_test_bank.js                   # EXTEND (§12.1)
│   ├── unit_tests.js                         # NEW (speak(), math, station generators)
│   ├── layout_audit.js                       # NEW (Playwright viewport audit, §12.5)
│   └── placeholder_art.js                    # NEW
├── src/
│   ├── components/
│   │   ├── TopNav.jsx  IntroScreen.jsx
│   │   ├── shared/   Mascot  FeedbackOverlay  FloatingSymbols  PythagorasVisual  Calculator  Sheet
│   │   ├── gamification/  KingdomMap  StarRating  BadgesModal
│   │   ├── quiz/     QuestionRenderer  BossBattleModal
│   │   ├── phases/   WonderPhase  StoryPhase  SimulatePhase  PlayPhase  ReflectPhase
│   │   └── simulations/
│   │       ├── SquareLab.jsx            # Station A · Concept Discovery
│   │       ├── LadderRescue.jsx         # Station B · Build-to-Target
│   │       ├── ZipLineDesigner.jsx      # Station C · Multi-step / Composite
│   │       ├── SiteInspector.jsx        # Station D · Error-Detective
│   │       ├── kit.jsx  Stations.css
│   ├── config/   worlds.config.js  characters.config.js  audio.config.js  app.config.js (NEW)
│   ├── hooks/    useAudio  useHeaderHeight  useViewport  usePointerDrag (NEW)  useReducedMotion (NEW)
│   ├── data/     storyContent.js  questionBank.js  stationData.js (NEW)  recapQuestions.js (NEW)
│   ├── utils/    audio  audioMap(auto)  narration  speak  badgeEngine  scoring  shuffle  rng  pythagorasMath  slots
│   ├── styles/   design-tokens.css  globals.css
│   └── App.jsx  main.jsx  index.css
├── docs/  PythagoQuest_PRD.md  PythagoQuest_TRD.md  audio_generation_pipeline.md (rewritten)
└── index.html  package.json  vite.config.js  tailwind.config.js  postcss.config.js  vercel.json  .oxlintrc.json  .gitignore  .env.local.example  README.md
```
*Hooks stay in `src/hooks/` as in the reference (the blueprint's `src/core/hooks/` location is not used; both reference hooks and every import already point at `src/hooks`).* **No `src/features/`.** A CI grep fails the build if any file under `components/simulations` is not imported by `SimulatePhase.jsx`.

`config/app.config.js` (new, single place for every tunable the PRD leaves open):
```js
export const SIM_STATION_COUNT = 4;
export const WORLD_COUNT = 10, QUESTIONS_PER_WORLD = 10;
export const UNLOCK_RULE = (prevStars) => prevStars >= 1;   // PRD O3
export const TIMER_SCOPE = 'question';                      // 'question' | 'session'  (PRD O4)
export const TIMER_SECONDS = 60;
export const CALCULATOR_ENABLED = true;                     // PRD O6
export const ROUND_DP = 1;                                  // PRD O2
export const MIN_TARGET_PX = 44;
```

---

## 4. State Management (`App.jsx`)

`useReducer` with the blueprint's fixed action names: `SET_PHASE, NEXT_STORY_PANEL, PREV_STORY_PANEL, ADVANCE_SIM_STATION, PREV_SIM_STATION, COMPLETE_SIM_STATION, LOAD_QUESTIONS, ANSWER_CORRECT, ANSWER_INCORRECT, USE_HINT, CLEAR_FEEDBACK, PREV_QUESTION, NEXT_QUESTION, UNLOCK_BADGE, COMPLETE_PHASE, TOGGLE_AUDIO, RESET_SESSION` (+ the reference's `UPDATE_WORLD_RESULT`).

**Rule: every action is dispatched by something or deleted** (reference defect 11). Disposition:

| Action | Used by |
|---|---|
| `SET_PHASE`, `COMPLETE_SIM_STATION`, `ANSWER_CORRECT`, `ANSWER_INCORRECT`, `UPDATE_WORLD_RESULT`, `COMPLETE_PHASE`, `TOGGLE_AUDIO`, `RESET_SESSION` | as in the reference |
| `UNLOCK_BADGE` | **New role:** the single path by which badges are granted — dispatched for every badge returned by `checkBadges(state)` (§9) |
| `NEXT/PREV_STORY_PANEL` | **Move story panel index into the reducer** so TopNav's progress row and StoryPhase read one source (removes the `storySlideInfo` side-channel `useState` in `App`) |
| `ADVANCE/PREV_SIM_STATION` | **Move station index into the reducer** (`simStation`), bounded by `SIM_STATION_COUNT − 1` |
| `LOAD_QUESTIONS`, `USE_HINT`, `NEXT_QUESTION`, `PREV_QUESTION`, `CLEAR_FEEDBACK` | **Delete** — the per-session quiz UI state (question list, index, hint level, lives, timer) stays local to `PlayPhase` as in the reference; only results flow to the reducer. (Deviation from "reuse verbatim", justified by defect 11; confirm with the blueprint owner.) |

Key state: `phase, storyPanel, simStation, simCompleted[SIM_STATION_COUNT], worldResults[10], bossWins[10], xp, streak, bestStreak, totalCorrect, totalAnswered, bossesDefeated, badges[], audioEnabled, journeyComplete`.

Rules:
- Panel end check: `state.storyPanel >= STORY_PANELS.length - 1` (never a literal).
- `ANSWER_CORRECT` increments `streak`, sets `bestStreak = max(bestStreak, streak)`; `ANSWER_INCORRECT` zeroes `streak`. Streak is never derived from stars.
- `UPDATE_WORLD_RESULT` keeps `max(previous, stars)` and, when `bossWon`, sets `bossWins[worldIdx] = true` and increments `bossesDefeated` once per world.
- **Badge evaluation:** a reducer-level wrapper `withBadges(nextState)` runs `checkBadges(nextState)` after every action that can change a trigger and appends results to `badges` (deduplicated). This removes badge logic from `PlayPhase` entirely and fixes defect 2 by construction. Newly earned ids are also pushed to `state.badgeQueue` so `PlayPhase`/`SimulatePhase` can show the unlock toast (`FeedbackOverlay status="badge"`).
- `RESET_SESSION` clears progress but keeps `audioEnabled`.
- `hasProgress` = any XP, star, badge or completed station → Home/✕ show the confirmation (reference behaviour).

---

## 5. Component Specs

### 5.1 `TopNav` — responsive (replaces reference markup, same visual language)
See §10.3 for the exact class strategy. Props unchanged plus `storyInfo` from the reducer. The header is `position: fixed`; `useHeaderHeight(ref)` writes `--header-h`; the confirm modal becomes a **bottom `Sheet`** on phones. Buttons keep `aria-current="step"` on the active phase and `aria-label` on icon-only states.

### 5.2 `IntroScreen`
Copy per PRD §8.1. Layout classes: `grid-cols-1 sm:grid-cols-3` feature cards; journey-flow rows `flex-wrap`; whole screen scrolls inside `main` when taller than `100dvh` (`overflow-y-auto`).

### 5.3 `WonderPhase`
Card = `flex flex-col` with a **scrolling body** (`min-h-0 overflow-y-auto`) and a **footer outside the scroll area holding the CTA** (so the CTA is always visible, fixing the 1366×768 clip). Diagram `<PythagorasVisual type="field-diagonal" data={WONDER} compact />` where `WONDER = { a: 60, b: 80, unknown: 'c', unit: 'm' }`; the headline numbers string is built from the same object (`${a + b}`), enforcing PRD §7.3-7.

### 5.4 `StoryPhase`
Same carousel logic. Changes: (1) `<main>` card uses `md:grid-cols-2` only from **900 px** (`story:` screen), stacked below; (2) text column is the *only* scrolling element, and includes the bubble; (3) image box `h-[38dvh] story:h-[min(420px,52dvh)]`; (4) phone footer: icon-style Back/Next with short labels and a "n / 6" counter instead of dots (`xs:hidden`/`sm:flex`); (5) narration = `storyNarration(slideIdx)` built from `STORY_PANELS[i].text` and `.highlight` (§8.2); (6) `onSlideChange` replaced by reducer `storyPanel`. Image fallback (`imageBg`/`imageEmoji`) retained. Image `alt` = panel title + one-sentence scene description from `storyContent.alt`.

### 5.5 `SimulatePhase`
- `STATIONS = [SquareLab, LadderRescue, ZipLineDesigner, SiteInspector]` with `{ id, icon, short: 'A'…'D', name, sub, Comp }`.
- **≥ 1180 px:** reference 12-column shell. **< 1180 px:** `StationStrip` (4 equal buttons, icon + letter + status chip `To do` / `Done ✓`, each ≥ 44 px tall) above the workspace; the workspace header shows the full station name.
- Tabs get `min-w-0` and `truncate`; the status chip replaces the reference's 🔓 icon.
- Next-station behaviour as in the reference (tabs freely clickable); the **Go to Practice** CTA is disabled until `simCompleted.every(Boolean)` and shows `n/4 complete`.
- Cards use `max-h-[calc(100dvh-var(--header-h)-16px)]`; the workspace is `min-h-0 overflow-y-auto`.
- Intro narration per station (`simStationIntro(idx)`); `key={stationIdx}` remounts station state (reference behaviour).
- Orientation hint on phones in landscape: `matchMedia('(orientation: landscape) and (max-height: 500px)')` → one-line hint.

### 5.6 `PlayPhase`
Keep structure (mode tabs → `KingdomMap` → quiz view; boss intro modal; feedback overlay; badges modal) with these changes:
1. **Question source:** `const qs = sessionQuestions(worldIdx, modeId, seed)` from `data/questionBank.js` (§6.6), not `generateQuestion` in a loop.
2. **Scoring:** `calcXP({ attempts: 1, hintsUsed: hintLevel, streak: streak + 1 })`; dispatch `ANSWER_CORRECT/INCORRECT` only — **no badge logic in this file** (§4).
3. **Finish:** compute `starsEarned = calcStars(correct)` from the *local* counter passed as an argument (avoid the reference's reliance on state read inside closures); `bossWon = mode==='boss' && livesLeft > 0 && finishedAllQuestions`; dispatch `UPDATE_WORLD_RESULT`.
4. **Boss:** lives tracked locally; on 0 lives end the session *immediately* after the feedback overlay is dismissed; no stars recorded for an abandoned boss; the world's reward badge id is `boss_<worldId>`.
5. **Timer:** `TIMER_SCOPE === 'question'` → countdown resets on each question and timing out records the question as incorrect and advances; `'session'` → single 60 s countdown (reference behaviour). Timer pauses while the feedback overlay is open.
6. **Calculator:** `🧮` button in the quiz header opens `<Calculator />` (§5.8) when `CALCULATOR_ENABLED`.
7. **Layout:** stats pills collapse into one chip < 768 px; options grid `grid-cols-1 sm:grid-cols-2`; the diagram box `max-h-[32dvh]` (`26dvh` on phones); question text size from `--fs-question-text`.
8. **Copy:** PRD §8.5; remove "MOE".
9. Rule pill under the question shows the **concept name** (`category.replace(/-/g,' ')`), never the method.

### 5.7 `ReflectPhase`
Recap questions from `data/recapQuestions.js` (PRD §8.6 — fixed text, options shuffled once per mount); scorecard adds a badge row (icons only + count); reflection prompt/placeholder per PRD; the confetti call is skipped when `useReducedMotion()`; `CelebrationScreen` uses `h-full` inside `main` (not `w-screen h-screen`, which ignores the header and dynamic viewport).

### 5.8 `Calculator` (new, `components/shared/Calculator.jsx`)
Immediate-execution calculator, no `eval`. State `{ acc, op, entry, fresh }`. Keys: `0–9 . ⌫ C`, `+ − × ÷ =`, `x²`, `√`. Rules: `x²` and `√` act on the current entry immediately; `√` of a negative shows `Error` and clears on the next key; display rounds to 8 significant digits (`Number(x.toPrecision(8))`); key buttons ≥ 44 px; focus-trapped dialog (`role="dialog"`, `aria-modal`), closes on Escape; keyboard digits/operators work. Example: `3 x² + 8 x² = √` → `8.5440037`. Unit-tested (§12.2).

### 5.9 Motion
`framer-motion` is used for: station success panel, feedback overlay/sheet entrance, story panel cross-fade, and badge toast. Every `motion` component reads `useReducedMotion()` and swaps to `initial={false}` (no animation). CSS animations (`fadeInUp`, `floatSlow`, `shake`) are disabled by a `@media (prefers-reduced-motion: reduce)` block in `globals.css`.

### 5.10 Shared sheet
`Sheet` renders children as a centred modal ≥ 768 px and a bottom sheet (`rounded-t-3xl`, `max-h-[85dvh]`, internal scroll, safe-area padding) below; used by Boss modal, Feedback overlay, Badges modal, confirm-reset. Traps focus, `Escape` closes (except Feedback, whose only action is Next).

---

## 6. Data Layer

### 6.1 `config/worlds.config.js`
Ten entries `{ id, name, emoji, accent, description, conceptFocus, boss: { name, emoji, reward } }` populated verbatim from PRD §9.1 (accents `#f472b6 #38bdf8 #4ade80 #fb923c #fbbf24 #2dd4bf #818cf8 #e879f9 #c084fc #f43f5e`). Export `WORLDS`.

### 6.2 `config/characters.config.js`
```js
export const CHARACTERS = {
  priya:  { name: 'Priya',  role: 'Apprentice', emoji: '👧', colour: '#f472b6', mascotEmoji: '🦉', bio: 'Measures everything twice and loves a good ladder problem.' },
  junkai: { name: 'Jun Kai', role: 'Apprentice', emoji: '👦', colour: '#38bdf8', mascotEmoji: '🦉', bio: 'Always spots the shortcut before anyone else.' },
  tally:  { name: 'Foreman Tally', role: 'Foreman & Mentor', emoji: '🦉', colour: '#facc15', mascotEmoji: '🦉', bio: 'The wise foreman with a hard hat and a set-square.' },
};
export const MASCOT = { name: 'Tally', title: 'Foreman Tally', emoji: '🦉', badge: 'Right-Angle Works' };
```

### 6.3 `data/storyContent.js`
`STORY_PANELS` — **length 6**, shape `{ panel, id, title, text, highlight, character, characterEmoji, image, alt, imageBg, imageEmoji, bubble }`, with `text`, `highlight`, `character`, `bubble` verbatim from PRD §8.3 and `image: '/assets/story/story_N.png'`. Strings may contain `²`, `√`, `≈`, `m`, `cm`, `$`; they are authored **once** and narrated through `speak()` (§8.2). Authoring conventions (checked by `unit_tests.js`): thousands use a non-breaking space; adjectival units are hyphenated (`13-m ladder`); decimals use a point.

### 6.4 `utils/pythagorasMath.js` — single source of maths truth
Pure functions used by the generator **and** by Stations A–D, so the maths lives in exactly one place. *The code below is the prototype that was run in this analysis (all checks passed); copy it as the starting file.*

```js
export const SCALE = 10;                                   // decimal contexts are stored as integer tenths
export const sum2 = (a, b) => a * a + b * b;
export const isSquare = n => Number.isInteger(n) && n >= 0 && Math.sqrt(n) ** 2 === n && Number.isInteger(Math.sqrt(n));
export const isTriple = ([a, b, c]) => a > 0 && b > 0 && a * a + b * b === c * c;

export const BASE_TRIPLES = [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29],[12,35,37],[9,40,41]];
export const MULTIPLIERS  = [1, 2, 3, 4, 5, 10];

/** all whole-number triples (legs ascending, de-duplicated) with hypotenuse in [minC, maxC] */
export function triplesWithin(minC, maxC) {
  const out = [];
  for (const base of BASE_TRIPLES) for (const k of MULTIPLIERS) {
    const t = base.map(x => x * k);
    if (t[2] >= minC && t[2] <= maxC) out.push(t);
  }
  return [...new Map(out.map(t => [t.join('-'), t])).values()].sort((x, y) => x[2] - y[2]);
}

/** decimal triples as integer tenths, at least one side non-integer in metres; e.g. [9,12,15] = 0.9, 1.2, 1.5 */
export function decimalTriples(maxTenthsC = 60) {
  const out = [];
  for (const base of [[3,4,5],[5,12,13],[8,15,17],[7,24,25]]) for (let k = 1; k <= 12; k++) {
    const t = base.map(x => x * k);
    if (t[2] <= maxTenthsC && t.some(x => x % 10 !== 0)) out.push(t);
  }
  return [...new Map(out.map(t => [t.join('-'), t])).values()];
}

export const round1 = x => Math.round(x * 10 + 1e-9) / 10;
/** rounding-safe: x*10 is not within 0.05 of a .5 boundary (avoids 1 d.p. disputes and float error) */
export function roundSafe(x) { const t = x * 10, f = t - Math.floor(t); return Math.abs(f - 0.5) > 0.05; }
export const fmt = x => (Number.isInteger(x) ? String(x) : x.toFixed(1));        // answers/distractors: 1 d.p.
export const fmtExact = x => String(Number(x.toFixed(2)));                       // squared values: up to 2 d.p. (e.g. 4.81, 2.25)

export function decimalHypCases(minLeg = 2, maxLeg = 20) {     // legs integers; hyp² not a perfect square; rounding-safe
  const out = [];
  for (let a = minLeg; a <= maxLeg; a++) for (let b = a + 1; b <= maxLeg; b++) {
    const h2 = sum2(a, b); if (isSquare(h2)) continue;
    const c = Math.sqrt(h2); if (!roundSafe(c)) continue;
    out.push({ a, b, h2, c, ans: round1(c) });
  }
  return out;
}
export function decimalLegCases(minC = 5, maxC = 30) {          // hyp c integer; other leg b integer; leg² not square, ≥ 4
  const out = [];
  for (let c = minC; c <= maxC; c++) for (let b = 2; b < c; b++) {
    const l2 = c * c - b * b; if (l2 < 4 || isSquare(l2)) continue;
    const a = Math.sqrt(l2); if (!roundSafe(a)) continue;
    out.push({ c, b, l2, a, ans: round1(a) });
  }
  return out;
}

/** distractors that model real misconceptions (never random numbers) */
export function hypDistractors(a, b, correct) {
  return pick3([a + b, sum2(a, b), round1(Math.sqrt(Math.abs(b * b - a * a))), correct + 1, correct - 1, correct + 2, correct - 2], correct);
}   // added lengths · forgot √ · subtracted instead of added · near-misses (fallback)
export function legDistractors(c, b, correct) {
  return pick3([round1(Math.sqrt(c * c + b * b)), c - b, c * c - b * b, correct + 1, correct - 1, correct + 2, correct - 2], correct);
}   // added instead of subtracted · subtracted lengths · forgot √ · near-misses (fallback)
function pick3(cands, correct) {
  const seen = new Set([fmt(correct)]), out = [];
  for (const x of cands) { if (!(x > 0)) continue; const s = fmt(x); if (seen.has(s)) continue; seen.add(s); out.push(x); if (out.length === 3) break; }
  return out;
}

export function converse(sides) {                               // test uses the LONGEST side, wherever it sits
  const s = [...sides].sort((x, y) => x - y), lhs = s[0] ** 2 + s[1] ** 2, rhs = s[2] ** 2;
  return { isRight: lhs === rhs, longest: s[2], lhs, rhs };
}
/** "not right" case: perturb one side of a triple; must satisfy the triangle inequality and not be a triple in any order */
export function notRightPerturb(rng, [a, b, c]) {
  for (let t = 0; t < 50; t++) {
    const i = rng.int(0, 2), d = rng.pick([-3, -2, -1, 1, 2, 3]), s = [a, b, c]; s[i] += d;
    if (s.some(x => x < 2)) continue;
    const [x, y, z] = [...s].sort((p, q) => p - q);
    if (x + y <= z || x * x + y * y === z * z) continue;
    return s;
  }
  return null;
}
```
**Prototype results (reproduced by `npm run test:units`):** whole-number triples with hypotenuse 5–100: **27**; with hypotenuse ≤ 30 (ladders): **10** (3-4-5, 6-8-10, 5-12-13, 9-12-15, 8-15-17, 12-16-20, 15-20-25, 7-24-25, 10-24-26, 20-21-29); decimal triples with hypotenuse ≤ 6.0 m: **20**; decimal-answer hypotenuse cases: **148**; decimal-answer leg cases: **333**. Across all 27 + 20-triple pools and all 148 + 333 decimal cases, `hypDistractors` / `legDistractors` produced three distinct distractors and four distinct formatted options in **100 %** of cases, and no two decimal options were closer than 0.2.

**Hard rules (each is asserted in §12.1):**
1. Whole-number items draw `(a, b, c)` from `triplesWithin`, **never** from three independent random numbers; decimal-scaled contexts draw from `decimalTriples` and compute in integer tenths.
2. Context realism caps: ladder ≤ 30 m, wire/rope ≤ 40 m, ramp ≤ 6 m, TV ≤ 150 cm, field ≤ 120 m, tray/door ≤ 3 m.
3. Non-whole answers: `decimalHypCases`/`decimalLegCases` only (not a perfect square, rounding-safe); the question contains "correct to 1 decimal place" **iff** the answer is rounded.
4. Converse: "right" from the pool; "not right" from `notRightPerturb`; the order of the three sides shown is shuffled so the longest is not always last; **distractors must have a false statement or a wrong conclusion** (the PoC initially produced a true statement — `25² − 20² = 15²` — prefixed "No"; fixed).
5. `explanation` uses the exact numbers and states the *method* (add vs subtract), never only the answer.

### 6.5 Question templates (`data/questionBank.js`)
Schema (fixed): `{ id, districtId, category, visual, questionText, options[4], correctAnswer, explanation, hint1, hint2, visualData }`. Every world has **≥ 2 template functions** (some slots fall to the second template, which also guarantees 10 distinct texts); each draws numbers from §6.4 pools.

| World | Templates (slot ramp easy → hard) | Misconception distractors |
|---|---|---|
| 0 Spotter's Lookout | (a) "which side is the hypotenuse" in ladder/ramp/roof/screen scenes (options: the real side, the other two, a *vertex*); (b) "which equation is correct" for stated side lengths (4 placements of the longest side); (c) orientation: same triangle rotated/mirrored, ask the hypotenuse label | longest-side confusion; leg vs hypotenuse swap; vertex vs side |
| 1 Hypotenuse Harbour | find hypotenuse in 4 contexts (field, kite string, TV, support wire), whole-number triples, ramped by hypotenuse size; slot 9 uses a decimal-scaled triple | `a+b`; `a²+b²`; `√|b²−a²|` |
| 2 Missing-Leg Mountain | find a leg: ladder reach, guy-wire pole height, ladder foot distance, rope on a flagpole | `√(c²+b²)`; `c−b`; `c²−b²` |
| 3 Round-It-Right Reef | hyp (slots 0–4) and leg (5–9) with 1 d.p. answers; ramp, rope, brace, path contexts | as W1/W2 + rounding slip (`⌈⌉` instead of nearest) in 1 distractor when distinct |
| 4 Square-Corner Site | converse for 3 side lengths (alternating right / not right); builder's 3-4-5 check; "which triple is right-angled?"; diagram "not to scale", no right-angle mark | wrong pairing; `x+y>z` triangle-inequality confusion; false rearranged equation |
| 5 Ramp & Ladder Row | ramp length, slide length, tent rope, ladder reach with decimal-scaled triples **and** integer triples; a "draw the triangle first" item (choose the correct labelled diagram) | `a+b`; squares only; sign slip |
| 6 Fit-It Factory | diagonal of door / tray / screen / gate (rectangle → right triangle); "does it fit?" yes/no with the diagonal compared to a rod/pole length | `a+b`; `√|b²−a²|`; forgot √ |
| 7 Shortcut City | east–north displacement; walk-edges vs shortcut difference (two steps); compare two routes ("which is shorter, by how much?") | answer = the shortcut only; answer = the edges only; difference of squares |
| 8 Zip-Line Park | height-difference then hypotenuse (zip-line); diagonal × cost per metre; rafter × 2; two-leg route totals | use full height not difference; forgot cost step; forgot ×2 |
| 9 Blueprint Tower | weighted draw: 6 items from worlds 0–8 templates (≥ 5 distinct source worlds across the 10 slots) + 2 "reasonableness" items (hypotenuse must be longest; ladder can't reach higher than its length) + 2 single-unknown items (`x² + 15² = 17²`) | as source template |

*Slot ramp rule:* slot *s* selects pool entries from the *s/10* quantile of the pool sorted by hypotenuse (PoC `genWorld1`), so slot 0 is "3-4-5-like" and slot 9 is the largest.

### 6.6 Bank API and session sampling (`data/questionBank.js`, `utils/slots.js`)
```js
export function generateWorld(worldId, seed)   // → exactly 10 questions (slots 0..9), 10 distinct questionText
export function generateBank(seed = 12345)     // → 100 questions = 10 × generateWorld  (used by the stress test)
export const DISTRICTS = WORLDS.map(w => ({ id: w.id, name: w.name, icon: w.emoji, accent: w.accent,
                                            conceptFocus: w.conceptFocus, description: w.description, boss: w.boss }));
export function sessionQuestions(worldId, modeId, seed) // → k questions per slots.js
```
`utils/slots.js`:
```js
const SPREAD = { guided: [0, 2, 4, 6, 8], independent: [0,1,2,3,4,5,6,7,8,9], timed: [1,2,3,4,5,6,7,8], boss: [5,6,7,8,9] };
export function pickSlots(modeId, rng) {          // light seeded jitter (±1, clamped, no duplicates) for guided/timed so sessions differ
  const base = SPREAD[modeId]; if (modeId === 'independent' || modeId === 'boss') return base;
  const used = new Set(); return base.map(s => { let t = Math.min(9, Math.max(0, s + rng.int(-1, 1))); while (used.has(t)) t = (t + 1) % 10; used.add(t); return t; });
}
```
`sessionQuestions` generates the world with a **fresh seed per session** (so numbers differ between sessions) and returns the chosen slots **in ascending order**. Boss uses slots 5–9 so it is genuinely harder than Independent. The module-level `export const questionBank = generateBank(Date.now())` in the reference is removed (it generated 100 questions at import time, unused).

### 6.7 `shared/PythagorasVisual.jsx`
`<PythagorasVisual type data compact />` — pure SVG, `viewBox="0 0 320 220"`, colours from CSS variables only (`--pyth-leg-a`, `--pyth-leg-b`, `--pyth-hyp`, `--pyth-unknown`, `--pyth-ok`, `--pyth-grid`), `className="w-full h-full select-none"`, `role="img"` with an `aria-label` built from `data` (e.g. "Right-angled triangle, legs 60 metres and 80 metres, hypotenuse unknown").

Core helper: `fitTriangle(a, b, box)` scales legs by `min(box.w/a, box.h/b)` (with a minimum label-offset when the aspect ratio exceeds 3.5:1, e.g. 7-24-25), places the right-angle square at the corner, and labels each side at its midpoint offset along the outward normal. Labels use text (`60 m`, `x`, `?`), never colour alone; the hypotenuse is also drawn thicker and labelled "c".

| `type` | `data` | Renders |
|---|---|---|
| `right-triangle` | `{ a, b, c?, unknown: 'a'\|'b'\|'c', unit, labels? }` | generic labelled right triangle (used by most word problems) |
| `squares-on-sides` | `{ a, b, tiles?: boolean }` | triangle with a square on each side, optional unit-tile grid (Station A, Story panel 2) |
| `field-diagonal` | `{ a, b, unknown, unit, route?: boolean }` | top-down rectangle, dashed edge route, solid diagonal |
| `ladder-wall` | `{ L?, d?, h?, unknown, unit }` | wall, ground, ladder, window marker (Station B, ladder items) |
| `ramp` | `{ rise, run, length?, unknown, unit }` | side-on ramp with a right-angle block |
| `rect-diagonal` | `{ w, h, unknown, unit, object: 'door'\|'tv'\|'tray'\|'gate' }` | rectangle with diagonal |
| `zipline` | `{ towerH, poleH, gap, unit, step }` | tower, pole, dashed legs that appear by `step` (Station C) |
| `route-compare` | `{ a, b, unit, show: 'edges'\|'shortcut'\|'both' }` | L-shaped route vs hypotenuse |
| `grid-displacement` | `{ east, north, unit }` | compass journey on a light grid |
| `rafter` | `{ halfSpan, rise, unit }` | gable roof half-section |
| `converse-check` | `{ sides:[…], unit, notToScale: true }` | **schematic** triangle (fixed generic shape, never SSS-accurate), side labels, caption "Not drawn to scale", **no right-angle mark** |
| `identify-sides` | `{ scene, highlight?: 'hyp'\|'leg-a'\|'leg-b' }` | ladder/ramp/roof/screen scenes with the three sides labelled by letter only |

`compact` reduces stroke and label size for the Play inline context (diagram box height `h-44 sm:h-52 md:h-56 max-h-[32dvh]`).

---

## 7. Simulate Station Specs

### 7.0 Shared contract
```jsx
<Station onComplete={fn} audioEnabled={bool} />
```
- Self-contained internal state (no dependency on the reducer beyond `onComplete`); success panel with **Complete Station ✓**; SVG visuals use CSS variables (never hex).
- **Every drag has a tap/keyboard equivalent:** `<Stepper>` (−/+ buttons, 44 px) and `←/→` on the focused handle (`Shift` ×5). Sliders are native `<input type="range">` plus the stepper; the SVG handle is `role="slider"` with `aria-valuenow/min/max` and `aria-label`.
- **Pointer maths:** `usePointerDrag(svgRef, onPoint)` — `onPointerDown` calls `e.currentTarget.setPointerCapture(e.pointerId)`; converts client → SVG coordinates via `svg.getScreenCTM().inverse()`; ends on `pointerup`/`pointercancel`; `touch-action: none` on the handle. (Fixes reference defect 4. No CSS `zoom`.)
- `aria-live="polite"` region for the live readout; every feedback message is text, not colour only.
- Randomness: stations take a seeded RNG from `createRNG(Date.now() + stationIdx*7919)`; the generators live in `data/stationData.js` and call `pythagorasMath.js`.

### 7.1 Station A — `SquareLab` (Concept Discovery)
State: `a, b ∈ 1..12`, `theta` (90 default), `bendMode`, `seen: Set<string>` (pairs), `sawLess/sawEqual/sawGreater`, `nonTripleSeen`, `confirmed`.
- Render `PythagorasVisual type="squares-on-sides"`; the unit-tile grid is drawn when `a, b, c` are all integers and ≤ 17 (otherwise area labels only).
- Readout (live): `a² + b² = c²` with numbers: `9 + 16 = 25` → "c = 5"; non-whole → `c ≈ 8.5` (via `round1`).
- Bend mode: `theta ∈ 60..120` step 5; third side from the cosine rule `c² = a² + b² − 2ab·cosθ`; comparison chip `a² + b² (<, =, >) c²` computed from the numbers (use `Math.abs(diff) < 1e-9` → `=`; at θ = 90 it is exactly `=`).
- **Gate:** `seen.size ≥ 3 && nonTripleSeen && sawLess && sawEqual && sawGreater && confirmed`. Confirmation MCQ: "In a right-angled triangle, the area of the square on the hypotenuse equals…" (answer: *the sum of the areas of the squares on the other two sides*; foils: sum of the other two sides; product of the other two sides; double the longer side). Wrong → `Msg tone="rose"`, retry free.

### 7.2 Station B — `LadderRescue` (Build-to-Target)
State: `case {L, h, d}` from `LADDER_CASES = [[13,12,5],[10,8,6],[17,15,8],[25,24,7],[15,12,9],[26,24,10]]` (validated `d²+h²=L²` at module load), `guess` (1..L−1), `attempts`, `status: 'idle'|'close'|'exact'|'miss'`, `hits`, `firstTryBonus`.
- Live: ladder redrawn from `guess`: `hNow = √(L² − guess²)`; readout `guess² + hNow² = L²` (with `hNow` to 1 d.p.); window marker at `h`; the ladder top ring: amber when `|hNow − h| ≤ 1`, green when exact. **Check** accepts `guess === d` only; tolerance is guidance.
- Success panel after each hit; **New ladder** loads a different case; gate: `hits === 3`.
- Reflection hint line after the 2nd miss in a round: "The ladder is the hypotenuse — subtract." (supports LO3.)

### 7.3 Station C — `ZipLineDesigner` (Multi-step / Composite)
Data (`stationData.js`) — each scene `{ id, title, visual, steps[3], needs: ['subtract'|'cost'|'total'] }`; each step `{ prompt, options[4], correct, explain }`:
1. **zipline** `{ tower: 20, pole: 8, gap: 16 }`: ① "How far does the line drop?" → 12 m · ② equation: `12² + 16² = L²` (foils: `12 + 16 = L`; `16² − 12² = L²`) · ③ "How long?" → 20 m.
2. **gate-brace** `{ w: 1.5, h: 2.0, price: 18 }`: ① label the right triangle (which side is the brace → hypotenuse) · ② `1.5² + 2.0² = c²` · ③ cost → **$45**. (`needs: ['cost']`)
3. **rafter** `{ halfSpan: 12, rise: 5, count: 2 }`: ① identify legs (12, 5) · ② equation · ③ total timber → **26 m**. (`needs: ['total']`)
4. **two-leg route** `{ east: 8, north: 15, back: 17 }`: ① outward distance by the edges 23 m · ② check `8² + 15² = 17²` · ③ saved → **6 m**. (`needs: ['subtract']`)
All numbers are validated at module load with `isTriple`/arithmetic assertions (throws in dev, fails `test:units`).
- Live: `PythagorasVisual` receives `step` and reveals legs → right-angle mark + hypotenuse → length label as steps are answered. Wrong option: shake + hint text, no penalty, option disabled.
- **Gate:** two scenes completed; the pair is drawn so one has `needs ∋ 'subtract'` and the other has `needs ∋ 'cost'` or `'total'` (i.e. scenes {1 or 4} + {2 or 3}).

### 7.4 Station D — `SiteInspector` (Error-Detective)
Generator `makeReport(rng, errorType)` returns `{ lines: [{ tag:'Given'|'Equation'|'Working'|'Answer', text }], faultyIndex, fixes: [3 options], correctFix, why }` built from `pythagorasMath.js` so the wrong line is **provably wrong and the fix provably right** (asserted in `unit_tests.js` for 3 000 random reports):

| Type | Faulty line (example from a 13-5-12 ladder) | Correct fix |
|---|---|---|
| E1 add-instead-of-subtract | `x² = 13² + 5² = 194` | `x² = 13² − 5² = 144` |
| E2 forgot the square root | `c² = 10 000, so c = 10 000 m` | `c = √10 000 = 100 m` |
| E3 hypotenuse treated as a leg | `13² + 12² = x²` (finding the foot, with 13 the ladder) | `13² − 12² = x²` |
| E4 squaring slip | `5² = 10` | `5² = 25` |
| E5 added lengths not squares | `c = 3 + 4 = 7 m` | `c² = 3² + 4² = 25, c = 5 m` |
| E6 converse concluded wrongly | `7² + 24² = 625 = 25², so NOT right-angled` | `… so the triangle IS right-angled` |
| E7 rounding slip | `√73 = 8.544… ≈ 8.6` | `≈ 8.5` |

Flow: tap a line → highlight; if wrong line: `Msg` + retry; if the faulty line: reveal the 3 fixes; choose → `Msg` with `why`. **Gate:** 3 cases, all different types, with (E1 or E5) and E6 always among them.

### 7.5 `SimulatePhase` wiring
`COMPLETE_SIM_STATION` dispatched by `onComplete`; `sim_all` is granted by the reducer wrapper (§4) as soon as the fourth station completes.

---

## 8. Audio Pipeline

### 8.1 Mechanics (reuse, no logic change)
`config/audio.config.js` (voice `Xb7hH8MSUJpSbSDYk0k2`, model `eleven_multilingual_v2`, presets statement/instruction/question/encouragement/emphasis/thinking/celebration), `utils/audio.js` (`getAudioUrl`: static `audioMap` → dynamic fetch (cached) → `null`; `narrate` queue with next-segment preload; `setMuted`; `stopNarration`; `playClickSound`), `hooks/useAudio.js`. **There is no browser speech fallback** (`grep -r speechSynthesis src dist` must be empty — CI gate). If audio is unavailable `narrate` silently continues.

### 8.2 `utils/speak.js` and `utils/narration.js`
`speak(text)` — the **single** on-screen → spoken transform, used by narration, by the audio-map key, and by the parity check. Tested implementation (all rules in PRD §11.1):

```js
const ONES = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
export function intToWords(n) {
  if (n === 0) return 'zero'; if (n < 0) return 'minus ' + intToWords(-n);
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
  if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + intToWords(n % 100) : '');
  if (n < 1e6) return intToWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? (n % 1000 < 100 ? ' and ' : ' ') + intToWords(n % 1000) : '');
  return String(n);
}
export function numToWords(str) {
  const [i, d] = String(str).split('.'); const w = intToWords(parseInt(i, 10));
  return d === undefined ? w : w + ' point ' + d.split('').map(ch => intToWords(+ch)).join(' ');
}
const UNITS = { km: 'kilometres', m: 'metres', cm: 'centimetres', mm: 'millimetres' };
export function speak(text) {
  let s = String(text ?? '');
  s = s.replace(/(\d)[   ,](\d{3})(?!\d)/g, '$1$2').replace(/(\d)[   ,](\d{3})(?!\d)/g, '$1$2'); // 10 000 → 10000
  s = s.replace(/\b(\d+)-(\d+)-(\d+)\b/g, '$1, $2, $3');                                                              // 3-4-5
  s = s.replace(/\bd\.p\./g, 'decimal place').replace(/\b1 decimal place/g, 'one decimal place');
  s = s.replace(/√\s*\(?(\d+(?:\.\d+)?)\)?/g, (_, n) => `the square root of ${n}`);
  s = s.replace(/([a-zA-Z0-9.]+)²/g, (_, b) => `${b} squared`);
  s = s.replace(/≈/g, ' is approximately ').replace(/≠/g, ' does not equal ').replace(/=/g, ' equals ');
  s = s.replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/\+/g, ' plus ').replace(/(\s)[−–-](\s)/g, ' minus ');
  s = s.replace(/\$\s?(\d+)\.(\d{2})\b/g, (_, d, c) => `${d} dollars and ${parseInt(c, 10)} cents`);
  s = s.replace(/\$\s?(\d+(?:\.\d+)?)/g, (_, n) => `${n} dollars`);
  s = s.replace(/(\d+(?:\.\d+)?)-(km|cm|mm|m)\b/g, (_, n, u) => `${n}-${UNITS[u].replace(/res$/, 're').replace(/s$/, '')}`);   // 13-m ladder → thirteen-metre ladder
  s = s.replace(/(\d+(?:\.\d+)?)\s?(km|cm|mm|m)\b/g, (_, n, u) => `${n} ${UNITS[u]}`);
  s = s.replace(/(\d+)°/g, '$1 degrees').replace(/∠([A-Za-z]{3})/g, (_, l) => `angle ${l.split('').join(' ')}`);
  s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, (_, n) => numToWords(n));
  return s.replace(/\s+/g, ' ').trim();
}
```
Verified outputs: `60² + 80² = 3600 + 6400 = 10 000` → "sixty squared plus eighty squared equals three thousand six hundred plus six thousand four hundred equals ten thousand"; `√73 ≈ 8.5 m` → "the square root of seventy-three is approximately eight point five metres"; `A 13-m ladder` → "A thirteen-metre ladder"; `$112.50` → "one hundred and twelve dollars and fifty cents"; `a 3-4-5 rope` → "a three, four, five rope"; `1 d.p.` → "one decimal place". *Known limits (document, don't hide):* a variable followed by a squared digit such as `x²` reads "x squared" ✓; a bare `m` that is a variable name (e.g. "m = 5") would be misread as metres — **variables in this module are `a, b, c, x, d, h, L`; `m`, `cm`, `km` are never used as variable names** (lint rule in `unit_tests.js`: any `\bm\b` not preceded by a number fails).

`narration.js` keeps the blueprint's exported names — `wonderNarration`, `storyNarration(panel)`, `simStationIntro(stationIdx)`, `playQuestionNarration`, `playCorrectNarration`, `playWrongNarration`, `playHint1Narration`, `playHint2Narration`, `districtCompleteNarration`, `bossStartNarration`, `bossWinNarration`, `reflectNarration`, `reflectCompleteNarration`, plus `getAllNarration()`. **Derivation, not duplication (fixes defect 3):**
```js
export const storyNarration = i => [say(speak(STORY_PANELS[i].text)), emphasize(speak(STORY_PANELS[i].highlight))];
export const wonderNarration = () => [say(speak(WONDER.body)), ask(speak(WONDER.tallyQuestion))];
```
`getAllNarration()` is built from the same sources, de-duplicated by text. **Audio-map key = the spoken string** (`speak(...)` output). Titles and short labels are not narrated.

### 8.3 Generation
`generate_audio.js` keeps the reference design (phrases from `getAllNarration()`, 500 ms spacing, skip existing unless `--force`, rewrites `audioMap.js`), adds `--check` (no API call: exits non-zero if any phrase lacks an `audioMap` entry — the **audio-parity gate**). Question text, hints and explanations are procedural → dynamic path (`getAudioUrl` live/proxy); everything else is static. After content lock: `npm run generate-audio` then `npm run clean-audio`. Expect ~45–60 static phrases.

### 8.4 Keys and the proxy
`.env.local.example` contains **`VITE_ELEVENLABS_API_KEY=`** (empty) and a comment only. Production: leave the client variable **unset** so `fetchDynamic` uses `/api/elevenlabs`; ship `api/elevenlabs.js` (Vercel Node function) that reads `ELEVENLABS_API_KEY` from the server environment, validates `{ text ≤ 600 chars, voiceId === VOICE_ID, modelId === MODEL_ID }`, forwards to ElevenLabs with `voice_settings`, streams `audio/mpeg` back, and rate-limits per IP *(in-memory; unverified under serverless cold starts)*. The previously exposed key must be rotated (PRD O9).

---

## 9. Gamification

- `utils/scoring.js` — **reuse verbatim**: `calcStars(n)` → ≥ 9: 3, ≥ 7: 2, ≥ 5: 1, else 0; `calcXP({attempts, hintsUsed, streak})` → `max(2, 10 − 3·(attempts−1) − 2·hintsUsed) + (streak ≥ 3 ? min(10, (streak−2)·2) : 0)`.
- `utils/badgeEngine.js` — `BADGES` strings per PRD §10, ids unchanged: `first_correct, streak_5, streak_10, sim_all, world_3star, boss_won, answered_20, journey_complete`, plus **10 boss trophies** `boss_0…boss_9` with `{ name: WORLDS[i].boss.reward, icon: WORLDS[i].boss.emoji, description: 'Defeated <boss> in <world>' }`. `checkBadges(state)` receives the **full reducer state** and tests: `totalCorrect ≥ 1`; `bestStreak ≥ 5 / 10`; `simCompleted.every(Boolean)`; `worldResults.some(r => r === 3)`; `bossesDefeated ≥ 1`; `totalAnswered ≥ 20`; `journeyComplete`; `bossWins[i] → boss_i`. Returns newly unlocked badge objects; the reducer wrapper (§4) dispatches `UNLOCK_BADGE` for each.
- **Boss Battle:** 5 questions (slots 5–9), 3 lives, one per world; win = all 5 answered with ≥ 1 life left; awards `boss_<i>` + `boss_won`.
- `BadgesModal` lists the 8 trigger badges then "Boss trophies" (10); counts "n of 18 unlocked".
- Reflect scorecard uses `Stars n / 30`.

---

## 10. Design Tokens, Viewport & Responsive Implementation

### 10.1 Tokens (`styles/design-tokens.css`)
Reuse the reference tokens unchanged (cosmic background, glass tokens, phase colours, fluid `--space-*`/`--fs-*`). Replace `--world-0…9` with PRD §9.1 values and replace the angle tokens:
```css
:root {
  --world-0:#f472b6; --world-1:#38bdf8; --world-2:#4ade80; --world-3:#fb923c; --world-4:#fbbf24;
  --world-5:#2dd4bf; --world-6:#818cf8; --world-7:#e879f9; --world-8:#c084fc; --world-9:#f43f5e;
  --header-h: 56px;                       /* overwritten at runtime by useHeaderHeight; Intro sets 0px */
  --pyth-leg-a:#38bdf8; --pyth-leg-b:#fb923c; --pyth-hyp:#facc15; --pyth-unknown:#f43f5e; --pyth-ok:#4ade80; --pyth-grid:rgba(255,255,255,.14);
  --target-min: 44px;
}
```

### 10.2 Breakpoints
Tailwind `screens` (add to `tailwind.config.js`): `xs: 390px, sm: 640px, md: 768px, story: 900px, lg: 1024px, lab: 1180px, nav: 1360px`. `useViewport()` is updated to return `{ width, height, isPhone: w<768, isMedium: 768≤w<1180, isWide: w≥1180, isShort: h<800 }` and **is used** by `SimulatePhase` (strip vs sidebar) and `TopNav` (labels), so layout decisions that Tailwind classes can't express live in one hook.

### 10.3 Responsive `TopNav` implementation
- Row 1 container: `flex flex-wrap items-center justify-between gap-2`, `px-[max(1rem,env(safe-area-inset-left))]`.
- Home pill: label `hidden`-below? **No** — Home keeps its label ≥ 390 px; it is the escape route.
- Capsule: each pill = `[num] [icon] [label]`; label classes `hidden nav:inline` and, when active, `inline`; number badge `hidden md:flex`; on phone the capsule drops to **row 2** (`order-3 w-full justify-center`).
- Sound pill: label `hidden md:inline`; ✕ is 44 px.
- Story progress row: `w-full` third row on phones, second row elsewhere; text "Job Card n of 6".
- Header height changes are picked up by `useHeaderHeight` → `--header-h`; **no component may hard-code a header offset**.

### 10.4 Global rules (`globals.css`)
```css
html, body, #root { height: 100%; margin: 0; }
body, .app-container { height: 100vh; height: 100dvh; max-height: 100dvh; overflow: hidden; }
main.app-main { padding-top: var(--header-h); }
.phase-card { max-height: calc(100dvh - var(--header-h) - 16px); min-height: 0; display: flex; flex-direction: column; }
.phase-card > .scroll { min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
.tap { min-width: var(--target-min); min-height: var(--target-min); }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } .floating-bg-container { display: none; } }
```
**Deleted from the reference:** the `@media (max-height: 800px)` `!important` block (replaced by token-driven spacing on `.phase-card`) and every `max-h-[9Xvh]` utility. **Never** use CSS `zoom`. `index.html` keeps `viewport-fit=cover`; header and bottom rows add `padding-bottom: env(safe-area-inset-bottom)`.

### 10.5 Accessibility implementation
Focus-visible ring token (`outline: 3px solid var(--color-gold)`); `<nav aria-label="Learning phases">`; phase pills `aria-current`; station strip `role="tablist"` with `aria-selected`; quiz options `role="radiogroup"/"radio"`; modals `role="dialog" aria-modal="true" aria-labelledby`; SVG visuals `role="img"` + `aria-label`; slider handles per §7.0; `lang="en-SG"` on `<html>`. Minimum text sizes enforced by a Tailwind safelist test (no `text-[10px]`/`text-[11px]` in `src`; `unit_tests.js` greps).

### 10.6 Test viewports
1366×768, 1440×900, 1920×1080 (Tier 1 laptop); 1024×768 and 768×1024 (Tier 1 iPad); 390×844 (Tier 2 phone); 844×390 (best effort). Reference baseline measurements (kept for regression comparison): nav capsule 929 px wide; header height 84 px (Wonder/Simulate/Practice) and 124 px (Story) at 768 px; 80 / 115 px at 390 px.

---

## 11. Build / Deploy

`npm install && npm run build` from a clean extract (verified for the reference on the blueprint stack: ✓ 49 modules, 0.96 s). Deploy on Vercel (SPA rewrite excludes `/assets/` and `/api/`). `index.html`: title **"PythagoQuest · Grade 8 Maths"**, description "Join Priya and Jun Kai at the Right-Angle Works to solve real-world jobs with Pythagoras' theorem.", OG title/description likewise, favicon present, `<html lang="en-SG">`, fonts as in the reference (Fredoka One, Nunito, Inter). README: run/build/audio/test commands, module summary, art brief (§13), no mention of browser speech. Environment variables: client `VITE_ELEVENLABS_API_KEY` (dev only), server `ELEVENLABS_API_KEY` (proxy).

---

## 12. QA Plan

### 12.1 Bank stress test (`scripts/stress_test_bank.js`, extended)
≥ **300 seeds × 100 questions = 30 000**. Per question: schema complete (no `undefined`, `null`, empty string); `options.length === 4`, all distinct; `correctAnswer ∈ options`; no `NaN`/`undefined` in the serialised question; **independent recomputation** of the answer from `visualData` (re-derive with `sum2`/`Math.sqrt`/`converse`, compare to `correctAnswer` after formatting); domain rules: whole-number items use a valid triple (`isTriple`); non-whole items are rounding-safe and say "correct to 1 decimal place" **iff** rounded; options differ by ≥ 0.2 when decimal; converse: polarity of `correctAnswer` matches `converse().isRight`, no permutation of a "not right" item is a triple, triangle inequality holds, and distractors never assert a true equation with the wrong conclusion (re-evaluate every `a² + b² = c²`-style distractor string); **per-world: 10 distinct `questionText`s (strict, not ≥ 7)**; world id 9 draws from ≥ 5 source worlds (via `visualData.sourceWorld`); `sessionQuestions` returns the right count and ascending slots for each mode, and Boss slots are 5–9. *Prototype evidence:* worlds 1, 3 and 4 passed 300 seeds × 3 worlds = 9 000 questions with 0 problems in ~0.2 s.

### 12.2 Unit tests (`scripts/unit_tests.js`, plain Node asserts)
- `speak()`: one test per rule in PRD §11.1 (the verified outputs in §8.2 are the fixtures).
- Calculator reducer (`3 x² + 8 x² = √` → 8.5440037; `√` of negative; chained ops).
- `makeReport` for 3 000 random reports × 7 error types: the faulty line is arithmetically/logically false and the correct fix true.
- Station data validation (`LADDER_CASES`, scene numbers).
- Authoring lint: no `text-[10px]`/`[11px]`, no `vh`-based max-height, no `zoom:`, no `speechSynthesis`, no `\bMOE\b` in `src/`, no variable named `m|cm|km`, every file in `components/simulations/` is imported.
- Content–visual parity: `WONDER` and each `STORY_PANELS[i].text` numbers that also feed a visual are asserted equal to the visual's data.

### 12.3 Badge test
A scripted reducer run (no UI) dispatches a path that must unlock **all 8 trigger badges and all 10 boss trophies**, and checks `bestStreak` is independent of stars.

### 12.4 Audio parity
`npm run check-audio` → every string returned by a narration helper that is not marked dynamic has an exact `audioMap` entry; `grep -r speechSynthesis src dist` returns nothing.

### 12.5 Layout audit (`scripts/layout_audit.js`, Playwright; this is the harness that was prototyped on the reference)
For each viewport in §10.6 and each phase (Intro, Wonder, Story 1/3/6, Simulate A–D, Practice map, quiz, Boss modal, Feedback overlay, Reflect recap, Reflect scorecard, Celebration): load the production preview, navigate (nav jump for phases), then assert and archive a screenshot:
1. `documentElement.scrollWidth <= innerWidth` (no horizontal page scroll);
2. header `getBoundingClientRect().right <= innerWidth` and every header button fully inside the viewport;
3. no visible element in `main` has `top < header bottom` unless it is intentionally behind it;
4. **primary CTA** (`[data-cta="primary"]`) fully inside the viewport without scrolling;
5. every `button, [role=button], [role=slider], input[type=range], a` has `width ≥ 44 && height ≥ 44` (exemptions require `data-tap-exempt`);
6. computed `font-size ≥ 13px` for every text node;
7. no console/page errors (font-CDN failures are ignored when offline).
*Reference baseline for comparison:* rules 1, 2 and 4 fail at 1024, 768 and 390 px; rule 4 fails on Wonder at 1366×768.

### 12.6 Journey walkthrough
Wonder → Story (6 panels, nav progress 1/6…6/6, final button "Enter the Workshop") → Simulate (all 4 stations completable by keyboard alone, Practice CTA gated) → Practice (map, all 4 modes, Guided hints, Timed timeout, Boss winnable and losable, badges unlock) → Reflect (recap, scorecard, reflection gate, confetti off under reduced motion) → Celebration → Restart. Zero console/page errors.

### 12.7 Build, budget, security
Clean-clone `npm install && npm run build && npm run lint`; gzip JS ≤ 120 kB (reference on this stack 108.9 kB) — add a size assertion in `layout_audit.js`; story images ≤ 250 kB each; **secret scan** (`grep -rE "sk_[a-f0-9]{20,}|xi-api-key.*[A-Za-z0-9]{20,}"` over the tree and zip) returns nothing.

### 12.8 Manual accessibility spot-check
Keyboard-only run of every station and the quiz; screen-reader pass over one station and one question; 200 % zoom at 1366×768 (nothing unreachable); contrast check of the 10 world accents on `#14082c` (≥ 4.5:1 for accent text; if a hue fails, text uses white and the accent is border-only).

---

## 13. Delivery Checklist

- [ ] Zip excludes `node_modules/`, `dist/`, `.env.local`.
- [ ] `public/assets/story/story_1.png … story_6.png` — **six** true 1024×1024 PNG placeholders (≤ 250 kB; **no duplicate `.jpg`**); `scripts/placeholder_art.js` (gradient + panel number + emoji + title) regenerates them; README contains the per-panel art brief (PRD §13).
- [ ] `README.md`, `index.html`, OG tags, `docs/audio_generation_pipeline.md` rewritten; `grep -ri "angle\|detective\|amirah\|wei jie\|place value\|MOE\|robo\|zara" src index.html README.md docs` returns only intentional matches (the word "angle" in "right angle").
- [ ] `.env.local.example` is placeholder-only; `.gitignore` covers `.env*` except the example; secret scan clean; **the previously committed key has been rotated by the owner**.
- [ ] `vercel.json`, `.oxlintrc.json`, `api/elevenlabs.js`, `public/favicon.svg` present.
- [ ] `audioMap.js` regenerated after content lock, `clean-audio` run, `check-audio` green.
- [ ] Pass logs attached: `test:bank`, `test:units`, `test:layout` (with screenshots), `build`, `lint`.
- [ ] Defect register D1–D14 (PRD §7.7) and §1.3 items each have a linked test or checklist tick.

---

## 14. Risks

| # | Risk | Mitigation |
|---|---|---|
| R1 | Blueprint dependency versions differ from the reference's tested React 18 / Vite 5 stack | **Closed:** reference builds and lints on the blueprint versions (React 19.3.0, Vite 8.3.3, framer-motion 12.43, Tailwind 3.4.19). Re-verify after the real code is written; fallback is pinning to the reference versions |
| R2 | `calcXP` formula unavailable | **Closed:** copied from the reference (`scoring.js`) |
| R3 | ElevenLabs key exposed in the client bundle / already leaked in the supplied zip | Serverless proxy; client key unset in production; rotate the exposed key; secret-scan gate |
| R4 | SVG drag maths breaks under scaling/flex layouts or off-element drags | `getScreenCTM` + pointer capture; keyboard/tap alternative on every drag; tested at all viewports |
| R5 | Generated numbers not "clean" (ugly roots, rounding disputes, duplicate/near-duplicate options) | Curated pools; rounding-safe rule; 0.2 option separation; 300-seed stress test with independent recomputation (prototype: 0 problems in 9 000 questions) |
| R6 | Spoken/on-screen drift from notation expansion | Single `speak()` used for narration and audio key; derived narration; `check-audio`; unit-test fixtures |
| R7 | **`speak()` misreads context-dependent tokens** (`m` as metres vs a variable; "10 000" vs two numbers; "3-4-5" vs subtraction) | Authoring conventions + lint (no `m|cm|km` variables, non-breaking-space thousands, hyphenated adjectival units); fixtures for each |
| R8 | Calculator-less students cannot do decimal-answer worlds; calculator allowed-or-not is a pedagogy decision | `CALCULATOR_ENABLED` flag; PRD O6; fallback re-scopes World 4 to estimate-and-choose |
| R9 | Timer semantic ambiguity (60 s per question vs whole session) changes difficulty a lot | `TIMER_SCOPE` constant; PRD O4 |
| R10 | Responsive rewrite introduces regressions in the reference's good layouts | Layout audit runs on every phase × viewport; baseline numbers from the reference recorded (§12.5, §10.6) |
| R11 | Orphan/dead code reappears (defect 1/11) | CI grep (imports of `simulations/*`), lint, "every action dispatched or deleted" review item |
| R12 | Home/✕ wipe progress (reference behaviour) | Confirmation sheet when any progress exists (kept) |
| R13 | World-unlock rule (≥ 1★ in previous world) inherited, not in the blueprint | Isolated in `UNLOCK_RULE`; PRD O3 |
| R14 | Real-world contexts may not be culturally/age appropriate or may imply unsafe behaviour (ladders, zip-lines) | Copy review by a teacher; ladder items teach the maths only and show a "ladders: ask an adult" caption in W5 *(proposed; stakeholder to confirm)* |
| R15 | Story illustration production is the long pole (6 × 1024² art) | Placeholders ship first; panels render an emoji fallback if an image 404s (reference behaviour) |
