export function LoadingScreen() {
  return (
    <div className="phone-frame flex flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
          <path
            d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="mt-4 text-[13px] font-extrabold uppercase tracking-[0.16em] text-brand">Gym Plan B</p>
      <p className="mt-1 text-[12px] font-semibold text-muted">Loading exercise data…</p>
    </div>
  );
}
