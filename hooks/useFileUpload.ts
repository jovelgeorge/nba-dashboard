import { useCallback } from 'react';
import { useDashboard, DataSource, ProcessedData } from '@/contexts/DashboardContext';
import { parseCSV, processData } from '@/lib/data-processing';
import { validateCSVFile, validateCSVHeaders, validateCSVRow } from '@/lib/validation';
import { savePlayersToStorage, saveFileStatusToStorage } from '@/lib/storage';

export const useFileUpload = () => {
  const { state, dispatch } = useDashboard();

  const processFile = useCallback(async (file: File, source: DataSource) => {
    try {
      // Initial file validation
      const fileValidation = validateCSVFile(file);
      if (!fileValidation.isValid) {
        throw new Error(fileValidation.error);
      }

      // Update upload status
      dispatch({
        type: 'UPDATE_FILE_STATUS',
        payload: {
          source,
          status: { lastUpdate: null, isUploading: true, error: null }
        }
      });

      // Parse CSV
      const data = await parseCSV(file);

      // Validate headers
      const headerValidation = validateCSVHeaders(Object.keys(data[0] || {}), source);
      if (!headerValidation.isValid) {
        throw new Error(headerValidation.error);
      }

      // Validate and process rows
      const errors: string[] = [];
      const validRows = data.filter((row, index) => {
        const rowValidation = validateCSVRow(row, source);
        if (!rowValidation.isValid && rowValidation.error) {
          errors.push(`Row ${index + 1}: ${rowValidation.error}`);
          return false;
        }
        return true;
      });

      // Process valid data
      const processedData = processData(validRows, source);

      // Update state and storage
      const now = new Date();
      const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

      dispatch({ type: 'SET_PLAYERS', payload: processedData });
      dispatch({
        type: 'UPDATE_FILE_STATUS',
        payload: {
          source,
          status: {
            lastUpdate: timestamp,
            isUploading: false,
            error: errors.length > 0 ? `Processed with ${errors.length} errors` : null
          }
        }
      });

      // Save to storage
      savePlayersToStorage(processedData);
      saveFileStatusToStorage(state.fileStatus);

      // Return processed data and any errors
      return {
        stats: processedData,
        errors: errors.length > 0 ? errors : undefined
      } as ProcessedData;

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
