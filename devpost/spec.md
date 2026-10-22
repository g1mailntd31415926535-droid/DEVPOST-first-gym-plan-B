---
doc: spec
status: approved
---

# Gym Plan B — Technical Spec

## How This Works, In Plain Language

The app is **one web page** built to look like a phone (React + Vite, TypeScript). Exercise data lives in **a spreadsheet-like table** on Supabase — the app **only reads**, never writes. When you tap "machine busy", the app runs **a small formula in the browser**: keep exercises with the **same muscle group + same target region**, score which one moves most like the original (80%) and matches its compound/isolation type (20%), rank them, and take the top 3. There is no AI/LLM, no separate server, and no account. The workout (current exercise, substituted exercises, completed sets) exists only in browser memory — reloading the page starts a new workout, as intended for the PoC. Imagery has **2 layers**: exercise illustrations (RepDB, attributed) and a **red-highlighted SVG body map** (MuscleMap). If the network is unavailable, the app falls back to a **bundled sample dataset** so the demo still runs.

Why this shape: it is the smallest thing that still proves the core (the recommendation engine), and every hard part (the engine) is a pure module that can later be attached to the real app/WebView.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

1. **Load app** → `data/exercises.ts` calls Supabase `GET exercises` → stores the result in memory; on error, uses `data/seed.ts` (and shows a "sample data" banner).
2. **HomeScreen** displays sample statistics (constants) + the **Test Set** card (5 exercises, declared in code) → tapping ▶ initializes the session.
3. **CheckSheet** for the current exercise → "Machine free — train now" → training screen; "Busy — choose another exercise" → **BusyChoiceSheet**.
4. **BusyChoiceSheet**: (1) "Choose a suggested exercise" → calls `rankAlternatives(exercise, exercises)` → **ReplacementListScreen**; (2) "Another exercise from the plan" → moves the exercise pointer (the busy exercise stays in the queue).
5. **ReplacementListScreen** shows top 3 (+ a "show more" button that reveals the rest); each card renders `MuscleFigure` (MuscleMap) + RepDB image + reason + difference.
6. **Choose an exercise** → update the session (replace in the old slot) → **TrainingScreen**.
7. **TrainingScreen**: set chips, "Complete set" → **RestScreen** counts down `default_rest_seconds` → "Skip — continue" → next set / next exercise.
8. Repeat until the Test Set is finished. Nothing is saved externally.

## Stack

| Layer | Choice | Why / trade-off |
|---|---|---|
| Build tool | **Vite** (latest stable at install time) | Fast startup, simple `npm run dev` |
| UI | **React 18.3 + TypeScript** | React because MuscleMap is React; TS helps the agent avoid type errors |
| Styling | **Tailwind CSS v3** (stable) | Build mockup layouts quickly without a large CSS file |
| DB | **Supabase (new project) + @supabase/supabase-js v2** | Read-only; satisfies the data-copy requirement |
| Muscle map | **@musclemap/react 1.x (+ core, assets)** | MIT; SVG colored by MuscleGroup; React Native-compatible later via WebView |
| Test | **Vitest** | Test engine modules without UI |

Docs: [Vite](https://vite.dev/guide/) · [React](https://react.dev/reference/react) · [Tailwind](https://tailwindcss.com/docs) · [Supabase JS](https://supabase.com/docs/reference/javascript) · [MuscleMap](https://github.com/Jsplice/MuscleMap) · [Vitest](https://vitest.dev/guide/)

✅ **Verified at build:** `@musclemap/react` 1.1.0 accepts React 18 (`peerDependencies: ^18 || ^19`). The installed stack is React 18.3, Vite 6, Tailwind 3, and Vitest 3.

## Where It Runs and How Someone Tries It

- Runtime: a browser on the local machine (Windows). Requirements: **Node 20+**, npm. Supabase is **optional**: a `.env.local` file (gitignored) can provide `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; without it the app runs from the bundled seed and shows the offline banner.
- Run: `npm install` → `npm run dev` → open `http://localhost:5173`.
- Demo recording: DevTools → portrait device mode (390×844) to match the mockup.
- Submission: **short demo video + public GitHub repository** (required). **No deployment** (learner decision); deployment does not replace the video/repository.
- Public repository (verified public): https://github.com/g1mailntd31415926535-droid/DEVPOST-first-gym-plan-B (branch `main`).
- Demo video (public YouTube, 1:52): https://youtu.be/ihV1N6tdFTo
- Without `.env.local`: the app still runs from the offline seed (clear banner), so demo recording is safe.

## Look and Feel

Source: `prd.md > Look and Feel` + `scope.md > Inspiration & Identity`.

- White background, **dark blue** accent (~`#0A66FF`) for buttons/selected chips; **very bold** text (Inter/Manrope-style weights 700–800), large headings; large rounded cards (~20–24px); light-gray chips (`#F2F3F5`); generous spacing, a "modern gym app" feel.
- UI copy: **English** (changed at build at the learner's request for the Devpost submission; the spec previously chose Vietnamese); **English exercise names**.
- Illustrations: RepDB flat 512px WebP, displayed in rounded squares. **MuscleMap body**: red highlight (`monochromeColor` red) on the correct muscle region; if the library does not split the region → use a coarser group + a **text region label** next to it, and do not pretend to be exact. An explicitly approximate mask is acceptable only when labeled "(approx.)" in the UI and Credits.
- Attribution "Exercise data by RepDB (repdb.co)" on the About/Credits screen + README.

## Components

### App (session state machine)
`App.tsx` only routes phases → screens; session logic lives in `lib/session.ts` (a pure, testable reducer). It holds `phase` (`home | check | busy | pick | alternatives | training | rest | finished`), `plan`, `queue` (slots left to train; `queue[0]` is the current exercise), `deferred`, current set, finished sets, `restEndsAt` + `restTarget`. One `useReducer`; nothing persisted to disk. PRD ref: `prd.md > States and Boundaries`.

### HomeScreen
Sample statistics (hardcoded), streak, check-in calendar (decorative dot matrix), "Test Set" card + ▶ button. Display only. PRD ref: `prd.md > Screens and Layout`.

### CheckSheet
Exercise name (EN), chips for `default_sets`, `default_min_rep–max_rep`, `default_rest_seconds`, kg = 99 placeholder; free/busy buttons. **No equipment state is passed forward.** PRD ref: `prd.md > Workout and Exercise Substitution`.

### BusyChoiceSheet
Two options: open the replacement list / open the **list of remaining exercises in the plan** to choose one first (the busy exercise is deferred to the end and asked about again when it returns). The picker always has a Back button; if only the current exercise remains → empty state + Back. PRD ref: as above.

### ReplacementListScreen + ExerciseOptionCard
Top 3 + "show more". Card: image, name, tag (`Recommend` / `Different movement style`), muscle group + region, equipment, reason (generated from scored data), and a "difference from the original" line (generated by comparing metadata: family/pattern/type/equipment). PRD ref: `prd.md > Recommendation Engine`.

### MuscleFigure
Wraps `<MuscleMap values={...} monochromeColor="#E5484D" showLegend={false} />` and maps taxonomy → `MuscleGroup` through a static lookup (`lib/muscleMapMapping.ts`). If a region is unsupported → use the coarse group + text label. MuscleMap 1.1 has no upper/middle/lower chest path, so the component overlays an **approximate neutral gradient mask** on the whole chest and always labels it "(approx.)" — visual emphasis, not an anatomical boundary from the library. PRD ref: `prd.md > Look and Feel`.

### TrainingScreen
3 chips (weight lock 99 / rep range / rest), current set large, S1–S4 chips, "Next up" (remaining exercises: name + sets · weight), complete-set button. PRD ref: `prd.md > The Core Journey`.

### RestScreen + timer
Countdown ring; computed from `Date.now()` so it stays correct when the tab is suspended; "Skip — continue" button; when time expires, automatically advance to the next set. PRD ref: `prd.md > The Core Journey`.

### lib/recommendation.ts (pure engine)
`rankAlternatives(original, all): RankedExercise[]`
1. Filter for exact `muscle_group` + `target_region` matches; exclude `classify_status = needs-review`; exclude the original exercise.
2. `movementScore`: same family + pattern = 1.0; same family, different pattern = 0.6; different family = 0.3.
3. `typeScore`: same `exercise_type` = 1, different = 0.
4. `score = 0.8*movementScore + 0.2*typeScore`; sort descending; `recommended = highest score && movementScore == 1.0`.
5. Return `isDifferentStyle = movementScore < 0.6` / different family; the UI adds the tag and **never** gives a "Different movement style" exercise the Recommend tag.
Empty → `[]` so the UI can show the empty state. No React/Supabase dependency → unit-testable and portable.

### data/exercises.ts + data/seed.ts
`loadExercises()`: Supabase select (id, name, defaults, equipment, metadata, image_asset) with a timeout; missing config / error / missing Test Set exercises → seed + `source: 'seed'` so Home shows the "Sample data" banner. A short loading gate appears before Home. Seed = exactly the exercises needed for the Test Set (statically bundled, with metadata identical to the DB); `mapExerciseRow` converts snake_case → camelCase. PRD ref: `prd.md > Data`.

## Data Model

### `exercises` table on the NEW Supabase project

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | **keep the original Gym Tracker UUID**, copy explicitly |
| `name` | text not null | EN name |
| `default_sets` | int4 not null default 3 | copy |
| `default_min_rep` | int4 not null | copy |
| `default_max_rep` | int4 not null | copy |
| `default_rest_seconds` | int4 not null | copy |
| `equipment` | text | copy (existing string, displayed raw) |
| `muscle_group` | text | **NEW classification** (Chest/Shoulders/Back/Legs/Arms/Core) |
| `target_region` | text | **NEW** (Upper/Middle/Lower; Front/Side/Rear; Lats/Upper Back; Quads/Hamstrings/Glutes/Calves; Biceps/Triceps; Abs/Obliques) |
| `movement_family` | text | **NEW** (Press/Pull/Squat/Hinge/Raise) |
| `movement_pattern` | text | **NEW** (e.g. Incline Press, Vertical Pull) |
| `exercise_type` | text | **NEW** (compound/isolation) |
| `classify_status` | text not null default 'needs-review' | `classified` / `needs-review` |
| `image_asset` | text null | path to the bundled RepDB image (e.g. `/exercises/incline-barbell-press.webp`) |

**Do not copy:** `image_url`, `exercise_image_url`, `muscle_diagram_url`, `video_url` (Lyfta sources — no rights), `secondary_muscles`, `category` (not used by the engine). State this clearly in the reuse manifest.

### Migration (executed at build)

1. The learner exported the old project as CSV/JSON — a **manual, read-only export**.
2. A SQL import loaded the required rows into the new project, **inserting explicit `id` values** and preserving UUIDs.
3. New metadata was filled in using the approved classification table; uncertain items remain `needs-review`.
4. Verified: **26 rows / 23 classified / 3 needs-review**, matching UUIDs, and no auth/user tables copied. The old project was untouched.

### Test Set classification table (approved in the PRD)

Exactly the 5 rows in `prd.md > Exercise Data Classification` — build uses them directly, with no extra inference.

### App state (in memory)

```ts
type Phase = 'home' | 'check' | 'busy' | 'pick' | 'alternatives' | 'training' | 'rest' | 'finished';
type Session = {
  phase: Phase;
  plan: Exercise[];        // 5 exercises; a substituted exercise replaces the one in its slot
  queue: number[];         // slots left to train; queue[0] = current exercise
  deferred: number[];      // deferred slots (chose "do another exercise first"), return to the end of the queue
  currentSet: number;
  finishedSets: number;
  restEndsAt: number | null;                       // absolute deadline based on Date.now()
  restTarget: 'next-set' | 'next-exercise' | null;
};
```
Reload = session lost (intentional).

## File Structure

```
gym-plan-b/
├── .env.local               # DO NOT COMMIT: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
├── .env.example             # variable names + empty values
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── README.md                # how to run, RepDB attribution, resource transparency
├── devpost/                 # Devpost Learn workspace (already present)
├── public/
│   └── exercises/           # RepDB images for the test set only (bundled)
├── src/
│   ├── main.tsx
│   ├── App.tsx              # state machine + phase routing
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── CheckScreen.tsx        # machine check sheet
│   │   ├── BusyChoiceScreen.tsx   # two options
│   │   ├── PickExerciseScreen.tsx # remaining exercises + Back/empty state
│   │   ├── ReplacementListScreen.tsx
│   │   ├── TrainingScreen.tsx
│   │   ├── RestScreen.tsx
│   │   └── CreditsScreen.tsx      # RepDB attribution
│   ├── components/
│   │   ├── ExerciseOptionCard.tsx
│   │   ├── MuscleFigure.tsx
│   │   ├── TimerRing.tsx
│   │   ├── Chip.tsx
│   │   └── Sheet.tsx
│   ├── hooks/
│   │   └── useRestTimer.ts        # countdown against an absolute deadline
│   ├── lib/
│   │   ├── recommendation.ts      # pure engine
│   │   ├── recommendation.test.ts
│   │   ├── session.ts             # pure session reducer (queue/defer/rest)
│   │   ├── session.test.ts
│   │   ├── explain.ts             # reason + difference generated from metadata
│   │   ├── muscleMapMapping.ts    # taxonomy -> MuscleGroup enum
│   │   └── supabase.ts
│   ├── data/
│   │   ├── seed.ts                # offline fallback + Test Set order
│   │   └── exercises.ts           # load + buildTestPlan
│   └── types.ts
└── supabase/
    └── schema.sql             # table DDL + RLS select-only + sample seed import
```

## External Services and Dependencies

### Supabase (new project, read-only)

- Create a separate project for Gym Plan B; `exercises` table per the schema above; enable **RLS** with a `select` policy for `anon` (no insert/update/delete).
- Client call: `supabase.from('exercises').select('id,name,default_sets,default_min_rep,default_max_rep,default_rest_seconds,equipment,muscle_group,target_region,movement_family,movement_pattern,exercise_type,classify_status,image_asset')`.
- Equivalent REST: `GET {SUPABASE_URL}/rest/v1/exercises?select=...` with `apikey` + `Authorization: Bearer <anon>` headers.
- Key: **anon** in `.env.local` (designed to be public, protected by RLS). **service_role / DB password must never** appear in the frontend, `.env.example`, or the repo. Docs: [Supabase API keys](https://supabase.com/docs/guides/api/api-keys) · [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- Cost: free tier; the PoC uses a few dozen rows.

### RepDB Free Exercise Dataset

- License: free for in-app use (including commercial) **with attribution**; **redistribution as a dataset/API is forbidden**; using images as input to generative AI models is **forbidden**; `premium-samples/` is for viewing only.
- How to use: download **only the WebP files for the exercises needed** into `public/exercises/` (in-app use), and credit the source in the app + README. Do not bundle the entire library as a "dataset" in the repo.
- Docs: [repo](https://github.com/RepDB/exercise-dataset) · [LICENSE-DATA](https://github.com/RepDB/exercise-dataset/blob/main/LICENSE-DATA.md)

### MuscleMap

- MIT for everything (code + SVG + background images). Packages `@musclemap/react`, `@musclemap/core`, `@musclemap/assets`.
- Unverified risk: **region granularity** (Upper/Middle/Lower chest, Front/Side/Rear delts). Check early with `MUSCLE_GROUP_PARTS` in `@musclemap/assets`; if missing → use the coarse group + text label, or place two figures side by side. (Resolved: side delts, lats and quads are exact; chest uses an explicitly approximate mask, labeled "(approx.)".)

## Important Failure Modes

- **Supabase does not respond / wrong key** → run the offline seed + show the "Using sample data" banner; do not block the demo.
- **No candidates in the region** → empty state "No suitable substitute yet (region X)"; do not invent exercises.
- **Image missing/broken** → placeholder frame + exercise name text; do not break the layout.
- **MuscleMap lacks a detailed region** → coarse group + text region label, or an explicitly approximate mask labeled "(approx.)".
- **Tab hidden during rest** → the timer stays correct thanks to the `restEndsAt` deadline.

## What Was Simplified and Why

- **Test Set declared in code** instead of a plan/workout table in the DB — only 5 fixed exercises, no need for schedule CRUD.
- **Engine runs client-side** instead of an API/LLM — correct PoC boundary, easy to test, no extra service.
- **Copy only the 26 required exercise rows** instead of all 100+ — keeps migration small and transparent; expand later.
- **Session in RAM only**, no persistence — the PoC does not need history; avoids extra storage complexity.
- **Home-screen statistics are constants** — only for demo context.
- **Images only for the test set** — expand after the learner approves quality (assumed direction C: RepDB MVP).

## Verification Plan

- `npm test` (Vitest): the 5 original exercises return correct-region results; Incline does not return Flat; different-family candidates get the "Different movement style" tag and are never Recommend; empty state for a region with no candidates; `needs-review` never enters the top list.
- Manual run through the PRD demo script: open app → Test Set ▶ → machine busy → two options → top 3 → show more → choose Recommend → training screen → complete set → rest → continue.
- Verify attribution is visible; verify the app works with the network disconnected (seed).

## Decisions and Open Issues

**Learner decisions:** React + Vite + TS mobile-first (web first, WebView/Expo later); run locally, **no deployment**; new Supabase project, keep original UUIDs, do not copy user data/credentials; no equipment declaration/filtering; **English exercise names, all UI in English** (changed at build for the Devpost submission); kg = 99 placeholder; do not use Lyfta images; **image direction C — RepDB Free for the MVP, upgrade to Gym Plan B's own illustration style after the competition** (learner confirmed at the spec review).

**MuscleMap checked (slice 4):** `@musclemap/react` 1.1.0 accepts React 18 (`peerDependencies: ^18 || ^19`). `MUSCLE_GROUP_PARTS` has `SHOULDERS_FRONT/SIDE/REAR`, `LATS`, `QUADS` but **no** upper/middle/lower chest. `lib/muscleMapMapping.ts` maps side delts / lats / quads exactly; chest colors the whole group, then overlays an **approximate gradient mask** to emphasize upper/middle/lower, always labeled "(approx.)" and explained in the UI/Credits — this is visual emphasis, not an anatomical boundary from the library.

**Open issues:** no build-blocking issues remain. `.env.local` is configured locally and gitignored; RepDB images are bundled by slug in `public/exercises/` and `image_asset` points to those files.

**Post-slice-4 follow-up:** the learner asked for upper-chest-only highlighting and exercise images on the Pick screen. Chest now uses the approximate mask (not claimed exact, labeled) and the picker uses RepDB images instead of dumbbell icons.
