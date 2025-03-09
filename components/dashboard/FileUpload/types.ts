// components/dashboard/FileUpload/types.ts
import type { DataSource, FileStatus } from '@/types';

// Use the centralized FileUploadProps as the base interface
export type { FileUploadProps } from '@/types';

// Renamed from FileUploadCardProps to avoid duplication
export interface UploadStatusProps {
  status: FileStatus;
  source: DataSource;
}

export interface UploadIndicatorProps {
  status: FileStatus;
  isActive: boolean;
}