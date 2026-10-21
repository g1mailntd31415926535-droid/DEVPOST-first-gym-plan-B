export function TimerRing({ remainingMs, totalMs }: { remainingMs: number; totalMs: number }) {
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const progress = totalMs > 0 ? Math.min(1, Math.max(0, remainingMs / totalMs)) : 0;
  const seconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;

  return (
    <div className="relative h-56 w-56">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#E8ECF4" strokeWidth="14" />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#0A66FF"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          className="transition-[stroke-dashoffset] duration-200 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[52px] font-extrabold leading-none tabular-nums">
          {minutes}:{String(rest).padStart(2, '0')}
        </span>
        <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted">Rest</span>
      </div>
    </div>
  );
}
