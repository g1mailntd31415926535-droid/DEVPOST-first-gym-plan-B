import type { Exercise, RankedExercise } from '../types';
import { ExerciseOptionCard } from '../components/ExerciseOptionCard';
import { ArrowLeftIcon } from '../components/icons';

export function ReplacementListScreen({
  base,
  ranked,
  showAll,
  onToggleShowAll,
  onChoose,
  onBack,
}: {
  base: Exercise;
  ranked: RankedExercise[];
  showAll: boolean;
  onToggleShowAll: () => void;
  onChoose: (exercise: Exercise) => void;
  onBack: () => void;
}) {
  const visible = showAll ? ranked : ranked.slice(0, 3);
  const hiddenCount = ranked.length - visible.length;

  return (
    <div className="phone-frame flex flex-col bg-[#E9ECF2]">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-[#E9ECF2]/95 px-5 pb-3 pt-6 backdrop-blur">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink ring-1 ring-ink/5"
        >
          <ArrowLeftIcon />
        </button>
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand">Exercise swap</p>
          <h1 className="truncate text-[16px] font-extrabold leading-tight">{base.name} is busy</h1>
        </div>
      </header>

      <div className="px-5 pb-8">
        <div className="rounded-card bg-white p-4 ring-1 ring-ink/5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">You need</p>
          <p className="mt-1 text-[13px] font-bold">
            {base.muscleGroup} · {base.targetRegion}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            Only exercises with the same muscle group and target region are listed. Ranked by movement
            similarity (80%) and exercise type (20%).
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wide">
            {ranked.length} matching {ranked.length === 1 ? 'exercise' : 'exercises'}
          </h2>
          <span className="text-[11px] font-semibold text-muted">99 kg placeholder</span>
        </div>

        {ranked.length === 0 ? (
          <div className="mt-3 rounded-card border border-dashed border-ink/20 bg-white/60 p-6 text-center">
            <p className="text-[14px] font-extrabold">No suitable substitute yet</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">
              There is no verified candidate for{' '}
              <strong className="font-bold text-ink">
                {base.muscleGroup} · {base.targetRegion}
              </strong>
              . The app won&rsquo;t pad the list with exercises outside the target region — pick another
              exercise from your plan, or wait for the machine.
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {visible.map((item) => (
              <ExerciseOptionCard
                key={item.exercise.id}
                base={base}
                ranked={item}
                onChoose={() => onChoose(item.exercise)}
              />
            ))}
          </div>
        )}

        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={onToggleShowAll}
            className="mt-3 w-full rounded-2xl bg-white px-4 py-3 text-[12px] font-extrabold uppercase tracking-wide text-ink ring-1 ring-ink/10"
          >
            Show {hiddenCount} more
          </button>
        )}

        {showAll && ranked.length > 3 && (
          <button
            type="button"
            onClick={onToggleShowAll}
            className="mt-3 w-full rounded-2xl px-4 py-3 text-[12px] font-bold uppercase tracking-wide text-muted"
          >
            Show less
          </button>
        )}

        <p className="mt-6 text-[11px] leading-relaxed text-muted">
          Ranking is an internal rule of thumb for picking the closest movement, not a scientific claim
          about training effect. The original exercise&rsquo;s weight and reps are never auto-converted.
        </p>
      </div>
    </div>
  );
}
