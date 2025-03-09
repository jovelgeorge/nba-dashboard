/**
 * Dashboard-specific Type Definitions
 * This module contains type definitions specific to the dashboard functionality.
 * Common types are imported from the index.ts file.
 */

import type { 
  DataSource, 
  FileStatus,
  Player
} from './index';

// Re-export common types for convenience
export type { 
  DataSource, 
  UnifiedStat, 
  FileStatus,
  Player
} from './index';

/**
 * Application state for the dashboard
 */
export interface DashboardState {
  players: Player[];
  selectedTeam: string | null;
  dataSource: DataSource;
  fileStatus: Record<DataSource, FileStatus>;
  showDifferences?: boolean;
}

/**
 * Context type for the dashboard context
 */
export interface DashboardContextType {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
}

/**
 * All possible actions that can be dispatched to update dashboard state
 */
export type DashboardAction =
  | { type: 'SET_PLAYERS'; payload: Player[] }
  | { type: 'SET_SELECTED_TEAM'; payload: string | null }
  | { type: 'SET_DATA_SOURCE'; payload: DataSource }
  | { type: 'SET_SHOW_DIFFERENCES'; payload: boolean }
  | { type: 'UPDATE_FILE_STATUS'; payload: { source: DataSource; status: FileStatus } }
  | { type: 'UPDATE_PLAYER_MINUTES'; payload: { playerName: string; minutes: number } }; 