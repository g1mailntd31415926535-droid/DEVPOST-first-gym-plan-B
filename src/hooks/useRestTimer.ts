import { useEffect, useRef, useState } from 'react';

/**
 * Counts down against an absolute deadline instead of decrementing a counter,
 * so the remaining time is still correct after the tab has been suspended.
 */
export function useRestTimer(restEndsAt: number | null, onDone: () => void) {
  const [remainingMs, setRemainingMs] = useState(() =>
    restEndsAt === null ? 0 : Math.max(0, restEndsAt - Date.now()),
  );
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (restEndsAt === null) return;

    let fired = false;
    const tick = () => {
      const next = Math.max(0, restEndsAt - Date.now());
      setRemainingMs(next);
      if (next <= 0 && !fired) {
        fired = true;
        onDoneRef.current();
      }
    };

    tick();
    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [restEndsAt]);

  return remainingMs;
}
