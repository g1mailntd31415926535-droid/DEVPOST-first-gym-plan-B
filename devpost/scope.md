---
doc: scope
status: approved
---

# Gym Plan B — Exercise Substitution

A standalone mini-app (a new project, separate from the learner's older Gym Tracker app): when someone else is using the machine for an exercise in the training plan, the app asks *"Is the machine free?"* → the user taps "Busy — choose another exercise" → the engine automatically suggests substitute exercises, prioritizing preservation of the training goal. The MVP focuses only on **Exercise Substitution**; Workout Rescue (adjusting the plan based on remaining time) is a later extension idea and is **not built**.

The learner **already has a gym-tracking app** (Gym Tracker) built long ago, which often has bugs. This time we **do not modify the old app**; instead we build a separate mini-app that solves one secondary problem for gym-goers. After the hackathon, this project will be added to the old app.

## The Unique Kernel
The "machine is taken" moment is solved on the spot by a **metadata-driven Recommendation Engine** (not a hard-coded relationship table defined for every exercise pair): hard-filter by the same muscle group + **target region** (upper chest only matches upper chest…), then score similarity = movement similarity (80%) + exercise type, compound/isolation (20%). The score is an internal "movement similarity" rule, **not** a scientific claim of equivalent training effect. **No automatic weight/rep conversion** between exercises — the learner will add that later. If there are not enough candidates → **say so clearly**, and do not pad the list.

## Who It's For
The learner — a gym-goer with an existing training plan. Today, when a machine is taken, they have to think of an equivalent exercise themselves; now they tap "machine busy" and get options, then check the gym equipment themselves and choose.

## The Core Loop
Open the app → the home screen keeps the mockup design (streak, check-in calendar, statistics) with **sample data**, display only → the **"Test Set"** plan card → tap ▶ → a per-exercise sheet asks *"Is this machine / station free right now?"* → machine free: train as planned; **machine busy** → suggestion list: **top 3 + "show more"**, each option shows the name, illustration, target muscle group, required equipment, reason it was suggested (the top exercise has a Recommend tag), and the important difference from the original → the user checks which equipment is free in the gym and chooses → the new exercise replaces the old one in the same slot → minimal training screen (tick sets) → rest timer → continue.

## Inspiration & Identity
White/dark blue, rounded corners, large bold type — following the mockup images the learner provided. Exercise illustrations: **RepDB Free** (respecting the user's requirement). Target muscle regions highlighted in red, Lyfta-style, using **MuscleMap SVG**; the two illustrations can sit side by side if needed. If the library does not support splitting a region (upper/middle/lower chest) → **do not color the whole group and claim it is the region**; use a text label and present it honestly.

## Why This Matters to the Learner
Built for himself, with the result folded back into the real app after the hackathon. It is also a chance to practice plan-first AI-assisted building.

## What "Working" Looks Like
A demo of about 1 minute: open the app (home screen already visible) → select Test Set → exercise 1 sheet "is the machine free?" → "Busy — choose another exercise" → top 3 list with reasons and equipment → choose a free, suitable exercise → training screen for the new exercise → complete a set → countdown rest → continue.

## The POC Boundary
- Home screen uses sample data (display only); the sample plan is named **Test Set** (the shoulder exercises from the mockup plus Incline Barbell Press).
- **Five-exercise test set:** Incline Barbell Press, Flat Bench Press, Lateral Raise, Lat Pulldown, Squat.
- Data is a **private copy for Plan B: a new Supabase project cloned from the old Supabase** (rest time in particular comes from this copy), so the old Gym Tracker app data is untouched. Reuse part of the exercise data from Gym Tracker (name, ID, sets/reps/rest…) plus new metadata (muscle_group, target_region, movement_family, movement_pattern, exercise_type, classify_status). AI can help classify; uncertain cases are **marked needs_review** for the learner to check. The old Supabase is **read-only, never modified or deleted**.
- Two-stage engine (region filter → scoring), no LLM in the MVP; 80/20 weights.
- Minimal training screen + rest timer as in the mockup; suggested sets/reps use **default values**, **kg = 99 (placeholder for every exercise)** — weight conversion comes later.
- RepDB Free illustrations + MuscleMap; visible RepDB attribution; verify the MuscleMap regions, with an honest fallback.
- Use AI to help classify the test-set exercises only; do not classify all 650 exercises now.

## Later
Weight/rep conversion between exercises, Workout Rescue, an LLM in the engine, expanding classification to all 100+ exercises, a dynamic home screen backed by real data, loading a real plan, and inventing other scenarios.

## Explicitly Cut
- **Asking the user to photograph or declare gym equipment** — the user checks the gym themselves and only taps "machine busy".
- **Automatic weight/rep conversion** — not enough evidence yet; add later.
- **Re-hosting Lyfta images** on Supabase — no suitable rights; reuse old data only as disclosed.
- **Modifying the old Gym Tracker Supabase** — read-only.
- **Login, automatic machine detection (camera/sensors)**.

## Resource Transparency (a cross-cutting requirement, especially at `6-ship`)
Gym Plan B uses part of the data from the earlier Gym Tracker project (which existed before the hackathon). We must: clearly separate old resources from new development (the engine + algorithm are the hackathon's new value); track exactly what is reused; **not claim the project was built from scratch**; not claim ownership of Lyfta images — use only licensed images and credit them; at `6-ship`, **proactively remind the learner to disclose this**, ask them to confirm the exact list of reused resources before writing, and never write the disclosure on their behalf. The submission should show that part of the existing data was reused to save time building the Exercise Database; the new value is Exercise Substitution + the Recommendation Engine.
