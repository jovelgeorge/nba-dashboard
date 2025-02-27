'use client';

import { DashboardProvider } from '@/contexts/DashboardContext';
import { FileUploadSection } from '@/components/dashboard/FileUpload';
import { SourceSelector } from '@/components/dashboard/DataSource';
import { TeamSelector } from '@/components/dashboard/TeamSelector';
import { TeamSection } from '@/components/dashboard/TeamStats';
import { useDashboard } from '@/contexts/DashboardContext';

function Dashboard() {
  const { state } = useDashboard();
  const hasData = state.players.length > 0;

  return (
    <main className="container mx-auto p-4 space-y-6 relative">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">NBA Player Projections Dashboard</h1>
          <p className="text-muted-foreground">
            Upload player projections from ETR or Unabated to fine-tune player minutes and team rotations.
          </p>
        </div>
        
        <div className="grid gap-6">
          <FileUploadSection />
          
          {hasData && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <SourceSelector />
                <TeamSelector />
              </div>
              
              {state.selectedTeam && <TeamSection />}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}