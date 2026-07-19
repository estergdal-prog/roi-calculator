"use client";

import { useMemo, useState } from "react";
import type { Channel } from "@/lib/calculations";
import {
  computeMetrics,
  computeTotals,
  findBestChannel,
} from "@/lib/calculations";
import {
  CURRENCIES,
  formatCurrency,
  formatPercent,
  formatRoas,
  type CurrencyCode,
} from "@/lib/format";
import {
  MAX_CHANNELS,
  colorForIndex,
  defaultChannels,
  emptyChannel,
} from "@/lib/constants";
import ChannelCard from "./ChannelCard";
import RoasChart, { type ChartMetric } from "./RoasChart";
import SummaryTable from "./SummaryTable";
import StatTile from "./StatTile";

export default function RoiCalculator() {
  const [channels, setChannels] = useState<Channel[]>(() => defaultChannels());
  const [currency, setCurrency] = useState<CurrencyCode>("ILS");
  const [chartMetric, setChartMetric] = useState<ChartMetric>("roas");

  const symbol =
    CURRENCIES.find((c) => c.code === currency)?.symbol ?? "$";

  const rows = useMemo(
    () => channels.map((channel) => ({ channel, metrics: computeMetrics(channel) })),
    [channels]
  );
  const totals = useMemo(() => computeTotals(rows), [rows]);
  const best = useMemo(() => findBestChannel(rows), [rows]);

  function updateChannel(id: string, patch: Partial<Channel>) {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }

  function addChannel() {
    setChannels((prev) =>
      prev.length >= MAX_CHANNELS ? prev : [...prev, emptyChannel(prev.length)]
    );
  }

  function removeChannel(id: string) {
    setChannels((prev) => {
      if (prev.length <= 1) return prev;
      // Reassign colors by position so the palette stays in fixed order.
      return prev
        .filter((c) => c.id !== id)
        .map((c, i) => ({ ...c, color: colorForIndex(i) }));
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            אנליטיקת שיווק
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            מחשבון ROI לשיווק דיגיטלי
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            השוו הוצאה, המרות והחזר בכל ערוצי השיווק — וגלו בדיוק היכן התקציב שלכם
            עובד הכי חזק.
          </p>
        </div>
        <label className="shrink-0 text-xs font-medium text-slate-500">
          <span className="mb-1 block">מטבע</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      {/* Insight banner */}
      <InsightBanner best={best} currency={currency} />

      {/* Portfolio stat tiles */}
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="סך ההוצאה"
          value={formatCurrency(totals.spend, currency)}
        />
        <StatTile
          label="סך ההכנסה"
          value={formatCurrency(totals.revenue, currency)}
        />
        <StatTile
          label="ROAS משוקלל"
          value={formatRoas(totals.roas)}
          tone={totals.roas >= 1 ? "positive" : "negative"}
        />
        <StatTile
          label="ROI כולל"
          value={formatPercent(totals.roi)}
          tone={totals.roi >= 0 ? "positive" : "negative"}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Inputs column */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-slate-500">
              ערוצים ({channels.length})
            </h2>
            <button
              type="button"
              onClick={addChannel}
              disabled={channels.length >= MAX_CHANNELS}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M10 3a.75.75 0 0 1 .75.75v5.5h5.5a.75.75 0 0 1 0 1.5h-5.5v5.5a.75.75 0 0 1-1.5 0v-5.5h-5.5a.75.75 0 0 1 0-1.5h5.5v-5.5A.75.75 0 0 1 10 3Z" />
              </svg>
              הוספת ערוץ
            </button>
          </div>
          {channels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              metrics={computeMetrics(channel)}
              currency={currency}
              symbol={symbol}
              canRemove={channels.length > 1}
              onChange={(patch) => updateChannel(channel.id, patch)}
              onRemove={() => removeChannel(channel.id)}
            />
          ))}
          {channels.length >= MAX_CHANNELS ? (
            <p className="text-center text-xs text-slate-400">
              הגעתם למקסימום של {MAX_CHANNELS} ערוצים.
            </p>
          ) : null}
        </div>

        {/* Results column */}
        <div className="space-y-8 lg:col-span-3">
          <RoasChart
            rows={rows}
            metric={chartMetric}
            onMetricChange={setChartMetric}
          />
          <SummaryTable
            rows={rows}
            totals={totals}
            currency={currency}
            bestId={best?.channel.id ?? null}
          />
        </div>
      </div>

      <footer className="mt-12 space-y-2 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
        <p>
          <span className="font-semibold text-slate-500">ROAS</span> — החזר על
          הוצאת פרסום · <span className="font-semibold text-slate-500">ROI</span> —
          החזר על ההשקעה · <span className="font-semibold text-slate-500">CPC</span>{" "}
          — עלות לקליק ·{" "}
          <span className="font-semibold text-slate-500">CPA / CAC</span> — עלות
          לרכישה / ללקוח ·{" "}
          <span className="font-semibold text-slate-500">CTR</span> — אחוז הקלקה ·{" "}
          <span className="font-semibold text-slate-500">AOV</span> — ערך הזמנה
          ממוצע
        </p>
        <p>הנתונים המוצגים הם הערכות המבוססות על הנתונים שהזנתם.</p>
      </footer>
    </div>
  );
}

function InsightBanner({
  best,
  currency,
}: {
  best: ReturnType<typeof findBestChannel>;
  currency: CurrencyCode;
}) {
  if (!best) {
    return (
      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
        הזינו את ההוצאה, אחוז ההמרה וערך ההזמנה הממוצע (AOV) של הערוצים כדי לגלות
        את הערוץ הרווחי ביותר שלכם.
      </div>
    );
  }

  const { channel, metrics } = best;
  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50 to-white px-5 py-4 shadow-sm">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h4.017l-.99 5.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 15.25 7h-4.017l.75-5.093Z" />
        </svg>
      </div>
      <p className="text-sm leading-relaxed text-slate-700">
        הערוץ הרווחי ביותר שלכם הוא{" "}
        <span
          className="font-semibold"
          style={{ color: channel.color }}
        >
          {channel.name || "ערוץ זה"}
        </span>{" "}
        עם ROAS של{" "}
        <span className="font-semibold text-slate-900">
          {formatRoas(metrics.roas)}
        </span>{" "}
        — ומניב{" "}
        <span className="font-semibold text-slate-900">
          {formatCurrency(metrics.revenue, currency)}
        </span>{" "}
        מתוך{" "}
        <span className="font-semibold text-slate-900">
          {formatCurrency(channel.spend, currency)}
        </span>{" "}
        בהוצאה (ROI של {formatPercent(metrics.roi)}).
      </p>
    </div>
  );
}
