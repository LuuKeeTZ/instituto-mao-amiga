const dois = (n: number) => String(n).padStart(2, '0');

/** "2026-11-16T21:05:00Z" → "16/11/2026 às 18:05" (no fuso do aparelho). */
export function formatarDataHora(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${d.getFullYear()} às ${dois(
    d.getHours(),
  )}:${dois(d.getMinutes())}`;
}
