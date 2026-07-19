import type { Channel } from "./calculations";

// Categorical palette (fixed order, never cycled) from the validated data-viz
// reference palette. Each channel is assigned the next color in order so its
// identity is consistent between the summary table and the chart.
export const CHANNEL_COLORS = [
  "#2a78d6", // blue
  "#008300", // green
  "#e87ba4", // magenta
  "#eda100", // yellow
  "#1baf7a", // aqua
  "#eb6834", // orange
  "#4a3aa7", // violet
  "#e34948", // red
] as const;

export const MAX_CHANNELS = CHANNEL_COLORS.length;

let idCounter = 0;
export function nextId(): string {
  idCounter += 1;
  return `ch_${Date.now().toString(36)}_${idCounter}`;
}

export function colorForIndex(index: number): string {
  return CHANNEL_COLORS[index % CHANNEL_COLORS.length];
}

/** Sensible, realistic starter channels so the tool is useful on first load. */
export function defaultChannels(): Channel[] {
  return [
    {
      id: nextId(),
      name: "Google Ads",
      color: CHANNEL_COLORS[0],
      spend: 5000,
      trafficMode: "clicks",
      clicks: 4000,
      impressions: 200000,
      ctr: 2,
      conversionRate: 3.5,
      aov: 120,
    },
    {
      id: nextId(),
      name: "Facebook / Meta",
      color: CHANNEL_COLORS[1],
      spend: 3500,
      trafficMode: "clicks",
      clicks: 5000,
      impressions: 250000,
      ctr: 2,
      conversionRate: 1.8,
      aov: 95,
    },
    {
      id: nextId(),
      name: "דיוור אלקטרוני",
      color: CHANNEL_COLORS[2],
      spend: 800,
      trafficMode: "clicks",
      clicks: 12000,
      impressions: 60000,
      ctr: 20,
      conversionRate: 2.4,
      aov: 110,
    },
  ];
}

export function emptyChannel(index: number): Channel {
  return {
    id: nextId(),
    name: `ערוץ ${index + 1}`,
    color: colorForIndex(index),
    spend: 0,
    trafficMode: "clicks",
    clicks: 0,
    impressions: 0,
    ctr: 0,
    conversionRate: 0,
    aov: 0,
  };
}
