# PythagoQuest — Grade 8 · Pythagoras' Theorem: Real-World Applications (PRD)

**Grade:** 8 (Singapore Sec 2) &nbsp;|&nbsp; **Topic:** Pythagoras' Theorem — Real-World Applications &nbsp;|&nbsp; **Module name:** PythagoQuest
**Clone source for this build:** `angle-on-line-g7-main` (the shipped AngleQuest module, supplied as the UI/UX, layout and viewport reference). This is the "newer sibling" case the TRD blueprint allows; it supersedes the default `G2-Money-Money-main`. The paired TRD (`PythagoQuest_TRD.md`) lists every file as *reuse / modify / new / do-not-clone*.
**Special instructions given:** none beyond "use the zip as the reference for UI/UX, architecture, layouts and viewports". All blueprint defaults apply. Where the reference contradicts a fixed blueprint rule, the blueprint wins (§2.2).

---

## 1. Overview

PythagoQuest is a Grade 8 module that teaches Pythagoras' theorem **through the jobs it is actually used for**: checking a ladder, building a ramp, cutting across a field, bracing a gate, hanging a zip-line, and testing whether a corner is truly square. Two apprentices, **Priya** and **Jun Kai**, work at a community repair-and-build shop called the **Right-Angle Works**, mentored by **Foreman Tally the Owl** 🦉. Every world is a job site, and every question is a job that can only be finished by finding a right-angled triangle hidden in the scene.

The five-phase **Wonder → Story → Simulate → Practice → Reflect** journey, XP / Stars / Streak / Badge gamification, the 100-question procedurally generated bank across 10 worlds, and the ElevenLabs-only narration are inherited unchanged from the Intellia Global architecture (PRD blueprint §A). What is new here is (a) a topic whose numbers are *not* naturally clean, so number generation is the main technical risk (§9.3), (b) a deliberate **viewport and layout contract** (§7) written from a measured audit of the reference build, and (c) a calculator policy (§8.8) because Grade 8 students are expected to evaluate square roots.

## 2. Background

### 2.1 Why this topic, why now
Pythagoras' theorem is the first place in lower-secondary maths where students must (1) decide *which* side is unknown before choosing an operation, and (2) evaluate square roots that are rarely whole numbers. The recurring failure modes are well known: adding the lengths instead of the squares, **adding when they should subtract** (finding a shorter side), forgetting the final square root, treating a leg as the hypotenuse, and applying the theorem to triangles with no right angle. The module is designed around those five failures. Real-world framing matters because the hardest step for students is not the arithmetic but *seeing the right-angled triangle in the scene*.

### 2.2 How the reference was used (what was adopted, what was not)
The supplied zip was unpacked, installed, built, stress-tested and rendered in a headless browser at four viewports. Findings that shape this PRD:

| Finding | Evidence | Consequence |
|---|---|---|
| The reference builds and its 30,000-question stress test passes | `vite build` OK; `npm run test:bank` → 300 seeds × 100 Qs, 0 failures | Safe base to clone. |
| The reference also builds on the blueprint's newer stack (React 19, Vite 8, framer-motion 12, Tailwind 3.4) | Clean build on those versions; `oxlint` runs | The version risk left open in the AngleQuest TRD is closed. |
| The reference has real layout defects below ~1340 px width and at 768 px height | Measured: nav capsule is 929 px wide; at 1024 px the Sound/Close buttons are pushed off-screen; Wonder's primary button is clipped at 1366×768 | Fixed by the layout contract in §7. |
| Four of the eight badges can never unlock; Station D (error detective) exists as a file but is not wired in; the story narration is a paraphrase of, not a match for, the on-screen text | Code search (§7.7 defect register) | Corrected by design here; each is an acceptance test (§14). |

**Adopted from the reference:** the dark glass-morphism visual system and design tokens; the fixed top navigation (Home · 5-phase capsule · Sound · Close) with a second row for story progress; the centred glass-card phase layout; the Story carousel with illustration + text + pull-quote + mascot bubble; the Simulate 2-column shell (station tabs left, workspace right); the Practice mode tabs + world grid + stats bar; the Boss modal; the feedback overlay; the shared UI kit (`Panel`, `Node`, `Msg`, `GoldBtn`, `GhostBtn`, slider with −/+ buttons); the seeded-RNG question generator; the stress-test harness; the ElevenLabs engine without any browser-speech fallback.

**Not adopted (defects or off-standard behaviour):** see §7.7.

## 3. Standards Alignment

Singapore lower-secondary Mathematics, Geometry & Measurement strand — **Pythagoras' theorem** (taught at Secondary 2; in school schemes of work this appears as three consecutive sections: the theorem, *applications of the theorem in real-world contexts*, and the converse).
*Source consulted:* a Singapore secondary school's published Sec 2 Express content outline (Chapter 9: "9.1 Pythagoras' Theorem · 9.2 Applications of Pythagoras' Theorem in Real-world Contexts · 9.3 Converse of Pythagoras' Theorem"), and a third-party syllabus summary listing the Sec 2 outcome as "Applying Pythagoras' theorem, determining right-angled triangles". The MOE syllabus PDF itself could not be fetched in this session; see Open Question O1.

### 3.1 Precise skills in scope
- Identify the right angle, the **hypotenuse** and the **legs** of a right-angled triangle in any orientation, including triangles hidden in real-world diagrams.
- State the theorem as **a² + b² = c²** and know it applies **only** to right-angled triangles.
- Find the hypotenuse given both legs (add the squares, take the square root).
- Find a shorter side given the hypotenuse and the other leg (subtract the squares, take the square root) and explain why it is subtraction.
- Give answers as whole numbers (Pythagorean triples) or **correct to 1 decimal place** (non-perfect-square roots).
- Recognise common triples — 3-4-5, 5-12-13, 8-15-17, 7-24-25 and their multiples — including decimal scalings such as 0.9-1.2-1.5.
- Use the **converse** to decide whether a triangle or a physical corner is right-angled.
- Model real-world situations (ladders, ramps, tent ropes, rectangle diagonals, shortcuts, east-north journeys, zip-lines) as right-angled triangles and solve **multi-step** problems (height difference first; cost per metre; compare two routes).
- Check answers for reasonableness (hypotenuse is the longest side) and for units.

### 3.2 Adjacent skills scoped out (bridge only, never tested)
- **Trigonometric ratios** (sine, cosine, tangent) — the next sub-topic. Mentioned at most as a one-line teaser in Story panel 6; never assessed.
- **Three-dimensional Pythagoras** (space diagonal of a cuboid) and the **distance formula on coordinate axes** — future modules.
- **Simplifying surds** (e.g. √72 = 6√2) — answers are whole numbers or 1 d.p. only.
- **Solving quadratic equations** from "side lengths x and x + 7" problems — out of scope; World 10 uses single-unknown items solvable in one step.
- **Proofs of the theorem** (rearrangement proofs) — Station A gives a visual *discovery*, not a formal proof.
- Angle sizes of non-right triangles. (Station A's "bend the corner" view shows that the equation stops balancing when the corner is not 90°; it names no angle types and nothing from it is tested.)

### 3.3 Domain conventions students are expected to know
- Lengths carry units; a squared length is written with squared units only in working, never in a final length answer.
- Non-whole answers are **rounded to 1 decimal place** and the question says so. *(Assumption O2: schools often say "3 significant figures"; 1 d.p. is used for MCQ clarity.)*
- Thousands are separated by a space, not a comma ("10 000").
- Diagrams in converse questions are labelled **"Not drawn to scale"** and carry **no right-angle mark** — otherwise the diagram gives the answer away.
- Square roots may be evaluated with a calculator (§8.8).

## 4. Learning Objectives

By the end of this module, a student should be able to:

1. **Identify** the right angle, hypotenuse and legs of a right-angled triangle, in any orientation and in real-world diagrams (ladder–wall–ground, ramp, rectangle diagonal).
2. **State and use** a² + b² = c² to find the hypotenuse given two legs, recognising when the answer is a whole number.
3. **Find a shorter side** given the hypotenuse and the other leg, and explain why the squares are subtracted.
4. **Recognise Pythagorean triples** (3-4-5, 5-12-13, 8-15-17, 7-24-25 and multiples, including decimal scalings) and use them to check or speed up work.
5. **Apply the converse** to decide whether a triangle or a physical corner is right-angled, naming the comparison made.
6. **Model** real-world situations — ladders, ramps, ropes, diagonals, shortcuts, east-north journeys — as right-angled triangles by drawing and labelling a diagram before calculating.
7. **Solve multi-step** real-world problems that need Pythagoras plus another step (subtract heights, multiply by a cost per metre, compare two routes).
8. **Interpret and evaluate** answers: check that the hypotenuse is the longest side, give correct units, round to 1 d.p., and decide "does it fit?".

*(Ordering: recall → single-step application → comparison/reasoning → composite/multi-step → real-world word problems. It drives both the Story panel sequence (§8.3) and the world sequence (§9).)*

## 5. Inherited Standards (copied from PRD blueprint §A — not re-derived)

- **Five-phase architecture:** Wonder → Story → Simulate → Play (labelled "Practice" in the UI) → Reflect.
- **Gamification:** XP per question (attempts / hints / streak-weighted); Stars 0–3 per world (9–10 correct = 3★, 7–8 = 2★, 5–6 = 1★, below = 0★); continuous streak; 8 fixed badge triggers (relabelled, §10); Boss Battles (5 questions, 3 lives, one per world, 10 total).
- **Practice modes:**

| Mode | Questions | Hints | Timed | Lives |
|---|---|---|---|---|
| Guided Practice | 5 | Yes | No | No |
| Independent Practice | 10 | No | No | No |
| Timed Challenge | 8 | No | Yes (60 s — see O4 for how the timer is scoped) | No |
| Boss Battle | 5 | No | No | Yes (3) |

- **Audio:** ElevenLabs "Alice" (`Xb7hH8MSUJpSbSDYk0k2`), `eleven_multilingual_v2`, six style presets; pre-generated static `.mp3`s for all known text; dynamic ElevenLabs generation only for procedurally varying text; **no browser Web Speech fallback under any circumstance**; strict 1:1 spoken/on-screen parity; every symbol and unit spoken in full natural language (§11).
- **Question bank:** 10 worlds × 10 questions = 100, procedurally generated from templates and stress-tested (≥ 300 randomised runs, zero malformed); fixed schema `{ id, districtId, category, visual, questionText, options[4], correctAnswer, explanation, hint1, hint2, visualData }`; World id 9 is always mixed review / grand finale.
- **Product standards:** React / Vite / Tailwind / Framer Motion; pixel-faithful dark glass-morphism per `design-tokens.css`; Fredoka One / Nunito fonts; enlarged fonts and touch targets in Simulate and Practice; surgical reuse of every non-topic-specific reference file; zip delivery excluding `node_modules` and `dist`, with placeholder story art plus an art-brief README.

## 6. Module Identity

- **Name:** **PythagoQuest** (follows `{Topic}Quest`; distinct from existing LineQuest / AngleQuest).
- **Story theme:** *The Right-Angle Works* — a community repair-and-build shop. Grade 8 suits a project / apprenticeship setting: each world is a job site, each question a job card. Settings are recognisably Singapore (school field, HDB-estate void deck and ramps, playground, MRT-side footpaths) without using any real brand or named location.
- **Characters** (Singaporean-multicultural naming, first names only, per blueprint default; no override requested): **Priya** (measures everything twice) and **Jun Kai** (always looks for the shortcut). *Proposed defaults — see O5 on whether to reuse Amirah and Wei Jie from AngleQuest as a continuing cast.*
- **Mascot:** **Tally the Owl** 🦉 retained, restyled as **Foreman Tally** — hard hat and a set-square clipped to his wing. A light reskin, not a mascot swap: the "wise mentor" role carries over and keeps the Intellia family consistent.

## 7. UX, Layout & Viewport Contract (derived from the reference zip)

This section turns the reference's *actual* behaviour — measured, not assumed — into requirements. It is the main reason a Grade 8 module built on this reference will be usable on school laptops, iPads and phones.

### 7.1 App shell anatomy (inherited)
- **Root:** `.app-container` — full-viewport flex column on the cosmic gradient (`--bg-cosmic`) with a darkening overlay; the only scrolling regions are *inside* cards.
- **TopNav (fixed header, hidden on the Intro screen):** Home pill (left) · 5-phase capsule `01 Wonder · 02 Story · 03 Simulate · 04 Practice · 05 Reflect` (centre; active pill is filled, others ghost; any phase can be jumped to) · Sound pill (green "Sound On" / red "Muted") and ✕ (right). During Story a **second row** shows a progress bar and "Job Card n of 6". Home and ✕ ask for confirmation if any progress exists.
- **Main:** `main.app-main { padding-top: var(--header-h) }` where `--header-h` is the *measured* header height (`ResizeObserver`), so content never sits under the header whatever its height.
- **Phase colours:** Wonder `#c084fc` · Story `#fb923c` · Simulate `#38bdf8` · Practice `#4ade80` · Reflect `#818cf8`; each phase card opens with a short glowing **phase band** in its colour.
- **Cards:** glass cards centred in `main`, widths: Wonder `max-w-2xl` (672 px), Story `max-w-5xl` (1024), Simulate and Practice `max-w-6xl` (1152), Reflect `max-w-4xl` (896). Floating faint maths symbols sit behind every phase (re-skinned for this topic: `a² + b² = c²`, `√`, `3-4-5`, `90°`, `c`, `∟`).
- **Type & buttons:** headings Fredoka One, body Nunito; primary CTA is the gold gradient pill (`btn-gold`); secondary is a ghost pill (`btn-secondary`).

### 7.2 Supported devices and viewports

| Tier | Device class | Test viewports (CSS px) | Commitment |
|---|---|---|---|
| **1** | School laptop / Chromebook | 1366×768 · 1440×900 · 1920×1080 | Everything fully visible and usable; primary CTA never clipped |
| **1** | iPad landscape | 1024×768 | Same as laptop; nav compacted; Simulate stacks |
| **1** | iPad portrait | 768×1024 | Single-column phase layouts; nav compacted |
| **2** | Phone portrait | 390×844 | Fully usable; single column; stations scroll vertically |
| **2** | Phone landscape | 844×390 | Best effort: usable with inner scrolling; a one-line "turn your phone sideways or use a larger screen for the labs" hint is shown in Simulate |

*Short laptop screens (≤ 768 px tall) are the most common school device and the reference's weakest case; they are Tier 1 and are tested first.*

### 7.3 Layout rules (apply to every screen)
1. **Primary navigation is never clipped.** "Begin", "Next / Back", "Enter the Workshop", "Go to Practice", "Complete Station", "Next Question" and "Complete Mission" must be visible **without scrolling** at every Tier 1 viewport. Where content is taller than the space, the card's *content* scrolls internally and the CTA stays outside or sticky at the bottom of the card.
2. **No clipped content.** Cards use `max-height: calc(100dvh − var(--header-h) − 16px)` (dynamic viewport units, never `vh`) and `min-height: 0` flex children with `overflow-y: auto`; nothing relies on `overflow: hidden` to hide overflow.
3. **Header never overflows.** The nav is *responsive*, not just shrinkable (§7.4).
4. **Touch targets ≥ 44 × 44 px; no body or label text below 13 px.** Slider −/+ buttons, station tabs, option cards, close buttons and world cards all meet this.
5. **Safe areas:** `viewport-fit=cover` plus `env(safe-area-inset-*)` padding on the header and bottom navigation rows (notched phones, iPads in landscape).
6. **Reduced motion:** every animation honours `prefers-reduced-motion`; the floating background symbols stop; confetti is skipped.
7. **Numbers in diagrams must equal numbers in copy** (reference defect D8: Wonder text said 132° but the diagram drew 135°). Every visual is generated from the same data object as the text it accompanies.

### 7.4 Responsive behaviour by screen

Three layout classes are used: **Wide** ≥ 1180 px, **Medium** 768–1179 px, **Phone** < 768 px. Two components need their own thresholds, measured from the reference: the **full-label nav needs ≥ 1360 px** (its capsule alone is 929 px and the right-hand controls ~190 px), and the **Story 2-column layout needs ≥ 900 px**.

| Screen | Wide (≥ 1180) | Medium (768–1179) | Phone (< 768) |
|---|---|---|---|
| **TopNav** | ≥ 1360: full labels (Home pill · capsule · Sound pill · ✕). 1180–1359: capsule shows **icon + number**, the active pill also shows its label; Home/Sound keep labels | Capsule = icon + number, active pill labelled; Sound pill collapses to icon; header never exceeds the viewport | Row 1: Home (icon + label) · Sound (icon) · ✕. Row 2: phase capsule, icons + numbers, active labelled. Story progress is row 3. Header height is measured, so layouts adapt |
| **Intro** | Centred column, journey flow card, 3 feature cards | Same, tighter spacing | Feature cards stack 1-up; journey flow wraps 3 + 2 |
| **Wonder** | One card: diagram + headline numbers + body + Tally bubble + CTA | Same; the diagram shrinks first | Diagram 140 px tall; Tally bubble above the CTA; CTA sticky |
| **Story** | 2-column: illustration left, scrolling text right; Back · dots · Next row below | 2-column ≥ 900 px; below that **stacked**: illustration (≤ 38 dvh) above scrolling text with the mascot bubble inside the scroll area | Stacked; illustration ≤ 30 dvh; Back / Next become short labels ("← Back", "Next →"); dots replaced by a "3 / 6" counter |
| **Simulate** | 12-column grid: station tabs (4 cols) · workspace (8 cols) | **Stacked**: station tabs become a horizontal 4-segment strip (icon + letter A–D + status chip) above the workspace; full station name in the workspace header | Stacked; strip scrolls horizontally; workspace scrolls vertically; landscape hint shown |
| **Practice — map** | 5 × 2 world grid; mode tabs in one row | 5 × 2 at ≥ 1024 px, otherwise 2 × 5; mode tabs wrap to 2 × 2 below 900 px | 2 × 5 grid; mode tabs 2 × 2; stats bar wraps |
| **Practice — quiz** | Question, diagram (≤ 32 dvh), 2 × 2 options | Same | Options 1 × 4; diagram ≤ 26 dvh; stats pills collapse to one "🔥 3 · ✨ 120 XP" chip |
| **Boss modal / Feedback / Badges** | Centred modals (`max-w-lg` / `2xl`) | Same | Bottom sheets: full width, `max-h` 85 dvh, internal scroll |
| **Reflect** | Recap card → scorecard (3 tiles + 10-world strip) → textarea → CTA | Same | Tiles stay 3-up but compact; world strip 5 × 2; textarea full width |

### 7.5 Interaction rules shared by the Simulate stations
Every drag has a keyboard/tap equivalent (−/+ buttons ≥ 44 px, `←/→` on the focused handle, `Shift` = larger step). Pointer maths uses `getScreenCTM().inverse()` and **pointer capture** (`setPointerCapture`) so a drag that leaves the SVG does not stall (reference stations track `pointermove` on a wrapper only). Live results are announced in an `aria-live="polite"` region. No `zoom:` CSS anywhere.

### 7.6 Performance and payload budgets
Initial JS ≤ 120 kB gzip (reference on the blueprint stack: 108.9 kB). Story images ≤ 250 kB each, delivered **once** per panel (the reference ships every image twice, as `.png` and `.jpg`, 9.2 MB total, and the `.png` files are actually JPEG data). Pre-generated audio is lazy-loaded per phase.

### 7.7 Defect register — what the reference does wrong and this module must not inherit

| # | Defect found in the reference (evidence) | Required behaviour here |
|---|---|---|
| D1 | **Header overflows below ~1340 px.** Capsule is 929 px wide. At 1024 px the Sound and ✕ buttons are off-screen and "Reflect" is cut; at 768 px the capsule spans 161→1090 px; at 390 px, 135→861 px | Responsive nav (§7.4); header fits at all viewports |
| D2 | **Wonder's CTA is clipped at 1366×768** and the card's top (phase label) sits under the header | Rule 7.3-1; internal scroll + sticky CTA |
| D3 | Story: mascot bubble row clipped at 1366×768 and 1024×768; title clipped at 1024×768 | Text column scrolls inside the card; nothing clipped |
| D4 | Story on phone: body text begins mid-sentence, pull-quote clipped, "Next Case Clue" wraps to three lines and runs off the right edge | Stacked layout; short button labels; counter |
| D5 | Simulate at 768–1024 px: station-tab text runs underneath the workspace panel (missing `min-w-0`, sidebar too narrow); 🔓 icon overlaps long names | Stack below 1280 px; tabs truncate; status shown as a labelled chip |
| D6 | Card heights use `vh` (`max-h-[94vh]`, `92vh`, `90vh`) inside a `100dvh` shell | `dvh` throughout |
| D7 | Touch/label sizes below standard: −/+ buttons 32 px, station sub-labels 11 px, world-card labels 10 px | §7.3-4 |
| D8 | Content/diagram mismatch (132° text vs 135° diagram) | §7.3-7; automated check (§14) |
| D9 | Station D (error detective) exists as `CaseFileDetective.jsx` but is **never imported**; the shipped Station D is a different lab | All four blueprint archetypes wired, no orphan files |
| D10 | **Only 4 of 8 badges can unlock** (first-correct, 5-streak, 10-streak, journey). The badge check is given a partial state and reads `totalCorrect` / `totalAnswered` from a *function* prop (always `undefined`), so "20 answered", "all stations", "3-star world" and "boss won" never fire; per-world boss reward badges are never granted | Badge engine receives the full reducer state; scripted test unlocks all 8 + 10 boss rewards (§14) |
| D11 | Story narration is a hand-written paraphrase of the on-screen text, so spoken ≠ shown | Narration is derived from the same fields as the screen text (§11.2) |
| D12 | Real ElevenLabs API key committed in `.env.local.example`; `.gitignore`'s `*.local` does not match `.env.local.example` | Placeholder only; key rotated by the owner (§15 O9); pre-delivery secret scan |
| D13 | Dead code and dead dependencies: `ADVANCE_SIM_STATION` hard-codes `3`; reducer actions `NEXT_STORY_PANEL`, `LOAD_QUESTIONS`, `UNLOCK_BADGE` unused; `useViewport` unused; `framer-motion` and `lucide-react` listed but never imported; `/api/elevenlabs` fetched but no such function ships | Derive counts from constants; wire or remove; no unused dependencies; serverless proxy shipped (TRD §8.4) |
| D14 | The "100-question bank" is not a bank: Play calls the generator per session, so Guided Practice always uses template slots 0–4 | Sessions sample *spread* slots from a seeded per-world set of 10 (§9.4) |

## 8. Five-Phase Journey Detail

### 8.1 Intro screen
Pill "✨ Grade 8 · Geometry & Measurement" · title **Pythagoras' Theorem** / *in the Real World* · mascot avatar 📐 with the speech pill "Ready to build it right? 🎉" · subtitle "Join Priya and Jun Kai at the Right-Angle Works to measure ladders, ramps, shortcuts and diagonals — without ever picking up a tape measure." · the five-phase **Your Learning Journey** flow card · 🚀 **Begin Your Journey!** · three feature cards (**Real Jobs** — ladders, ramps & shortcuts · **Simulations** — interactive labs · **10 Game Worlds** — XP & awards). *No curriculum-body claims appear in on-screen copy (TRD blueprint §1.5).*

### 8.2 Wonder — "The Mystery of the Shortcut"
A single hook screen. Visual: a top-down school field, 60 m × 80 m, Priya's route along two edges (dashed, labelled **60 m** and **80 m**), Jun Kai's straight route across (solid, labelled **?**). Headline numbers: **"Edges: 60 m + 80 m = 140 m · Shortcut = ?"**
Body: *"Priya follows the edges of a 60 m by 80 m school field. Jun Kai cuts straight across the middle. Can we find out how long his shortcut is without walking it?"*
Tally's question: **"What if you could measure a path you never walked?"** · CTA **Open the Job Cards →**.
*Content QA:* the diagram, headline and body are generated from `{ legA: 60, legB: 80 }`; the answer (100 m) is revealed only in Story panel 3.

### 8.3 Story — 6 panels
The reference build also used 6 panels; the default is 4. Pythagoras needs staged build-up (vocabulary → discovery of the rule → two different uses of it → converse → a working method), so **6 panels** are used. *Build note for the TRD:* panel-count logic must read `STORY_PANELS.length`; the reference already does in `StoryPhase` and in the reducer's `NEXT_STORY_PANEL`.

| # | Title | Concept delivered | On-screen text (spoken verbatim after notation expansion, §11) | Pull-quote (`highlight`) | Speaker · bubble |
|---|---|---|---|---|---|
| 1 | The Shortcut Problem | Right triangle in a real scene; **legs** and **hypotenuse** | "At the Right-Angle Works, apprentices Priya and Jun Kai race across their school field, which is 60 m long and 80 m wide. Priya follows the two edges. Jun Kai cuts straight across. The two edges that meet at the corner are the legs. The straight shortcut, opposite the right angle, is the hypotenuse." | "The hypotenuse is the longest side of a right-angled triangle, opposite the right angle." | Jun Kai 👦 · "I only walked the hypotenuse, and I still got here first!" |
| 2 | Squares on the Sides | Discover **a² + b² = c²** with tiles | "Foreman Tally lays square tiles on the sides of a triangle with legs 3 m and 4 m. The 3 m square holds 9 tiles and the 4 m square holds 16 tiles. The square on the hypotenuse holds exactly 25 tiles, and 9 + 16 = 25." | "In a right-angled triangle, a² + b² = c², where c is the hypotenuse." | Foreman Tally 🦉 · "Add the two small squares and you get the big square. Every time!" |
| 3 | Finding the Longest Side | Hypotenuse: square, add, square root; whole-number and 1 d.p. answers | "Square each leg, add them, then take the square root. Field: 60² + 80² = 3600 + 6400 = 10 000, so the shortcut is √10 000 = 100 m. Priya walked 140 m, so Jun Kai saved 40 m. If the root is not a whole number, use a calculator and round to 1 decimal place: √73 ≈ 8.5." | "Hypotenuse: square the legs, add, then take the square root." | Priya 👧 · "Square, add, square root. Three moves and the shortcut is solved!" |
| 4 | Finding a Shorter Side | Leg: **subtract** the squares | "A 13 m ladder leans against a wall with its foot 5 m from the wall. The ladder is the hypotenuse, so subtract: 13² − 5² = 169 − 25 = 144, and the height is √144 = 12 m. To find a leg, the hypotenuse goes first, and you subtract." | "Shorter side: take the other leg's square away from the hypotenuse's square." | Jun Kai 👦 · "If I added, the wall would be taller than the ladder. Impossible!" |
| 5 | Is the Corner Square? | **Converse**; Pythagorean triples | "Builders check a corner with a 3-4-5 rope: 30 cm and 40 cm along the two edges, and 50 cm across between the marks. Since 30² + 40² = 900 + 1600 = 2500 = 50², the corner is a right angle. This is the converse of Pythagoras' theorem. Triples such as 3-4-5, 5-12-13, 8-15-17 and 7-24-25, and their multiples, are worth remembering." | "If a² + b² = c² for the longest side c, the triangle has a right angle." | Priya 👧 · "No protractor needed. Just three measurements and a little arithmetic!" |
| 6 | Build It Right | The four-move method; hand-off to Simulate; one-line trigonometry teaser (not tested) | "Every real-world job follows the same four moves. First, draw the right-angled triangle and label it. Second, decide: is the unknown side the hypotenuse or a leg? Third, calculate: add the squares for a hypotenuse, subtract for a leg. Fourth, check: is the hypotenuse the longest side, and are the units right? Now step into the Workshop!" | "Draw it, label it, calculate it, check it." | Foreman Tally 🦉 · "Hard hats on, apprentices. The Workshop is open!" |

Each panel carries an illustration (§13), a `Job Card n of 6` label, the pull-quote pill with ✨ ends, and the speaker bubble. The final button reads **Enter the Workshop →**; the others **Next Job Card →**.

### 8.4 Simulate — "Right-Angle Workshop · 4 Training Stations"
Layout (§7.4): station tabs + workspace, "Station n of 4" chip, **Go to Practice Phase! →** gated on all four complete (with "n/4 complete" helper text). Tabs show a labelled status chip (**To do / Done ✓**) rather than the reference's ambiguous 🔓 icon. The four stations follow the blueprint's archetype heuristic and share the contract `onComplete`, `audioEnabled`, self-contained state, SVG visuals themed by CSS variables, a **Complete Station ✓** success panel, and keyboard/tap equivalents for every drag.

**Station A — "Square Lab" 📐 (Concept Discovery Lab).**
*Premise:* "Build real squares on the three sides of a right-angled triangle and watch the areas add up."
*Manipulates:* two sliders (leg a and leg b, 1–12, step 1, with −/+ buttons) resize a right-angled triangle; a toggle **Bend the corner** unlocks a third slider for the angle between the legs (60°–120°, step 5°).
*Live feedback:* squares are drawn on each side with a **unit-tile grid** (for whole-number sides the tiles can be counted); a readout shows **a² + b² = c²** with values, e.g. **9 + 16 = 25, so c = 5**; when c is not whole, the readout shows **c ≈ 8.5**. In *Bend the corner* mode the readout switches to a comparison chip **a² + b² ◀ = ▶ c²** that balances **only at exactly 90°**.
*Completion gate:* explore ≥ 3 distinct (a, b) pairs **including at least one non-triple**; use *Bend the corner* to see all three states (less / equal / greater) at least once; then answer the confirmation question **"In a right-angled triangle, the area of the square on the hypotenuse equals…"** → *the sum of the areas of the squares on the other two sides* (distractors: the sum of the other two sides; the product of the other two sides; double the longer side). Wrong → message + retry, no penalty.

**Station B — "Ladder Rescue" 🪜 (Build-to-Target Challenge).**
*Premise:* "The window is at a fixed height. Slide the foot of the ladder to the right distance so the top just reaches it."
*Manipulates:* the distance **d** of the ladder's foot from the wall (slider with −/+; step 1 m; max = ladder length − 1).
*Live feedback:* the ladder redraws in real time; the readout shows **d² + h² = L²** with `h` solved live; a window marker shows the target height. The top of the ladder glows **amber within ±1 m** of the window, **green on an exact hit**. *"Check"* accepts exact only; the tolerance band is visual guidance. An attempts counter encourages **calculate first, then set the slider**; a first-try hit earns a ⭐ shown on the success panel (cosmetic).
*Cases (whole-number triples, ladder ≤ 30 m):* (L, target h) = (13, 12), (10, 8), (17, 15), (25, 24), (15, 12), (26, 24); three are drawn per session, never the same twice in a row.
*Completion gate:* **3 exact hits**, each after pressing **New ladder**.

**Station C — "Zip-Line Designer" 🚡 (Multi-Step / Composite Construction Challenge).**
*Premise:* "Real designs need more than one step. Build each design one step at a time and watch the drawing grow."
*Manipulates:* picks answers in a three-step build per scene: (1) **find the helper value** (e.g. the height *difference* between tower and pole), (2) **choose the correct equation** from three, (3) **calculate the final value** (and, in two scenes, a cost).
*Live feedback:* after step 1 the dotted legs and their labels appear; after step 2 the right-angle mark and the hypotenuse highlight; after step 3 the line animates with its length; a correct choice fills green with a one-line reason; a wrong choice shakes and shows a hint without penalty.
*Scene templates (4; two are drawn per session):*
 1. **Zip-line** — tower 20 m, pole 8 m, 16 m apart → drop 12 m → length **20 m**.
 2. **Gate brace** — gate 1.5 m × 2.0 m, brace costs $18 per metre → diagonal 2.5 m → **$45**.
 3. **Roof rafter** — half-span 12 m, rise 5 m → rafter 13 m; two rafters → **26 m** of timber.
 4. **Two-leg route** — walk 8 m east and 15 m north to a flag, then 17 m straight back → "Is the route back along the hypotenuse?" (checks 8² + 15² = 17²) → saves **6 m** vs the way out.
*Completion gate:* two scenes finished, **using at least one scene with a subtraction step and one with a cost / total step** (the UI tracks which it served).

**Station D — "Site Inspector" 📋 (Error-Detective).**
*Premise:* "A trainee's worked report has exactly one mistake. Find it and fix it."
*Manipulates:* a four-line worked card (**Given · Equation · Working · Answer**); the student **taps the faulty line**, then **chooses the corrected line** from three options.
*Seeded error types (each realistic, each generated so the "wrong" line is provably wrong and the correction provably right):* E1 add-instead-of-subtract when finding a leg · E2 forgot the final square root · E3 hypotenuse treated as a leg (or vice-versa) · E4 squaring slip (e.g. 5² = 10) · E5 added the lengths instead of the squares · E6 converse concluded from the wrong comparison · E7 rounding slip (8.544 → 8.6).
*Live feedback:* the chosen line highlights red/green; a one-sentence explanation names the misconception.
*Completion gate:* **3 cases, each a different error type**, drawn so that E1 or E5 and E6 always appear.

### 8.5 Practice (Play)
Unchanged mechanics (§5): mode tabs (Guided · Independent · Timed · Boss), a 10-world map where **world n unlocks when world n−1 has ≥ 1★** (reference behaviour; O3), stats bar (**⭐ n / 30** · **🎖️ badges** · XP · streak), the Boss intro modal, the feedback overlay showing the explanation and any badge earned. Copy: header "Practice Job Sites"; sub-line "10 worlds · Need 1★ in World n to unlock World n+1"; correct-answer title "Job done! 🎯"; wrong-answer title "Not quite — check the diagram 🔍". The **calculator** (§8.8) is available from a 🧮 button in the quiz header.
*Timer scope:* see O4. *Session sampling:* §9.4.

### 8.6 Reflect — "Site Debrief & Scorecard"
1. **Three-question recap** (targets the module's core misconceptions — which side is the hypotenuse, add vs subtract, and what the converse compares; Station D targets the same ones). Questions are fixed:
 1. *"In a right-angled triangle, which side is the hypotenuse?"* → **The longest side, opposite the right angle** / The shortest side / Any side that touches the right angle / The side at the bottom.
 2. *"A 10 m ladder reaches 8 m up a wall. To find how far its foot is from the wall, Jun Kai calculates √(10² + 8²). What is wrong?"* → **He should subtract: √(10² − 8²) = 6 m, because the ladder is the hypotenuse** / He should multiply the two numbers / He should add the lengths: 10 + 8 / Nothing is wrong.
 3. *"A corner has marks 9 cm and 12 cm along its edges, and 16 cm between the marks. Is it a right angle?"* → **No, because 9² + 12² = 225, which is not equal to 16² = 256** / Yes, because 9 + 12 > 16 / Yes, because 9² + 12² = 16² / No, because 16 is not a multiple of 9.
2. **Scorecard:** Total XP · ⭐ n / 30 · Best streak · 10-world star strip · badges earned.
3. **Reflection:** "Explain to Foreman Tally how you know whether to add or subtract the squares:" with placeholder "Dear Foreman Tally, to find a hypotenuse I add the squares because…" (≥ 10 characters to enable **Complete Site Mission! 🎖️**).
4. **Celebration screen** with confetti (skipped under reduced motion): "Chief Site Engineer!" — "You've mastered Pythagoras' theorem — finding hypotenuses, finding shorter sides, testing for right angles and solving real-world jobs across all 10 worlds!" · Total XP · Total Stars · **Build Again 🚀**.

### 8.7 Home / Close behaviour
Home and ✕ ask "Return Home? Your progress this session will be reset." whenever any XP, star or badge exists (reference behaviour, kept).

### 8.8 Calculator policy
Grade 8 students are expected to evaluate square roots. A small **Tally's Calculator** 🧮 (digits, + − × ÷, **x²**, **√**, =, clear; immediate-execution, no parentheses) is available in Practice and in Station B and C, on by default (`CALCULATOR_ENABLED`). It is a convenience, not a solver: it has no memory of the question. *(O6: confirm with stakeholders that a calculator is allowed at this level.)*

## 9. World & Question Bank

### 9.1 Ten worlds (foundational → applied; id 9 is the mixed-review grand finale)

| id | Name | Emoji | Accent | `conceptFocus` | Description | Boss · emoji · reward badge |
|---|---|---|---|---|---|---|
| 0 | Spotter's Lookout | 🔭 | `#f472b6` | `identify-sides` | Spot the right angle, hypotenuse and legs in real scenes. | Mix-Up Max · 🎭 · "Side Spotter" |
| 1 | Hypotenuse Harbour | ⚓ | `#38bdf8` | `find-hypotenuse-whole` | Find the longest side when both legs are known (whole-number triples). | Add-It-Up Sid · ➕ · "Harbour Hero" |
| 2 | Missing-Leg Mountain | ⛰️ | `#4ade80` | `find-leg-whole` | Find a shorter side from the hypotenuse and the other leg. | Backwards Bruno · 🔄 · "Leg Finder" |
| 3 | Round-It-Right Reef | 🪸 | `#fb923c` | `decimal-answers` | Square roots that aren't whole: answers to 1 decimal place. | Round-Off Rex · 🦖 · "Precision Pro" |
| 4 | Square-Corner Site | 🧱 | `#fbbf24` | `converse-square-check` | Is the corner a true right angle? Test with the converse. | Wonky Walt · 🏚️ · "Square Corner Certified" |
| 5 | Ramp & Ladder Row | 🪜 | `#2dd4bf` | `ladders-ramps` | Ladders, ramps, slides and tent ropes as right-angled triangles. | Slippery Sam · 🛝 · "Ladder Legend" |
| 6 | Fit-It Factory | 📺 | `#818cf8` | `diagonals-fit` | Diagonals of doors, screens, trays and gates — will it fit? | Cut-Corner Carl · ✂️ · "Perfect Fit" |
| 7 | Shortcut City | 🚶 | `#e879f9` | `shortcuts-distance` | Compare the long way round with the straight-line shortcut; east-north journeys. | Detour Dan · 🚧 · "Shortcut Champion" |
| 8 | Zip-Line Park | 🚡 | `#c084fc` | `multi-step` | Two-step jobs: heights, costs and totals. | Tangle-Wire Tobias · 🧵 · "Multi-Step Master" |
| 9 | Blueprint Tower | 🏗️ | `#f43f5e` | `mixed-review` | Hardest boss; mixes every question type from worlds 1–9, plus reasonableness checks. | The Grand Contractor · 🎩 · "Blueprint: APPROVED" |

*The UI numbers worlds 1–10 (W1…W10); ids 0–9 are internal.* Colour is never the only carrier of a world's identity — every card also shows its emoji, name and boss. *(Mapping to objectives: W1→LO1 · W2→LO2, 4 · W3→LO3, 4 · W4→LO2, 3, 8 · W5→LO5, 4 · W6→LO6 · W7→LO6, 8 · W8→LO6, 7 · W9→LO7 · W10→all.)*

### 9.2 Sample questions (illustrative; every number below was recomputed independently in code)

| World | Question | Options (✔ correct) | Reasoning shown in `explanation` |
|---|---|---|---|
| 0 | "A 5 m ladder leans against a vertical wall on level ground. Which part of the wall–ground–ladder triangle is the hypotenuse?" | ✔ The ladder · The wall · The ground · The corner where the wall meets the ground | The hypotenuse is opposite the right angle (wall meets ground); that is the ladder, the longest side. |
| 0 | "The sides of a right-angled triangle are 9 cm, 12 cm and 15 cm. Which equation is correct?" | ✔ 9² + 12² = 15² · 9² + 15² = 12² · 12² + 15² = 9² · 9² = 12² + 15² | 81 + 144 = 225 = 15²; the hypotenuse (longest side) is on its own. |
| 1 | "A rectangular school field is 60 m long and 80 m wide. How long is the diagonal path?" | ✔ 100 m · 140 m · 10 000 m · 52.9 m | 60² + 80² = 3600 + 6400 = 10 000; √10 000 = 100 m. (140 = added lengths; 10 000 = forgot √; 52.9 = subtracted.) |
| 2 | "A 13 m ladder leans against a wall with its foot 5 m from the wall. How high up the wall does it reach?" | ✔ 12 m · 13.9 m · 8 m · 144 m | 13² − 5² = 169 − 25 = 144; √144 = 12 m. (13.9 = added instead; 8 = subtracted lengths.) |
| 2 | "A 25 m wire is fixed to the top of a pole and to the ground 7 m from the pole's base. How tall is the pole?" | ✔ 24 m · 26 m · 18 m · 576 m | 25² − 7² = 625 − 49 = 576; √576 = 24 m. |
| 3 | "A ramp rises 3 m and covers a horizontal distance of 8 m. How long is the sloping surface? Give your answer correct to 1 decimal place." | ✔ 8.5 m · 11 m · 73 m · 7.4 m | 3² + 8² = 73; √73 = 8.544… ≈ 8.5 m. |
| 3 | "A 10 m rope is tied from the top of a 7 m pole to the ground. How far from the base of the pole is the rope fixed? Give your answer correct to 1 decimal place." | ✔ 7.1 m · 12.2 m · 3 m · 51 m | 10² − 7² = 51; √51 = 7.14… ≈ 7.1 m. |
| 4 | "Priya marks 30 cm along one edge of a corner and 40 cm along the other, and measures 50 cm between the marks. Is the corner a right angle?" | ✔ Yes, because 30² + 40² = 50² · No, because 30 + 40 is more than 50 · No, because 50² is greater than 30² · Cannot tell without a protractor | 900 + 1600 = 2500 = 50², so the converse says it is right-angled. |
| 4 | "A triangle has sides 7 cm, 24 cm and 26 cm. Is it right-angled?" *(diagram: not drawn to scale, no right-angle mark)* | ✔ No — 7² + 24² = 625, but 26² = 676 · Yes — 7² + 24² = 26² · Yes — 7 + 24 is greater than 26 · Yes — 26² − 24² = 7² | 49 + 576 = 625 ≠ 676; the test uses the longest side as c. |
| 5 | "A wheelchair ramp rises 0.9 m over a horizontal distance of 1.2 m. How long is the sloping surface?" | ✔ 1.5 m · 2.1 m · 0.8 m · 2.25 m | 0.9² + 1.2² = 0.81 + 1.44 = 2.25; √2.25 = 1.5 m (a 3-4-5 triple scaled by 0.3). |
| 5 | "A tent rope 2.5 m long is fixed to the top of a 2.4 m pole. How far from the pole's base is the rope pegged?" | ✔ 0.7 m · 3.5 m · 0.1 m · 0.49 m | 2.5² − 2.4² = 6.25 − 5.76 = 0.49; √0.49 = 0.7 m (7-24-25 scaled by 0.1). |
| 6 | "A rectangular tray is 1.2 m long and 0.5 m wide. What is the longest straight rod that can lie flat on it?" | ✔ 1.3 m · 1.7 m · 1.1 m · 1.69 m | 1.2² + 0.5² = 1.69; √1.69 = 1.3 m (5-12-13 scaled by 0.1). |
| 6 | "A rectangular door frame is 0.9 m wide and 2.0 m high. What is the length of its diagonal, correct to 1 decimal place?" | ✔ 2.2 m · 2.9 m · 1.8 m · 4.81 m | 0.9² + 2.0² = 4.81; √4.81 = 2.19… ≈ 2.2 m. |
| 7 | "Priya walks 60 m along one edge of a field, then 80 m along the next. Jun Kai walks straight across. How much shorter is Jun Kai's route?" | ✔ 40 m · 100 m · 20 m · 140 m | Shortcut 100 m; 140 − 100 = 40 m (two steps). |
| 7 | "A boat sails 12 km east and then 5 km north. How far is it from its start in a straight line?" | ✔ 13 km · 17 km · 7 km · 169 km | 12² + 5² = 169; √169 = 13 km. |
| 8 | "A zip-line runs from the top of a 20 m tower to the top of an 8 m pole standing 16 m away on level ground. How long is the zip-line?" | ✔ 20 m · 25.6 m · 17.9 m · 28 m | Drop = 20 − 8 = 12 m; 12² + 16² = 400; √400 = 20 m. (25.6 used 20 as the leg; 17.9 used 8.) |
| 8 | "A rectangular gate is 1.5 m wide and 2.0 m high. A diagonal brace costs $18 per metre. What does the brace cost?" | ✔ $45 · $63 · $36 · $112.50 | 1.5² + 2.0² = 6.25; √6.25 = 2.5 m; 2.5 × 18 = $45. |
| 9 | "A 17 m ladder leans on a wall and reaches 15 m up. How far is its foot from the wall?" | ✔ 8 m · 22.7 m · 2 m · 64 m | 17² − 15² = 64; √64 = 8 m. |
| 9 | "A student says the hypotenuse of a right-angled triangle with legs 5 cm and 12 cm is 7 cm. How can you tell it is wrong without recalculating?" | ✔ The hypotenuse must be longer than both legs · 7 is an odd number · The hypotenuse must equal 5 + 12 · The hypotenuse must be shorter than both legs | The hypotenuse is the longest side (correct answer: 13 cm). |

### 9.3 Clean-number rules (hard constraints carried into the TRD's generator)
1. **Whole-number worlds draw from a curated triple pool, never three independent random numbers.** Pool: the seven base triples 3-4-5, 5-12-13, 8-15-17, 7-24-25, 20-21-29, 12-35-37, 9-40-41 × {1, 2, 3, 4, 5, 10}, hypotenuse ≤ 100 — **27 triples** after de-duplication; **10 triples** with hypotenuse ≤ 30 for ladder contexts. A realism cap applies per context (ladder ≤ 30 m, ramp ≤ 6 m, screen ≤ 150 cm, field ≤ 120 m).
2. **Decimal contexts** (ramps, trays, doors) use **decimal-scaled triples** stored as integer tenths (e.g. 9-12-15 → 0.9-1.2-1.5) — **20 triples** with hypotenuse ≤ 6.0 m — so arithmetic is exact.
3. **Non-whole answers** use integer legs 2–20 (hypotenuse) or integer hypotenuse 5–30 (leg), with c² (or the leg squared) **not a perfect square**, and **rounding-safe**: the value × 10 must not lie within 0.05 of a .5 boundary (avoids 1 d.p. disputes and float error). This yields **148 hypotenuse cases and 333 leg cases**; every one produced four distinct options at least 0.2 apart in testing.
4. **Converse items:** "right" cases come from the triple pool; "not right" cases perturb one side by ±1 to ±3, must still satisfy the triangle inequality, and are checked so that no permutation of the sides is a triple. The longest side is **not** always last in the list shown.
5. Every question states the unit; the rounding instruction ("correct to 1 decimal place") appears in every non-whole question and only in those.
6. **Distractors model real misconceptions** (not random numbers): added the lengths; forgot the square root (the sum or difference of squares); subtracted when adding was needed (or the reverse); used the wrong side as the hypotenuse; arithmetic slips on squares. Templates and their per-world misconceptions are specified in TRD §6.5.

### 9.4 Bank structure and session sampling
Each world holds **10 question slots** (ramped easy → hard, slots 0–9) generated from ≥ 2 templates with a seeded RNG; the 10 `questionText`s in a world are all distinct. A session of *k* questions draws *k* slots **evenly spread across the ramp** (Guided 5 → slots 0, 2, 4, 6, 8 after a seeded jitter; Independent 10 → all slots in order; Timed 8; Boss 5 → slots 5–9 so the boss is genuinely harder), with fresh numbers each time (new seed per session), so Guided Practice is no longer "always the same easy five".

## 10. Gamification Naming (8 fixed triggers, relabelled)

| Trigger (fixed) | Badge name | Icon |
|---|---|---|
| First correct answer | First Beam Placed | 🧱 |
| 5-answer streak | Steady Scaffold | 🔥 |
| 10-answer streak | Skyline Streak | 🏙️ |
| All 4 Simulate stations complete | Fully Equipped Foreman | 🧰 |
| Any world scores 3 stars | Triple-Check Approved | ⭐⭐⭐ |
| Any Boss Battle won | Site Boss Beaten | 🏆 |
| 20+ questions answered in Practice | Persistent Plumb Line | 📏 |
| Full 5-phase journey complete | Chief Site Engineer | 🎖️ |

In addition, each Boss Battle win awards that world's **reward badge** (§9.1), shown in the Badges modal under "Boss trophies" (10 more, locked until won). *(Both are acceptance-tested; in the reference neither the world-star badge nor any boss reward could unlock — defect D10.)*

## 11. Audio & Narration Content Rules

### 11.1 Terms that must always be spoken in full
| On screen | Spoken as |
|---|---|
| a², b², c², 60² | "a squared", "sixty squared" — never "a two" or "sixty to the power of two" |
| √73, √10 000 | "the square root of seventy-three" — never "root" alone |
| a² + b² = c² | "a squared plus b squared equals c squared" |
| ≈ | "is approximately" · ≠ → "does not equal" |
| m, cm, km | "metres", "centimetres", "kilometres"; hyphenated adjectives as "thirteen-metre ladder" |
| $18 | "eighteen dollars" |
| 8.5, 0.9 | "eight point five", "zero point nine" — never "eight decimal five" |
| 10 000 | "ten thousand" (the space is a thousands separator, not two numbers) |
| 3-4-5 | "three, four, five" — never "three minus four minus five" |
| hypotenuse, legs, right angle, converse | spoken in full |
| 1 d.p. | "one decimal place" |
| ∠ABC | "angle A B C" |
| 90° | "ninety degrees" |

### 11.2 Parity contract (strict 1:1)
All narrated text is **derived from the same fields as the screen text** and passed through the single `speak()` transform (TRD §8.2): Wonder body and Tally question; Story `text` and `highlight` (the bubble is a character line, shown but not narrated); station intro lines; question text, hints and explanations; feedback lines. No separately authored "spoken version" of a story panel exists (defect D11). Titles and short UI labels are not narrated.

## 12. Accessibility
- Enlarged fonts and touch targets in Simulate and Practice, **calibrated for ages 13–14** (more restrained than the lower-primary modules, but never below 13 px text or 44 px targets — the reference's 11 px labels and 32 px buttons are corrected).
- Every region of every diagram carries a **text label** (value, "?" or "x"); colour is never the only signal (legs vs hypotenuse are also distinguished by label and line style; correct/incorrect also by icon and words).
- Every slider/drag interaction has −/+ buttons and arrow-key control; results are announced via `aria-live="polite"`.
- Visible focus rings; `aria-label` on SVG handles; modals trap focus and close on Escape.
- Reduced-motion support (§7.3-6). Contrast: text on glass cards ≥ 4.5:1 (checked for the 10 world accents on `#14082c`).
- Audio is optional: all information is also on screen; mute is one tap from every screen.

## 13. Assets Required
**6 story illustrations at 1024 × 1024**, one per panel (matches the reference's shipped dimensions), delivered once each as true PNG placeholders (≤ 250 kB) plus a README art brief. Common cast: Priya (👧, curly hair in a bun, tape measure on her belt), Jun Kai (👦, glasses, notebook), **Foreman Tally** (owl, hard hat, set-square clipped to his wing). Setting: a sunny Singapore HDB estate and school field; warm, bright, friendly.

| Panel | Scene | Characters and mood |
|---|---|---|
| 1 | Aerial three-quarter view of a 60 m × 80 m school field; one child running along the edges, another cutting across the diagonal; edge lengths chalked on the grass | Priya and Jun Kai at the start line; playful, energetic |
| 2 | Workshop floor: three squares of 1 m floor tiles laid on the sides of a 3-4-5 triangle (9, 16 and 25 tiles clearly countable) | Tally on a stool pointing with a ruler; curious |
| 3 | The field again with the diagonal marked "100 m" and the edges "60 m", "80 m"; stopwatch on the grass | Priya with a calculator; satisfied |
| 4 | HDB block wall and a 13 m ladder, foot 5 m out, with a window at 12 m highlighted | Jun Kai steadying the ladder, Tally on the ladder top as lookout; careful, safety-first |
| 5 | Builder's corner: a string with knots at 30, 40 and 50 cm laid out on a wooden frame | Priya and Jun Kai checking the corner; excited "it's square!" |
| 6 | Workshop door with four glowing icons (field, ladder, ramp, zip-line) and hard hats on hooks | Tally handing out hard hats; celebratory send-off |

Plus: favicon (must exist — the reference references `/favicon.svg`; it ships one), Open-Graph text for PythagoQuest, and an optional `generate_story_art.js` script kept only if its prompts are rewritten for these scenes.

## 14. Success Metrics / Acceptance Criteria
**Fixed criteria (blueprint):** question-bank stress test; audio parity; clean production build; full-journey walkthrough with zero console/page errors.
**Module-specific criteria:**
1. **Number rules (§9.3) verified in the ≥ 300-run stress test (30 000 questions)** by independent recomputation of every answer from `visualData`; every triple in a whole-number item is a valid triple; every non-whole item is rounding-safe; every question has four distinct options; every world has 10 distinct `questionText`s; world 10 draws from ≥ 5 source worlds.
2. **All four stations genuinely interactive** (live-updating SVG, not static) and each completable through keyboard alone; Station D's seeded errors provably wrong/right (unit-tested).
3. **All eight trigger badges and all ten boss rewards unlock** in a scripted walkthrough (defect D10); streak is independent of stars.
4. **Viewport matrix (§7.2) passes:** at all six viewports, for every phase, no primary CTA is clipped, the header fits, no horizontal page scroll, no content under the header, every interactive target ≥ 44 px (automated bounding-box audit + screenshots archived).
5. **Content QA:** every number drawn in a visual equals the number in its copy (automated), and no on-screen string claims a curriculum body ("MOE").
6. **Narration:** `speak()` unit tests for every rule in §11.1; every static narration string has an exact `audioMap` entry; no `speechSynthesis` in source or build output.
7. **Security:** no API key in the repository (secret-scan clean); `.env.local.example` contains a placeholder only.
8. **Budgets (§7.6)** met; `npm run lint` clean of errors.

## 15. Assumptions & Open Questions

**Assumptions made (proposed defaults):**
- **A1** Characters Priya and Jun Kai, mascot Foreman Tally, and the Right-Angle Works theme are proposed defaults, not stakeholder-approved.
- **A2** Grade 8 = Singapore Sec 2, following the mapping used in AngleQuest (Grade 7 = Sec 1).
- **A3** Reference behaviours kept unless stated: world n unlocks at ≥ 1★ in world n−1; Home/✕ reset with confirmation; reflection needs ≥ 10 characters.
- **A4** 3-4-5-style triples and decimal scalings are in scope as *recognition aids*; students are never required to memorise them.

**Open questions for stakeholders:**
- **O1** The MOE Mathematics syllabus PDF could not be retrieved in this session (robots.txt block). Scope was triangulated from a Sec 2 school content outline (§3). Please confirm the exact syllabus wording for Pythagoras at this level, and whether the converse and "real-world contexts" are examinable in the Sec 2 target stream.
- **O2** **1 d.p. vs 3 significant figures** for non-whole answers (schools vary). 1 d.p. is used; switching is a one-constant change in the generator and a rewrite of the rounding sentence.
- **O3** Keep "≥ 1★ in the previous world to unlock the next"? (Inherited from the reference; not in the blueprint.) With a 10-world progression this can block a student on a single hard world.
- **O4** **Timed Challenge timer scope.** The blueprint says "Timed (60 s)". The reference applies 60 s to the *whole* 8-question session (7.5 s per question), which is not feasible for multi-step Pythagoras with square roots. This PRD proposes **60 s per question** (`TIMER_SCOPE = 'question'`); the alternative is a longer whole-session timer. Please confirm.
- **O5** Reuse **Amirah and Wei Jie** (AngleQuest) as a continuing cast instead of Priya and Jun Kai? It builds a "series" feel at the cost of less variety.
- **O6** Is a calculator allowed for this level in class? If not, `CALCULATOR_ENABLED = false` and World 4 (decimal answers) must be re-scoped to estimate-and-choose.
- **O7** Is phone support Tier 2 (as proposed) or should phones be out of scope? It affects Simulate effort (§7.4).
- **O8** Future modules deliberately scoped out (§3.2): trigonometric ratios (natural sequel, "TrigQuest"), 3-D Pythagoras, and distance on the coordinate plane.
- **O9** **Security — action needed by the project owner:** the supplied `angle-on-line-g7-main.zip` contains a real ElevenLabs API key in `.env.local.example`. It was not copied into these documents. Treat it as exposed: rotate it, remove it from version history, and use a server-side proxy in production (TRD §8.4).
