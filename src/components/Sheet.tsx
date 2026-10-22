import type { ReactNode } from 'react';

/** Shared bottom-sheet container so every step keeps the same shape. */
export function Sheet({ children }: { children: ReactNode }) {
  return (
    <div className="phone-frame flex flex-col justify-end bg-ink/10">
      <div className="flex-1 bg-gradient-to-b from-ink/5 to-ink/20" aria-hidden />
      <div className="sheet">{children}</div>
    </div>
  );
}
