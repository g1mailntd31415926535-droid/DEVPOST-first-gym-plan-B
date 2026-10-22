import type { SupabaseClient } from '@supabase/supabase-js';
import type { ClassifyStatus, Exercise, ExerciseType, MovementFamily, MuscleGroup } from '../types';
import { bundledImageFor, SEED_EXERCISES, TEST_PLAN_ORDER } from './seed';
import { supabase } from '../lib/supabase';

export type CatalogSource = 'seed' | 'supabase';

export interface Catalog {
  exercises: Exercise[];
  source: CatalogSource;
  /** Why the seed was used, for the demo banner and the console. */
  note?: string;
}

export interface ExerciseRow {
  id: string;
  name: string;
  default_sets: number;
  default_min_rep: number;
  default_max_rep: number;
  default_rest_seconds: number;
  equipment: string | null;
  muscle_group: string;
  target_region: string;
  movement_family: string;
  movement_pattern: string;
  exercise_type: string;
  classify_status: string;
  image_asset: string | null;
}

export const EXERCISE_COLUMNS = [
  'id',
  'name',
  'default_sets',
  'default_min_rep',
  'default_max_rep',
  'default_rest_seconds',
  'equipment',
  'muscle_group',
  'target_region',
  'movement_family',
  'movement_pattern',
  'exercise_type',
  'classify_status',
  'image_asset',
].join(',');

export const SUPABASE_TIMEOUT_MS = 8000;

/** DB snake_case row -> app camelCase shape. No derived scores live in the DB. */
export function mapExerciseRow(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    name: row.name,
    defaultSets: row.default_sets,
    defaultMinRep: row.default_min_rep,
    defaultMaxRep: row.default_max_rep,
    defaultRestSeconds: row.default_rest_seconds,
    equipment: row.equipment,
    muscleGroup: row.muscle_group as MuscleGroup,
    targetRegion: row.target_region,
    movementFamily: row.movement_family as MovementFamily,
    movementPattern: row.movement_pattern,
    exerciseType: row.exercise_type as ExerciseType,
    classifyStatus: row.classify_status as ClassifyStatus,
    // Older Supabase rows may not have image_asset yet; use the bundled copy.
    imageAsset: row.image_asset ?? bundledImageFor(row.name),
  };
}

export async function fetchExercisesFromSupabase(
  client: SupabaseClient | null = supabase,
): Promise<Exercise[]> {
  if (!client) throw new Error('Supabase is not configured');

  const query = client
    .from('exercises')
    .select(EXERCISE_COLUMNS)
    .order('name', { ascending: true });

  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Supabase request timed out')), SUPABASE_TIMEOUT_MS);
  });

  const { data, error } = await Promise.race([query, timeout]);
  if (error) throw new Error(error.message);
  if (!data) return [];

  return (data as unknown as ExerciseRow[]).map(mapExerciseRow);
}

/**
 * Slice 3: use the real catalog when it is configured and reachable, and keep
 * the demo alive with the bundled seed when it is not. The Test Set must exist
 * in the fetched data, otherwise we fall back rather than show a broken plan.
 */
export async function loadExercises(
  fetcher: () => Promise<Exercise[]> = fetchExercisesFromSupabase,
): Promise<Catalog> {
  try {
    const exercises = await fetcher();
    const missing = TEST_PLAN_ORDER.filter(
      (name) => !exercises.some((exercise) => exercise.name === name),
    );
    if (missing.length > 0) {
      throw new Error(`Test Set exercises missing from Supabase: ${missing.join(', ')}`);
    }
    return { exercises, source: 'supabase' };
  } catch (error) {
    const note = error instanceof Error ? error.message : 'Unknown data error';
    return { exercises: SEED_EXERCISES, source: 'seed', note };
  }
}

/** Test Set is declared in code; resolved by name so real UUIDs can replace seed ids. */
export function buildTestPlan(all: Exercise[]): Exercise[] {
  return TEST_PLAN_ORDER.map((name) => {
    const found = all.find((exercise) => exercise.name === name);
    if (!found) throw new Error(`Missing Test Set exercise: ${name}`);
    return found;
  });
}
