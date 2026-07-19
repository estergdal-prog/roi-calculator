// Number formatting helpers. All are defensive against NaN / Infinity so the
// UI never renders "NaN" or "Infinity" to the user.

export type CurrencyCode = "ILS" | "USD" | "EUR" | "GBP";

export const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] =
  [
    { code: "ILS", label: "₪ שקל", symbol: "₪" },
    { code: "USD", label: "$ דולר", symbol: "$" },
    { code: "EUR", label: "€ אירו", symbol: "€" },
    { code: "GBP", label: "£ ליש\"ט", symbol: "£" },
  ];

/** Returns a finite number or 0 for null/NaN/Infinity/negative-guarded input. */
export function safeNumber(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function formatCurrency(
  value: number,
  currency: CurrencyCode = "ILS",
  maximumFractionDigits = 2
): string {
  const n = safeNumber(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(n);
}

export function formatNumber(value: number, maximumFractionDigits = 0): string {
  const n = safeNumber(value);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(n);
}

export function formatPercent(value: number, maximumFractionDigits = 1): string {
  const n = safeNumber(value);
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(n)}%`;
}

/** ROAS is conventionally shown as a multiplier, e.g. "4.2x". */
export function formatRoas(value: number, maximumFractionDigits = 2): string {
  const n = safeNumber(value);
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(n)}x`;
}
