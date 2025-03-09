'use client';

import { DashboardProvider } from '@/contexts/DashboardContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Dashboard } from '@/components/dashboard/Dashboard';

export default function Home() {
  return (
    <ErrorBoundary>
      <DashboardProvider>
        <Dashboard />
      </DashboardProvider>
    </ErrorBoundary>
  );
}