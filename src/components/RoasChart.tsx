"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChannelWithMetrics } from "@/lib/calculations";
import { formatPercent, formatRoas } from "@/lib/format";

export type ChartMetric = "roas" | "roi";

interface RoasChartProps {
  rows: ChannelWithMetrics[];
  metric: ChartMetric;
  onMetricChange: (metric: ChartMetric) => void;
}

interface Datum {
  name: string;
  value: number;
  color: string;
}

export default function RoasChart({
  rows,
  metric,
  onMetricChange,
}: RoasChartProps) {
  const data: Datum[] = rows.map((r) => ({
    name: r.channel.name || "Untitled",
    value: metric === "roas" ? r.metrics.roas : r.metrics.roi,
    color: r.channel.color,
  }));

  const hasData = data.some((d) => Number.isFinite(d.value) && d.value !== 0);
  const fmt = (v: number) =>
    metric === "roas" ? formatRoas(v) : formatPercent(v, 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            השוואת ערוצים
          </h2>
          <p className="text-xs text-slate-500">
            {metric === "roas"
              ? "ROAS — החזר על הוצאת הפרסום (הכנסה לכל ₪ שהושקע)"
              : "ROI — החזר על ההשקעה (רווח כאחוז מההוצאה)"}
          </p>
        </div>
        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => onMetricChange("roas")}
            className={`rounded-md px-3 py-1.5 transition ${
              metric === "roas"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            ROAS
          </button>
          <button
            type="button"
            onClick={() => onMetricChange("roi")}
            className={`rounded-md px-3 py-1.5 transition ${
              metric === "roi"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            ROI
          </button>
        </div>
      </div>

      {hasData ? (
        <div className="h-72 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 24, right: 8, left: 8, bottom: 4 }}
              barCategoryGap="28%"
            >
              <XAxis
                dataKey="name"
                reversed
                tick={{ fontSize: 12, fill: "#52514e" }}
                tickLine={false}
                axisLine={{ stroke: "#c3c2b7" }}
                interval={0}
                height={40}
              />
              <YAxis
                orientation="right"
                tickFormatter={(v) => fmt(v)}
                tick={{ fontSize: 11, fill: "#898781" }}
                tickLine={false}
                axisLine={false}
                width={56}
              />
              <Tooltip
                cursor={{ fill: "rgba(53, 99, 255, 0.06)" }}
                content={<ChartTooltip metric={metric} />}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={72}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(v: number) => fmt(v)}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    fill: "#0b0b0b",
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-sm text-slate-400">
          הזינו הוצאה, המרות ו-AOV כדי לראות את ביצועי הערוצים.
        </div>
      )}
    </section>
  );
}

function ChartTooltip({
  active,
  payload,
  metric,
}: {
  active?: boolean;
  payload?: Array<{ payload: Datum }>;
  metric: ChartMetric;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <div className="flex items-center gap-2 font-semibold text-slate-900">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: d.color }}
        />
        {d.name}
      </div>
      <div className="mt-1 text-slate-600">
        {metric === "roas" ? "ROAS: " : "ROI: "}
        <span className="font-semibold text-slate-900">
          {metric === "roas" ? formatRoas(d.value) : formatPercent(d.value)}
        </span>
      </div>
    </div>
  );
}
