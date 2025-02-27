import React, { useCallback, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertCircle } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import { processCSVFile } from '@/lib/enhanced-data-processing';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ValidationWarning } from '@/components/ValidationWarning';
import { cn } from '@/lib/utils';
import type { DataSource } from '@/types/dashboard';

interface EnhancedFileUploadProps {
  source: DataSource;
  className?: string;
}

export function EnhancedFileUpload({ source, className }: EnhancedFileUploadProps) {
  const { state, dispatch } = useDashboard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const status = state.fileStatus[source];
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    await handleFileUpload(file);
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await handleFileUpload(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    try {
      setValidationWarnings([]);
      
      // Update upload status
      dispatch({ 
        type: 'UPDATE_FILE_STATUS', 
        payload: { 
          source,
          status: { isUploading: true, error: null, lastUpdate: null }
        }
      });
      
      // Process file
      const result = await processCSVFile(file, source);
      
      // Update timestamp
      const now = new Date();
      const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      
      // Update state
      dispatch({ type: 'SET_PLAYERS', payload: result.stats });
      dispatch({ 
        type: 'UPDATE_FILE_STATUS',
        payload: {
          source,
          status: { isUploading: false, error: null, lastUpdate: timestamp }
        }
      });

      // Set any validation warnings
      if (result.errors && result.errors.length > 0) {
        setValidationWarnings(result.errors);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error processing file';
      
      dispatch({
        type: 'UPDATE_FILE_STATUS',
        payload: {
          source,
          status: {
            isUploading: false,
            error: errorMessage,
            lastUpdate: state.fileStatus[source].lastUpdate
          }
        }
      });
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center",
          "w-full h-32 p-4 border-2 border-dashed rounded-lg",
          "transition-colors duration-200",
          status.isUploading ? "opacity-50 cursor-wait" : "cursor-pointer hover:border-primary",
          status.error ? "border-red-500" : "border-muted"
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
              status.error ? "text-red-500" : "text-muted-foreground"
            )}
            aria-hidden="true"
          />
        )}
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {status.isUploading ? 'Processing...' : 'Upload CSV'}
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
          title="Validation Warnings"
          messages={validationWarnings}
          className="mt-4"
        />
      )}
    </Card>
  );
} 