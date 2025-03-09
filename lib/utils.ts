/**
 * Utility Functions
 * 
 * This module provides general utility functions used throughout the application.
 * It includes UI utilities and re-exports data processing functions.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Stats } from "@/types";

// Re-export data processing functions
export {
  scaleStats,
  calculateTeamTotals,
  calculateStatDifferences,
  calculateTeamMinutes,
  roundStat
} from './data-processing';

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
 * Labels for stat display
 */
export const STAT_LABELS = {
  points: "PTS",
  rebounds: "REB",
  assists: "AST",
  steals: "STL",
  blocks: "BLK",
  turnovers: "TOV",
  threePointers: "3PM",
};

// ==============================
// Formatting Utilities
// ==============================

/**
 * Formats a stat value for display
 * 
 * @param value - The stat value to format
 * @returns Formatted stat string
 */
export function formatStat(value: number): string {
  return value.toFixed(1);
}

