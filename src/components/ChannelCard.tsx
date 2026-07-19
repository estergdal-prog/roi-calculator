"use client";

import type { Channel, ChannelMetrics } from "@/lib/calculations";
import type { CurrencyCode } from "@/lib/format";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatRoas,
} from "@/lib/format";
import NumberField from "./NumberField";

interface ChannelCardProps {
  channel: Channel;
  metrics: ChannelMetrics;
  currency: CurrencyCode;
  symbol: string;
  canRemove: boolean;
  onChange: (patch: Partial<Channel>) => void;
  onRemove: () => void;
}

export default function ChannelCard({
  channel,
  metrics,
  currency,
  symbol,
  canRemove,
  onChange,
  onRemove,
}: ChannelCardProps) {
  const roiPositive = metrics.roi >= 0;

  return (
    <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 p-4">
        <span
          className="h-3.5 w-3.5 shrink-0 rounded-full"
          style={{ backgroundColor: channel.color }}
          aria-hidden
        />
        <input
          aria-label="שם הערוץ"
          value={channel.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="שם הערוץ"
          className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1 py-1 text-base font-semibold text-slate-900 outline-none transition hover:border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className="shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
          aria-label="הסרת ערוץ"
          title={canRemove ? "הסרת ערוץ" : "יש להשאיר לפחות ערוץ אחד"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M8.75 1a1 1 0 0 0-.96.73L7.56 2.5H4a.75.75 0 0 0 0 1.5h.03l.63 11.24A2.25 2.25 0 0 0 6.9 17.4h6.2a2.25 2.25 0 0 0 2.24-2.16L15.97 4H16a.75.75 0 0 0 0-1.5h-3.56l-.23-.77A1 1 0 0 0 11.25 1h-2.5ZM8.5 7.25a.75.75 0 0 1 1.5 0v5a.75.75 0 0 1-1.5 0v-5Zm3.5 0a.75.75 0 0 0-1.5 0v5a.75.75 0 0 0 1.5 0v-5Z" />
          </svg>
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
        <NumberField
          label="הוצאה / תקציב"
          value={channel.spend}
          onChange={(v) => onChange({ spend: v })}
          prefix={symbol}
          step={50}
        />

        {/* Traffic mode toggle */}
        <div>
          <span className="mb-1 block text-xs font-medium text-slate-600">
            מקור תנועה
          </span>
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => onChange({ trafficMode: "clicks" })}
              className={`flex-1 rounded-md py-1.5 transition ${
                channel.trafficMode === "clicks"
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              קליקים
            </button>
            <button
              type="button"
              onClick={() => onChange({ trafficMode: "impressions" })}
              className={`flex-1 rounded-md py-1.5 transition ${
                channel.trafficMode === "impressions"
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              חשיפות
            </button>
          </div>
        </div>

        {channel.trafficMode === "clicks" ? (
          <NumberField
            label="קליקים"
            value={channel.clicks}
            onChange={(v) => onChange({ clicks: v })}
            step={100}
          />
        ) : (
          <>
            <NumberField
              label="חשיפות"
              value={channel.impressions}
              onChange={(v) => onChange({ impressions: v })}
              step={1000}
            />
            <NumberField
              label="CTR (אחוז הקלקה)"
              value={channel.ctr}
              onChange={(v) => onChange({ ctr: v })}
              suffix="%"
              step={0.1}
              max={100}
              hint={`≈ ${formatNumber(metrics.clicks)} קליקים`}
            />
          </>
        )}

        <NumberField
          label="אחוז המרה"
          value={channel.conversionRate}
          onChange={(v) => onChange({ conversionRate: v })}
          suffix="%"
          step={0.1}
          max={100}
        />
        <NumberField
          label="AOV (ערך הזמנה ממוצע)"
          value={channel.aov}
          onChange={(v) => onChange({ aov: v })}
          prefix={symbol}
          step={5}
        />
      </div>

      {/* Derived metrics */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-b-2xl border-t border-slate-100 bg-slate-100 sm:grid-cols-3">
        <Metric label="CPC" value={formatCurrency(metrics.cpc, currency)} />
        <Metric label="המרות" value={formatNumber(metrics.conversions)} />
        <Metric label="CPA / CAC" value={formatCurrency(metrics.cpa, currency)} />
        <Metric label="הכנסה" value={formatCurrency(metrics.revenue, currency)} />
        <Metric
          label="ROI"
          value={formatPercent(metrics.roi)}
          tone={roiPositive ? "positive" : "negative"}
        />
        <Metric
          label="ROAS"
          value={formatRoas(metrics.roas)}
          tone={metrics.roas >= 1 ? "positive" : "negative"}
        />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600"
      : tone === "negative"
        ? "text-red-500"
        : "text-slate-900";
  return (
    <div className="bg-white px-4 py-3">
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className={`mt-0.5 text-sm font-semibold tabular-nums ${toneClass}`}>
        {value}
      </div>
    </div>
  );
}
