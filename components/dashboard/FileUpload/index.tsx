// components/dashboard/FileUpload/index.tsx
import { useCallback } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useFileUpload } from '@/hooks/useFileUpload';
import { FileUploadCard } from './FileUploadCard';
import type { DataSource } from '@/types/dashboard';

export function FileUploadSection() {
  const { state } = useDashboard();
  const { processFile, fileStatus } = useFileUpload();

  const handleFileSelect = useCallback(async (source: DataSource, file: File) => {
    await processFile(file, source);
  }, [processFile]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FileUploadCard
        source="ETR"
        status={fileStatus.ETR}
        isActive={state.dataSource === 'ETR'}
        onFileSelect={(file) => handleFileSelect('ETR', file)}
      />
      <FileUploadCard
        source="UA"
        status={fileStatus.UA}
        isActive={state.dataSource === 'UA'}
        onFileSelect={(file) => handleFileSelect('UA', file)}
      />
    </div>
  );
}