# Gym Plan B — Exercise Substitution

A mobile-first proof of concept for the moment a gym machine is busy: instead of abandoning the exercise, open Gym Plan B, say the machine is busy, and get ranked substitutes that train the **same muscle group and target region**.

Built for the Devpost **Build With AI: Basics** hackathon. It runs locally; it is not deployed.

## Try It

Requirements: **Node 20+** and npm.

```bash
npm install
npm run dev
```

Open <http://localhost:5173>. The app is designed for a phone frame; DevTools → device toolbar → **390 × 844** gives the intended view.

On Windows PowerShell, if `npm` is blocked by the execution policy, use `npm.cmd` instead:

```powershell
npm.cmd install
npm.cmd run dev
```

### Optional: connect the read-only Supabase project

The demo works without any configuration: it falls back to the bundled 26-exercise catalog and shows a **“Live data is unavailable”** banner. To use the live catalog:

1. Copy `.env.example` to `.env.local`.
2. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the new Gym Plan B Supabase project. Use the **anon** key only.
3. Apply `supabase/schema.sql` and `supabase/seed.sql` in that project (the seed is idempotent).
4. Restart `npm run dev`.

See `supabase/IMPORT.md` for the read-only import notes. Never put a `service_role` key or database password in the frontend or the repository.

## Demo Path (about 1 minute)

1. Home → tap ▶ on the **Test Set** card.
2. Exercise 1 → **Machine busy — swap exercise**.
3. Choose **See suggested swaps** → top 3 same-region options, ranked by movement similarity.
4. Pick the **Recommend** option → the training screen shows the substitute in the old slot.
5. Complete a set → rest countdown → **Skip rest — train now**.
6. Optional: choose **Do another exercise first**, pick another exercise from the plan, and confirm the busy exercise returns later.

## What It Does

- **Hard filter first:** only exercises with the same `muscle_group` and `target_region` (for example, upper chest only matches upper chest).
- **Then score:** movement similarity is 80% of the score (same movement family + pattern ranks highest) and exercise type is 20% (compound/isolation match).
- **Honest tags:** the strongest same-movement candidate gets **Recommend**; different-family candidates get **Different movement style** and can never be Recommend.
- **No padding:** if a region has no verified candidates, the app says so instead of filling the list.
- **Rule-based, not a lookup table:** there is no per-pair substitution table and no invented muscle-activation coefficients; the score uses stored movement metadata and exercise type.
- **No equipment questionnaire:** the app never asks what equipment exists and the engine never filters by equipment. You check the gym and choose.
- **No automatic weight conversion:** substitutes show their own default sets/reps and a `99 kg` placeholder.
- **No LLM at runtime:** ranking is deterministic TypeScript.

The home screen statistics, streak and check-in calendar are fixed sample data for demo context. Workout state lives in memory and resets on reload. Workout Rescue, login, and real weight conversion are out of scope for this PoC.

## Verification

```bash
npm test
npm run build
```

The tests cover the hard filter, 80/20 scoring, Recommend/different-style rules, empty results, needs-review exclusion, deferred exercises, and the rest-timer state machine. The build runs TypeScript and Vite.

## Reused Data and Transparency

Gym Plan B is a new app, but it does **not** claim the exercise database was built from scratch.

**Reused from the author's earlier Gym Tracker project (pre-hackathon):**

- 26 exercise rows in a **new, separate, read-only Supabase project**: exercise names, original UUIDs, default sets/reps/rest, and equipment.
- The old Gym Tracker Supabase project is never modified.

**Built for this hackathon:**

- The Exercise Substitution flow and UI.
- The two-stage recommendation engine and its tests.
- New classification metadata (`muscle_group`, `target_region`, `movement_family`, `movement_pattern`, `exercise_type`, `classify_status`).
- The session/rest state machine, illustration and muscle-region components, and the English interface.

**AI assistance:** AI was used as a planning and coding assistant, and to help draft the exercise classification table. Uncertain classifications were marked `needs-review` and excluded from results. No AI model is called when the app runs.

**Not reused:** Lyfta images or other Lyfta-hosted assets. The app bundles only the RepDB illustrations needed for the Test Set and its candidates.

## Images, Licenses, and Attribution

- **Exercise data and flat illustrations:** [RepDB](https://repdb.co/) — [RepDB Free Exercise Dataset](https://github.com/RepDB/exercise-dataset). Free-tier, in-app use with visible attribution. Only the 26 needed 512×512 WebP images are bundled in `public/exercises/`; the dataset itself and `premium-samples/` are not redistributed.
  Required attribution: **“Exercise data by RepDB (repdb.co)”**.
- **Body figure:** [MuscleMap](https://github.com/Jsplice/MuscleMap) via `@musclemap/react`, `@musclemap/core`, and `@musclemap/assets` 1.1.0 (MIT). MuscleMap has no upper/middle/lower chest path, so chest uses an explicitly approximate mask labeled **(approx.)**; this is visual emphasis, not an anatomical boundary from the library.
- Full notices: `THIRD_PARTY_NOTICES.md` and `public/exercises/ATTRIBUTION.md`.

## Project Notes

- Stack: React 18 + Vite 6 + TypeScript + Tailwind CSS 3, with Vitest for the pure engine/reducer tests.
- `devpost/` contains the approved scope, PRD, technical spec, and build checklist.
- `.env.local` and `devpost/learner-profile.md` are gitignored.
- No secrets, auth data, or user data are committed.

## Disclaimer

Gym Plan B is a proof-of-concept demo, not medical or training advice. Ranking is an internal rule of thumb for movement similarity, not a scientific claim that two exercises produce equivalent results.
