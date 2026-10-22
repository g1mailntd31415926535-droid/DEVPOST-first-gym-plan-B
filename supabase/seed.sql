-- Gym Plan B — curated exercise rows (22)
-- Run AFTER schema.sql in the NEW Supabase project (SQL editor).
-- IDs are the original Gym Tracker UUIDs. Names are the approved English labels
-- (Vietnamese translations stripped); sets/reps/rest/equipment are copied as-is.
-- Anything uncertain is left as needs-review and never appears in swap results.

insert into public.exercises (
  id, name, default_sets, default_min_rep, default_max_rep, default_rest_seconds,
  equipment, muscle_group, target_region, movement_family, movement_pattern,
  exercise_type, classify_status, image_asset
) values
  -- Test Set originals
  ('7a6d5f7b-68f7-a9c3-0976-47c8ea85343c', 'Incline Barbell Press', 3, 6, 10, 180,
   'Barbell', 'Chest', 'Upper', 'Press', 'Incline Press', 'compound', 'classified', null),
  ('1f9b0699-9811-a441-8a01-0fc93c810e5e', 'Flat Bench Press', 3, 6, 10, 180,
   'Barbell', 'Chest', 'Middle', 'Press', 'Horizontal Press', 'compound', 'classified', null),
  ('8c58c437-f8ad-797c-3af1-abaa5188835d', 'Lateral Raise', 3, 10, 15, 120,
   'Dumbbell', 'Shoulders', 'Side', 'Raise', 'Lateral Raise', 'isolation', 'classified', null),
  ('d1be49f9-9bd6-6b7e-93b0-fc4f72bd5a5d', 'Lat Pulldown', 3, 8, 12, 180,
   'Cable', 'Back', 'Lats', 'Pull', 'Vertical Pull', 'compound', 'classified', null),
  ('1382982e-3cb2-597e-1076-9027e45ee507', 'Squat', 3, 6, 10, 180,
   'Barbell', 'Legs', 'Quads', 'Squat', 'Squat Pattern', 'compound', 'classified', null),

  -- Chest / Upper candidates
  ('95480247-9686-a23a-30c1-0c7ccfb2b324', 'Incline Dumbbell Press', 3, 8, 12, 180,
   'Dumbbell', 'Chest', 'Upper', 'Press', 'Incline Press', 'compound', 'classified', null),
  ('bb29f49e-3ec2-da74-92a8-44232068acab', 'Smith Machine Incline Press', 3, 8, 12, 180,
   'Smith machine', 'Chest', 'Upper', 'Press', 'Incline Press', 'compound', 'classified', null),
  ('a9de94cb-46f3-217e-9d32-9b31fb81d410', 'Low-to-High Cable Fly', 3, 10, 15, 120,
   'Cable', 'Chest', 'Upper', 'Raise', 'Chest Fly', 'isolation', 'needs-review', null),

  -- Chest / Middle candidates
  ('e31cb09b-779d-956d-2d2f-ba314c291194', 'Dumbbell Bench Press', 3, 8, 12, 180,
   'Dumbbell', 'Chest', 'Middle', 'Press', 'Horizontal Press', 'compound', 'classified', null),
  ('6bcde17a-7ae5-9fe3-409a-349982b98392', 'Machine Chest Press', 3, 8, 12, 180,
   'Machine', 'Chest', 'Middle', 'Press', 'Horizontal Press', 'compound', 'classified', null),
  ('5cea0c17-9c72-4030-3ea8-e5be61463786', 'Cable Fly', 3, 10, 15, 120,
   'Cable', 'Chest', 'Middle', 'Raise', 'Chest Fly', 'isolation', 'needs-review', null),
  ('60ee059c-93c2-b86e-be4c-1acd52e7a0c4', 'Push-Up', 3, 10, 15, 120,
   'Body weight', 'Chest', 'Middle', 'Press', 'Horizontal Press', 'compound', 'needs-review', null),

  -- Shoulders / Side candidates
  ('2f14b062-c517-3f70-1e61-5e34733f2fae', 'Cable Lateral Raise', 3, 10, 15, 120,
   'Cable', 'Shoulders', 'Side', 'Raise', 'Lateral Raise', 'isolation', 'classified', null),
  ('30a1355e-ad45-3265-c99b-b16549a60c60', 'Machine Lateral Raise', 3, 10, 15, 120,
   'Machine', 'Shoulders', 'Side', 'Raise', 'Lateral Raise', 'isolation', 'classified', null),

  -- Back / Lats candidates
  ('80e38928-4bb0-5232-9cc1-21a3fae085f0', 'Pull-Up', 3, 6, 10, 180,
   'Body weight', 'Back', 'Lats', 'Pull', 'Vertical Pull', 'compound', 'classified', null),
  ('605ea42e-de97-cb9f-1c31-0729c45ed23f', 'Seated Cable Row', 3, 8, 12, 120,
   'Cable', 'Back', 'Lats', 'Pull', 'Horizontal Pull', 'compound', 'classified', null),
  ('420c8581-366f-313c-e451-c7ab91d9936b', 'Chin-Up', 3, 6, 10, 180,
   'Body weight', 'Back', 'Lats', 'Pull', 'Vertical Pull', 'compound', 'needs-review', null),
  ('599ddcab-cd1c-314f-3d0f-0efee2dc48ae', 'Straight-Arm Pulldown', 3, 10, 15, 120,
   'Cable', 'Back', 'Lats', 'Pull', 'Straight-Arm Pull', 'isolation', 'needs-review', null),

  -- Legs / Quads candidates
  ('9bdd23e2-52a6-26c0-8fb2-a6e29e6c01ed', 'Leg Press', 3, 8, 12, 180,
   'Machine', 'Legs', 'Quads', 'Squat', 'Squat Pattern', 'compound', 'classified', null),
  ('b54d7630-eae6-e665-c4c4-60a8d86cbc29', 'Hack Squat', 3, 8, 12, 180,
   'Machine', 'Legs', 'Quads', 'Squat', 'Squat Pattern', 'compound', 'classified', null),
  ('df396a63-a303-de15-3624-f4ab971075ed', 'Front Squat', 3, 6, 10, 180,
   'Barbell', 'Legs', 'Quads', 'Squat', 'Squat Pattern', 'compound', 'needs-review', null),
  ('decd54e4-7129-e82e-dcee-08fe1ec2da70', 'Bulgarian Split Squat', 3, 8, 12, 180,
   'Dumbbell', 'Legs', 'Quads', 'Squat', 'Split Squat', 'compound', 'needs-review', null)
on conflict (id) do update set
  name = excluded.name,
  default_sets = excluded.default_sets,
  default_min_rep = excluded.default_min_rep,
  default_max_rep = excluded.default_max_rep,
  default_rest_seconds = excluded.default_rest_seconds,
  equipment = excluded.equipment,
  muscle_group = excluded.muscle_group,
  target_region = excluded.target_region,
  movement_family = excluded.movement_family,
  movement_pattern = excluded.movement_pattern,
  exercise_type = excluded.exercise_type,
  classify_status = excluded.classify_status,
  image_asset = excluded.image_asset;
