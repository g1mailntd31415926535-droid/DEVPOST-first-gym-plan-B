import { MuscleMap } from '@musclemap/react';
import type { MuscleMapValues } from '@musclemap/core';
import { regionHighlight } from '../lib/muscleMapMapping';
import type { Exercise } from '../types';

/**
 * The red-highlighted body figure from MuscleMap.
 *
 * Chest has no upper/middle path in MuscleMap 1.1, so it is highlighted as a
 * whole group and the text label carries the exact target region. Shoulders,
 * lats and quads map to dedicated paths.
 */
export function MuscleFigure({
  exercise,
  size = 52,
  showNote = false,
}: {
  exercise: Exercise;
  size?: number;
  showNote?: boolean;
}) {
  const target = regionHighlight(exercise.muscleGroup, exercise.targetRegion);
  const values = { [target.group]: { score: 100 } } as MuscleMapValues;

  return (
    <div
      className="flex shrink-0 flex-col items-center"
      role="img"
      aria-label={`${target.label} highlighted in red`}
    >
      <div className="pointer-events-none">
        <MuscleMap
          values={values}
          view={target.view}
          monochromeColor="#E5484D"
          monochromeBaseColor="#DDE2EA"
          showLegend={false}
          glow={false}
          tooltipFields={[]}
          figureWidth={size}
        />
      </div>
      <span className="mt-0.5 max-w-[72px] text-center text-[8px] font-extrabold uppercase leading-tight tracking-wide text-muted">
        {target.label}
      </span>
      {showNote && (
        <span className="mt-1 max-w-[160px] text-center text-[10px] leading-snug text-muted">
          {target.exact
            ? 'Exact region highlighted.'
            : 'MuscleMap has no sub-region path here, so the whole chest is highlighted.'}
        </span>
      )}
    </div>
  );
}
