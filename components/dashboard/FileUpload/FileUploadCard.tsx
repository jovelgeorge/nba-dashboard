// components/dashboard/FileUpload/FileUploadCard.tsx
import React, { useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';
import type { DataSource, FileStatus } from '@/types/dashboard';

interface FileUploadCardProps {
  source: DataSource;
  status: FileStatus;
  isActive: boolean;
  onFileSelect: (file: File) => void;
  className?: string;
}

export function FileUploadCard({ 
  source, 
  status, 
  isActive, 
  onFileSelect,
  className 
}: FileUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    onFileSelect(file);
  }, [onFileSelect]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    onFileSelect(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect]);

  return (
    <Card className={cn("w-full", className)}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center",
          "w-full h-32 p-4 border-2 border-dashed rounded-lg",
          "transition-colors duration-200",
          status.isUploading ? "opacity-50 cursor-wait" : "cursor-pointer hover:border-primary",
          status.error ? "border-red-500" : isActive ? "border-primary" : "border-muted"
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !status.isUploading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${source} CSV file`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".csv"
          onChange={handleFileChange}
          disabled={status.isUploading}
          aria-label="File input"
        />
        
        {status.isUploading ? (
          <LoadingSpinner 
            size="lg"
            className="text-primary mb-2"
          />
        ) : (
          <Upload 
            className={cn(
              "w-8 h-8 mb-2",
              status.error ? "text-red-500" : isActive ? "text-primary" : "text-muted-foreground"
            )}
            aria-hidden="true"
          />
        )}
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {status.isUploading ? 'Processing...' : `Upload ${source} CSV`}
          </p>
          {status.lastUpdate && (
            <p className="text-xs text-muted-foreground mt-1">
              Last update: {status.lastUpdate}
            </p>
          )}
        </div>
      </div>

      {status.error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {status.error}
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
}