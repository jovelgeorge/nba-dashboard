// components/dashboard/FileUpload/types.ts
import { DataSource, FileUploadStatus } from '@/contexts/DashboardContext';

export interface FileUploadCardProps {
  source: DataSource;
  status: FileUploadStatus;
  isActive: boolean;
  onFileSelect: (file: File) => Promise<void>;
}

export interface UploadStatusProps {
  status: FileUploadStatus;
  source: DataSource;
}

export interface UploadIndicatorProps {
  status: FileUploadStatus;
  isActive: boolean;
}