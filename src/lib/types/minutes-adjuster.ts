export type DataSource = {
  name: "ETR" | "Unabated";
  filePattern: RegExp;
};

export type Player = {
  PlayerId: string;
  Player: string;
  Team: string;
  Position: string;
  Minutes: number;
  originalMinutes: number;
  adjustedMinutes: number;
  originalStats: Stats;
  scaledStats: Stats;
};

export type ChangeLogEntry = {
  id: string;
  timestamp: Date;
  playerId: string;
  playerName: string;
  team: string;
  oldMinutes: number;
  newMinutes: number;
};

export type MinutesAdjusterState = {
  activeSource: DataSource["name"];
  selectedTeam: string | null;
  players: Player[];
  isLoading: boolean;
  error: string | null;
  changeLog: ChangeLogEntry[];
  teamStats: {
    [team: string]: {
      minutes: number;
      Points: number;
      Rebounds: number;
      Assists: number;
      Steals: number;
      Blocks: number;
      Turnovers: number;
      "3PM": number;
    };
  };
  originalTeamStats: {
    [team: string]: {
      minutes: number;
      Points: number;
      Rebounds: number;
      Assists: number;
      Steals: number;
      Blocks: number;
      Turnovers: number;
      "3PM": number;
    };
  };
  expandedPlayerId: string | null;

  setActiveSource: (source: DataSource["name"]) => void;
  setSelectedTeam: (team: string) => void;
  setPlayers: (players: Player[]) => void;
  updatePlayerMinutes: (playerId: string, minutes: number) => void;
  setExpandedPlayer: (playerId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addChangeLogEntry: (entry: Omit<ChangeLogEntry, "id" | "timestamp">) => void;
  calculateTeamStats: () => void;
};

export type StatCategory = {
  key: string;
  label: string;
};

export const STAT_CATEGORIES: StatCategory[] = [
  { key: "Points", label: "PTS" },
  { key: "Rebounds", label: "REB" },
  { key: "Assists", label: "AST" },
  { key: "Steals", label: "STL" },
  { key: "Blocks", label: "BLK" },
  { key: "Turnovers", label: "TOV" },
  { key: "3PM", label: "3PM" },
];

export type Stats = {
  Points: number;
  Rebounds: number;
  Assists: number;
  Steals: number;
  Blocks: number;
  Turnovers: number;
  "3PM": number;
};

export type TeamTotals = {
  minutes: number;
  Points: number;
  Rebounds: number;
  Assists: number;
  Steals: number;
  Blocks: number;
  Turnovers: number;
  "3PM": number;
};

export type StatDisplayProps = {
  value: number;
  originalValue: number;
  label?: string;
  showPercentageOfTeam?: boolean;
  teamTotal?: number;
};

export type PlayerCardProps = {
  player: Player;
  onMinutesChange: (playerId: string, minutes: number) => void;
  teamTotals: TeamTotals;
  isExpanded: boolean;
  onToggleExpand: () => void;
};
