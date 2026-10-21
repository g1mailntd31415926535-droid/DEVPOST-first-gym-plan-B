import type { Exercise } from '../types';
import { SEED_EXERCISES, TEST_PLAN_ORDER } from './seed';

export type DataSource = 'seed' | 'supabase';

/**
 * Slice 1: the catalog is the seeded sample set. Slice 3 swaps this for the
 * new Supabase project and keeps the seed as the offline fallback.
 */
export async function loadExercises(): Promise<{ exercises: Exercise[]; source: DataSource }> {
  return { exercises: SEED_EXERCISES, source: 'seed' };
}

/** Test Set is declared in code; resolved by name so real UUIDs can replace seed ids later. */
export function buildTestPlan(all: Exercise[]): Exercise[] {
  return TEST_PLAN_ORDER.map((name) => {
    const found = all.find((exercise) => exercise.name === name);
    if (!found) throw new Error(`Missing Test Set exercise: ${name}`);
    return found;
  });
}
