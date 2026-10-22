import { describe, expect, it } from 'vitest';
import {
  fetchExercisesFromSupabase,
  loadExercises,
  mapExerciseRow,
  type ExerciseRow,
} from './exercises';
import { SEED_EXERCISES } from './seed';

const row: ExerciseRow = {
  id: '2f6a7b10-0000-4000-8000-000000000001',
  name: 'Incline Barbell Press',
  default_sets: 4,
  default_min_rep: 8,
  default_max_rep: 12,
  default_rest_seconds: 180,
  equipment: 'Barbell',
  muscle_group: 'Chest',
  target_region: 'Upper',
  movement_family: 'Press',
  movement_pattern: 'Incline Press',
  exercise_type: 'compound',
  classify_status: 'classified',
  image_asset: null,
};

describe('mapExerciseRow', () => {
  it('maps snake_case DB columns to the app shape', () => {
    expect(mapExerciseRow(row)).toEqual({
      id: row.id,
      name: 'Incline Barbell Press',
      defaultSets: 4,
      defaultMinRep: 8,
      defaultMaxRep: 12,
      defaultRestSeconds: 180,
      equipment: 'Barbell',
      muscleGroup: 'Chest',
      targetRegion: 'Upper',
      movementFamily: 'Press',
      movementPattern: 'Incline Press',
      exerciseType: 'compound',
      classifyStatus: 'classified',
      imageAsset: null,
    });
  });
});

describe('loadExercises', () => {
  it('uses the fetched catalog when it contains the whole Test Set', async () => {
    const catalog = await loadExercises(async () => SEED_EXERCISES);
    expect(catalog.source).toBe('supabase');
    expect(catalog.exercises).toHaveLength(SEED_EXERCISES.length);
    expect(catalog.note).toBeUndefined();
  });

  it('falls back to the seed when Supabase is not configured', async () => {
    const catalog = await loadExercises(async () => {
      throw new Error('Supabase is not configured');
    });
    expect(catalog.source).toBe('seed');
    expect(catalog.exercises).toBe(SEED_EXERCISES);
    expect(catalog.note).toBe('Supabase is not configured');
  });

  it('falls back to the seed when the request fails', async () => {
    const catalog = await loadExercises(async () => {
      throw new Error('network down');
    });
    expect(catalog.source).toBe('seed');
    expect(catalog.note).toBe('network down');
  });

  it('refuses a catalog that is missing Test Set exercises', async () => {
    const catalog = await loadExercises(async () => [SEED_EXERCISES[0]]);
    expect(catalog.source).toBe('seed');
    expect(catalog.note).toContain('Test Set exercises missing from Supabase');
  });

  it('throws from the raw fetcher when there is no client', async () => {
    await expect(fetchExercisesFromSupabase(null)).rejects.toThrow('Supabase is not configured');
  });
});
