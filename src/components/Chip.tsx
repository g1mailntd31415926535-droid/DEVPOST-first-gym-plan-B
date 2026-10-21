import type { ReactNode } from 'react';

export function Chip({
  children,
  active = false,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return <span className={active ? 'chip chip-active' : 'chip'}>{children}</span>;
}
