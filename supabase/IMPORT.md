# Importing exercises into the new Supabase project

Goal: a **new, separate** project holds a read-only copy of the exercises Gym Plan B needs, keeping
the original Gym Tracker UUIDs. The old project is only ever read from.

## 1. Export from the old project (read-only)

Do not edit or delete anything in the old project. In its SQL editor, run a **select** (learner
chose a full-table export, so we can pick the right rows offline):

```sql
select id, name, default_sets, default_min_rep, default_max_rep, default_rest_seconds, equipment
from public.exercises
order by name;
```

Download the result as CSV and save it to `supabase/import/old-exercises.csv`. That folder is
gitignored: raw exports never enter the repo. From this file we select the 5 Test Set exercises
plus ~3–5 candidates per target region; only those rows are inserted into the new project. No auth
tables, profiles, history, or credentials are exported.

Needed columns are exactly the seven above. Do **not** include `image_url`, `exercise_image_url`,
`muscle_diagram_url`, or `video_url` (Lyfta assets are not licensed for this project).

## 2. Create the new project

1. Create a new Supabase project (free tier) used only for Gym Plan B.
2. Open **SQL Editor** and run [`schema.sql`](./schema.sql). It creates `public.exercises` with
   RLS enabled and a select-only policy.
3. Copy **Project URL** and the **anon public** key into `.env.local` (see `.env.example`).
   Never put `service_role` or the database password in the frontend or the repo.

## 3. Insert the curated rows

Run [`seed.sql`](./seed.sql) in the new project's SQL editor. It imports **26 rows** with explicit
Gym Tracker UUIDs: the 5 Test Set exercises, 3–5 classified candidates per target region, and 3
uncertain candidates kept as `needs-review` (they never appear in swap results).

- Names use the approved English labels; Vietnamese translations are stripped.
- `default_sets / min_rep / max_rep / rest / equipment` are copied unchanged from the old rows.
- `on conflict (id) do update` makes the file safe to re-run after a taxonomy fix.
- `image_asset` is filled by `seed.sql` with the bundled RepDB path (e.g. `/exercises/incline-barbell-press.webp`). Re-run `seed.sql` after pulling the images; the app also falls back to the bundled path by exercise name if an older row still has `null`.

## 4. Verify before wiring the app

```sql
select count(*) from public.exercises;
select id, name, muscle_group, target_region, classify_status
from public.exercises
order by name;
```

- Count matches the number of exported rows.
- Every UUID matches the old row for the same exercise name.
- No table other than `exercises` exists in the new project's public schema.

Then check the read-only API (replace the placeholders):

```bash
curl "$SUPABASE_URL/rest/v1/exercises?select=id,name&limit=3" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY"
```

It must return `200` with rows. A write attempt with the anon key must fail.

## 5. Run the app

`.env.local` is loaded by Vite at startup, so restart `npm run dev`. The Home screen banner
("Sample data — Supabase is not connected") disappears when the real catalog loaded successfully.
If the request fails or the Test Set names are missing, the app falls back to the bundled seed on
purpose so a demo never breaks.
