export function FinishedScreen({
  finishedSets,
  totalExercises,
  onRestart,
}: {
  finishedSets: number;
  totalExercises: number;
  onRestart: () => void;
}) {
  return (
    <div className="phone-frame flex min-h-screen flex-col justify-center px-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-2xl">💪</div>
      <h1 className="mt-4 text-[24px] font-extrabold leading-tight">Xong buổi tập</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">
        Hoàn thành {finishedSets} set qua {totalExercises} bài. Đây là kết thúc của Test Set trong bản demo.
      </p>
      <button
        type="button"
        onClick={onRestart}
        className="mt-6 w-full rounded-2xl bg-brand px-4 py-4 text-[13px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-brand/25"
      >
        Làm lại từ đầu
      </button>
    </div>
  );
}
