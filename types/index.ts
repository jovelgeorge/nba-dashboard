/**
 * Common Type Definitions
 * This module contains all common type definitions used throughout the application.
 */

export type DataSource = 'ETR' | 'UA';

export interface Stats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  threePointers: number;
}

export interface UnifiedStat {
  name: string;
  position: string;
  team: string;
  opponent: string;
  minutes: number;
  stats: Stats;
  original: {
    minutes: number;
    stats: Stats;
  };
}

export interface FileStatus {
  isUploading: boolean;
  error: string | null;
  lastUpdate: string | null;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ProcessedData {
  stats: UnifiedStat[];
  errors?: string[];
}

// For backward compatibility
export type Player = UnifiedStat; 