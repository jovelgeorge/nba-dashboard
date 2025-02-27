import { useDashboard } from '@/contexts/DashboardContext';
import { StatBox } from '@/components/ui/stats';
import { calculateTeamMinutes } from '@/lib/stats';
import type { Player } from '@/types';

interface TeamHeaderProps {
  team: string;
  players: Player[];
}

export function TeamHeader({ team, players }: TeamHeaderProps) {
  const { state } = useDashboard();
  const { dataSource } = state;
  
  const { current: totalMinutes, difference: minutesDifference } = calculateTeamMinutes(players);

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">{team}</h2>
        <p className="text-sm text-muted-foreground">
          {dataSource} Projections
        </p>
      </div>
      <StatBox 
        label="Total Minutes" 
        value={totalMinutes} 
        difference={minutesDifference}
        isMinutes={true}
      />
    </div>
  );
} 