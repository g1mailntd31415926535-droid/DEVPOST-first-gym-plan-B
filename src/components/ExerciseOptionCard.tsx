import type { Exercise, RankedExercise } from '../types';
import { DumbbellIcon } from '../components/icons';
import { differencesFor, reasonFor } from '../lib/explain';

export function ExerciseOptionCard({
  base,
  ranked,
  onChoose,
}: {
  base: Exercise;
  ranked: RankedExercise;
  onChoose: () => void;
}) {
  const { exercise, recommended, isDifferentStyle } = ranked;
  const differences = differencesFor(base, exercise);

  return (
    <button
      type="button"
      onClick={onChoose}
      className={[
        'w-full rounded-card bg-white p-3 text-left ring-1 transition active:scale-[0.99]',
        recommended ? 'ring-2 ring-brand' : 'ring-ink/10',
      ].join(' ')}
    >
      <div className="flex gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <DumbbellIcon className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {recommended && (
              <span className="rounded-chip bg-brand px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
                Recommend
              </span>
            )}
            {isDifferentStyle && (
              <span className="rounded-chip bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-700">
                Different movement style
              </span>
            )}
            {!recommended && !isDifferentStyle && (
              <span className="rounded-chip bg-chip px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-muted">
                Swap
              </span>
            )}
          </div>
          <h3 className="mt-1 text-[15px] font-extrabold leading-tight">{exercise.name}</h3>
          <p className="mt-0.5 text-[11px] font-semibold text-muted">
            {exercise.equipment ?? 'Unknown equipment'} · {exercise.exerciseType}
          </p>
        </div>
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-muted">{reasonFor(base, exercise)}</p>

      {differences.length > 0 && (
        <ul className="mt-1.5 space-y-0.5">
          {differences.slice(0, 3).map((line) => (
            <li key={line} className="text-[10px] font-medium leading-relaxed text-muted/90">
              · {line}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="rounded-chip bg-chip px-2 py-0.5 text-[10px] font-bold text-ink/70">
          {exercise.defaultSets} sets
        </span>
        <span className="rounded-chip bg-chip px-2 py-0.5 text-[10px] font-bold text-ink/70">
          {exercise.defaultMinRep}–{exercise.defaultMaxRep} reps
        </span>
        <span className="rounded-chip bg-chip px-2 py-0.5 text-[10px] font-bold text-ink/70">
          99 kg (placeholder)
        </span>
      </div>
    </button>
  );
}
