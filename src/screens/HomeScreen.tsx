const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const trainedDays = [2, 5, 6, 9, 12, 16, 19, 23];

export function HomeScreen({
  onStart,
  onCredits,
  dataSource,
  dataNote,
}: {
  onStart: () => void;
  onCredits: () => void;
  dataSource: 'seed' | 'supabase';
  dataNote?: string;
}) {
  return (
    <div className="phone-frame px-5 pb-8 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Gym Plan B</p>
          <h1 className="mt-1 text-[22px] font-extrabold leading-tight">Today&rsquo;s session</h1>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-sm font-extrabold text-brand">
          TD
        </div>
      </header>

      {dataSource === 'seed' && (
        <div
          title={dataNote}
          className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 px-3 py-2.5 text-amber-800 ring-1 ring-amber-200"
        >
          <span className="mt-0.5 text-[13px]">●</span>
          <p className="text-[11px] font-semibold leading-relaxed">
            Sample data — Supabase is not connected. The demo is running on bundled exercises.
          </p>
        </div>
      )}

      <section className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-brand p-3 text-white">
          <p className="text-[26px] font-extrabold leading-none">3</p>
          <p className="mt-1 text-[10px] font-semibold uppercase leading-tight opacity-80">This month</p>
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-ink/5">
          <p className="text-[26px] font-extrabold leading-none">3</p>
          <p className="mt-1 text-[10px] font-semibold uppercase leading-tight text-muted">Total sessions</p>
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-ink/5">
          <p className="text-[26px] font-extrabold leading-none">2</p>
          <p className="mt-1 text-[10px] font-semibold uppercase leading-tight text-muted">Routines</p>
        </div>
      </section>

      <section className="mt-4 rounded-card bg-white p-4 ring-1 ring-ink/5">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wide">Consistency</h2>
          <span className="text-[12px] font-semibold text-muted">Oct 2026</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-chip p-3">
            <p className="text-[20px] font-extrabold leading-none">0 days</p>
            <p className="mt-1 text-[11px] font-semibold text-muted">Current streak</p>
          </div>
          <div className="rounded-2xl bg-chip p-3">
            <p className="text-[20px] font-extrabold leading-none">3 sessions</p>
            <p className="mt-1 text-[11px] font-semibold text-muted">This month</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2 text-[11px] font-bold">
          <span className="rounded-chip bg-ink px-3 py-1 text-white">1M</span>
          <span className="rounded-chip bg-chip px-3 py-1 text-muted">2M</span>
          <span className="rounded-chip bg-chip px-3 py-1 text-muted">Year</span>
          <span className="rounded-chip bg-chip px-3 py-1 text-muted">All</span>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-muted">
          {days.map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
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
          <h2 className="text-[15px] font-extrabold">Your plan</h2>
          <span className="text-[12px] font-semibold text-muted">1 routine</span>
        </div>

        <div className="mt-3 rounded-card bg-white p-4 ring-1 ring-ink/5">
          <div className="flex items-start justify-between">
            <div>
              <span className="rounded-chip bg-brand-soft px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-brand">
                Day 01
              </span>
              <h3 className="mt-2 text-[18px] font-extrabold">Test Set</h3>
              <p className="mt-1 text-[12px] font-semibold text-muted">5 exercises · ready</p>
            </div>
            <button
              type="button"
              onClick={onStart}
              aria-label="Start Test Set session"
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
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">How it works</p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/80">
          Machine taken? Tap &ldquo;Machine busy&rdquo; to see swaps for the same muscle region, ranked by
          movement similarity.
        </p>
      </section>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onCredits}
          className="text-[11px] font-extrabold uppercase tracking-wide text-brand underline decoration-brand/30 underline-offset-2"
        >
          Credits &amp; data sources
        </button>
        <p className="mt-2 text-[11px] font-semibold leading-relaxed text-muted">
          Proof-of-concept demo · Exercise data &amp; illustrations by{' '}
          <a
            href="https://repdb.co/"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-brand underline decoration-brand/30 underline-offset-2"
          >
            RepDB (repdb.co)
          </a>
        </p>
      </div>
    </div>
  );
}
