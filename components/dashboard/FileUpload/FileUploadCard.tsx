// components/dashboard/FileUpload/FileUploadCard.tsx
import React, { useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
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
    
    // Check if file is CSV
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }
    
    onFileSelect(file);
  }, [onFileSelect, status.isUploading]);

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    onFileSelect(file);
    
    // Reset the input value so the same file can be uploaded again if needed
    e.target.value = '';
  }, [onFileSelect]);

  // Handle click on the card to trigger file input
  const handleCardClick = useCallback(() => {
    if (status.isUploading) return;
    fileInputRef.current?.click();
  }, [status.isUploading]);

  // Determine card status classes
  const cardClasses = cn(
    "relative overflow-hidden transition-all duration-200",
    "border-2 rounded-lg p-6",
    status.isUploading && "opacity-80",
    isActive && status.lastUpdate && "border-primary",
    !status.lastUpdate && "border-dashed",
    className
  );

  return (
    <Card 
      className={cardClasses}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleCardClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
        disabled={status.isUploading}
      />
      
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        {status.isUploading ? (
          <LoadingSpinner size="lg" />
        ) : status.lastUpdate ? (
          <CheckCircle2 className="h-12 w-12 text-primary" />
        ) : (
          <Upload className="h-12 w-12 text-muted-foreground" />
        )}
        
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{source} Projections</h3>
          
          {status.lastUpdate ? (
            <p className="text-sm text-muted-foreground">
              Last updated: {status.lastUpdate}
              <br />
              Click to upload a new file
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Drag & drop or click to upload a CSV file
            </p>
          )}
        </div>
      </div>
      
      {status.error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {status.error}
          </AlertDescription>
        </Alert>
      )}
      
      {validationWarnings.length > 0 && (
        <div className="mt-4">
          <ValidationWarning 
            type="messages" 
            title="Validation Warnings"
            messages={validationWarnings}
          />
        </div>
      )}
    </Card>
  );
}