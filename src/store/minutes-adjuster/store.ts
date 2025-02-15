"use client";

import { create } from "zustand";
import { Player } from "@/lib/types/minutes-adjuster";

interface ProjectionSource {
  id: string;
  name: string;
  players: Player[];
  timestamp: Date;
}

interface MinutesAdjusterState {
  sources: ProjectionSource[];
  activeSourceId: string | null;
  selectedTeam: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  addSource: (name: string, players: Player[]) => void;
  setActiveSource: (sourceId: string) => void;
  setSelectedTeam: (team: string | null) => void;
  updatePlayerMinutes: (sourceId: string, playerId: string, minutes: number) => void;
  setError: (error: string | null) => void;
  
  // Computed
  getActivePlayers: () => Player[];
  getTeams: () => string[];
}

export const useMinutesAdjusterStore = create<MinutesAdjusterState>((set, get) => ({
  sources: [],
  activeSourceId: null,
  selectedTeam: null,
  isLoading: false,
  error: null,

  addSource: (name: string, players: Player[]) => {
    const sourceId = crypto.randomUUID();
    set((state) => ({
      sources: [
        ...state.sources,
        {
          id: sourceId,
          name,
          players,
          timestamp: new Date(),
        },
      ],
      // Automatically set as active if it's the first source
      activeSourceId: state.activeSourceId ?? sourceId,
      error: null,
    }));
  },

  setActiveSource: (sourceId) => {
    set({ activeSourceId: sourceId });
  },

  setSelectedTeam: (team) => {
    set({ selectedTeam: team });
  },

  updatePlayerMinutes: (sourceId, playerId, minutes) => {
    set((state) => ({
      sources: state.sources.map((source) =>
        source.id === sourceId
          ? {
              ...source,
              players: source.players.map((player) =>
                player.PlayerId === playerId
                  ? {
                      ...player,
                      Minutes: minutes,
                      scaledStats: calculateScaledStats(player, minutes),
                    }
                  : player
              ),
            }
          : source
      ),
    }));
  },

  setError: (error) => {
    set({ error });
  },

  getActivePlayers: () => {
    const state = get();
    const activeSource = state.sources.find(
      (source) => source.id === state.activeSourceId
    );
    return activeSource?.players || [];
  },

  getTeams: () => {
    const players = get().getActivePlayers();
    return Array.from(new Set(players.map((p) => p.Team))).sort();
  },
}));

function calculateScaledStats(player: Player, newMinutes: number) {
  const scaleFactor = newMinutes / player.originalMinutes;
  return {
    Points: player.originalStats.Points * scaleFactor,
    Rebounds: player.originalStats.Rebounds * scaleFactor,
    Assists: player.originalStats.Assists * scaleFactor,
    Steals: player.originalStats.Steals * scaleFactor,
    Blocks: player.originalStats.Blocks * scaleFactor,
    Turnovers: player.originalStats.Turnovers * scaleFactor,
    "3PM": player.originalStats["3PM"] * scaleFactor,
  };
}