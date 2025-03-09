// components/dashboard/PlayerStats/PlayerList.tsx
import { useDashboard } from '@/contexts/DashboardContext';
import { validateTeamMinutes } from '@/lib/validation';
import { ValidationWarning } from '@/components/ValidationWarning';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { PlayerListProps } from '.';
import { PlayerRow } from './PlayerRow';

export function PlayerList({ players }: PlayerListProps) {
  const { state } = useDashboard();
  
  // Only show validation if there are players for the selected team
  const showValidation = players.length > 0 && state.selectedTeam !== null;
  const validation = showValidation 
    ? validateTeamMinutes(state.players, state.selectedTeam!)
    : { isValid: true, totalMinutes: 0, minutesDifference: 0, playerErrors: [] };

  return (
    <div className="space-y-4">
      {showValidation && (
        <ValidationWarning 
          type="minutes" 
          validation={validation} 
        />
      )}
      
      {players.map(player => (
        <ErrorBoundary key={player.name}>
          <PlayerRow player={player} />
        </ErrorBoundary>
      ))}
    </div>
  );
}