import { TimerRing } from '../components/TimerRing';
import { useRestTimer } from '../hooks/useRestTimer';

export function RestScreen({
  exercise,
  restEndsAt,
  totalSeconds,
  nextLabel,
  onDone,
}: {
  exercise: { name: string; defaultRestSeconds: number };
  restEndsAt: number;
  totalSeconds: number;
  nextLabel: string;
  onDone: () => void;
}) {
  const remainingMs = useRestTimer(restEndsAt, onDone);

  return (
    <div className="phone-frame flex min-h-screen flex-col items-center px-5 pb-8 pt-10 text-center">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted">Rest</p>
      <h1 className="mt-1 text-[20px] font-extrabold leading-tight">{exercise.name}</h1>

      <div className="mt-6">
        <TimerRing remainingMs={remainingMs} totalMs={totalSeconds * 1000} />
      </div>

      <div className="mt-6 rounded-card bg-white px-5 py-4 ring-1 ring-ink/5">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Up next</p>
        <p className="mt-1 text-[15px] font-extrabold">{nextLabel}</p>
        <p className="mt-1 text-[11px] text-muted">
          Rest is {exercise.defaultRestSeconds}s from this exercise&rsquo;s defaults.
        </p>
      </div>

      <button
        type="button"
        onClick={onDone}
        className="mt-6 w-full rounded-2xl bg-brand px-4 py-4 text-[13px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-brand/25 transition active:scale-[0.99]"
      >
        Skip rest — train now
      </button>
      <p className="mt-3 text-[11px] leading-relaxed text-muted">
        Timer runs on a real clock, so it stays accurate if you switch tabs or lock your phone.
      </p>
    </div>
  );
}
