/**
 * File Upload Hook
 * 
 * This hook provides functionality for handling CSV file uploads,
 * processing the data, and updating the application state.
 */

import { useCallback } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import type { DataSource, ProcessedData } from '@/types/index';
import { processCSVFile } from '@/lib/data-processing';
import { savePlayersToStorage, saveFileStatusToStorage } from '@/lib/storage';

/**
 * Hook for handling file uploads and processing
 * @returns Object containing file upload functions and status
 */
export const useFileUpload = () => {
  const { state, dispatch } = useDashboard();

  /**
   * Process a file upload and update application state
   * @param file - The file to process
   * @param source - The data source type
   * @returns A promise that resolves to the processed data
   */
  const processFile = useCallback(async (file: File, source: DataSource): Promise<ProcessedData> => {
    try {
      // Update upload status
      dispatch({
        type: 'UPDATE_FILE_STATUS',
        payload: {
          source,
          status: { lastUpdate: null, isUploading: true, error: null }
        }
      });

      // Process file
      const result = await processCSVFile(file, source);
      
      // Update timestamp
      const now = new Date();
      const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      
      const updatedStatus = {
        lastUpdate: timestamp,
        isUploading: false,
        error: result.errors?.length ? `Processed with ${result.errors.length} errors` : null
      };
      
      // Update state
      dispatch({ type: 'SET_PLAYERS', payload: result.stats });
      dispatch({
        type: 'UPDATE_FILE_STATUS',
        payload: {
          source,
          status: updatedStatus
        }
      });

      // Save to storage
      savePlayersToStorage(result.stats);
      saveFileStatusToStorage(state.fileStatus);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error processing file';
      
      dispatch({
        type: 'UPDATE_FILE_STATUS',
        payload: {
          source,
          status: {
            lastUpdate: state.fileStatus[source].lastUpdate,
            isUploading: false,
            error: errorMessage
          }
        }
      });

      throw error;
    }
  }, [dispatch, state.fileStatus]);

  return {
    processFile,
    fileStatus: state.fileStatus
  };
};
