/**
 * Common Type Definitions
 * This module contains all common type definitions used throughout the application.
 */

/**
 * Data source identifier for different projection sources
 */
export type DataSource = 'ETR' | 'UA';

/**
 * Statistical categories tracked for each player
 */
export interface Stats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  threePointers: number;
}

/**
 * Player data with both current and original statistical values
 */
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

/**
 * Status of file uploads
 */
export interface FileStatus {
  isUploading: boolean;
  error: string | null;
  lastUpdate: string | null;
}

/**
 * Result of file validation
 */
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Result of processing data files
 */
export interface ProcessedData {
  stats: UnifiedStat[];
  errors?: string[];
}

/**
 * For backward compatibility
 */
export type Player = UnifiedStat;

/**
 * State for team minute validation
 */
export interface TeamMinutesValidation {
  isValid: boolean;
  totalMinutes: number;
  minutesDifference: number;
  playerErrors: string[];
}

/**
 * Result of minute adjustment validation
 */
export interface MinuteValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Props for file upload components
 */
export interface FileUploadProps {
  source: DataSource;
  status: FileStatus;
  isActive: boolean;
  onFileSelect: (file: File) => Promise<void>;
}

/**
 * Type of validation being performed
 */
export type ValidationType = 'minutes' | 'data' | 'file'; 