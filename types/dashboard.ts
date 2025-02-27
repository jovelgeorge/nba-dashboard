export type DataSource = 'ETR' | 'UA';

export interface Stats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  threePointers: number;
}

export interface UnifiedStat {
  name: string;
  position: string;
  team: string;
  opponent: string;
  minutes: number;
  stats: Stats;
  original: {
    minutes: number;
    stats: Stats;
  };
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ProcessedData {
  stats: UnifiedStat[];
  errors?: string[];
}

export interface FileStatus {
  isUploading: boolean;
  error: string | null;
  lastUpdate: string | null;
}

export interface DashboardState {
  players: UnifiedStat[];
  selectedTeam: string | null;
  dataSource: DataSource;
  fileStatus: Record<DataSource, FileStatus>;
}

export interface DashboardContextType {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
}

export type DashboardAction =
  | { type: 'SET_PLAYERS'; payload: UnifiedStat[] }
  | { type: 'SET_SELECTED_TEAM'; payload: string | null }
  | { type: 'SET_DATA_SOURCE'; payload: DataSource }
  | { type: 'UPDATE_FILE_STATUS'; payload: { source: DataSource; status: FileStatus } }; 