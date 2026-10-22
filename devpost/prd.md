---
doc: prd
status: approved
---

# Gym Plan B — Product Requirements

A standalone mini-app for gym-goers (first of all the learner): when a planned exercise's machine is taken, the app suggests suitable substitute exercises using a metadata-scored Recommendation Engine — preserving the training goal. Source: `scope.md` (approved, project name Gym Plan B).

## The Core Journey

1. **Open the app** → the home screen shows the learner's design mockup (workout statistics, streak, "Consistency" check-in calendar, "Your plan") with **fixed sample data, display only**. Source: `scope.md > The Core Loop`.
2. Tap the ▶ button on the **"Test Set"** plan card (5 exercises: Incline Barbell Press, Flat Bench Press, Lateral Raise, Lat Pulldown, Squat) → start the workout.
3. **Per-exercise check sheet** (exercise 1/5): shows the **English** exercise name (the learner's decision: submit to the US-based organizers, drop Vietnamese names), chips for weight lock (kg = 99 placeholder), set count, and rep range → asks *"Is this machine / station free right now?"* → two buttons: **"✓ Machine free — train now"** / **"⚠ Busy — choose another exercise"**. **This is only an action gate for the user to say "I can't do this exercise right now" — it is not a declaration of gym equipment/status, and no data from this choice goes into the engine.**
4. Choose "Busy" → **two-choice sheet**: **(1) "Choose a suggested exercise"** → open the **replacement list screen**: top 3 options + a "show more" button (reveals a few more exercises); each option shows the exercise name, illustration, target muscle group, required equipment, and reason it was suggested; the strongest option has a **Recommend** tag; exercises from a different movement_family get a "Different movement style" tag. **(2) "Choose another exercise from the plan"** → temporarily skip the busy exercise and do another exercise from the session first. → The user **checks the gym themselves** and picks an available option.
5. Choose an option → that exercise **replaces the old one in the same slot** in the Test Set.
6. **Training screen**: exercise name, chips (weight lock / rep range / rest time), "Current set", set chips (S1–S4), a "Next up" section (following exercises), and a **"Complete set 1"** button.
7. Tap complete set → **between-set rest screen**: countdown timer (180s default), a "Get ready — Set 2/4" row, and a **"Skip — continue"** button.
8. Repeat until the end of the last exercise → the workout ends. This is the whole demo.

## Screens and Layout

1. **Home screen** — like the learner's mockup: statistic cards, a "Consistency" card (streak + check-in calendar), and a "Your plan" section containing the "Test Set" card + a large ▶ button. Display only; no interaction beyond the ▶ button.
2. **Machine check sheet** — bottom sheet like the mockup: "EXERCISE 1/5", exercise name, chips (kg · sets · reps), free/busy question, two large buttons.
3. **Busy-choice sheet** — two options: "Choose a suggested exercise" / "Choose another exercise from the plan".
4. **Replacement list screen** — list: up to 3 direct options + "show more"; each row: illustration, name, tags (Recommend / Different movement style), muscle group, equipment, reason, and difference from the original exercise.
5. **Training screen** — like the mockup: exercise title, 3 chips (Weight lock / Rep range / Rest), a "Current set" block with the current set large + S1–S4 chips, a "Next up" section (next exercise: name + sets · weight), and a "Complete set N" button.
6. **Rest screen** — like the mockup: "Between-set rest" title, large countdown ring, "Get ready — Set N/M" row, "Skip — continue" button.

## Look and Feel

- Follow the learner's design mockup: white background, **dark blue** as the primary color for buttons/accents, large bold text, large rounded cards, light-gray information chips.
- Exercise illustrations: **RepDB Free** (flat style, 512px WebP) — do not use `premium-samples/`, do not use Lyfta images directly.
- Target muscle region **highlighted in red** with **MuscleMap** SVG (the two illustrations may sit side by side if that works better). If MuscleMap cannot split upper/middle/lower chest or front/side/rear delts → **do not color the whole group and claim the region was split**: use a `target_region` text label and present it honestly (high-level muscle group, text naming the region). An explicitly approximate mask is acceptable only when it is labeled "(approx.)" in the UI and Credits.
- Attribution **"Exercise data by RepDB (repdb.co)"** displayed in the app (credits/secondary screen) + README.

## Features and Behavior

### Recommendation Engine (the heart of the PoC)

- **Hard filter (stage 1):** a candidate must match **both** the original exercise's `muscle_group` and `target_region` (upper chest ≠ middle chest ≠ lower chest; front delts ≠ side delts ≠ rear delts…). If the original exercise or a candidate has no classified region → it does not enter the top list.
- **Scoring (stage 2):** score = movement similarity 80% (`movement_family` + `movement_pattern`: same family + pattern is highest; different family, same pattern = medium → "Different movement style" tag) + exercise type 20% (compound/isolation match).
- **No hard-coded relationship table for each exercise pair**; no unsupported muscle-activation scores (e.g., Chest = 3, Triceps = 2, Front delts = 1); no LLM in the MVP.
- **Honest meaning:** the app states clearly that ranking is "movement similarity", not a claim of scientifically equivalent training effect.
- **Not enough candidates in a region (for example, the test set has only one other Quads exercise besides Squat):** show a clear *"No suitable substitute yet (region X)"* message; do not pad the list.

### Exercise Data Classification

The taxonomy table was approved point by point by the learner (families: Press · Pull · Squat · Hinge · Raise; specific patterns under each family):

| # | Exercise (Test Set) | muscle_group | target_region | family | pattern | type |
|---|---|---|---|---|---|---|
| 1 | Incline Barbell Press | Chest | Upper | Press | Incline Press | Compound |
| 2 | Flat Bench Press | Chest | Middle | Press | Horizontal Press | Compound |
| 3 | Lateral Raise | Shoulders | Side | Raise | Lateral Raise | Isolation |
| 4 | Lat Pulldown | Back | Lats | Pull | Vertical Pull | Compound |
| 5 | Squat | Legs | Quads | Squat | Squat Pattern | Compound |

Expected candidates (actual names from the clone; if an exercise is missing → **report the data gap, do not invent an exercise**) — ⚠ = `needs-review`:

| Original exercise | Same-family candidates | Different-family candidates ("Different movement style" tag) |
|---|---|---|
| Incline Barbell Press | Incline Dumbbell Press · Smith Machine Incline Press | Low-to-High Cable Fly |
| Flat Bench Press | Dumbbell Bench Press · Machine Chest Press · Smith Machine Bench Press · Push-Up | Pec Deck Fly · Cable Fly ⚠ |
| Lateral Raise | Cable Lateral Raise · Machine Lateral Raise · Dumbbell Lateral Raise (if separate from the original) | — (the real database has no other side-delt exercise) |
| Lat Pulldown | Pull-Up · Chin-Up · Seated Cable Row (same family, different pattern → lower score) · One-Arm Dumbbell Row | Straight-Arm Pulldown ⚠ |
| Squat | Leg Press · Hack Squat · Front Squat · Goblet Squat | Bulgarian Split Squat ⚠ (unilateral; the lunges family is not declared) |

- The learner approved expanding the list during build (after seeing the real data): added Smith Machine Bench Press, Pec Deck Fly, One-Arm Dumbbell Row, Goblet Squat; promoted Low-to-High Cable Fly, Push-Up, Chin-Up, Front Squat from ⚠ to classified. Total **26 rows** in the new DB: **23 classified + 3 `needs-review`**.
- Shoulders/Side has only 2 classified candidates in the real data → accept fewer than top 3; do not invent exercises.

Movement score matrix (80%): same family + same pattern = 1.0 → Recommend tag; same family + different pattern = 0.6; different family = 0.3 + mandatory "Different movement style" tag, never Recommend. Exercise type (20%): match = 1, no match = 0.

- Metadata fields: `muscle_group`, `target_region`, `movement_family`, `movement_pattern`, `exercise_type`, `classify_status`.
- AI may help classify the Test Set exercises + candidates; **uncertain cases are marked `needs-review` for the learner to check**; do not invent domain information.
- Do not classify all 650 RepDB exercises / update them in bulk in the MVP.

### Workout and Exercise Substitution

- **UX principle (important):** CheckSheet and BusyChoiceSheet **are not an equipment-declaration flow**. The user only indicates "I can't do this exercise right now" and asks for a substitute. The app **does not ask** which equipment the user has; the engine **never** filters results by equipment status; the suggestion list is identical regardless of "which machine is busy". The user checks the gym and chooses.
- Per-exercise sheet: machine free → train now; machine busy → **two-choice sheet**: (1) open the suggested replacement list; (2) **"choose another exercise from the plan to do first"** → open the **list of remaining exercises in the plan** so the user can choose; the busy exercise moves to the end of the plan and **remains in the list**; when it comes back, ask again whether the machine is free. The picker always has a **Back** button; if there are no other exercises besides the current one → show a clear message and a Back button (the learner confirmed this behavior at build).
- Choose a substitute → replace the old exercise's slot in the Test Set → go to the **training screen** for the new exercise.
- Training screen: current set, four set chips (S1–S4), "Next up"; "Complete set" → rest screen → countdown → "Skip — continue" → next set or next exercise.
- Defaults for a suggested exercise: **sets/reps come from the exercise record's defaults**; **kg = 99 (placeholder for every exercise)** — weight conversion will be added after the competition.

### Data

- **New Supabase project cloned from the old Supabase** (Gym Tracker's 100+ exercises). The old Supabase is **read-only, untouched**.
- **Report exactly which tables are copied** and which columns are copied (name, ID, sets/reps/rest if present) before migrating.

### Demo Script (video ~1 minute, illustrating the real flow — not a separate feature)

Tap ▶ on Test Set to start → busy-exercise sheet → tap "Busy" → **choose "Choose a suggested exercise"** → top 3 list appears → tap **"show more"** to reveal more exercises → **choose the top exercise with the Recommend tag** → it replaces the old slot → train normally (training screen → complete set → rest → continue). There is no equipment-input feature — that is only demo context, not a new feature.

## States and Boundaries

- **Empty state (no candidates in the region):** show a clear message instead of a list with too few candidates. Source: learner decision *"if there are no suitable candidates, say so clearly"*.
- **Unclassified exercise (needs-review):** never enters the engine; show a "pending classification" label instead of suggesting it; the learner reviews the flagged exercises.
- **Original exercise with an unclear priority region when the user requests a substitute:** the app immediately asks "which region is your training goal?" for that session — the user's decision, without changing the original metadata.
- **Metric data (streak…):** fixed, display only, not updated by actual training.
- **Old Supabase data:** strictly read-only; all writes go to the new clone.
- **No login:** a single user (the learner).

## Product Decisions

- **MVP is Exercise Substitution only; Workout Rescue (adjusting the plan based on remaining time) comes later** — avoid scope creep, make the demo work now.
- **Two-stage dynamic scoring engine (80/20), no self-defined exercise-pair table, no LLM in the MVP** — easy to extend, transparent logic.
- **No automatic weight/rep conversion; use default values + kg = 99 placeholder** — honest about data limits; add later.
- **Separate "Different movement style" tag** for different-family exercises — do not present them as fully equivalent.
- **Do not ask for photos / gym equipment declarations** — the user checks the gym themselves.
- **New Supabase copy (clone of the old one)** — avoid touching the real app's data; rest time comes from the clone.
- **RepDB Free illustrations + MuscleMap SVG; RepDB attribution required** — respect licenses; MuscleMap is MIT.
- **Home screen keeps its design with sample data** — creates demo context, low effort because it is display only.
- **Test Set has 5 original test exercises: Incline Barbell Press, Flat Bench Press, Lateral Raise, Lat Pulldown, Squat** — each should have 3–5 candidates from the clone; if data is missing, report the gap, do not invent; top 3 + "show more".
- **English exercise names only** — submitting to US-based organizers; drop Vietnamese names in parentheses.
- **All UI copy in English** (learner request at build for the Devpost submission) — replaces the earlier "Vietnamese UI" decision; exercise names remain English.

## What We're Building

The complete flow: home screen (mockup) → Test Set ▶ → per-exercise machine check sheet → "busy" → **two-choice sheet (suggested exercise / another exercise first)** → replacement list (top 3 + show more, tags, reason, equipment, difference) → choose → replace the old slot → training screen → rest screen → continue. Alongside: metadata classification for Test Set exercises + candidates, two-stage engine, empty state, region fallback question for exercises with an unclear region, RepDB images + MuscleMap red highlighting, RepDB attribution, and a resource-transparency disclosure ready for submission.

## Deferred From the POC

- **Automatic weight/rep/double-progression conversion between exercises** — internal technical design, add after the competition; the MVP uses default values + kg 99.
- **Workout Rescue** (adjusting the plan based on remaining time) — extension idea after feedback.
- **LLM in the Recommendation Engine** — better, but unnecessary for the PoC.
- **Classifying all 100+ / 650 exercises** — only the 5 Test Set exercises + their candidates for now.
- **A fully functional home screen** (live streak, calendar updates) — data is display only.

## Possible Later Enhancements

- Weight/rep conversion between exercises (exercise pairs + coefficients, or a target weight entered by the user) — attach after the competition, add to the real app.
- Filter suggestions by the equipment the user has in the gym at that moment (if there is a quick, honest way to declare it).
- Expand the classification catalog and test more muscle regions beyond the 5-exercise test set.

## Non-Goals

- No login / multiple users.
- No automatic machine detection (camera/sensors).
- Do not modify or delete the old Gym Tracker Supabase data.
- Do not re-host Lyfta images; **do not claim ownership of Lyfta images**.
- Do not invent reused-resource disclosure text — always ask the learner to confirm.
- Do not use RepDB images as input for generative AI models; do not redistribute RepDB as a dataset/API.

## Resolved Questions

- **RepDB usage:** resolved — bundle only the image files used by the app (in-app use, with attribution); do not redistribute the dataset or use the images as AI input.
- **MuscleMap region support:** resolved — side delts, lats, and quads have exact paths; MuscleMap has no upper/middle/lower chest path, so chest uses an explicitly approximate mask labeled "(approx.)" in the UI and Credits.
- **Behavior of option (2) "choose another exercise from the plan to do first":** show the remaining exercises, always provide a Back button, and show a separate message when no other exercise remains.
