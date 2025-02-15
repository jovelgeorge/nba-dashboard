import { Player, Stats } from "../types/minutes-adjuster";

type UnabatedRawData = {
  PlayerId: string;
  Player: string;
  Team: string;
  Position: string;
  Minutes: number;
  Points: number;
  Rebounds: number;
  Assists: number;
  Steals: number;
  Blocks: number;
  Turnovers: number;
  "3PM": number;
};

type EtrRawData = {
  Player: string;
  Position: string;
  Team: string;
  Minutes: number;
  Points: number;
  Rebounds: number;
  Assists: number;
  "Three Pointers": number;
  Steals: number;
  Blocks: number;
  Turnovers: number;
};

type RawPlayerData = {
  [key: string]: any;
  Player?: string;
  Team?: string;
  Position?: string;
  Minutes?: number;
  Points?: number;
  Rebounds?: number;
  Assists?: number;
  Steals?: number;
  Blocks?: number;
  Turnovers?: number;
  "Three Pointers"?: number;
  "3PM"?: number;
};

const createStats = (data: Record<string, number>): Stats => ({
  Points: data.Points || 0,
  Rebounds: data.Rebounds || 0,
  Assists: data.Assists || 0,
  Steals: data.Steals || 0,
  Blocks: data.Blocks || 0,
  Turnovers: data.Turnovers || 0,
  "3PM": data["3PM"] || data["Three Pointers"] || 0,
});

const normalizePlayerData = (rawPlayer: RawPlayerData, source: string): Player => {
  const stats = {
    Points: rawPlayer.Points || rawPlayer.pts || 0,
    Rebounds: rawPlayer.Rebounds || rawPlayer.reb || 0,
    Assists: rawPlayer.Assists || rawPlayer.ast || 0,
    Steals: rawPlayer.Steals || rawPlayer.stl || 0,
    Blocks: rawPlayer.Blocks || rawPlayer.blk || 0,
    Turnovers: rawPlayer.Turnovers || rawPlayer.tov || 0,
    "3PM": rawPlayer["3PM"] || rawPlayer["Three Pointers"] || rawPlayer.threes || 0,
  };

  return {
    PlayerId: rawPlayer.PlayerId || rawPlayer.player_id || `${source}_${Date.now()}`,
    Player: rawPlayer.Player || rawPlayer.name || "",
    Team: (rawPlayer.Team || rawPlayer.team || "").toUpperCase(),
    Position: (rawPlayer.Position || rawPlayer.pos || "").toUpperCase(),
    Minutes: rawPlayer.Minutes || rawPlayer.mins || 0,
    originalMinutes: rawPlayer.Minutes || rawPlayer.mins || 0,
    adjustedMinutes: rawPlayer.Minutes || rawPlayer.mins || 0,
    originalStats: stats,
    scaledStats: { ...stats },
  };
};

export const processUnabatedData = (rawData: unknown[]): Player[] => {
  return rawData
    .map(row => normalizePlayerData(row as RawPlayerData, "Unabated"))
    .filter(player => player.Player && player.Team);
};

export const processEtrData = (rawData: unknown[]): Player[] => {
  return rawData
    .map(row => normalizePlayerData(row as RawPlayerData, "ETR"))
    .filter(player => player.Player && player.Team);
};