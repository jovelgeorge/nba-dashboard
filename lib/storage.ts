import { UnifiedStat, FileStatus, STORAGE_KEYS, DataSource } from '../contexts/DashboardContext';

export const savePlayersToStorage = (players: UnifiedStat[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  } catch (error) {
    console.error('Error saving players to storage:', error);
  }
};

export const getPlayersFromStorage = (): UnifiedStat[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting players from storage:', error);
    return [];
  }
};

export const saveFileStatusToStorage = (status: FileStatus) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FILE_STATUS, JSON.stringify(status));
  } catch (error) {
    console.error('Error saving file status to storage:', error);
  }
};

export const getFileStatusFromStorage = (): FileStatus | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FILE_STATUS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting file status from storage:', error);
    return null;
  }
};

export const saveSelectedTeamToStorage = (team: string | null) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_TEAM, team || '');
  } catch (error) {
    console.error('Error saving selected team to storage:', error);
  }
};

export const getSelectedTeamFromStorage = (): string | null => {
  try {
    const team = localStorage.getItem(STORAGE_KEYS.SELECTED_TEAM);
    return team || null;
  } catch (error) {
    console.error('Error getting selected team from storage:', error);
    return null;
  }
};

export const saveDataSourceToStorage = (source: DataSource): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DATA_SOURCE, source);
  } catch (error) {
    console.error('Error saving data source to storage:', error);
  }
};

export const getDataSourceFromStorage = (): DataSource | null => {
  try {
    const source = localStorage.getItem(STORAGE_KEYS.DATA_SOURCE);
    return source as DataSource | null;
  } catch (error) {
    console.error('Error getting data source from storage:', error);
    return null;
  }
};

export const saveShowDifferencesToStorage = (show: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SHOW_DIFFERENCES, JSON.stringify(show));
  } catch (error) {
    console.error('Error saving show differences to storage:', error);
  }
};

export const getShowDifferencesFromStorage = (): boolean => {
  try {
    const show = localStorage.getItem(STORAGE_KEYS.SHOW_DIFFERENCES);
    return show ? JSON.parse(show) : false;
  } catch (error) {
    console.error('Error getting show differences from storage:', error);
    return false;
  }
};

export const clearStoredData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}; 