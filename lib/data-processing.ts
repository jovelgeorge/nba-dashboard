/**
 * Data Processing Module
 * 
 * This module handles all CSV file processing and data calculations for the NBA dashboard application.
 * It includes functions for parsing, validating, transforming, and calculating player statistics data
 * from various sources into a unified format.
 */

import Papa from 'papaparse';
import type { 
  Stats,
  Player, 
  DataSource, 
  ProcessedData
} from '@/types';
import { validateCSVFile, validateCSVHeaders, validateCSVRow } from './validation';

/**
 * Custom error class for CSV processing errors
 */
export class CSVProcessingError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'CSVProcessingError';
  }
}

/**
 * Team name mapping for standardization
 * Maps three-letter team codes to full team names
 */
export const TEAM_NAME_MAPPING: Record<string, string> = {
  ATL: "Atlanta Hawks",
  BOS: "Boston Celtics",
  BKN: "Brooklyn Nets",
  CHA: "Charlotte Hornets",
  CHI: "Chicago Bulls",
  CLE: "Cleveland Cavaliers",
  DAL: "Dallas Mavericks",
  DEN: "Denver Nuggets",
  DET: "Detroit Pistons",
  GSW: "Golden State Warriors",
  HOU: "Houston Rockets",
  IND: "Indiana Pacers",
  LAC: "LA Clippers",
  LAL: "Los Angeles Lakers",
  MEM: "Memphis Grizzlies",
  MIA: "Miami Heat",
  MIL: "Milwaukee Bucks",
  MIN: "Minnesota Timberwolves",
  NOP: "New Orleans Pelicans",
  NYK: "New York Knicks",
  OKC: "Oklahoma City Thunder",
  ORL: "Orlando Magic",
  PHI: "Philadelphia 76ers",
  PHX: "Phoenix Suns",
  POR: "Portland Trail Blazers",
  SAC: "Sacramento Kings",
  SAS: "San Antonio Spurs",
  TOR: "Toronto Raptors",
  UTA: "Utah Jazz",
  WAS: "Washington Wizards",
};

/**
 * Normalizes a team name by converting abbreviations to full names
 * and applying proper capitalization
 * 
 * @param team - The team name or abbreviation to normalize
 * @returns The normalized team name
 */
export const normalizeTeamName = (team: string): string => {
  // Check if it's an abbreviation first
  const fullName = TEAM_NAME_MAPPING[team.toUpperCase()];
  if (fullName) return fullName;

  // If not an abbreviation, return the original name with proper capitalization
  return team.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Interface for raw CSV row data with optional fields to support
 * different CSV formats from various data sources
 */
export interface RawCSVRow {
  [key: string]: string | number | null | undefined;
  player?: string;
  name?: string;
  position?: string;
  pos?: string;
  team: string;
  opponent?: string;
  opp?: string;
  minutes?: string | number;
  min?: string | number;
  points?: string | number;
  pts?: string | number;
  rebounds?: string | number;
  reb?: string | number;
  assists?: string | number;
  ast?: string | number;
  steals?: string | number;
  stl?: string | number;
  blocks?: string | number;
  blk?: string | number;
  turnovers?: string | number;
  to?: string | number;
  threepointers?: string | number;
  '3pm'?: string | number;
}

/**
 * Converts a value to string, handling null and undefined values
 * 
 * @param value - The value to convert to string
 * @returns The string representation of the value, or empty string if null/undefined
 */
export const convertToString = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return '';
  return value.toString();
};

/**
 * Parses a CSV file using Papa Parse
 * 
 * @param file - The CSV file to parse
 * @returns A promise that resolves to an array of parsed CSV rows
 */
export const parseCSV = (file: File): Promise<RawCSVRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim(),
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          reject(new CSVProcessingError('No data found in file'));
        } else {
          resolve(results.data as RawCSVRow[]);
        }
      },
      error: (error: Error) => {
        reject(new CSVProcessingError('Failed to parse CSV', error));
      }
    });
  });
};

/**
 * Processes raw CSV row data into a unified stat format
 * 
 * @param row - The raw CSV row data
 * @returns The processed unified stat object
 */
export const processRow = (row: RawCSVRow): Player => {
  const minutes = parseFloat(convertToString(row.minutes || row.min));
  const processedStats = {
    points: parseFloat(convertToString(row.points || row.pts)),
    rebounds: parseFloat(convertToString(row.rebounds || row.reb)),
    assists: parseFloat(convertToString(row.assists || row.ast)),
    steals: parseFloat(convertToString(row.steals || row.stl)),
    blocks: parseFloat(convertToString(row.blocks || row.blk)),
    turnovers: parseFloat(convertToString(row.turnovers || row.to)),
    threePointers: parseFloat(convertToString(row.threepointers || row['3pm'] || '0')),
  };

  return {
    name: convertToString(row.player || row.name),
    position: convertToString(row.position || row.pos),
    team: normalizeTeamName(convertToString(row.team)),
    opponent: normalizeTeamName(convertToString(row.opponent || row.opp)),
    minutes,
    stats: processedStats,
    original: {
      minutes,
      stats: { ...processedStats },
    },
  };
};

/**
 * Processes multiple rows of raw CSV data
 * 
 * @param rows - The raw CSV rows to process
 * @returns An array of unified stat objects
 */
export const processData = (rows: RawCSVRow[]): Player[] => {
  return rows.map(processRow);
};

/**
 * Main function to process a CSV file, handling validation and processing
 * 
 * @param file - The CSV file to process
 * @param source - The data source type (ETR, UA, etc.)
 * @returns A promise that resolves to the processed data
 */
export const processCSVFile = async (
  file: File, 
  source: DataSource
): Promise<ProcessedData> => {
  // Validate file
  const fileValidation = validateCSVFile(file);
  if (!fileValidation.isValid) {
    throw new CSVProcessingError(fileValidation.error || 'Invalid file');
  }

  try {
    // Parse CSV
    const rows = await parseCSV(file);
    
    // Validate headers
    const headerValidation = validateCSVHeaders(
      Object.keys(rows[0] || {}),
      source
    );
    
    if (!headerValidation.isValid) {
      throw new CSVProcessingError(headerValidation.error || 'Invalid headers');
    }

    const stats: Player[] = [];
    const errors: string[] = [];

    // Validate and process rows
    rows.forEach((row, index) => {
      try {
        // Standardize row data for validation
        const standardizedRow = {
          ...row,
          player: convertToString(row.player || row.name),
          position: convertToString(row.position || row.pos),
          team: convertToString(row.team),
          opponent: convertToString(row.opponent || row.opp),
          minutes: convertToString(row.minutes || row.min),
          points: convertToString(row.points || row.pts),
          rebounds: convertToString(row.rebounds || row.reb),
          assists: convertToString(row.assists || row.ast),
          steals: convertToString(row.steals || row.stl),
          blocks: convertToString(row.blocks || row.blk),
          turnovers: convertToString(row.turnovers || row.to),
          threePointers: convertToString(row.threepointers || row['3pm'] || '0')
        };

        // Validate row
        const rowValidation = validateCSVRow(standardizedRow, source);
        if (!rowValidation.isValid) {
          throw new Error(rowValidation.error);
        }

        // Process valid row
        stats.push(processRow(row));
      } catch (error) {
        errors.push(`Row ${index + 1}: ${error instanceof Error ? error.message : 'Invalid data'}`);
      }
    });

    if (stats.length === 0) {
      throw new CSVProcessingError('No valid data found in file');
    }

    return { 
      stats, 
      errors: errors.length > 0 ? errors : undefined 
    };
  } catch (error) {
    if (error instanceof CSVProcessingError) {
      throw error;
    }
    throw new CSVProcessingError('Failed to process CSV file', error);
  }
};

/**
 * Scales player statistics based on minutes adjustment
 * 
 * @param originalStats - The original player statistics
 * @param originalMinutes - The original minutes played
 * @param newMinutes - The new minutes to adjust to
 * @returns Scaled player statistics
 */
export function scaleStats(
  originalStats: Stats, 
  originalMinutes: number, 
  newMinutes: number
): Stats {
  if (originalMinutes === 0) {
    return { ...originalStats };
  }
  
  const scaleFactor = newMinutes / originalMinutes;
  
  return {
    points: roundStat(originalStats.points * scaleFactor),
    rebounds: roundStat(originalStats.rebounds * scaleFactor),
    assists: roundStat(originalStats.assists * scaleFactor),
    steals: roundStat(originalStats.steals * scaleFactor),
    blocks: roundStat(originalStats.blocks * scaleFactor),
    turnovers: roundStat(originalStats.turnovers * scaleFactor),
    threePointers: roundStat(originalStats.threePointers * scaleFactor),
  };
}

/**
 * Rounds a statistical value to one decimal place
 * 
 * @param value - The value to round
 * @returns Rounded value
 */
export function roundStat(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Calculates total team statistics
 * 
 * @param players - The array of players to calculate totals for
 * @returns Combined statistics for the team
 */
export function calculateTeamTotals(players: { stats: Stats }[]): Stats {
  return players.reduce((totals, player) => ({
    points: roundStat(totals.points + player.stats.points),
    rebounds: roundStat(totals.rebounds + player.stats.rebounds),
    assists: roundStat(totals.assists + player.stats.assists),
    steals: roundStat(totals.steals + player.stats.steals),
    blocks: roundStat(totals.blocks + player.stats.blocks),
    turnovers: roundStat(totals.turnovers + player.stats.turnovers),
    threePointers: roundStat(totals.threePointers + player.stats.threePointers),
  }), {
    points: 0,
    rebounds: 0, 
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    threePointers: 0
  });
}

/**
 * Calculates differences between two stat objects
 * 
 * @param current - Current statistics
 * @param original - Original statistics
 * @returns Differences between current and original stats
 */
export function calculateStatDifferences(current: Stats, original: Stats): Stats {
  return {
    points: roundStat(current.points - original.points),
    rebounds: roundStat(current.rebounds - original.rebounds),
    assists: roundStat(current.assists - original.assists),
    steals: roundStat(current.steals - original.steals),
    blocks: roundStat(current.blocks - original.blocks),
    turnovers: roundStat(current.turnovers - original.turnovers),
    threePointers: roundStat(current.threePointers - original.threePointers),
  };
}

/**
 * Groups players by team
 * 
 * @param players - The array of all player stats
 * @returns Object with teams as keys and arrays of players as values
 */
export const groupByTeam = (players: Player[]): { [key: string]: Player[] } => {
  return players.reduce((teams, player) => {
    if (!teams[player.team]) {
      teams[player.team] = [];
    }
    teams[player.team].push(player);
    return teams;
  }, {} as { [key: string]: Player[] });
};

/**
 * Calculates team minutes statistics
 * 
 * @param players - The array of players to calculate minutes for
 * @returns Object containing current, original, and difference in minutes
 */
export function calculateTeamMinutes(players: Player[]): {
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

/**
 * Calculates total minutes for a specific team
 * 
 * @param players - The array of all player stats
 * @param selectedTeam - The team to calculate minutes for
 * @returns The total minutes played by the team
 */
export const calculateTeamTotalMinutes = (players: Player[], selectedTeam: string): number => {
  return players
    .filter(player => player.team === selectedTeam)
    .reduce((total, player) => total + player.minutes, 0);
};