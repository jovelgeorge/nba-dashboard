/**
 * Team Statistics Components
 * This module exports all components related to team statistics display and manipulation.
 */

import { Card } from '@/components/ui/card';
import { useDashboard } from '@/contexts/DashboardContext';
import { LoadingOverlay } from '../Layout/LoadingOverlay';
import { TeamHeader } from './TeamHeader';
import { TeamStats } from './TeamStats';
import { PlayerList } from '../PlayerStats';
import type { Player } from '@/types';

// Component exports
export { TeamHeader } from './TeamHeader';
export { TeamStats } from './TeamStats';

// Type exports
export interface TeamHeaderProps {
  team: string;
}

export interface TeamStatsProps {
  players: Player[];
}

// TeamSection component definition and export
export function TeamSection() {
  const { state } = useDashboard();
  const { selectedTeam, players, fileStatus } = state;
  const isLoading = Object.values(fileStatus).some(status => status.isUploading);

  const teamPlayers = selectedTeam 
    ? players.filter(player => player.team === selectedTeam)
    : [];

  if (!selectedTeam) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 relative">
        <LoadingOverlay 
          isLoading={isLoading}
          message="Loading team data..."
        />
        <TeamHeader team={selectedTeam} />
      </Card>
      
      <TeamStats players={teamPlayers} />
      
      <Card className="p-6">
        <PlayerList players={teamPlayers} />
      </Card>
    </div>
  );
} 