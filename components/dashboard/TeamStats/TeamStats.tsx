import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatBox } from '@/components/ui/stats';
import { STAT_LABELS } from '@/lib/utils';
import { usePlayerStats } from '@/hooks';
import type { Player } from '@/types';

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
    <Card>
      <CardHeader>
        <CardTitle>Team Totals - {teamName}</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
} 