import type { Exercise } from '../types';

const TYPE_LABEL: Record<Exercise['exerciseType'], string> = {
  compound: 'compound',
  isolation: 'isolation',
};

/** Plain-language reason shown on each option card. Built only from stored metadata. */
export function reasonFor(base: Exercise, candidate: Exercise): string {
  const parts: string[] = [`Same target: ${base.muscleGroup} · ${base.targetRegion}`];

  if (candidate.movementFamily === base.movementFamily) {
    parts.push(
      candidate.movementPattern === base.movementPattern
        ? `Same movement family ${base.movementFamily} – ${base.movementPattern}`
        : `Same family ${base.movementFamily}, different pattern (${candidate.movementPattern})`,
    );
  } else {
    parts.push(
      `Different movement style (${candidate.movementFamily}) — not an equivalent swap`,
    );
  }

  if (candidate.exerciseType === base.exerciseType) {
    parts.push(`Same type: ${TYPE_LABEL[candidate.exerciseType]}`);
  }

  parts.push(`Equipment: ${candidate.equipment ?? 'unknown'}`);
  return parts.join(' · ');
}

/** Concrete differences from the original — shown as a short list on the card. */
export function differencesFor(base: Exercise, candidate: Exercise): string[] {
  const out: string[] = [];

  if (candidate.equipment !== base.equipment) {
    out.push(`Equipment: ${candidate.equipment ?? 'unknown'} instead of ${base.equipment ?? 'unknown'}`);
  }
  if (candidate.movementPattern !== base.movementPattern) {
    out.push(`Pattern: ${candidate.movementPattern} instead of ${base.movementPattern}`);
  }
  if (candidate.exerciseType !== base.exerciseType) {
    out.push(
      `Type: ${TYPE_LABEL[candidate.exerciseType]} instead of ${TYPE_LABEL[base.exerciseType]}`,
    );
  }
  if (candidate.defaultSets !== base.defaultSets) {
    out.push(`Sets: ${candidate.defaultSets} instead of ${base.defaultSets}`);
  }

  return out;
}
