"use client";

import { useId } from "react";

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string; // e.g. currency symbol
  suffix?: string; // e.g. "%"
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}

/**
 * A controlled numeric input that keeps its own text buffer so the field can be
 * cleared while typing, but only ever emits a clamped, finite number upward —
 * the calculations never receive NaN.
 */
export default function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max,
  step = 1,
  hint,
}: NumberFieldProps) {
  const id = useId();

  function handleChange(raw: string) {
    if (raw.trim() === "") {
      onChange(0);
      return;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return; // ignore junk like "-" mid-type
    let next = parsed;
    if (typeof min === "number") next = Math.max(min, next);
    if (typeof max === "number") next = Math.min(max, next);
    onChange(next);
  }

  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </span>
      <div
        dir="ltr"
        className="group flex items-center rounded-lg border border-slate-200 bg-white shadow-sm transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100"
      >
        {prefix ? (
          <span className="pl-3 pr-1 text-sm font-medium text-slate-400 select-none">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : 0}
          min={min}
          max={max}
          step={step}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={(e) => e.target.select()}
          className={`w-full bg-transparent py-2 text-sm font-medium text-slate-900 outline-none ${
            prefix ? "pl-1" : "pl-3"
          } ${suffix ? "pr-1" : "pr-3"}`}
        />
        {suffix ? (
          <span className="pl-1 pr-3 text-sm font-medium text-slate-400 select-none">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? <span className="mt-1 block text-[11px] text-slate-400">{hint}</span> : null}
    </label>
  );
}
