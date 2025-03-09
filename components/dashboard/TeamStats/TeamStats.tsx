import { StatBox } from '@/components/ui/stats/StatBox';
import { STAT_LABELS } from '@/lib/utils';
import { usePlayerStats } from '@/hooks';
import type { Player } from '@/types';

/**
 * TeamStats Component
 * 
 * Displays aggregated statistics for a team, showing current values and differences
 * based on minute adjustments. This component is part of the integrated team section
 * in the new design, without the card wrapper for better visual integration.
 * 
 * Features:
 * - Responsive grid layout for statistics
 * - Visual indicators for stat differences
 * - Team minute tracking with validation indicators
 * 
 * @param players - Array of players on the team to calculate stats for
 */
interface TeamStatsProps {
  players: Player[];
}

export function TeamStats({ players }: TeamStatsProps) {
  const { 
    calculateTeamTotals,
    calculateStatDifferences,
    getCurrentTeamMinutes,
    getTeamMinutesDifference
  } = usePlayerStats();

  if (!players.length) {
    return null;
  }

  const teamName = players[0]?.team || '';
  const currentStats = calculateTeamTotals(players);
  const originalStats = calculateTeamTotals(
    players.map(p => ({ stats: p.original.stats }))
  );
  const differences = calculateStatDifferences(currentStats, originalStats);
  const totalMinutes = getCurrentTeamMinutes(teamName);
  const minutesDifference = getTeamMinutesDifference(teamName);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Team Totals</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <StatBox 
          label={STAT_LABELS.points}
          value={currentStats.points} 
          difference={differences.points} 
        />
        <StatBox 
          label={STAT_LABELS.rebounds}
          value={currentStats.rebounds} 
          difference={differences.rebounds} 
        />
        <StatBox 
          label={STAT_LABELS.assists}
          value={currentStats.assists} 
          difference={differences.assists} 
        />
        <StatBox 
          label={STAT_LABELS.steals}
          value={currentStats.steals} 
          difference={differences.steals} 
        />
        <StatBox 
          label={STAT_LABELS.blocks}
          value={currentStats.blocks} 
          difference={differences.blocks} 
        />
        <StatBox 
          label={STAT_LABELS.turnovers}
          value={currentStats.turnovers} 
          difference={differences.turnovers} 
        />
        <StatBox 
          label={STAT_LABELS.threePointers}
          value={currentStats.threePointers} 
          difference={differences.threePointers} 
        />
        <StatBox 
          label="MIN" 
          value={totalMinutes} 
          difference={minutesDifference}
          isMinutes={true}
        />
      </div>
    </div>
  );
} 