/**
 * Storage Module
 * 
 * This module provides functions for storing and retrieving data from localStorage.
 */

import type { UnifiedStat, FileStatus, DataSource } from '@/types/index';

// Storage keys
export const STORAGE_KEYS = {
  PLAYERS: 'players',
  SELECTED_TEAM: 'selectedTeam',
  DATA_SOURCE: 'dataSource',
  FILE_STATUS: 'fileStatus',
  SHOW_DIFFERENCES: 'showDifferences'
};

/**
 * Saves player data to localStorage
 */
export const savePlayersToStorage = (players: UnifiedStat[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  } catch (error) {
    console.error('Error saving players to storage:', error);
  }
};

/**
 * Gets player data from localStorage
 */
export const getPlayersFromStorage = (): UnifiedStat[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting players from storage:', error);
    return [];
  }
};

/**
 * Saves file status to localStorage
 */
export const saveFileStatusToStorage = (status: Record<DataSource, FileStatus>) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FILE_STATUS, JSON.stringify(status));
  } catch (error) {
    console.error('Error saving file status to storage:', error);
  }
};

/**
 * Gets file status from localStorage
 */
export const getFileStatusFromStorage = (): Record<DataSource, FileStatus> | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FILE_STATUS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting file status from storage:', error);
    return null;
  }
};

/**
 * Saves selected team to localStorage
 */
export const saveSelectedTeamToStorage = (team: string | null) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_TEAM, team || '');
  } catch (error) {
    console.error('Error saving selected team to storage:', error);
  }
};

/**
 * Gets selected team from localStorage
 */
export const getSelectedTeamFromStorage = (): string | null => {
  try {
    const team = localStorage.getItem(STORAGE_KEYS.SELECTED_TEAM);
    return team || null;
  } catch (error) {
    console.error('Error getting selected team from storage:', error);
    return null;
  }
};

/**
 * Saves data source to localStorage
 */
export const saveDataSourceToStorage = (source: DataSource): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DATA_SOURCE, source);
  } catch (error) {
    console.error('Error saving data source to storage:', error);
  }
};

/**
 * Gets data source from localStorage
 */
export const getDataSourceFromStorage = (): DataSource | null => {
  try {
    const source = localStorage.getItem(STORAGE_KEYS.DATA_SOURCE) as DataSource;
    return source || null;
  } catch (error) {
    console.error('Error getting data source from storage:', error);
    return null;
  }
};

/**
 * Saves show differences setting to localStorage
 */
export const saveShowDifferencesToStorage = (show: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SHOW_DIFFERENCES, JSON.stringify(show));
  } catch (error) {
    console.error('Error saving show differences to storage:', error);
  }
};

/**
 * Gets show differences setting from localStorage
 */
export const getShowDifferencesFromStorage = (): boolean => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SHOW_DIFFERENCES);
    return data ? JSON.parse(data) : false;
  } catch (error) {
    console.error('Error getting show differences from storage:', error);
    return false;
  }
};

/**
 * Clears all stored data from localStorage
 */
export const clearStoredData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PLAYERS);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_TEAM);
    localStorage.removeItem(STORAGE_KEYS.DATA_SOURCE);
    localStorage.removeItem(STORAGE_KEYS.FILE_STATUS);
    localStorage.removeItem(STORAGE_KEYS.SHOW_DIFFERENCES);
  } catch (error) {
    console.error('Error clearing stored data:', error);
  }
}; 