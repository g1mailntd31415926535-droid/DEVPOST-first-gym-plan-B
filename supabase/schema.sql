-- Gym Plan B — read-only exercise catalog
-- Run this in the SQL editor of the NEW Supabase project only.
-- Never run it against the old Gym Tracker project.

create table if not exists public.exercises (
  id uuid primary key,
  name text not null unique,
  default_sets int4 not null default 3 check (default_sets between 1 and 20),
  default_min_rep int4 not null check (default_min_rep > 0),
  default_max_rep int4 not null check (default_max_rep >= default_min_rep),
  default_rest_seconds int4 not null default 90 check (default_rest_seconds >= 0),
  equipment text,
  -- New classification metadata (assigned during import; not present in Gym Tracker).
  muscle_group text not null check (muscle_group in ('Chest', 'Shoulders', 'Back', 'Legs', 'Arms', 'Core')),
  target_region text not null,
  movement_family text not null check (movement_family in ('Press', 'Pull', 'Squat', 'Hinge', 'Raise')),
  movement_pattern text not null,
  exercise_type text not null check (exercise_type in ('compound', 'isolation')),
  classify_status text not null default 'needs-review' check (classify_status in ('classified', 'needs-review')),
  image_asset text,
  created_at timestamptz not null default now()
);

comment on table public.exercises is
  'Read-only app catalog. Rows keep their Gym Tracker UUIDs; no user/auth data is copied.';

alter table public.exercises enable row level security;

-- Read-only for the app. There is deliberately NO insert/update/delete policy:
-- imports happen in the SQL editor (owner role), and anon cannot write.
drop policy if exists "exercises are readable by anon" on public.exercises;
create policy "exercises are readable by anon"
  on public.exercises
  for select
  to anon, authenticated
  using (true);

grant select on public.exercises to anon, authenticated;
revoke insert, update, delete on public.exercises from anon, authenticated;
