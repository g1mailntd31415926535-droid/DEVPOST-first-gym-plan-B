import { describe, expect, it } from 'vitest';
import { rankAlternatives } from './recommendation';
import { SEED_EXERCISES } from '../data/seed';
import type { Exercise } from '../types';

const byName = (name: string): Exercise => {
  const found = SEED_EXERCISES.find((exercise) => exercise.name === name);
  if (!found) throw new Error(`Missing seed exercise: ${name}`);
  return found;
};

describe('rankAlternatives — stage 1 filter', () => {
  it('only returns exercises with the same muscle group and target region', () => {
    for (const name of [
      'Incline Barbell Press',
      'Flat Bench Press',
      'Lateral Raise',
      'Lat Pulldown',
      'Squat',
    ]) {
      const base = byName(name);
      const results = rankAlternatives(base, SEED_EXERCISES);
      expect(results.length).toBeGreaterThan(0);
      for (const result of results) {
        expect(result.exercise.muscleGroup).toBe(base.muscleGroup);
        expect(result.exercise.targetRegion).toBe(base.targetRegion);
        expect(result.exercise.id).not.toBe(base.id);
      }
    }
  });

  it('never treats every chest exercise as an equivalent: incline excludes middle chest', () => {
    const base = byName('Incline Barbell Press');
    const names = rankAlternatives(base, SEED_EXERCISES).map((r) => r.exercise.name);
    expect(names).not.toContain('Flat Bench Press');
    expect(names).not.toContain('Dumbbell Bench Press');
    expect(names).not.toContain('Machine Chest Press');
  });

  it('excludes needs-review entries from the list', () => {
    const base = byName('Lateral Raise');
    const names = rankAlternatives(base, SEED_EXERCISES).map((r) => r.exercise.name);
    expect(names).not.toContain('Upright Row');
  });

  it('returns an empty list when the region has no candidates', () => {
    const orphan: Exercise = {
      ...byName('Flat Bench Press'),
      id: 'orphan',
      name: 'Lower Chest Machine Press',
      targetRegion: 'Lower',
    };
    expect(rankAlternatives(orphan, SEED_EXERCISES)).toEqual([]);
  });
});

describe('rankAlternatives — stage 2 scoring and tags', () => {
  it('recommends exactly one best same-movement candidate', () => {
    const results = rankAlternatives(byName('Incline Barbell Press'), SEED_EXERCISES);
    const recommended = results.filter((r) => r.recommended);
    expect(recommended).toHaveLength(1);
    expect(recommended[0].movementScore).toBe(1);
  });

  it('scores the same family with a different pattern lower than an exact match', () => {
    const results = rankAlternatives(byName('Lat Pulldown'), SEED_EXERCISES);
    const pullUp = results.find((r) => r.exercise.name === 'Pull-Up');
    const row = results.find((r) => r.exercise.name === 'Seated Cable Row');
    expect(pullUp?.movementScore).toBe(1);
    expect(row?.movementScore).toBe(0.6);
    expect(pullUp!.score).toBeGreaterThan(row!.score);
    expect(pullUp?.recommended).toBe(true);
    expect(row?.recommended).toBe(false);
  });

  it('tags different movement families and never lets them be recommended', () => {
    const base = byName('Flat Bench Press');
    const flyAsClassified: Exercise = {
      ...byName('Cable Fly'),
      id: 'fly-classified',
      classifyStatus: 'classified',
    };
    const results = rankAlternatives(base, [...SEED_EXERCISES, flyAsClassified]);
    const fly = results.find((r) => r.exercise.id === 'fly-classified');
    expect(fly?.isDifferentStyle).toBe(true);
    expect(fly?.recommended).toBe(false);
    expect(fly?.movementScore).toBe(0.3);
    // The exact-match candidate still owns the single Recommend tag.
    expect(results.filter((r) => r.recommended)).toHaveLength(1);
    expect(results.find((r) => r.recommended)?.exercise.name).toBe('Dumbbell Bench Press');
  });

  it('applies the 80/20 weights, not a made-up activation score', () => {
    const results = rankAlternatives(byName('Lateral Raise'), SEED_EXERCISES);
    for (const result of results) {
      expect(result.score).toBeCloseTo(
        0.8 * result.movementScore + 0.2 * result.typeScore,
        10,
      );
    }
  });
});
