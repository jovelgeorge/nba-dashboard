import { useDashboard } from '@/contexts/DashboardContext';
import { StatBox } from '@/components/ui/stats';
import { MinutesInput } from './MinutesInput';
import { STAT_LABELS } from '@/lib/stats';
import type { Player } from '@/types';
import { validateMinuteAdjustment } from '@/lib/validation';

interface PlayerRowProps {
  player: Player;
  allTeamPlayers: Player[];
}

export function PlayerRow({ player, allTeamPlayers }: PlayerRowProps) {
  const { dispatch, state } = useDashboard();
  const { stats, original } = player;
  
  const differences = {
    points: stats.points - original.stats.points,
    rebounds: stats.rebounds - original.stats.rebounds,
    assists: stats.assists - original.stats.assists,
    steals: stats.steals - original.stats.steals,
    blocks: stats.blocks - original.stats.blocks,
    turnovers: stats.turnovers - original.stats.turnovers,
    threePointers: stats.threePointers - original.stats.threePointers,
  };

  const handleMinutesChange = (minutes: number) => {
    const currentTeamMinutes = allTeamPlayers.reduce(
      (sum, p) => sum + (p.name === player.name ? 0 : p.minutes),
      0
    );

    const validation = validateMinuteAdjustment(
      player.minutes,
      minutes,
      currentTeamMinutes,
      player.team,
      state.players
    );

    if (validation.isValid) {
      dispatch({
        type: 'UPDATE_PLAYER_MINUTES',
        payload: { playerName: player.name, minutes }
      });
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium">{player.name}</h3>
          <p className="text-sm text-muted-foreground">{player.position}</p>
        </div>
        <MinutesInput
          minutes={player.minutes}
          originalMinutes={original.minutes}
          onChange={handleMinutesChange}
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatBox 
          label={STAT_LABELS.points}
          value={stats.points} 
          difference={differences.points} 
        />
        <StatBox 
          label={STAT_LABELS.rebounds}
          value={stats.rebounds} 
          difference={differences.rebounds} 
        />
        <StatBox 
          label={STAT_LABELS.assists}
          value={stats.assists} 
          difference={differences.assists} 
        />
        <StatBox 
          label={STAT_LABELS.steals}
          value={stats.steals} 
          difference={differences.steals} 
        />
        <StatBox 
          label={STAT_LABELS.blocks}
          value={stats.blocks} 
          difference={differences.blocks} 
        />
        <StatBox 
          label={STAT_LABELS.turnovers}
          value={stats.turnovers} 
          difference={differences.turnovers} 
        />
        <StatBox 
          label={STAT_LABELS.threePointers}
          value={stats.threePointers} 
          difference={differences.threePointers} 
        />
      </div>
    </div>
  );
}