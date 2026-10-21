import type { Exercise } from '../types';
import { Chip } from '../components/Chip';
import { AlertIcon, CheckIcon } from '../components/icons';
import { Sheet } from '../components/Sheet';

export function CheckScreen({
  exercise,
  index,
  total,
  onTrain,
  onBusy,
}: {
  exercise: Exercise;
  index: number;
  total: number;
  onTrain: () => void;
  onBusy: () => void;
}) {
  return (
    <Sheet>
      <div className="mx-auto h-1.5 w-10 rounded-full bg-ink/10" />
      <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted">
        Bài {index + 1} / {total}
      </p>
      <h1 className="mt-1 text-[26px] font-extrabold leading-tight">{exercise.name}</h1>
      <p className="mt-1 text-[12px] font-semibold text-muted">
        {exercise.muscleGroup} · {exercise.targetRegion} · {exercise.equipment}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip>99 kg</Chip>
        <Chip>{exercise.defaultSets} set</Chip>
        <Chip>
          {exercise.defaultMinRep}–{exercise.defaultMaxRep} reps
        </Chip>
        <Chip>{exercise.defaultRestSeconds}s nghỉ</Chip>
      </div>

      <p className="mt-5 text-[14px] font-semibold leading-snug">
        Máy của bài này có đang trống không?
      </p>
      <p className="mt-1 text-[12px] text-muted">
        Trọng lượng 99 kg chỉ là chỗ trống trong bản demo — app không tự tính tạ.
      </p>

      <div className="mt-5 space-y-2">
        <button
          type="button"
          onClick={onTrain}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-4 text-[13px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-brand/25 transition active:scale-[0.99]"
        >
          <CheckIcon />
          Máy trống — tập luôn
        </button>
        <button
          type="button"
          onClick={onBusy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-[13px] font-extrabold uppercase tracking-wide text-ink ring-1 ring-ink/15 transition active:scale-[0.99]"
        >
          <AlertIcon className="h-5 w-5 text-amber-500" />
          Đang bận — chọn bài khác
        </button>
      </div>
    </Sheet>
  );
}
