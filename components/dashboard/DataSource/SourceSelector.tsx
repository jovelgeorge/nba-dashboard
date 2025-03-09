import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/contexts/DashboardContext';
import { LoadingOverlay } from '../Layout/LoadingOverlay';
import { cn } from '@/lib/utils';
import type { DataSource } from '@/types';

export function SourceSelector() {
  const { state, dispatch } = useDashboard();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSourceSwitch = useCallback(async (source: DataSource) => {
    if (state.fileStatus[source].lastUpdate) {
      setIsSwitching(true);
      try {
        // Add a slight delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        dispatch({ type: 'SET_DATA_SOURCE', payload: source });
      } finally {
        setIsSwitching(false);
      }
    }
  }, [dispatch, state.fileStatus]);

  return (
    <div className="relative">
      <LoadingOverlay 
        isLoading={isSwitching}
        message="Switching data source..."
      />
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Data Source
        </h3>
        <div className="flex gap-4">
          {(['ETR', 'UA'] as const).map(source => (
            <Button
              key={source}
              variant={state.dataSource === source ? "default" : "outline"}
              disabled={!state.fileStatus[source].lastUpdate || isSwitching}
              onClick={() => handleSourceSwitch(source)}
              className="relative"
            >
              <div className={cn(
                "absolute top-1 right-1 w-2 h-2 rounded-full",
                state.fileStatus[source].lastUpdate ? "bg-green-500" : "bg-gray-300"
              )} />
              {source} Projections
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
} 