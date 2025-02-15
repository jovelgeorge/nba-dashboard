import { Player, TeamTotals, STAT_CATEGORIES } from "../types/minutes-adjuster";

export const calculateTeamTotals = (players: Player[]): TeamTotals => {
  const totals: TeamTotals = {};

  players.forEach((player) => {
    if (!totals[player.Team]) {
      totals[player.Team] = {
        minutes: 0,
        ...STAT_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.key]: 0 }), {}),
      };
    }

    totals[player.Team].minutes += player.adjustedMinutes;
    STAT_CATEGORIES.forEach((cat) => {
      totals[player.Team][cat.key] += player.scaledStats[cat.key];
    });
  });

  return totals;
};

export const calculateScaledStats = (
  player: Player,
  newMinutes: number,
): Record<string, number> => {
  const scaleFactor = newMinutes / player.originalMinutes;

  return STAT_CATEGORIES.reduce(
    (acc, cat) => ({
      ...acc,
      [cat.key]: player.originalStats[cat.key] * scaleFactor,
    }),
    {} as Record<string, number>,
  );
};

export const isTeamMinutesValid = (teamMinutes: number): boolean => {
  return Math.abs(teamMinutes - 240) <= 0.1;
};

export const formatMinutesDiff = (current: number, target = 240): string => {
  const diff = current - target;
  return `${diff > 0 ? "+" : ""}${diff.toFixed(1)}`;
};
