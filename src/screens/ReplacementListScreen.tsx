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
    <div className="phone-frame flex min-h-screen flex-col bg-[#E9ECF2]">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-[#E9ECF2]/95 px-5 pb-3 pt-6 backdrop-blur">
        <button
          type="button"
          onClick={onBack}
          aria-label="Quay lại"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink ring-1 ring-ink/5"
        >
          <ArrowLeftIcon />
        </button>
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand">Thay thế bài tập</p>
          <h1 className="truncate text-[16px] font-extrabold leading-tight">{base.name} đang bận</h1>
        </div>
      </header>

      <div className="px-5 pb-8">
        <div className="rounded-card bg-white p-4 ring-1 ring-ink/5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Đang cần</p>
          <p className="mt-1 text-[13px] font-bold">
            {base.muscleGroup} · {base.targetRegion}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            Chỉ hiện bài cùng nhóm cơ và cùng vùng đích. Xếp hạng theo độ giống chuyển động (80%) và
            dạng bài compound/isolation (20%).
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wide">
            {ranked.length} bài phù hợp
          </h2>
          <span className="text-[11px] font-semibold text-muted">Tạ mặc định 99 kg</span>
        </div>

        {ranked.length === 0 ? (
          <div className="mt-3 rounded-card border border-dashed border-ink/20 bg-white/60 p-6 text-center">
            <p className="text-[14px] font-extrabold">Chưa có bài thay thế phù hợp</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">
              Không có bài nào cùng nhóm cơ và vùng đích đã được kiểm tra. App không thêm bài ngoài vùng
              để lấp chỗ trống — hãy chọn bài khác trong giáo án hoặc nghỉ máy này.
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
            Xem thêm {hiddenCount} bài
          </button>
        )}

        {showAll && ranked.length > 3 && (
          <button
            type="button"
            onClick={onToggleShowAll}
            className="mt-3 w-full rounded-2xl px-4 py-3 text-[12px] font-bold uppercase tracking-wide text-muted"
          >
            Thu gọn
          </button>
        )}

        <p className="mt-6 text-[11px] leading-relaxed text-muted">
          Điểm xếp hạng là quy tắc nội bộ để chọn bài gần nhất, không phải kết luận khoa học về hiệu quả
          tập. Cân nặng và số rep của bài gốc không được tự động quy đổi.
        </p>
      </div>
    </div>
  );
}
