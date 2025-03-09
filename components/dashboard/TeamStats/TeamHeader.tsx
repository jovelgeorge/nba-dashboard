import { useDashboard } from '@/contexts/DashboardContext';
import { StatBox } from '@/components/ui/stats';
import { usePlayerStats } from '@/hooks';
import type { TeamHeaderProps } from '.';

export function TeamHeader({ team }: TeamHeaderProps) {
  const { state } = useDashboard();
  const { dataSource } = state;
  const { getCurrentTeamMinutes, getTeamMinutesDifference } = usePlayerStats();
  
  const totalMinutes = getCurrentTeamMinutes(team);
  const minutesDifference = getTeamMinutesDifference(team);

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