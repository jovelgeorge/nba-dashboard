export interface Stats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  threePointers: number;
}

export interface Player {
  name: string;
  team: string;
  minutes: number;
  stats: Stats;
  original: {
    minutes: number;
    stats: Stats;
  };
}

export type DataSource = 'ETR' | 'UA';

export interface FileStatus {
  lastUpdate: Date | null;
  error: string | null;
} 