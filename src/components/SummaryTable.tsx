"use client";

import type {
  ChannelWithMetrics,
  PortfolioTotals,
} from "@/lib/calculations";
import type { CurrencyCode } from "@/lib/format";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatRoas,
} from "@/lib/format";

interface SummaryTableProps {
  rows: ChannelWithMetrics[];
  totals: PortfolioTotals;
  currency: CurrencyCode;
  bestId: string | null;
}

export default function SummaryTable({
  rows,
  totals,
  currency,
  bestId,
}: SummaryTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <h2 className="text-base font-semibold text-slate-900">
          טבלת סיכום
        </h2>
        <p className="text-xs text-slate-500">
          פירוט מלא לכל הערוצים
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-start text-xs uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3 text-start font-medium">ערוץ</th>
              <Th>הוצאה</Th>
              <Th>קליקים</Th>
              <Th>CPC</Th>
              <Th>המרות</Th>
              <Th>CPA</Th>
              <Th>הכנסה</Th>
              <Th>ROI</Th>
              <Th>ROAS</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map(({ channel, metrics }) => {
              const isBest = channel.id === bestId;
              return (
                <tr
                  key={channel.id}
                  className={isBest ? "bg-brand-50/60" : undefined}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: channel.color }}
                      />
                      <span className="font-medium text-slate-900">
                        {channel.name || "ללא שם"}
                      </span>
                      {isBest ? (
                        <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
                          מוביל
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <Td>{formatCurrency(channel.spend, currency)}</Td>
                  <Td>{formatNumber(metrics.clicks)}</Td>
                  <Td>{formatCurrency(metrics.cpc, currency)}</Td>
                  <Td>{formatNumber(metrics.conversions)}</Td>
                  <Td>{formatCurrency(metrics.cpa, currency)}</Td>
                  <Td>{formatCurrency(metrics.revenue, currency)}</Td>
                  <Td tone={metrics.roi >= 0 ? "positive" : "negative"}>
                    {formatPercent(metrics.roi)}
                  </Td>
                  <Td tone={metrics.roas >= 1 ? "positive" : "negative"}>
                    {formatRoas(metrics.roas)}
                  </Td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-100 bg-slate-50 font-semibold text-slate-900">
              <td className="px-5 py-3">סה&quot;כ משוקלל</td>
              <Td>{formatCurrency(totals.spend, currency)}</Td>
              <Td>{formatNumber(totals.clicks)}</Td>
              <Td>—</Td>
              <Td>{formatNumber(totals.conversions)}</Td>
              <Td>{formatCurrency(totals.blendedCpa, currency)}</Td>
              <Td>{formatCurrency(totals.revenue, currency)}</Td>
              <Td tone={totals.roi >= 0 ? "positive" : "negative"}>
                {formatPercent(totals.roi)}
              </Td>
              <Td tone={totals.roas >= 1 ? "positive" : "negative"}>
                {formatRoas(totals.roas)}
              </Td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 text-end font-medium">{children}</th>;
}

function Td({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600"
      : tone === "negative"
        ? "text-red-500"
        : "text-slate-700";
  return (
    <td className={`px-5 py-3 text-end tabular-nums ${toneClass}`}>
      {children}
    </td>
  );
}
