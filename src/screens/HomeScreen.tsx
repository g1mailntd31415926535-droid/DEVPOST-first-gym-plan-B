const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const trainedDays = [2, 5, 6, 9, 12, 16, 19, 23];

export function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="phone-frame px-5 pb-8 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Gym Plan B</p>
          <h1 className="mt-1 text-[22px] font-extrabold leading-tight">Hôm nay tập gì?</h1>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-sm font-extrabold text-brand">
          TD
        </div>
      </header>

      <section className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-brand p-3 text-white">
          <p className="text-[26px] font-extrabold leading-none">3</p>
          <p className="mt-1 text-[10px] font-semibold uppercase leading-tight opacity-80">Buổi tháng này</p>
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-ink/5">
          <p className="text-[26px] font-extrabold leading-none">3</p>
          <p className="mt-1 text-[10px] font-semibold uppercase leading-tight text-muted">Tổng buổi</p>
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-ink/5">
          <p className="text-[26px] font-extrabold leading-none">2</p>
          <p className="mt-1 text-[10px] font-semibold uppercase leading-tight text-muted">Lịch tập</p>
        </div>
      </section>

      <section className="mt-4 rounded-card bg-white p-4 ring-1 ring-ink/5">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wide">Độ chăm chỉ</h2>
          <span className="text-[12px] font-semibold text-muted">Tháng 10/2026</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-chip p-3">
            <p className="text-[20px] font-extrabold leading-none">0 ngày</p>
            <p className="mt-1 text-[11px] font-semibold text-muted">Chuỗi hiện tại</p>
          </div>
          <div className="rounded-2xl bg-chip p-3">
            <p className="text-[20px] font-extrabold leading-none">3 buổi</p>
            <p className="mt-1 text-[11px] font-semibold text-muted">Trong tháng</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2 text-[11px] font-bold">
          <span className="rounded-chip bg-ink px-3 py-1 text-white">1T</span>
          <span className="rounded-chip bg-chip px-3 py-1 text-muted">2T</span>
          <span className="rounded-chip bg-chip px-3 py-1 text-muted">Năm</span>
          <span className="rounded-chip bg-chip px-3 py-1 text-muted">Tất cả</span>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-muted">
          {days.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }, (_, index) => {
            const dayNumber = index - 2;
            const isTrained = trainedDays.includes(dayNumber);
            const isToday = dayNumber === 21;
            return (
              <div
                key={index}
                className={[
                  'flex h-8 items-center justify-center rounded-lg text-[11px] font-semibold',
                  isTrained ? 'bg-brand text-white' : 'bg-chip/60 text-muted',
                  isToday && !isTrained ? 'ring-2 ring-brand' : '',
                  dayNumber < 1 || dayNumber > 31 ? 'opacity-0' : '',
                ].join(' ')}
              >
                {dayNumber >= 1 && dayNumber <= 31 ? dayNumber : ''}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-extrabold">Giáo án của bạn</h2>
          <span className="text-[12px] font-semibold text-muted">1 lịch</span>
        </div>

        <div className="mt-3 rounded-card bg-white p-4 ring-1 ring-ink/5">
          <div className="flex items-start justify-between">
            <div>
              <span className="rounded-chip bg-brand-soft px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-brand">
                Day 01
              </span>
              <h3 className="mt-2 text-[18px] font-extrabold">Test Set</h3>
              <p className="mt-1 text-[12px] font-semibold text-muted">5 bài · sẵn sàng</p>
            </div>
            <button
              type="button"
              onClick={onStart}
              aria-label="Bắt đầu buổi tập Test Set"
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/30 transition active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6" aria-hidden>
                <path d="M8 5.5v13a1 1 0 0 0 1.54.84l9.2-6.5a1 1 0 0 0 0-1.68l-9.2-6.5A1 1 0 0 0 8 5.5Z" />
              </svg>
            </button>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-muted">
            Incline Barbell Press · Flat Bench Press · Lateral Raise · Lat Pulldown · Squat
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-card bg-ink p-4 text-white">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">Cách hoạt động</p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/80">
          Máy đang bận? Bấm “Đang bận” để xem bài thay thế cùng vùng cơ, xếp theo độ giống chuyển động.
        </p>
      </section>

      <p className="mt-6 text-center text-[11px] font-semibold text-muted">
        Bản demo proof-of-concept · Dữ liệu bài tập: RepDB Free
      </p>
    </div>
  );
}
