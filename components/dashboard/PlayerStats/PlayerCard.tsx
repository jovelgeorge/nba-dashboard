import { useState } from 'react';
import { StatBox } from '@/components/ui/stats/StatBox';
import { MinutesInput } from './MinutesInput';
import { STAT_LABELS } from '@/lib/utils';
import { usePlayerStats } from '@/hooks';
import type { Player } from '@/types';

/**
 * PlayerCard Component
 * 
 * A card-based component for displaying and editing player statistics.
 * This component replaces the previous row-based layout for better information
 * density and visual hierarchy.
 * 
 * Features:
 * - Card-based layout for better scannability
 * - Integrated minute adjustments with direct visual feedback
 * - Clear separation of player info and statistics
 * - Responsive design that works well in grid layouts
 * 
 * @param player - The player data to display and edit
 */
export interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
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
    <div className="flex flex-col h-full rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-medium text-lg">{player.name}</h3>
          <p className="text-sm text-muted-foreground">{player.position}</p>
        </div>
        <MinutesInput
          minutes={player.minutes}
          originalMinutes={original.minutes}
          onChange={handleMinutesChange}
          validationError={validationError}
        />
      </div>
      
      <div className="p-4 grid grid-cols-2 gap-4 flex-grow">
        <StatBox 
          label={STAT_LABELS.points}
          value={stats.points} 
          difference={differences.points}
          className="flex flex-col"
        />
        <StatBox 
          label={STAT_LABELS.rebounds}
          value={stats.rebounds} 
          difference={differences.rebounds}
          className="flex flex-col"
        />
        <StatBox 
          label={STAT_LABELS.assists}
          value={stats.assists} 
          difference={differences.assists}
          className="flex flex-col"
        />
        <StatBox 
          label={STAT_LABELS.steals}
          value={stats.steals} 
          difference={differences.steals}
          className="flex flex-col"
        />
        <StatBox 
          label={STAT_LABELS.blocks}
          value={stats.blocks} 
          difference={differences.blocks}
          className="flex flex-col"
        />
        <StatBox 
          label={STAT_LABELS.turnovers}
          value={stats.turnovers} 
          difference={differences.turnovers}
          className="flex flex-col"
        />
      </div>
      
      <div className="p-4 border-t">
        <StatBox 
          label={STAT_LABELS.threePointers}
          value={stats.threePointers} 
          difference={differences.threePointers}
          className="flex items-center justify-between w-full"
        />
      </div>
    </div>
  );
} 