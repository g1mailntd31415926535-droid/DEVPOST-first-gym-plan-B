import type { Exercise } from '../types';
import { Chip } from '../components/Chip';
import { AlertIcon, CheckIcon } from '../components/icons';
import { Sheet } from '../components/Sheet';

export function CheckScreen({
  exercise,
  index,
  total,
  isDeferred,
  onTrain,
  onBusy,
}: {
  exercise: Exercise;
  index: number;
  total: number;
  isDeferred: boolean;
  onTrain: () => void;
  onBusy: () => void;
}) {
  return (
    <Sheet>
      <div className="mx-auto h-1.5 w-10 rounded-full bg-ink/10" />
      <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted">
        Exercise {index} of {total}
      </p>
      <h1 className="mt-1 text-[26px] font-extrabold leading-tight">{exercise.name}</h1>
      <p className="mt-1 text-[12px] font-semibold text-muted">
        {exercise.muscleGroup} · {exercise.targetRegion} · {exercise.equipment ?? 'Unknown equipment'}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip>99 kg</Chip>
        <Chip>{exercise.defaultSets} sets</Chip>
        <Chip>
          {exercise.defaultMinRep}–{exercise.defaultMaxRep} reps
        </Chip>
        <Chip>{exercise.defaultRestSeconds}s rest</Chip>
      </div>

      {isDeferred && (
        <p className="mt-3 rounded-2xl bg-brand-soft px-3 py-2 text-[11px] font-semibold leading-relaxed text-brand">
          You deferred this exercise because the machine was busy. Check again before starting.
        </p>
      )}

      <p className="mt-5 text-[14px] font-semibold leading-snug">
        Is this machine free right now?
      </p>
      <p className="mt-1 text-[12px] text-muted">
        99 kg is only a placeholder in this demo — the app never works out plates for you.
      </p>

      <div className="mt-5 space-y-2">
        <button
          type="button"
          onClick={onTrain}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-4 text-[13px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-brand/25 transition active:scale-[0.99]"
        >
          <CheckIcon />
          Machine free — train now
        </button>
        <button
          type="button"
          onClick={onBusy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-[13px] font-extrabold uppercase tracking-wide text-ink ring-1 ring-ink/15 transition active:scale-[0.99]"
        >
          <AlertIcon className="h-5 w-5 text-amber-500" />
          Machine busy — swap exercise
        </button>
      </div>
    </Sheet>
  );
}
