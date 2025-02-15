"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useMinutesAdjusterStore } from "@/store/minutes-adjuster/store";
import { type Player } from "@/lib/types/minutes-adjuster";
import { PlayerCard } from "./player-card";

interface PlayerListProps {
  players: Player[];
  onUpdateMinutes: (playerId: string, minutes: number) => void;
  teamTotals: {
    minutes: number;
    Points: number;
    Rebounds: number;
    Assists: number;
    Steals: number;
    Blocks: number;
    Turnovers: number;
    "3PM": number;
  };
  expandedPlayerId: string | null;
  onToggleExpand: (playerId: string | null) => void;
}

export const PlayerList = ({
  players,
  onUpdateMinutes,
  teamTotals,
  expandedPlayerId,
  onToggleExpand,
}: PlayerListProps) => {
  const sortedPlayers = [...players].sort((a, b) => b.Minutes - a.Minutes);

  return (
    <div className="space-y-4">
      {sortedPlayers.map((player) => (
        <PlayerCard
          key={player.PlayerId}
          player={player}
          onMinutesChange={onUpdateMinutes}
          teamTotals={teamTotals}
          isExpanded={expandedPlayerId === player.PlayerId}
          onToggleExpand={() =>
            onToggleExpand(expandedPlayerId === player.PlayerId ? null : player.PlayerId)
          }
        />
      ))}
    </div>
  );
};
