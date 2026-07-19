import { safeNumber } from "./format";

// How the user supplies traffic for a channel.
//   "clicks"      -> user enters number of clicks directly
//   "impressions" -> user enters impressions + CTR%, clicks are derived
export type TrafficMode = "clicks" | "impressions";

export interface Channel {
  id: string;
  name: string;
  color: string;
  spend: number; // marketing spend / budget for the channel
  trafficMode: TrafficMode;
  clicks: number; // used when trafficMode === "clicks"
  impressions: number; // used when trafficMode === "impressions"
  ctr: number; // click-through rate %, used when trafficMode === "impressions"
  conversionRate: number; // % of clicks that convert
  aov: number; // average order value (revenue per conversion)
}

export interface ChannelMetrics {
  clicks: number;
  cpc: number; // cost per click
  conversions: number;
  cpa: number; // cost per acquisition (a.k.a. CAC)
  revenue: number;
  profit: number; // revenue - spend
  roi: number; // % return on investment = profit / spend * 100
  roas: number; // return on ad spend = revenue / spend (multiplier)
}

/** Resolve the effective number of clicks for a channel from its traffic mode. */
export function resolveClicks(channel: Channel): number {
  if (channel.trafficMode === "impressions") {
    const impressions = Math.max(0, safeNumber(channel.impressions));
    const ctr = Math.max(0, safeNumber(channel.ctr));
    return (impressions * ctr) / 100;
  }
  return Math.max(0, safeNumber(channel.clicks));
}

/**
 * Compute all derived metrics for a channel. Every division is guarded so the
 * result is always a finite number (0 when the denominator is 0).
 */
export function computeMetrics(channel: Channel): ChannelMetrics {
  const spend = Math.max(0, safeNumber(channel.spend));
  const clicks = resolveClicks(channel);
  const conversionRate = Math.max(0, safeNumber(channel.conversionRate));
  const aov = Math.max(0, safeNumber(channel.aov));

  const cpc = clicks > 0 ? spend / clicks : 0;
  const conversions = (clicks * conversionRate) / 100;
  const cpa = conversions > 0 ? spend / conversions : 0;
  const revenue = conversions * aov;
  const profit = revenue - spend;
  const roi = spend > 0 ? (profit / spend) * 100 : 0;
  const roas = spend > 0 ? revenue / spend : 0;

  return { clicks, cpc, conversions, cpa, revenue, profit, roi, roas };
}

export interface ChannelWithMetrics {
  channel: Channel;
  metrics: ChannelMetrics;
}

export interface PortfolioTotals {
  spend: number;
  clicks: number;
  conversions: number;
  revenue: number;
  profit: number;
  roi: number;
  roas: number;
  blendedCpa: number;
}

/** Aggregate totals across all channels (the "blended" performance). */
export function computeTotals(rows: ChannelWithMetrics[]): PortfolioTotals {
  const spend = rows.reduce((s, r) => s + Math.max(0, safeNumber(r.channel.spend)), 0);
  const clicks = rows.reduce((s, r) => s + r.metrics.clicks, 0);
  const conversions = rows.reduce((s, r) => s + r.metrics.conversions, 0);
  const revenue = rows.reduce((s, r) => s + r.metrics.revenue, 0);
  const profit = revenue - spend;
  const roi = spend > 0 ? (profit / spend) * 100 : 0;
  const roas = spend > 0 ? revenue / spend : 0;
  const blendedCpa = conversions > 0 ? spend / conversions : 0;

  return { spend, clicks, conversions, revenue, profit, roi, roas, blendedCpa };
}

/**
 * Find the best-performing channel by ROAS. Only channels with spend > 0 and
 * some revenue are eligible so we don't crown an empty/unfilled row.
 */
export function findBestChannel(
  rows: ChannelWithMetrics[]
): ChannelWithMetrics | null {
  const eligible = rows.filter(
    (r) => Math.max(0, safeNumber(r.channel.spend)) > 0 && r.metrics.revenue > 0
  );
  if (eligible.length === 0) return null;
  return eligible.reduce((best, r) => (r.metrics.roas > best.metrics.roas ? r : best));
}
