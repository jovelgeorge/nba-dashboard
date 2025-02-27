import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Stats } from "../contexts/DashboardContext";

// UI Utilities
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Stat Processing Utilities
export function scaleStats(originalStats: Stats, originalMinutes: number, newMinutes: number): Stats {
  // Handle zero-minute edge case
  if (originalMinutes === 0) {
    return {
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      threePointers: 0,
    };
  }

  const scaleFactor = newMinutes / originalMinutes;
  return {
    points: originalStats.points * scaleFactor,
    rebounds: originalStats.rebounds * scaleFactor,
    assists: originalStats.assists * scaleFactor,
    steals: originalStats.steals * scaleFactor,
    blocks: originalStats.blocks * scaleFactor,
    turnovers: originalStats.turnovers * scaleFactor,
    threePointers: originalStats.threePointers * scaleFactor,
  };
}

export function formatStat(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
}

