/**
 * Team Statistics Components
 * This module exports all components related to team statistics display and manipulation.
 */

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

/**
 * TeamSection Component
 * 
 * Primary container for all team-related components in the dashboard.
 * This component implements the new integrated design approach, combining
 * team header, stats, and player listings in a cohesive layout with improved
 * visual hierarchy.
 * 
 * Features:
 * - Unified container for team information
 * - Integrated loading state management
 * - Logical grouping of related components
 * - Enhanced visual structure with sectioned content
 */
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
      <div className="bg-card rounded-lg border shadow-sm relative">
        <LoadingOverlay 
          isLoading={isLoading}
          message="Loading team data..."
        />
        
        <div className="p-6 border-b">
          <TeamHeader team={selectedTeam} />
        </div>
        
        <div className="p-6">
          <TeamStats players={teamPlayers} />
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">Player Adjustments</h3>
        <PlayerList players={teamPlayers} />
      </div>
    </div>
  );
} 