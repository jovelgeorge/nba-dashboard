import { UnifiedStat, Stats } from '@/types';

export const scaleStats = (
  originalStats: Stats,
  originalMinutes: number,
  newMinutes: number
): Stats => {
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
};

export const calculateTeamTotals = (players: UnifiedStat[]): Stats => {
  return players.reduce(
    (totals, player) => ({
      points: totals.points + player.stats.points,
      rebounds: totals.rebounds + player.stats.rebounds,
      assists: totals.assists + player.stats.assists,
      steals: totals.steals + player.stats.steals,
      blocks: totals.blocks + player.stats.blocks,
      turnovers: totals.turnovers + player.stats.turnovers,
      threePointers: totals.threePointers + player.stats.threePointers,
    }),
    {
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      threePointers: 0,
    }
  );
};

export const calculateStatDifferences = (
  current: Stats,
  original: Stats
): Stats => {
  return {
    points: current.points - original.points,
    rebounds: current.rebounds - original.rebounds,
    assists: current.assists - original.assists,
    steals: current.steals - original.steals,
    blocks: current.blocks - original.blocks,
    turnovers: current.turnovers - original.turnovers,
    threePointers: current.threePointers - original.threePointers,
  };
};

export const roundStat = (value: number): number => {
  return Math.round(value * 10) / 10;
};

export const formatStat = (value: number): string => {
  const rounded = roundStat(value);
  return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
}; 