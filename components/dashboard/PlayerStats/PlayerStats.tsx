// components/dashboard/PlayerStats/PlayerStats.tsx
import { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Card } from '@/components/ui/card';
import { MinutesInput } from './MinutesInput';
import { StatBox } from '@/components/ui/stats';
import { STAT_LABELS } from '@/lib/utils';
import { validateMinuteAdjustment } from '@/lib/validation';
import type { Player } from '@/types';

interface PlayerStatsProps {
  player: Player;
  teamPlayers: Player[];
}

export function PlayerStats({ player, teamPlayers }: PlayerStatsProps) {
  const { dispatch, state } = useDashboard();
  const { stats, original } = player;
  const [validationError, setValidationError] = useState<string | null>(null);
  
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
    const currentTeamMinutes = teamPlayers.reduce(
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
      setValidationError(null);
      dispatch({
        type: 'UPDATE_PLAYER_MINUTES',
        payload: { playerName: player.name, minutes }
      });
    } else {
      setValidationError(validation.error || 'Invalid minute adjustment');
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{player.name}</h3>
          <p className="text-sm text-muted-foreground">
            {player.team} • {player.position}
          </p>
        </div>
        <div className="text-right">
          <MinutesInput
            minutes={player.minutes}
            originalMinutes={original.minutes}
            onChange={handleMinutesChange}
            validationError={validationError}
          />
        </div>
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
    </Card>
  );
}