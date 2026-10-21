import type { UpcomingOption } from '../lib/session';
import { ArrowLeftIcon, DumbbellIcon } from '../components/icons';

export function PickExerciseScreen({
  currentName,
  options,
  onPick,
  onBack,
}: {
  currentName: string;
  options: UpcomingOption[];
  onPick: (slot: number) => void;
  onBack: () => void;
}) {
  return (
    <div className="phone-frame flex min-h-screen flex-col bg-[#E9ECF2]">
      <header className="flex items-center gap-3 px-5 pb-3 pt-6">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ink ring-1 ring-ink/5"
        >
          <ArrowLeftIcon />
        </button>
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand">Do another exercise first</p>
          <h1 className="truncate text-[16px] font-extrabold leading-tight">Pick what to train now</h1>
        </div>
      </header>

      <div className="px-5 pb-8">
        <div className="rounded-card bg-white p-4 ring-1 ring-ink/5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Waiting for its machine</p>
          <p className="mt-1 text-[13px] font-bold">{currentName}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            Pick another exercise from your plan. The one above moves to the end and asks again when you
            come back to it.
          </p>
        </div>

        {options.length === 0 ? (
          <div className="mt-4 rounded-card border border-dashed border-ink/20 bg-white/60 p-6 text-center">
            <p className="text-[14px] font-extrabold">No other exercises left in this plan</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">
              {currentName} is the only exercise still waiting. Go back and pick a swap for it, or try the
              machine again.
            </p>
            <button
              type="button"
              onClick={onBack}
              className="mt-4 w-full rounded-2xl bg-brand px-4 py-3 text-[12px] font-extrabold uppercase tracking-wide text-white"
            >
              Go back
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {options.map(({ slot, exercise }) => (
              <button
                key={exercise.id}
                type="button"
                onClick={() => onPick(slot)}
                className="flex w-full items-center gap-3 rounded-card bg-white p-3 text-left ring-1 ring-ink/10 transition active:scale-[0.99]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <DumbbellIcon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-extrabold">{exercise.name}</span>
                  <span className="mt-0.5 block text-[11px] font-semibold text-muted">
                    {exercise.muscleGroup} · {exercise.targetRegion} · {exercise.defaultSets} sets
                  </span>
                </span>
                <span className="shrink-0 text-[11px] font-extrabold uppercase tracking-wide text-brand">
                  Train
                </span>
              </button>
            ))}
          </div>
        )}

        {options.length > 0 && (
          <button
            type="button"
            onClick={onBack}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[12px] font-bold uppercase tracking-wide text-muted"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>
        )}
      </div>
    </div>
  );
}
