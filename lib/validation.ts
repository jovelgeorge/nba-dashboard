/**
 * Validation Utilities
 * This module contains functions for validating data and user inputs.
 */

import type { 
  Player,
  DataSource, 
  FileValidationResult, 
  MinuteValidationResult,
  TeamMinutesValidation
} from '@/types';

export const TEAM_MINUTE_LIMIT = 240;
export const MIN_PLAYER_MINUTES = 0;
export const MAX_PLAYER_MINUTES = 48;

export type PlayerValidationError = {
  playerName: string;
  minutes: number;
  error: string;
};

/**
 * Validates that a team's total minutes equal the regulation value.
 */
export const validateTeamMinutes = (players: Player[], selectedTeam: string): TeamMinutesValidation => {
  const teamPlayers = players.filter(player => player.team === selectedTeam);
  const playerErrors: string[] = [];
  let totalMinutes = 0;

  // Validate individual player minutes
  teamPlayers.forEach(player => {
    if (player.minutes < MIN_PLAYER_MINUTES) {
      playerErrors.push(
        `${player.name}: Minutes cannot be less than ${MIN_PLAYER_MINUTES}`
      );
    } else if (player.minutes > MAX_PLAYER_MINUTES) {
      playerErrors.push(
        `${player.name}: Minutes cannot exceed ${MAX_PLAYER_MINUTES}`
      );
    }
    totalMinutes += player.minutes;
  });

  // Calculate difference from team limit
  const minutesDifference = TEAM_MINUTE_LIMIT - totalMinutes;

  // Add team total validation error if needed
  if (totalMinutes !== TEAM_MINUTE_LIMIT) {
    playerErrors.push(
      `Team Total: Team minutes must equal ${TEAM_MINUTE_LIMIT} (current: ${totalMinutes})`
    );
  }

  return {
    isValid: playerErrors.length === 0,
    totalMinutes,
    minutesDifference,
    playerErrors,
  };
};

/**
 * Validates a minute adjustment to ensure it doesn't violate constraints.
 */
export const validateMinuteAdjustment = (
  currentMinutes: number,
  newMinutes: number,
  teamTotalMinutes: number,
  selectedTeam: string,
  allPlayers?: Player[]
): MinuteValidationResult => {
  if (newMinutes < MIN_PLAYER_MINUTES) {
    return {
      isValid: false,
      error: `Minutes cannot be less than ${MIN_PLAYER_MINUTES}`,
    };
  }

  if (newMinutes > MAX_PLAYER_MINUTES) {
    return {
      isValid: false,
      error: `Minutes cannot exceed ${MAX_PLAYER_MINUTES}`,
    };
  }

  // If we don't have the full players array, just validate against the team total
  if (!allPlayers) {
    const newTeamTotal = teamTotalMinutes + (newMinutes - currentMinutes);
    if (newTeamTotal > TEAM_MINUTE_LIMIT) {
      return {
        isValid: false,
        error: `Adjustment would exceed team limit of ${TEAM_MINUTE_LIMIT} minutes`,
      };
    }
    return { isValid: true, error: null };
  }

  // If we have the full players array, validate using the filtered team players
  const teamPlayers = allPlayers.filter(p => p.team === selectedTeam);
  const teamTotal = teamPlayers.reduce((sum, p) => sum + p.minutes, 0);
  const minutesDifference = newMinutes - currentMinutes;
  const newTeamTotal = teamTotal + minutesDifference;

  if (newTeamTotal > TEAM_MINUTE_LIMIT) {
    return {
      isValid: false,
      error: `Adjustment would exceed team limit of ${TEAM_MINUTE_LIMIT} minutes`,
    };
  }

  return { isValid: true, error: null };
};

export const suggestMinuteDistribution = (
  players: Player[],
  targetMinutes: number,
  selectedTeam: string
): { [key: string]: number } => {
  const teamPlayers = players.filter(p => p.team === selectedTeam);
  const totalCurrentMinutes = teamPlayers.reduce((sum, p) => sum + p.minutes, 0);
  const minutesToDistribute = targetMinutes - totalCurrentMinutes;
  
  if (minutesToDistribute === 0) return {};

  // Sort players by their current minutes (descending) to prioritize higher-minute players
  const sortedPlayers = [...teamPlayers].sort((a, b) => b.minutes - a.minutes);
  const adjustments: { [key: string]: number } = {};

  if (minutesToDistribute > 0) {
    // Distribute additional minutes to players under 48 minutes
    let remainingMinutes = minutesToDistribute;
    for (const player of sortedPlayers) {
      if (remainingMinutes <= 0) break;
      const availableSpace = MAX_PLAYER_MINUTES - player.minutes;
      if (availableSpace > 0) {
        const adjustment = Math.min(remainingMinutes, availableSpace);
        adjustments[player.name] = player.minutes + adjustment;
        remainingMinutes -= adjustment;
      }
    }
  } else {
    // Reduce minutes from players with the most minutes
    let minutesToReduce = -minutesToDistribute;
    for (const player of sortedPlayers) {
      if (minutesToReduce <= 0) break;
      const availableReduction = player.minutes - MIN_PLAYER_MINUTES;
      if (availableReduction > 0) {
        const adjustment = Math.min(minutesToReduce, availableReduction);
        adjustments[player.name] = player.minutes - adjustment;
        minutesToReduce -= adjustment;
      }
    }
  }

  return adjustments;
};

export type CSVRowData = { [key: string]: string };

interface HeaderValidationResult {
  isValid: boolean;
  error?: string;
}

interface RowValidationResult {
  isValid: boolean;
  error?: string;
}

interface CSVRow {
  [key: string]: string | number | undefined;
}

const REQUIRED_HEADERS = {
  ETR: ['player', 'position', 'team', 'opponent', 'minutes', 'points', 'rebounds', 'assists', 'steals', 'blocks', 'turnovers'],
  UA: ['player', 'position', 'team', 'opponent', 'minutes', 'points', 'rebounds', 'assists', 'steals', 'blocks', 'turnovers']
};

export const validateCSVFile = (file: File): FileValidationResult => {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  if (!file.name.endsWith('.csv')) {
    return { isValid: false, error: 'Please upload a CSV file' };
  }

  if (file.size === 0) {
    return { isValid: false, error: 'File is empty' };
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    return { isValid: false, error: 'File size exceeds 5MB limit' };
  }

  return { isValid: true };
};

export const validateCSVHeaders = (headers: string[], source: DataSource): HeaderValidationResult => {
  const requiredHeaders = REQUIRED_HEADERS[source];
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());

  const missingHeaders = requiredHeaders.filter(
    header => !normalizedHeaders.includes(header.toLowerCase())
  );

  if (missingHeaders.length > 0) {
    return {
      isValid: false,
      error: `Missing required headers: ${missingHeaders.join(', ')}`
    };
  }

  return { isValid: true };
};

const isValidValue = (value: string | number | undefined): value is string | number => {
  return value !== undefined && value !== null && value !== '';
};

export const validateCSVRow = (row: CSVRow, source: DataSource): RowValidationResult => {
  // Check for required fields
  const requiredFields = REQUIRED_HEADERS[source];
  
  for (const field of requiredFields) {
    const value = row[field];
    if (!isValidValue(value)) {
      return {
        isValid: false,
        error: `Missing required field: ${field}`
      };
    }
  }

  // Validate numeric fields
  const numericFields = ['minutes', 'points', 'rebounds', 'assists', 'steals', 'blocks', 'turnovers'];
  for (const field of numericFields) {
    const value = row[field];
    if (!isValidValue(value)) continue;
    
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      return {
        isValid: false,
        error: `Invalid numeric value for ${field}: ${value}`
      };
    }
  }

  // Validate minutes specifically
  const minutes = row.minutes;
  if (!isValidValue(minutes)) {
    return {
      isValid: false,
      error: 'Missing minutes value'
    };
  }
  
  const minutesValue = typeof minutes === 'number' ? minutes : parseFloat(minutes);
  if (minutesValue > 48) {
    return {
      isValid: false,
      error: `Invalid minutes value: ${minutesValue} (must be <= 48)`
    };
  }

  return { isValid: true };
}; 