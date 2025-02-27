/**
 * Data Processing Module
 * 
 * This module handles all CSV file processing for the NBA dashboard application.
 * It includes functions for parsing, validating, and transforming player statistics data
 * from various sources into a unified format.
 */

import Papa from 'papaparse';
import type { 
  UnifiedStat, 
  DataSource, 
  ProcessedData
} from '@/types/index';
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
export const processRow = (row: RawCSVRow): UnifiedStat => {
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
export const processData = (rows: RawCSVRow[]): UnifiedStat[] => {
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

    const stats: UnifiedStat[] = [];
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
 * Groups player stats by team
 * 
 * @param players - The array of player stats to group
 * @returns An object mapping team names to arrays of player stats
 */
export const groupByTeam = (players: UnifiedStat[]): { [key: string]: UnifiedStat[] } => {
  return players.reduce((groups, player) => {
    const team = player.team;
    if (!groups[team]) {
      groups[team] = [];
    }
    groups[team].push(player);
    return groups;
  }, {} as { [key: string]: UnifiedStat[] });
};

/**
 * Calculates the total minutes played by a team
 * 
 * @param players - The array of all player stats
 * @param selectedTeam - The team to calculate minutes for
 * @returns The total minutes played by the team
 */
export const calculateTeamTotalMinutes = (players: UnifiedStat[], selectedTeam: string): number => {
  return players
    .filter(player => player.team === selectedTeam)
    .reduce((total, player) => total + player.minutes, 0);
};