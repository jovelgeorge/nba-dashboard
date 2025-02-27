/**
 * Utility Functions
 * 
 * This module provides general utility functions used throughout the application.
 * It includes UI utilities, stat processing, and formatting functions.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Stats, UnifiedStat } from "@/types/index";

// ==============================
// UI Utilities
// ==============================

/**
 * Combines and merges class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==============================
// Stat Constants
// ==============================

/**
 * Initial/empty stats object
 */
export const INITIAL_STATS: Stats = {
  points: 0,
  rebounds: 0,
  assists: 0,
  steals: 0,
  blocks: 0,
  turnovers: 0,
  threePointers: 0,
};

/**
 * Stat abbreviation mapping
 */
export const STAT_LABELS = {
  points: 'PTS',
  rebounds: 'REB',
  assists: 'AST',
  steals: 'STL',
  blocks: 'BLK',
  turnovers: 'TOV',
  threePointers: '3PM',
} as const;

// ==============================
// Stat Processing Utilities
// ==============================

/**
 * Scales player stats based on minutes adjustment
 * 
 * @param originalStats - The original stats to scale
 * @param originalMinutes - The original minutes
 * @param newMinutes - The new minutes to scale to
 * @returns The scaled stats
 */
export function scaleStats(
  originalStats: Stats, 
  originalMinutes: number, 
  newMinutes: number
): Stats {
  // Handle zero-minute edge case
  if (originalMinutes === 0) {
    return { ...INITIAL_STATS };
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

/**
 * Calculates the total stats for a team
 * 
 * @param players - The array of players to calculate totals for
 * @returns The total stats
 */
export function calculateTeamTotals(players: { stats: Stats }[]): Stats {
  return players.reduce((totals, player) => ({
    points: totals.points + player.stats.points,
    rebounds: totals.rebounds + player.stats.rebounds,
    assists: totals.assists + player.stats.assists,
    steals: totals.steals + player.stats.steals,
    blocks: totals.blocks + player.stats.blocks,
    turnovers: totals.turnovers + player.stats.turnovers,
    threePointers: totals.threePointers + player.stats.threePointers,
  }), { ...INITIAL_STATS });
}

/**
 * Calculates the difference between two stat objects
 * 
 * @param current - The current stats
 * @param original - The original stats to compare against
 * @returns The difference between the two stat objects
 */
export function calculateStatDifferences(current: Stats, original: Stats): Stats {
  return {
    points: current.points - original.points,
    rebounds: current.rebounds - original.rebounds,
    assists: current.assists - original.assists,
    steals: current.steals - original.steals,
    blocks: current.blocks - original.blocks,
    turnovers: current.turnovers - original.turnovers,
    threePointers: current.threePointers - original.threePointers,
  };
}

/**
 * Calculates team minutes statistics
 * 
 * @param players - The array of players to calculate minutes for
 * @returns Object containing current, original, and difference in minutes
 */
export function calculateTeamMinutes(players: UnifiedStat[]): {
  current: number;
  original: number;
  difference: number;
} {
  const current = players.reduce((sum, p) => sum + p.minutes, 0);
  const original = players.reduce((sum, p) => sum + p.original.minutes, 0);
  return {
    current,
    original,
    difference: current - original
  };
}

// ==============================
// Formatting Utilities
// ==============================

/**
 * Rounds a stat value to one decimal place
 * 
 * @param value - The value to round
 * @returns The rounded value
 */
export function roundStat(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Formats a stat value for display, showing decimal only when needed
 * 
 * @param value - The value to format
 * @returns The formatted value as a string
 */
export function formatStat(value: number): string {
  const rounded = roundStat(value);
  return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
}

