import type { Exercise } from '../types';
import { Chip } from '../components/Chip';

export function TrainingScreen({
  exercise,
  plan,
  currentIndex,
  currentSet,
  replacedFrom,
  onSetDone,
}: {
  exercise: Exercise;
  plan: Exercise[];
  currentIndex: number;
  currentSet: number;
  replacedFrom?: string;
  onSetDone: () => void;
}) {
  const remaining = plan.slice(currentIndex + 1);

  return (
    <div className="phone-frame flex min-h-screen flex-col px-5 pb-8 pt-6">
      <header>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted">
          Bài {currentIndex + 1} / {plan.length}
        </p>
        <h1 className="mt-1 text-[24px] font-extrabold leading-tight">{exercise.name}</h1>
        <p className="mt-1 text-[12px] font-semibold text-muted">
          {exercise.muscleGroup} · {exercise.targetRegion} · {exercise.equipment}
        </p>
        {replacedFrom && (
          <p className="mt-2 inline-flex rounded-chip bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand">
            Đã thay thế từ {replacedFrom}
          </p>
        )}
      </header>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip active>99 kg</Chip>
        <Chip>
          {exercise.defaultMinRep}–{exercise.defaultMaxRep} reps
        </Chip>
        <Chip>{exercise.defaultRestSeconds}s nghỉ</Chip>
      </div>

      <section className="mt-4 rounded-card bg-ink p-5 text-white">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">Hiệp đang tập</p>
        <div className="mt-2 flex items-end justify-between">
          <p className="text-[44px] font-extrabold leading-none">
            {String(currentSet).padStart(2, '0')}
          </p>
          <p className="text-[13px] font-semibold text-white/70">/ {exercise.defaultSets} set</p>
        </div>
        <p className="mt-2 text-[13px] text-white/70">
          Mục tiêu {exercise.defaultMinRep}–{exercise.defaultMaxRep} reps × 99 kg
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: exercise.defaultSets }, (_, index) => {
            const setNumber = index + 1;
            const done = setNumber < currentSet;
            return (
              <span
                key={setNumber}
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-extrabold',
                  done ? 'bg-brand text-white' : setNumber === currentSet ? 'bg-white text-ink' : 'bg-white/10 text-white/50',
                ].join(' ')}
              >
                {setNumber}
              </span>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onSetDone}
          className="mt-4 w-full rounded-2xl bg-brand px-4 py-4 text-[13px] font-extrabold uppercase tracking-wide text-white transition active:scale-[0.99]"
        >
          Hoàn thành set {currentSet}
        </button>
        <p className="mt-2 text-center text-[10px] font-semibold text-white/40">
          Bản slice 1: chưa có màn nghỉ giữa hiệp
        </p>
      </section>

      {remaining.length > 0 && (
        <section className="mt-5">
          <h2 className="text-[12px] font-extrabold uppercase tracking-wide text-muted">Tiếp theo</h2>
          <ul className="mt-2 space-y-1.5">
            {remaining.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-2xl bg-white px-3 py-2.5 ring-1 ring-ink/5"
              >
                <span className="truncate text-[13px] font-bold">{item.name}</span>
                <span className="ml-2 shrink-0 text-[11px] font-semibold text-muted">
                  {item.defaultSets} set
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
