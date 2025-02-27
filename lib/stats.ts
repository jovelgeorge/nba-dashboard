import type { Stats, UnifiedStat } from '@/types';

export const INITIAL_STATS: Stats = {
  points: 0,
  rebounds: 0,
  assists: 0,
  steals: 0,
  blocks: 0,
  turnovers: 0,
  threePointers: 0,
};

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

export const STAT_LABELS = {
  points: 'PTS',
  rebounds: 'REB',
  assists: 'AST',
  steals: 'STL',
  blocks: 'BLK',
  turnovers: 'TOV',
  threePointers: '3PM',
} as const; 