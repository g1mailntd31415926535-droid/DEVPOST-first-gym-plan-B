---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. The app runs and the kernel works: a ranked replacement list**
  Becomes usable: Open the app on localhost, see the sample home screen, tap ▶ Test Set, reach the machine-check sheet, tap "Busy" → two-choice sheet → "Choose a suggested exercise" → a top-3 list ranked by the **real engine** from seed data (same muscle region, 80/20, Recommend / Different movement style tags, reasons). Choose an exercise → the minimal training screen shows the new exercise in the old slot.
  Why now: This is the kernel — if the engine is wrong, everything after it is meaningless. The scaffold is part of this slice; the core loop runs end-to-end from the start so every later slice has somewhere to stand.
  PRD ref: `prd.md > The Core Journey` (steps 1–5), `prd.md > Recommendation Engine`, `prd.md > Workout and Exercise Substitution`
  Spec ref: `spec.md > Stack`, `spec.md > File Structure`, `spec.md > Components` (`App`, `HomeScreen`, `CheckSheet`, `BusyChoiceSheet`, `ReplacementListScreen`, `lib/recommendation.ts`, `data/exercises.ts`), `spec.md > Verification Plan`
  Build: Scaffold Vite + React + TS + Tailwind according to the file structure; seed data for the 5 originals + candidates (metadata per the approved classification table); write pure `lib/recommendation.ts` + `recommendation.test.ts`; build the first 4 screens/sheets and the `useReducer` state machine; kg = 99 placeholder, English exercise names, Vietnamese UI at that point (later switched to English).
  Verify (mechanical): `npm.cmd run build` (or `tsc --noEmit`) without errors; `npm.cmd test` passes these cases: only same-region exercises enter the list; Incline does not return Flat/Middle; different-family exercises get the "Different movement style" tag and are never Recommend; `needs-review` never enters the top; a region with no candidates → empty list. Dev server starts without console errors.
  Learner check: Open `http://localhost:5173`, tap Test Set, tap "Busy" → "Choose a suggested exercise", check whether the list feels like "one same-region exercise at the top with a reason" as imagined, and describe how the UI feels versus the mockup.
  Commit: `feat: ranked replacement list with recommendation engine`

- [x] **2. Complete workout: training screen, rest timer, and "do another exercise first"**
  Becomes usable: From a substituted exercise, the training screen shows all chips (weight lock 99, rep range, rest), current set + S1–S4 chips, "Next up"; tapping "Complete set" → rest screen counts down according to `default_rest_seconds`, with "Skip — continue"; when time expires, advances to the next set automatically; choosing "Another exercise from the plan" defers the busy exercise, and when it returns the app asks again whether the machine is free; run through the whole Test Set to the finish screen.
  Why now: Complete the real user loop (train → rest → next exercise) before connecting real data, so behavioral bugs surface while they are cheap; the timer is the easiest thing to get wrong when the tab is hidden.
  PRD ref: `prd.md > The Core Journey` (steps 6–8), `prd.md > Workout and Exercise Substitution`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components` (`TrainingScreen`, `RestScreen`, `App`), `spec.md > Data Model` (state shape), `spec.md > Important Failure Modes` (timer when the tab is hidden)
  Build: TrainingScreen + RestScreen + `TimerRing` + `useRestTimer` based on `restEndsAt`; defer (`deferred`) and return logic; finish screen; empty state for an empty replacement list.
  Verify (mechanical): `npm.cmd run build` clean; vitest for defer/substitute logic (a busy exercise stays in the list, and after substitution it lands in the correct slot); run the dev server, complete a full workout, confirm the countdown is correct and "Skip" advances to the next set; hide the tab for 10 seconds and return — the timer is still correct.
  Learner check: Run a complete workout in the app — substitute an exercise, complete 2 sets, use "Skip — continue", try "Another exercise from the plan" — and report anything slow or confusing compared with how you actually train.
  Commit: `feat: full training session with rest timer and deferred exercises`

- [x] **3. Real data: new Supabase project, preserved Exercise IDs, offline fallback**
  Becomes usable: The app reads the `exercises` table from the new Supabase project (read-only, RLS select-only), showing the real 5 Test Set exercises + candidates; if `.env.local` is missing or the network is down → automatically use the seed + "using sample data" banner, so the demo does not die.
  Why now: After behavior is correct, swapping the data source is a one-layer change; doing it earlier would mix data bugs with UI bugs. This is also where we verify "do not touch the old Supabase, keep UUIDs".
  PRD ref: `prd.md > Data`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Data Model` (table + migration), `spec.md > External Services and Dependencies` (Supabase), `spec.md > Important Failure Modes`
  Build: `supabase/schema.sql` (DDL + RLS select-only) and an import script/guide that preserves `id`; `lib/supabase.ts` + `data/exercises.ts` fetch/fallback; `.env.example`; the learner creates the project + runs the SQL + exports/imports only the needed rows (no auth/users/credentials, no changes to the old project).
  Verify (mechanical): Run `select count(*)` on the new project → correct imported row count; call REST `GET /rest/v1/exercises?select=id,name` and get 200 with UUIDs matching the old copy; app with `.env.local` shows Supabase data (no banner); temporarily use a wrong key → app falls back to seed + banner; confirm the old project has no changes.
  Learner check: Open the app with Supabase configured, confirm exercise names/sets/reps/rest match your old gym app data; temporarily remove `.env.local` and check that the sample-data banner appears and the app still works.
  Commit: `feat: connect Supabase read-only data with offline seed fallback`

- [x] **4. Imagery: RepDB exercise illustrations + red-highlighted muscle regions (MuscleMap)**
  Becomes usable: Every replacement card and the training screen has an exercise illustration (RepDB, only Test Set exercises + candidates), plus a body figure with the correct muscle group/region highlighted in red; if MuscleMap cannot split a specific region → use the coarse group + a text region label (never pretend to be exact); the Credits screen shows RepDB attribution.
  Why now: This is the product's "storytelling" layer; do it after real data is stable so images attach to the right `id`, and surface the known technical risk (MuscleMap's region granularity) early.
  PRD ref: `prd.md > Look and Feel`, `prd.md > Screens and Layout`
  Spec ref: `spec.md > Components` (`MuscleFigure`), `spec.md > External Services and Dependencies` (RepDB license + MuscleMap), `spec.md > Decisions and Open Issues` (MuscleMap uncertainty)
  Build: Check `MUSCLE_GROUP_PARTS` in `@musclemap/assets`; fill in `lib/muscleMapMapping.ts` or document the fallback; download only the needed RepDB image files into `public/exercises/` (do not bundle the whole dataset, do not use premium-samples), attach `image_asset`; build `MuscleFigure`, images in cards + training screen; CreditsScreen + attribution.
  Verify (mechanical): Mapping table covers all 5 required regions (or the fallback is documented); every card image loads (no 404 in console); correct group highlighted on all 5 original exercises; attribution visible in the app.
  Learner check: Open a replacement list and inspect the images + body figures — is the highlighted muscle where you expect, and is the image style acceptable for the demo video?
  Commit: `feat: exercise illustrations and red muscle-region highlighting`

- [x] **5. Demo packaging: mockup polish, empty states, README and attribution**
  Becomes usable: The whole journey is smooth and faithful to the mockup (color, rounded corners, typography, spacing); the empty state "No suitable substitute yet (region X)" appears in the right place; the README explains how to run, RepDB attribution, and a resource-transparency section (data reused from Gym Tracker); the app is ready for a 1-minute demo video following the PRD script.
  Why now: Polish last so effort is not wasted on things that will change; README/attribution are submission requirements, not decoration.
  PRD ref: `prd.md > Look and Feel`, `prd.md > Non-Goals`, `prd.md > What We're Building`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Where It Runs and How Someone Tries It`, `spec.md > External Services and Dependencies`
  Build: Adjust styles to match the mockup; check empty states, offline banner, UI copy; write the README (run instructions, attribution, transparency note per scope); clean console errors; verify no secrets/learner profile are tracked in the repo.
  Verify (mechanical): `npm.cmd run build` + `npm.cmd test` clean; open DevTools at 390×844 and compare with the mockup; run the full 1-minute demo script without console errors; README has all 3 required sections; `git status` clean and `.env.local`/`learner-profile.md` are not tracked.
  Learner check: Click through the whole demo script on the phone frame, look for anything that differs from the original vision, then try a rough 1-minute recording with a phone/screen recorder.
  Commit: `chore: demo polish, README and attribution`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 1 (ranked replacement list)
- [x] Final kick-the-tires exploration and feedback completed

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Focused alternative for an experienced plan-first learner — brief evidence-based recap of the MuscleMap chest-granularity decision. Real uncertainty from `spec.md > Decisions and Open Issues`: MuscleMap 1.1 has no upper/middle chest path. Evidence: `src/lib/muscleMapMapping.ts` maps chest to the coarse group, `src/components/MuscleFigure.tsx` layers the approximate chest mask, `src/lib/muscleMapMapping.test.ts` covers the mapping, and the UI/Credits label the result "(approx.)"; visual check at 390×844 confirmed the label. Takeaway: when a dependency cannot support the requested precision, degrade to the supported unit and label the approximation instead of inventing detail. No code edit was needed; the optional reflection question was offered in the hand-off.
Route and stops: Reference route in `devpost/app-map.html` (not a live guided tour): `src/screens/CheckScreen.tsx` (`onBusy`) → `src/App.tsx` (`OPEN_BUSY`, `ranked` useMemo) + `src/lib/session.ts` (`OPEN_BUSY` / `OPEN_ALTERNATIVES`) → `src/lib/recommendation.ts` (`rankAlternatives`) → `src/screens/ReplacementListScreen.tsx` + `src/components/ExerciseOptionCard.tsx`. Chest-approximation change pointers: `src/lib/muscleMapMapping.ts`, `src/components/MuscleFigure.tsx`.
Edit outcome: not applicable — no code edit was proposed for the wrap-up; a kept edit would need its own verification and commit.
Reflection: offered — optional transfer question about what to change next time when starting with an agent; personal answer belongs only in the ignored `learner-profile.md` if given.
Activity mode: focused alternative — brief evidence-based recap + app map; no live guided tour and no edit.

## Revisions

- Slice 1: the "Another exercise from the plan first" option appeared in the sheet but was still disabled; the real defer behavior belongs to slice 2 (the approved order).
- Slice 1: the Test Set is resolved by **exercise name** (`TEST_PLAN_ORDER`) instead of seed UUIDs, so importing real UUIDs from Gym Tracker in slice 3 does not require changing the plan logic.
- Slice 1: upgraded vitest to 3.x to match Vite 6 (vitest 2 pulled its own Vite 5 and made `tsc` report a plugin type error).
- Slice 1: bundle only the Inter latin + vietnamese subsets (enough for the Vietnamese UI, fewer font files). Superseded when the UI switched to English.
- Build: **all UI copy switched to English** at the learner's request (Devpost submission); `prd.md` + `spec.md` updated with the language decision.
- Slice 2: session reducer extracted to `lib/session.ts` (pure, testable) with **queue slots** instead of `currentIndex`, so deferring an exercise means moving its slot to the end of the queue; `restEndsAt` is an absolute deadline; added `restTarget` to know whether rest ends into the next set or the next exercise.
- Slice 2 (learner feedback): "Do another exercise first" opens the **list of remaining exercises in the plan** for the user to choose (it does not jump to the next exercise automatically), with a Back button in every state and an empty state + Back when the current exercise is the only one left. `prd.md` + `spec.md` updated.
- Slice 3 (code path): `loadExercises()` async + loading gate; Supabase error/missing config/missing Test Set exercises → seed + "Sample data" banner. `lib/supabase.ts` uses only the anon key; `supabase/schema.sql` enables RLS select-only with no write policies; `supabase/IMPORT.md` explains the read-only export + insert that preserves UUIDs. **Real data not imported yet** — waiting for the learner to export and approve metadata.
- Slice 3 (data): exported all 100 exercises from the old project; imported **26 rows** (5 Test Set + classified candidates per region + 3 `needs-review`). Kept original UUIDs, shortened names to approved English labels, and copied sets/reps/rest/equipment unchanged. Offline seed rewritten to match the DB exactly.
- Slice 3 (expansion at the learner's request): added Smith Machine Bench Press, Pec Deck Fly, One-Arm Dumbbell Row, Goblet Squat; promoted Low-to-High Cable Fly, Push-Up, Chin-Up, Front Squat to `classified`. Result: Flat Bench has 5 candidates (top 3 + show more), Squat/Lat Pulldown have 4; Shoulders/Side still has 2 because the real data has no other exercise — no padding.
- Slice 3 verified: REST returned **26 rows / 23 classified / 3 needs-review**, all 4 new exercises present, UUIDs matching the export; app runs on real data with no sample banner. Slice 3 ticked.
- Slice 4 (built): downloaded **26 RepDB flat 512px WebP images** into `public/exercises/` (only the needed images, no dataset/premium-samples bundling); added `image_asset` to seed + SQL (idempotent; re-run `seed.sql` so the DB has paths — the app also falls back by name). `MuscleFigure` uses MuscleMap 1.1: `SHOULDERS_SIDE`, `LATS`, `QUADS` are exact; chest has no upper/middle path, so the whole group is colored and an **approximate gradient mask** emphasizes upper/middle/lower, always labeled "(approx.)". Images + body figures appear on replacement cards and the training screen; **the Pick exercise screen also has exercise images**; added CreditsScreen + RepDB link on Home.
- Slice 4 (learner feedback): requested upper-chest-only highlighting and images on the Pick screen. Chest switched to the approximate mask (not claimed exact, labeled) and the dumbbell icon was replaced with RepDB images in the picker.
- Slice 4 verified (mechanical): headless Chrome at 390×844 — images load with 200 in all 5 regions, no console/404 errors; Lat Pulldown shows the back view, Side delts show the side shoulder, chest shows the approximate region with its label; Flat Bench has 5 candidates + "Show 2 more"; Credits opens. Learner reviewed the style/region accuracy and approved.
- Slice 5 (polish): aligned the home sample stats with the calendar (3 sessions, 1 routine); corrected the deferred-exercise copy; removed repeated equipment text from card reasons and the generic "Swap" tag; empty state now names the exact `muscle_group · target_region`; offline banner rewritten for a non-technical reader; added `100dvh` sizing and focus-visible styles; removed the unused Vietnamese font subsets; added `README.md` with run steps, verification, RepDB attribution, and the reuse-transparency section; footer attribution now uses the exact required RepDB phrase.
- Slice 5: the README transparency list records the reuse already documented in `spec.md` and Credits; the exact reuse wording still needs the learner's confirmation at `6-ship`.
- Slice 5 verified (mechanical): 31/31 tests pass; production build exits 0 (only the known ~675 kB MuscleMap chunk-size warning); headless Chrome at 390×844 completed the full 5-exercise / 15-set flow to "Session complete" with no console or 404 errors; empty replacement state tested by intercepting the Supabase response; offline seed fallback tested by aborting Supabase (only the expected failed network requests in console); picker empty state reached after finishing four exercises; `git ls-files` contains only `.env.example` (no `.env.local` or `learner-profile.md`).
- Final review (learner): reviewed the slice 5 flow and copy at 390×844 and approved with no requested changes; learner explicitly confirmed the PoC is ready to ship, so the Final Review box is checked.
- Final review (mechanical): re-ran the tests and build, the full 15-set demo path, empty/offline/picker states, and `git diff --check`; no console errors, 404s, secrets, or tracked private files. No code changes were needed.
- Learning wrap-up: generated `devpost/app-map.html` from commit `452df25`; checked at 1100px and 390px with headless Chrome, including the reference route, change pointers, and the chest-approximation takeaway. No app/runtime changes were made by the map.
- 6-ship docs review: `spec.md > Where It Runs and How Someone Tries It` said `.env.local` was required, but the app, README, and tested fallback already support running from the seed without it. Corrected the spec to mark Supabase configuration optional; no code or behavior changed.
