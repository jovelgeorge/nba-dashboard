import { useState } from 'react';
import { StatBox } from '@/components/ui/stats';
import { MinutesInput } from './MinutesInput';
import { STAT_LABELS } from '@/lib/utils';
import { usePlayerStats } from '@/hooks';
import type { Player } from '@/types';

export interface PlayerRowProps {
  player: Player;
}

export function PlayerRow({ player }: PlayerRowProps) {
  const { getPlayerDifferences, updatePlayerMinutes } = usePlayerStats();
  const { stats, original } = player;
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Get stat differences using our hook
  const differences = getPlayerDifferences(player);

  const handleMinutesChange = (minutes: number) => {
    // Use our hook's updatePlayerMinutes function
    const validation = updatePlayerMinutes(player.name, minutes);

    if (validation.isValid) {
      setValidationError(null);
    } else {
      setValidationError(validation.error || 'Invalid minute adjustment');
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
          validationError={validationError}
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