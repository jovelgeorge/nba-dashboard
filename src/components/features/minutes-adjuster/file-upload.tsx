"use client";

import { useState, useCallback, useRef } from "react";
import Papa from "papaparse";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Info, Upload, FileCheck, AlertCircle } from "lucide-react";
import { Player } from "@/lib/types/minutes-adjuster";
import {
  processUnabatedData,
  processEtrData,
} from "@/lib/utils/data-processing";

interface UploadedFile {
  id: string;
  file: File;
  source: string | null;
  status: 'queued' | 'processing' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface FileUploadProps {
  onDataLoaded: (players: Player[], source: string) => void;
  onError: (error: string) => void;
}

export const FileUpload = ({ onDataLoaded, onError }: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectFileSource = (headers: string[]): string | null => {
    const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
    
    if (normalizedHeaders.includes('three pointers')) {
      return 'ETR';
    } else if (normalizedHeaders.includes('playerid') && 
               normalizedHeaders.includes('3pm')) {
      return 'Unabated';
    }
    return null;
  };

  const processFile = async (uploadedFile: UploadedFile) => {
    try {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, status: 'processing', progress: 30 }
            : f
        )
      );

      const text = await uploadedFile.file.text();
      const result = Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
      });

      if (result.errors.length > 0) {
        throw new Error(result.errors[0].message);
      }

      const source = detectFileSource(Object.keys(result.data[0] || {}));
      if (!source) {
        throw new Error('Unable to detect file source');
      }

      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, source, progress: 60 }
            : f
        )
      );

      const processedData = source === 'ETR' 
        ? processEtrData(result.data)
        : processUnabatedData(result.data);

      if (processedData.length === 0) {
        throw new Error('No valid data found in file');
      }

      onDataLoaded(processedData, source);

      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, status: 'success', progress: 100 }
            : f
        )
      );

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error processing file';
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, status: 'error', error: errorMessage }
            : f
        )
      );
      onError(errorMessage);
    }
  };

  const handleFiles = useCallback((files: FileList) => {
    const newFiles = Array.from(files)
      .filter(file => file.name.endsWith('.csv'))
      .map(file => ({
        id: crypto.randomUUID(),
        file,
        source: null,
        status: 'queued' as const,
        progress: 0
      }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach(processFile);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  return (
    <Card className="w-full max-w-3xl mx-auto bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Upload Projections</CardTitle>
        <CardDescription>
          Drop your CSV files or click to upload
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`
            relative rounded-lg border-2 border-dashed transition-all
            ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
            ${uploadedFiles.some(f => f.status === 'processing') ? "opacity-50" : "hover:border-primary hover:bg-primary/5"}
          `}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".csv"
            className="hidden"
            onChange={handleChange}
            onClick={e => e.stopPropagation()}
          />
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-1">
              Drag and drop your CSV files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports ETR and Unabated projection files
            </p>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {file.status === 'success' && <FileCheck className="h-4 w-4 text-green-500" />}
                    {file.status === 'error' && <AlertCircle className="h-4 w-4 text-destructive" />}
                    {file.status === 'processing' && <Info className="h-4 w-4 text-blue-500 animate-spin" />}
                    <span className="text-sm font-medium">{file.file.name}</span>
                  </div>
                  {file.source && (
                    <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">
                      {file.source}
                    </span>
                  )}
                </div>

                {file.status === 'processing' && (
                  <Progress value={file.progress} className="h-1" />
                )}

                {file.error && (
                  <p className="text-xs text-destructive">{file.error}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Files will be automatically processed and added to your projections
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};