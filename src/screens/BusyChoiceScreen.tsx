import { ArrowLeftIcon } from '../components/icons';
import { Sheet } from '../components/Sheet';

export function BusyChoiceScreen({
  exerciseName,
  onPickSuggested,
  onPickOther,
  onBack,
}: {
  exerciseName: string;
  onPickSuggested: () => void;
  onPickOther: () => void;
  onBack: () => void;
}) {
  return (
    <Sheet>
      <div className="mx-auto h-1.5 w-10 rounded-full bg-ink/10" />
      <h1 className="mt-5 text-[22px] font-extrabold leading-tight">Machine busy — what now?</h1>
      <p className="mt-1 text-[12px] leading-relaxed text-muted">
        Swap {exerciseName} for a similar exercise now, or pick another exercise from your plan and come
        back to this machine later.
      </p>

      <div className="mt-5 space-y-2">
        <button
          type="button"
          onClick={onPickSuggested}
          className="w-full rounded-2xl bg-brand px-4 py-4 text-[13px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-brand/25 transition active:scale-[0.99]"
        >
          See suggested swaps
        </button>
        <button
          type="button"
          onClick={onPickOther}
          className="w-full rounded-2xl bg-white px-4 py-4 text-left text-[13px] font-extrabold uppercase tracking-wide text-ink ring-1 ring-ink/15 transition active:scale-[0.99]"
        >
          Do another exercise first
          <span className="mt-1 block text-[10px] font-semibold normal-case tracking-normal text-muted">
            Choose from the exercises left in your plan. This one asks again when you come back
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[12px] font-bold text-muted"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to exercise
      </button>
    </Sheet>
  );
}
