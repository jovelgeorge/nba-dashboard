import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { processCSVFile } from '@/lib/data-processing';
import { scaleStats } from '@/lib/utils';
import type { 
  UnifiedStat, 
  DataSource, 
  FileStatus, 
  DashboardState, 
  DashboardAction,
  DashboardContextType
} from '@/types/dashboard';
import type { ProcessedData } from '@/types/index';

// Export these types and constants
export const STORAGE_KEYS = {
  PLAYERS: 'players',
  SELECTED_TEAM: 'selectedTeam',
  DATA_SOURCE: 'dataSource',
  FILE_STATUS: 'fileStatus',
  SHOW_DIFFERENCES: 'showDifferences'
} as const;

// Re-export types from types/dashboard.ts
export type { UnifiedStat, FileStatus, DataSource } from '@/types/dashboard';

const initialState: DashboardState = {
  players: [],
  selectedTeam: null,
  dataSource: 'ETR',
  fileStatus: {
    ETR: {
      isUploading: false,
      error: null,
      lastUpdate: null
    },
    UA: {
      isUploading: false,
      error: null,
      lastUpdate: null
    }
  }
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'SET_PLAYERS':
      return {
        ...state,
        players: action.payload
      };
    case 'SET_SELECTED_TEAM':
      return {
        ...state,
        selectedTeam: action.payload
      };
    case 'SET_DATA_SOURCE':
      return {
        ...state,
        dataSource: action.payload
      };
    case 'UPDATE_FILE_STATUS':
      return {
        ...state,
        fileStatus: {
          ...state.fileStatus,
          [action.payload.source]: action.payload.status
        }
      };
    case 'UPDATE_PLAYER_MINUTES':
      return {
        ...state,
        players: state.players.map(player => 
          player.name === action.payload.playerName
            ? {
                ...player,
                minutes: action.payload.minutes,
                stats: scaleStats(
                  player.original.stats, 
                  player.original.minutes, 
                  action.payload.minutes
                )
              }
            : player
        )
      };
    default:
      return state;
  }
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Persist state to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    if (savedState) {
      try {
        const players = JSON.parse(savedState) as UnifiedStat[];
        dispatch({ type: 'SET_PLAYERS', payload: players });
      } catch (error) {
        console.error('Error loading saved players:', error);
      }
    }

    const savedTeam = localStorage.getItem(STORAGE_KEYS.SELECTED_TEAM);
    if (savedTeam) {
      dispatch({ type: 'SET_SELECTED_TEAM', payload: savedTeam });
    }

    const savedDataSource = localStorage.getItem(STORAGE_KEYS.DATA_SOURCE) as DataSource | null;
    if (savedDataSource) {
      dispatch({ type: 'SET_DATA_SOURCE', payload: savedDataSource });
    }

    const savedFileStatus = localStorage.getItem(STORAGE_KEYS.FILE_STATUS);
    if (savedFileStatus) {
      try {
        const fileStatus = JSON.parse(savedFileStatus);
        Object.entries(fileStatus).forEach(([source, status]) => {
          dispatch({
            type: 'UPDATE_FILE_STATUS',
            payload: { source: source as DataSource, status: status as FileStatus }
          });
        });
      } catch (error) {
        console.error('Error loading saved file status:', error);
      }
    }
  }, []);

  // Save state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(state.players));
    if (state.selectedTeam) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_TEAM, state.selectedTeam);
    }
    localStorage.setItem(STORAGE_KEYS.DATA_SOURCE, state.dataSource);
    localStorage.setItem(STORAGE_KEYS.FILE_STATUS, JSON.stringify(state.fileStatus));
  }, [state.players, state.selectedTeam, state.dataSource, state.fileStatus]);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const useFileUpload = () => {
  const { state, dispatch } = useDashboard();
  
  const handleFileUpload = async (file: File, source: DataSource): Promise<ProcessedData> => {
    try {
      // Update upload status
      dispatch({ 
        type: 'UPDATE_FILE_STATUS', 
        payload: { 
          source,
          status: { isUploading: true, error: null, lastUpdate: null }
        }
      });
      
      // Process file
      const result = await processCSVFile(file, source);
      
      // Update timestamp
      const now = new Date();
      const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      
      // Update state
      dispatch({ type: 'SET_PLAYERS', payload: result.stats });
      dispatch({ 
        type: 'UPDATE_FILE_STATUS',
        payload: {
          source,
          status: { isUploading: false, error: null, lastUpdate: timestamp }
        }
      });
      
      return result;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error processing file';
      
      dispatch({
        type: 'UPDATE_FILE_STATUS',
        payload: {
          source,
          status: {
            isUploading: false,
            error: errorMessage,
            lastUpdate: state.fileStatus[source].lastUpdate
          }
        }
      });

      throw error;
    }
  };
  
  return { handleFileUpload, fileStatus: state.fileStatus };
}; 