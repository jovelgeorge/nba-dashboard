// components/dashboard/PlayerStats/PlayerList.tsx
import type { Player } from '@/types';
import { PlayerRow } from './PlayerRow';

interface PlayerListProps {
  players: Player[];
}

export function PlayerList({ players }: PlayerListProps) {
  return (
    <div className="space-y-4">
      {players.map(player => (
        <PlayerRow
          key={player.name}
          player={player}
          allTeamPlayers={players}
        />
      ))}
    </div>
  );
}