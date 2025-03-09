// components/dashboard/FileUpload/FileUploadCard.tsx
import React, { useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ValidationWarning } from '@/components/ValidationWarning';
import { cn } from '@/lib/utils';
import type { FileUploadProps } from '@/types';

/**
 * Extended version of the FileUploadProps with additional UI-specific properties
 */
export interface FileUploadCardProps extends FileUploadProps {
  /** Optional validation warnings to display */
  validationWarnings?: string[];
  /** Optional CSS class name */
  className?: string;
}

/**
 * FileUploadCard component for handling file uploads with drag and drop
 */
export function FileUploadCard({ 
  source, 
  status, 
  isActive, 
  onFileSelect,
  validationWarnings = [],
  className 
}: FileUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag over event
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Early return if uploading or no file
    if (status.isUploading) return;
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    onFileSelect(file);
  }, [onFileSelect, status.isUploading]);

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    onFileSelect(file);
    
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect]);

  // Handle click to open file dialog
  const handleClick = useCallback(() => {
    if (!status.isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [status.isUploading]);

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
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
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
          <p className="text-sm font-medium">
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
      
      {validationWarnings.length > 0 && (
        <ValidationWarning
          type="messages"
          title="Validation Warnings"
          messages={validationWarnings}
          className="mt-4"
        />
      )}
    </Card>
  );
}