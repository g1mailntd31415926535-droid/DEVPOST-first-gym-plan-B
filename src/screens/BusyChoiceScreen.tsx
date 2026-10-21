import { ArrowLeftIcon } from '../components/icons';
import { Sheet } from '../components/Sheet';

export function BusyChoiceScreen({
  onPickSuggested,
  onBack,
}: {
  onPickSuggested: () => void;
  onBack: () => void;
}) {
  return (
    <Sheet>
      <div className="mx-auto h-1.5 w-10 rounded-full bg-ink/10" />
      <h1 className="mt-5 text-[22px] font-extrabold leading-tight">Máy đang bận — làm gì trước?</h1>
      <p className="mt-1 text-[12px] text-muted">
        Bạn có thể đổi ngay sang bài tương đương, hoặc nhảy sang bài khác trong giáo án rồi quay lại sau.
      </p>

      <div className="mt-5 space-y-2">
        <button
          type="button"
          onClick={onPickSuggested}
          className="w-full rounded-2xl bg-brand px-4 py-4 text-[13px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-brand/25 transition active:scale-[0.99]"
        >
          Chọn bài đề xuất
        </button>
        <button
          type="button"
          disabled
          className="w-full rounded-2xl bg-white px-4 py-4 text-left text-[13px] font-extrabold uppercase tracking-wide text-ink/40 ring-1 ring-ink/10"
        >
          Bài khác trong giáo án tập trước
          <span className="mt-1 block text-[10px] font-semibold normal-case tracking-normal text-muted">
            Sẽ bật ở bước 2 (bài đang bận được giữ lại, hỏi lại khi quay về)
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[12px] font-bold text-muted"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Quay lại bài tập
      </button>
    </Sheet>
  );
}
