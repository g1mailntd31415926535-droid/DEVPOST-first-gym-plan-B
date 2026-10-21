import type { Exercise, RankedExercise } from '../types';

const SAME_FAMILY_SAME_PATTERN = 1.0;
const SAME_FAMILY_OTHER_PATTERN = 0.6;
const DIFFERENT_FAMILY = 0.3;

/**
 * Movement similarity is an internal rule of thumb, NOT a scientific claim
 * about equivalent training effect.
 */
export function movementScore(base: Exercise, candidate: Exercise): number {
  if (base.movementFamily !== candidate.movementFamily) return DIFFERENT_FAMILY;
  return base.movementPattern === candidate.movementPattern
    ? SAME_FAMILY_SAME_PATTERN
    : SAME_FAMILY_OTHER_PATTERN;
}

/**
 * Stage 1: hard filter on muscle group + target region.
 * Stage 2: 80% movement similarity + 20% exercise-type similarity.
 * `needs-review` entries never reach the list.
 */
export function rankAlternatives(base: Exercise, all: Exercise[]): RankedExercise[] {
  const eligible = all.filter(
    (candidate) =>
      candidate.id !== base.id &&
      candidate.classifyStatus === 'classified' &&
      candidate.muscleGroup === base.muscleGroup &&
      candidate.targetRegion === base.targetRegion,
  );

  const ranked: RankedExercise[] = eligible.map((candidate) => {
    const movement = movementScore(base, candidate);
    const type = candidate.exerciseType === base.exerciseType ? 1 : 0;
    return {
      exercise: candidate,
      movementScore: movement,
      typeScore: type,
      score: 0.8 * movement + 0.2 * type,
      isDifferentStyle: candidate.movementFamily !== base.movementFamily,
      recommended: false,
    };
  });

  ranked.sort(
    (a, b) => b.score - a.score || a.exercise.name.localeCompare(b.exercise.name),
  );

  // Only the best same-family/same-pattern candidate may carry "Recommend";
  // a different movement style can never be presented as an equivalent swap.
  if (ranked.length > 0 && ranked[0].movementScore === SAME_FAMILY_SAME_PATTERN) {
    ranked[0].recommended = true;
  }

  return ranked;
}
