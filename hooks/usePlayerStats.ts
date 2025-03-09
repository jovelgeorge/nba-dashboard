/**
 * Player Statistics Hook
 * 
 * This hook centralizes player statistics calculations, providing
 * functions for calculating, updating, and validating player statistics.
 */

import { useMemo } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { 
  calculateStatDifferences as calculateDifferences,
  calculateTeamTotals as calculateTotals
} from '@/lib/data-processing';
import { validateMinuteAdjustment } from '@/lib/validation';
import type { Player, Stats } from '@/types';

export interface PlayerStatCalculations {
  // Original and current stats
  original: Stats;
  current: Stats;
  // Difference between current and original
  differences: Stats;
  // Minutes
  originalMinutes: number;
  currentMinutes: number;
  minutesDifference: number;
}

export interface UsePlayerStatsReturn {
  // For a specific player
  getPlayerStats: (playerName: string) => PlayerStatCalculations | null;
  getPlayerDifferences: (player: Player) => Stats;
  // For updating player stats
  updatePlayerMinutes: (playerName: string, minutes: number) => {
    isValid: boolean;
    error: string | null;
  };
  // Team calculations
  getTeamPlayersStats: (teamName: string) => Player[];
  getCurrentTeamMinutes: (teamName: string) => number;
  getOriginalTeamMinutes: (teamName: string) => number;
  getTeamMinutesDifference: (teamName: string) => number;
  // Direct access to utility functions
  calculateTeamTotals: typeof calculateTotals;
  calculateStatDifferences: typeof calculateDifferences;
}

/**
 * Hook for player statistics calculations and updates
 * 
 * @returns Object containing player stat calculation and update functions
 */
export function usePlayerStats(): UsePlayerStatsReturn {
  const { state, dispatch } = useDashboard();
  const { players } = state;

  /**
   * Calculate the current and difference stats for a player
   */
  const getPlayerStats = (playerName: string): PlayerStatCalculations | null => {
    const player = players.find(p => p.name === playerName);
    if (!player) return null;

    return {
      original: player.original.stats,
      current: player.stats,
      differences: calculateDifferences(player.stats, player.original.stats),
      originalMinutes: player.original.minutes,
      currentMinutes: player.minutes,
      minutesDifference: player.minutes - player.original.minutes
    };
  };

  /**
   * Calculate differences between current and original stats for a player
   */
  const getPlayerDifferences = (player: Player): Stats => {
    return calculateDifferences(player.stats, player.original.stats);
  };

  /**
   * Get all players for a specific team
   */
  const getTeamPlayersStats = useMemo(() => {
    return (teamName: string): Player[] => {
      return players.filter(player => player.team === teamName);
    };
  }, [players]);

  /**
   * Update a player's minutes and recalculate their stats
   */
  const updatePlayerMinutes = (playerName: string, minutes: number) => {
    const player = players.find(p => p.name === playerName);
    if (!player) {
      return { isValid: false, error: 'Player not found' };
    }

    const teamPlayers = players.filter(p => p.team === player.team);
    const currentTeamMinutes = teamPlayers.reduce(
      (sum, p) => sum + (p.name === playerName ? 0 : p.minutes),
      0
    );

    const validation = validateMinuteAdjustment(
      player.minutes,
      minutes,
      currentTeamMinutes,
      player.team,
      players
    );

    if (validation.isValid) {
      dispatch({
        type: 'UPDATE_PLAYER_MINUTES',
        payload: { playerName, minutes }
      });
    }

    return validation;
  };

  /**
   * Get current total minutes for a team
   */
  const getCurrentTeamMinutes = (teamName: string): number => {
    return players
      .filter(player => player.team === teamName)
      .reduce((sum, player) => sum + player.minutes, 0);
  };

  /**
   * Get original total minutes for a team
   */
  const getOriginalTeamMinutes = (teamName: string): number => {
    return players
      .filter(player => player.team === teamName)
      .reduce((sum, player) => sum + player.original.minutes, 0);
  };

  /**
   * Get the difference between current and original minutes for a team
   */
  const getTeamMinutesDifference = (teamName: string): number => {
    const current = getCurrentTeamMinutes(teamName);
    const original = getOriginalTeamMinutes(teamName);
    return current - original;
  };

  return {
    getPlayerStats,
    getPlayerDifferences,
    updatePlayerMinutes,
    getTeamPlayersStats,
    getCurrentTeamMinutes,
    getOriginalTeamMinutes,
    getTeamMinutesDifference,
    // Direct access to utility functions for convenience
    calculateTeamTotals: calculateTotals,
    calculateStatDifferences: calculateDifferences
  };
} 