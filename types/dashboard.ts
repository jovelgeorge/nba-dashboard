/**
 * Dashboard-specific Type Definitions
 * This module contains type definitions specific to the dashboard functionality.
 * Common types are imported from the index.ts file.
 */

import type { DataSource, UnifiedStat, FileStatus } from './index';

// Re-export common types for convenience
export type { DataSource, UnifiedStat, FileStatus } from './index';

export interface DashboardState {
  players: UnifiedStat[];
  selectedTeam: string | null;
  dataSource: DataSource;
  fileStatus: Record<DataSource, FileStatus>;
  showDifferences?: boolean;
}

export interface DashboardContextType {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
}

export type DashboardAction =
  | { type: 'SET_PLAYERS'; payload: UnifiedStat[] }
  | { type: 'SET_SELECTED_TEAM'; payload: string | null }
  | { type: 'SET_DATA_SOURCE'; payload: DataSource }
  | { type: 'SET_SHOW_DIFFERENCES'; payload: boolean }
  | { type: 'UPDATE_FILE_STATUS'; payload: { source: DataSource; status: FileStatus } }
  | { type: 'UPDATE_PLAYER_MINUTES'; payload: { playerName: string; minutes: number } }; 