interface StatTileProps {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}

export default function StatTile({
  label,
  value,
  tone = "neutral",
}: StatTileProps) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600"
      : tone === "negative"
        ? "text-red-500"
        : "text-slate-900";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className={`mt-1 text-xl font-bold tabular-nums sm:text-2xl ${toneClass}`}>
        {value}
      </div>
    </div>
  );
}
