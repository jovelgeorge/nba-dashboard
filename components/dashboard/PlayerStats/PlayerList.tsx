// components/dashboard/PlayerStats/PlayerList.tsx
import { useDashboard } from '@/contexts/DashboardContext';
import { validateTeamMinutes } from '@/lib/validation';
import { ValidationWarning } from '@/components/ValidationWarning';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { PlayerListProps } from '.';
import { PlayerCard } from './PlayerCard';

/**
 * PlayerList Component
 * 
 * Displays a responsive grid of player cards for the selected team.
 * This component implements the card-based layout that replaces the
 * previous table-based layout for better information density and visual appeal.
 * 
 * Features:
 * - Responsive grid layout (1 column on mobile, 2 on tablet, 3 on desktop)
 * - Team minute validation with warning display
 * - Integrated error handling with ErrorBoundary
 * 
 * @param players - Array of players to display in the grid
 */
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map(player => (
          <ErrorBoundary key={player.name}>
            <PlayerCard player={player} />
          </ErrorBoundary>
        ))}
      </div>
    </div>
  );
}