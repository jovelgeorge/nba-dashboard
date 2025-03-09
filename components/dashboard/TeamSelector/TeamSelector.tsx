import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDashboard } from '@/contexts/DashboardContext';

export function TeamSelector() {
  const { state, dispatch } = useDashboard();
  
  // Get unique teams from players array and sort them
  const teams = React.useMemo(() => {
    const uniqueTeams = Array.from(new Set(state.players.map(p => p.team)));
    return uniqueTeams.sort();
  }, [state.players]);

  const handleTeamSelect = React.useCallback((team: string) => {
    dispatch({ type: 'SET_SELECTED_TEAM', payload: team });
  }, [dispatch]);

  if (!state.players.length) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        Select Team
      </h3>
      <Select
        value={state.selectedTeam || ''}
        onValueChange={handleTeamSelect}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent>
          {teams.map(team => (
            <SelectItem key={team} value={team}>
              {team}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}