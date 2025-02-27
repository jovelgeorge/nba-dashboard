// components/dashboard/FileUpload/index.tsx
/**
 * File Upload Section Component
 * 
 * This component provides a section for uploading CSV files from different data sources.
 */

import { useState, useCallback } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useFileUpload } from '@/hooks/useFileUpload';
import { FileUploadCard } from './FileUploadCard';
import type { DataSource } from '@/types/index';

export function FileUploadSection() {
  const { state } = useDashboard();
  const { processFile, fileStatus } = useFileUpload();
  const [validationWarnings, setValidationWarnings] = useState<Record<DataSource, string[]>>({
    ETR: [],
    UA: []
  });

  const handleFileSelect = useCallback(async (source: DataSource, file: File) => {
    try {
      const result = await processFile(file, source);
      // Set validation warnings if there are any
      if (result.errors && result.errors.length > 0) {
        setValidationWarnings(prev => ({
          ...prev,
          [source]: result.errors || []
        }));
      } else {
        // Clear warnings if successful with no errors
        setValidationWarnings(prev => ({
          ...prev,
          [source]: []
        }));
      }
    } catch (error) {
      console.error(`Error processing ${source} file:`, error);
      // Clear warnings on error since they'll be displayed in the error alert
      setValidationWarnings(prev => ({
        ...prev,
        [source]: []
      }));
    }
  }, [processFile]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FileUploadCard
        source="ETR"
        status={fileStatus.ETR}
        isActive={state.dataSource === 'ETR'}
        onFileSelect={(file) => handleFileSelect('ETR', file)}
        validationWarnings={validationWarnings.ETR}
      />
      <FileUploadCard
        source="UA"
        status={fileStatus.UA}
        isActive={state.dataSource === 'UA'}
        onFileSelect={(file) => handleFileSelect('UA', file)}
        validationWarnings={validationWarnings.UA}
      />
    </div>
  );
}