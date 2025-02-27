import Papa from 'papaparse';
import type { UnifiedStat, DataSource, ProcessedData } from '@/types/dashboard';
import { validateCSVFile, validateCSVHeaders, validateCSVRow } from './validation';

export class CSVProcessingError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'CSVProcessingError';
  }
}

// Team name mapping for standardization
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

const normalizeTeamName = (team: string): string => {
  // Check if it's an abbreviation first
  const fullName = TEAM_NAME_MAPPING[team.toUpperCase()];
  if (fullName) return fullName;

  // If not an abbreviation, return the original name with proper capitalization
  return team.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

interface RawCSVRow {
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

const convertToString = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return '';
  return value.toString();
};

export const processCSVFile = async (
  file: File, 
  source: DataSource
): Promise<ProcessedData> => {
  // Validate file first
  const fileValidation = validateCSVFile(file);
  if (!fileValidation.isValid) {
    throw new CSVProcessingError(fileValidation.error || 'Invalid file');
  }

  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim(),
      complete: (results) => {
        try {
          if (!results.data || results.data.length === 0) {
            throw new CSVProcessingError('No data found in file');
          }

          // Validate headers
          const headerValidation = validateCSVHeaders(
            Object.keys(results.data[0] || {}),
            source
          );
          
          if (!headerValidation.isValid) {
            throw new CSVProcessingError(headerValidation.error || 'Invalid headers');
          }

          const stats: UnifiedStat[] = [];
          const errors: string[] = [];

          (results.data as RawCSVRow[]).forEach((row, index) => {
            try {
              // Validate row data
              const rowValidation = validateCSVRow({
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
              }, source);

              if (!rowValidation.isValid) {
                throw new Error(rowValidation.error);
              }

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

              stats.push({
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
              });
            } catch (error) {
              errors.push(`Row ${index + 1}: ${error instanceof Error ? error.message : 'Invalid data'}`);
            }
          });

          if (stats.length === 0) {
            throw new CSVProcessingError('No valid data found in file');
          }

          resolve({ stats, errors: errors.length > 0 ? errors : undefined });
        } catch (error) {
          reject(error);
        }
      },
      error: (error: Error) => {
        reject(new CSVProcessingError('Failed to parse CSV', error));
      }
    });
  });
}; 