'use client';

/**
 * Main Dashboard Component
 * 
 * This component serves as the primary container for the NBA Player Projections Dashboard.
 */

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FileUploadSection } from '@/components/dashboard/FileUpload';
import { SourceSelector } from '@/components/dashboard/DataSource';
import { TeamSection } from '@/components/dashboard/TeamStats';
import { useDashboard } from '@/contexts/DashboardContext';
import { TeamSelector } from '@/components/dashboard/TeamSelector';
import { LoadingOverlay } from '@/components/dashboard/Layout/LoadingOverlay';

export function Dashboard() {
  const { state } = useDashboard();
  const hasData = state.players.length > 0;
  const isLoading = state.fileStatus.ETR.isUploading || state.fileStatus.UA.isUploading;

  return (
    <main className="container mx-auto p-4 space-y-6 relative">
      <LoadingOverlay isLoading={isLoading} message="Processing data..." />
      
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">nba-dashboard</h1>
          <p className="text-muted-foreground">
            upload statistical projections to fine-tune team rotations and player minutes.
          </p>
        </div>
        
        <div className="grid gap-6">
          <ErrorBoundary>
            <FileUploadSection />
          </ErrorBoundary>
          
          {hasData && (
            <>
              <ErrorBoundary>
                <div className="bg-card rounded-lg border shadow-sm p-4">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex-grow">
                      <SourceSelector />
                    </div>
                    <div className="flex-grow-0">
                      <TeamSelector />
                    </div>
                  </div>
                </div>
              </ErrorBoundary>
              
              {state.selectedTeam && (
                <ErrorBoundary>
                  <TeamSection />
                </ErrorBoundary>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
} 