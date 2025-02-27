import { Card } from '@/components/ui/card';
import { useDashboard } from '@/contexts/DashboardContext';
import { LoadingOverlay } from '../Layout/LoadingOverlay';
import { TeamHeader } from './TeamHeader';
import { TeamStats } from './TeamStats';
import { PlayerList } from '../PlayerStats';

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
        <TeamHeader team={selectedTeam} players={teamPlayers} />
      </Card>
      
      <TeamStats players={teamPlayers} />
      
      <Card className="p-6">
        <PlayerList players={teamPlayers} />
      </Card>
    </div>
  );
} 