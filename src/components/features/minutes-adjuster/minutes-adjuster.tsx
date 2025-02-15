"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Player } from "@/lib/types/minutes-adjuster";
import { PlayerList } from "./player-list";
import { StatDisplay } from "./stat-display";
import { FileUpload } from "./file-upload";
import { useMinutesAdjusterStore } from "@/store/minutes-adjuster/store";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const MinutesAdjuster = () => {
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);
  const {
    sources,
    activeSourceId,
    selectedTeam,
    getActivePlayers,
    getTeams,
    addSource,
    setActiveSource,
    setSelectedTeam,
    updatePlayerMinutes,
    setError,
  } = useMinutesAdjusterStore();
  const [showDifferences, setShowDifferences] = useState(false);
  const [useEtrProjections, setUseEtrProjections] = useState(false);

  const handleDataLoaded = (players: Player[], sourceName: string) => {
    try {
      addSource(sourceName, players);

      // Set first team as selected if none selected
      if (!selectedTeam && players.length > 0) {
        const firstTeam = players[0].Team;
        setSelectedTeam(firstTeam);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error processing data");
    }
  };

  const activePlayers = getActivePlayers();
  const teams = getTeams();
  const teamPlayers = activePlayers.filter((p) => p.Team === selectedTeam);

  const getTeamTotals = () => {
    if (!teamPlayers.length) return {
      minutes: 0,
      Points: 0,
      Rebounds: 0,
      Assists: 0,
      Steals: 0,
      Blocks: 0,
      Turnovers: 0,
      "3PM": 0,
    };

    return teamPlayers.reduce(
      (acc, player) => ({
        minutes: acc.minutes + player.Minutes,
        Points: acc.Points + player.scaledStats.Points,
        Rebounds: acc.Rebounds + player.scaledStats.Rebounds,
        Assists: acc.Assists + player.scaledStats.Assists,
        Steals: acc.Steals + player.scaledStats.Steals,
        Blocks: acc.Blocks + player.scaledStats.Blocks,
        Turnovers: acc.Turnovers + player.scaledStats.Turnovers,
        "3PM": acc["3PM"] + player.scaledStats["3PM"],
      }),
      {
        minutes: 0,
        Points: 0,
        Rebounds: 0,
        Assists: 0,
        Steals: 0,
        Blocks: 0,
        Turnovers: 0,
        "3PM": 0,
      }
    );
  };

  const getOriginalTeamTotals = () => {
    if (!teamPlayers.length) return getTeamTotals();
    
    return teamPlayers.reduce(
      (acc, player) => ({
        minutes: acc.minutes + player.originalMinutes,
        Points: acc.Points + player.originalStats.Points,
        Rebounds: acc.Rebounds + player.originalStats.Rebounds,
        Assists: acc.Assists + player.originalStats.Assists,
        Steals: acc.Steals + player.originalStats.Steals,
        Blocks: acc.Blocks + player.originalStats.Blocks,
        Turnovers: acc.Turnovers + player.originalStats.Turnovers,
        "3PM": acc["3PM"] + player.originalStats["3PM"],
      }),
      {
        minutes: 0,
        Points: 0,
        Rebounds: 0,
        Assists: 0,
        Steals: 0,
        Blocks: 0,
        Turnovers: 0,
        "3PM": 0,
      }
    );
  };

  const teamStats = getTeamTotals();
  const originalTeamStats = getOriginalTeamTotals();

  return (
    <div className="container mx-auto max-w-7xl py-8 space-y-8">
      {sources.length === 0 ? (
        <FileUpload 
          onDataLoaded={handleDataLoaded}
          onError={setError}
        />
      ) : (
        <>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              {sources.length > 1 && (
                <div className="flex gap-2">
                  {sources.map((source) => (
                    <Button
                      key={source.id}
                      variant={source.id === activeSourceId ? "default" : "outline"}
                      onClick={() => setActiveSource(source.id)}
                      className="font-medium"
                    >
                      {source.name}
                    </Button>
                  ))}
                </div>
              )}
              <Button
                variant="ghost"
                onClick={() => window.location.reload()}
                className="text-muted-foreground hover:text-foreground"
              >
                Upload New File
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Select value={selectedTeam || ''} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-[200px] bg-background">
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

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={useEtrProjections}
                    onCheckedChange={setUseEtrProjections}
                    id="etr-switch"
                  />
                  <label htmlFor="etr-switch" className="text-sm text-muted-foreground">
                    Use ETR Projections
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showDifferences}
                    onCheckedChange={setShowDifferences}
                    id="diff-switch"
                  />
                  <label htmlFor="diff-switch" className="text-sm text-muted-foreground">
                    Show Differences
                  </label>
                </div>
              </div>
            </div>
          </div>

          {selectedTeam && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">{selectedTeam}</h2>
                <span className={`text-sm font-medium ${
                  Math.abs(teamStats.minutes - 240) < 0.1 
                    ? 'text-emerald-500' 
                    : 'text-destructive'
                }`}>
                  {teamStats.minutes.toFixed(1)}/240 minutes
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-6">
                  <StatDisplay
                    label="PTS"
                    value={teamStats.Points}
                    originalValue={originalTeamStats.Points}
                  />
                </Card>
                <Card className="p-6">
                  <StatDisplay
                    label="REB"
                    value={teamStats.Rebounds}
                    originalValue={originalTeamStats.Rebounds}
                  />
                </Card>
                <Card className="p-6">
                  <StatDisplay
                    label="AST"
                    value={teamStats.Assists}
                    originalValue={originalTeamStats.Assists}
                  />
                </Card>
                <Card className="p-6">
                  <StatDisplay
                    label="STL"
                    value={teamStats.Steals}
                    originalValue={originalTeamStats.Steals}
                  />
                </Card>
              </div>

              {Math.abs(teamStats.minutes - 240) > 0.1 && (
                <Alert variant="destructive" className="bg-destructive/5 text-destructive">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Team minutes need to be adjusted. Current total: {teamStats.minutes.toFixed(1)} 
                    ({teamStats.minutes > 240 ? '+' : ''}{(teamStats.minutes - 240).toFixed(1)} minutes)
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <PlayerList
                  players={teamPlayers}
                  onUpdateMinutes={(playerId, minutes) => 
                    activeSourceId && updatePlayerMinutes(activeSourceId, playerId, minutes)
                  }
                  teamTotals={teamStats}
                  expandedPlayerId={expandedPlayerId}
                  onToggleExpand={setExpandedPlayerId}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};