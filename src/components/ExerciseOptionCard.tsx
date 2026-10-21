import type { Exercise, RankedExercise } from '../types';
import { DumbbellIcon } from '../components/icons';
import { reasonFor } from '../lib/explain';

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
                Kiểu chuyển động khác
              </span>
            )}
            {!recommended && !isDifferentStyle && (
              <span className="rounded-chip bg-chip px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-muted">
                Thay thế
              </span>
            )}
          </div>
          <h3 className="mt-1 text-[15px] font-extrabold leading-tight">{exercise.name}</h3>
          <p className="mt-0.5 text-[11px] font-semibold text-muted">
            {exercise.equipment ?? 'Không rõ thiết bị'} · {exercise.exerciseType}
          </p>
        </div>
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-muted">{reasonFor(base, exercise)}</p>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="rounded-chip bg-chip px-2 py-0.5 text-[10px] font-bold text-ink/70">
          {exercise.defaultSets} set
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
