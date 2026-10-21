import type { Exercise } from '../types';

const TYPE_LABEL: Record<Exercise['exerciseType'], string> = {
  compound: 'compound (phức hợp)',
  isolation: 'isolation (cô lập)',
};

/** Plain-language reason shown on each option card. Built only from stored metadata. */
export function reasonFor(base: Exercise, candidate: Exercise): string {
  const parts: string[] = [`Cùng vùng cơ ${base.muscleGroup} · ${base.targetRegion}`];

  if (candidate.movementFamily === base.movementFamily) {
    parts.push(
      candidate.movementPattern === base.movementPattern
        ? `Cùng nhóm chuyển động ${base.movementFamily} – ${base.movementPattern}`
        : `Cùng nhóm ${base.movementFamily}, khác pattern (${candidate.movementPattern})`,
    );
  } else {
    parts.push(
      `Kiểu chuyển động khác (${candidate.movementFamily}) — chỉ là phương án khác kiểu, không tương đương`,
    );
  }

  if (candidate.exerciseType === base.exerciseType) {
    parts.push(`Cùng dạng ${TYPE_LABEL[candidate.exerciseType]}`);
  }

  parts.push(`Thiết bị: ${candidate.equipment ?? 'không rõ'}`);
  return parts.join(' · ');
}

/** Concrete differences from the original — shown as a short list on the card. */
export function differencesFor(base: Exercise, candidate: Exercise): string[] {
  const out: string[] = [];

  if (candidate.equipment !== base.equipment) {
    out.push(`Thiết bị: ${candidate.equipment ?? 'không rõ'} thay cho ${base.equipment ?? 'không rõ'}`);
  }
  if (candidate.movementPattern !== base.movementPattern) {
    out.push(`Pattern: ${candidate.movementPattern} thay cho ${base.movementPattern}`);
  }
  if (candidate.exerciseType !== base.exerciseType) {
    out.push(`Dạng bài: ${TYPE_LABEL[candidate.exerciseType]} thay cho ${TYPE_LABEL[base.exerciseType]}`);
  }
  if (candidate.defaultSets !== base.defaultSets) {
    out.push(`Số set: ${candidate.defaultSets} thay cho ${base.defaultSets}`);
  }

  return out;
}
