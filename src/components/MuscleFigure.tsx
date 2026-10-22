import { useId } from 'react';
import { MuscleMap } from '@musclemap/react';
import { getBodyDiagram } from '@musclemap/assets';
import type { MuscleMapValues } from '@musclemap/core';
import { regionHighlight } from '../lib/muscleMapMapping';
import type { Exercise } from '../types';

/** Matches MuscleMap's neutral (score 0) muscle fill for the default theme. */
const NEUTRAL_MUSCLE = '#3A465E';

function chestMaskStops(region: string): Array<{ offset: number; opacity: number }> {
  if (region === 'Middle') {
    return [
      { offset: 0, opacity: 1 },
      { offset: 0.2, opacity: 1 },
      { offset: 0.34, opacity: 0 },
      { offset: 0.72, opacity: 0 },
      { offset: 0.86, opacity: 1 },
      { offset: 1, opacity: 1 },
    ];
  }
  if (region === 'Lower') {
    return [
      { offset: 0, opacity: 1 },
      { offset: 0.18, opacity: 1 },
      { offset: 0.52, opacity: 0 },
      { offset: 1, opacity: 0 },
    ];
  }
  return [
    { offset: 0, opacity: 0 },
    { offset: 0.46, opacity: 0 },
    { offset: 0.84, opacity: 1 },
    { offset: 1, opacity: 1 },
  ];
}

/**
 * The red-highlighted body figure from MuscleMap.
 *
 * Shoulders-side, lats and quads map to dedicated MuscleMap paths. MuscleMap
 * 1.1 has no upper/middle/lower chest path, so chest is rendered red as one
 * group and a neutral gradient is layered over it to *approximate* the
 * requested sub-region. The label always says "(approx.)" — this is visual
 * emphasis, not an anatomical boundary from the library.
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
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const gradientId = `chest-mask-${rawId}`;

  const diagram = getBodyDiagram('MALE', target.view === 'BACK' ? 'BACK' : 'FRONT');
  const chestParts = target.group === 'CHEST' ? diagram.muscles.filter((m) => m.group === 'CHEST') : [];
  const stops = chestMaskStops(exercise.targetRegion);

  return (
    <div
      className="flex shrink-0 flex-col items-center"
      role="img"
      aria-label={`${target.label} highlighted in red`}
    >
      <div className="pointer-events-none relative">
        <MuscleMap
          values={values}
          view={target.view}
          monochromeColor="#E5484D"
          monochromeBaseColor={NEUTRAL_MUSCLE}
          showLegend={false}
          glow={false}
          tooltipFields={[]}
          figureWidth={size}
        />
        {chestParts.length > 0 && (
          <svg
            viewBox={diagram.viewBox}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                {stops.map((stop) => (
                  <stop
                    key={stop.offset}
                    offset={`${stop.offset * 100}%`}
                    stopColor={NEUTRAL_MUSCLE}
                    stopOpacity={stop.opacity}
                  />
                ))}
              </linearGradient>
            </defs>
            {chestParts.map((part, index) => (
              <path key={part.id ?? index} d={part.d} fill={`url(#${gradientId})`} />
            ))}
          </svg>
        )}
      </div>
      <span className="mt-0.5 max-w-[78px] text-center text-[8px] font-extrabold uppercase leading-tight tracking-wide text-muted">
        {target.label}
      </span>
      {showNote && (
        <span className="mt-1 max-w-[170px] text-center text-[10px] leading-snug text-muted">
          {target.exact
            ? 'Exact MuscleMap region highlighted.'
            : target.approximate
              ? 'Approximate shading: MuscleMap has no upper/middle chest path, so the red area is cut from the whole chest.'
              : 'MuscleMap has no exact path for this region; the label names the target.'}
        </span>
      )}
    </div>
  );
}
