import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  type?: 'full' | 'section';
}

export function LoadingOverlay({ isLoading, message, type = 'section' }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className={cn(
      "absolute inset-0 flex items-center justify-center",
      "bg-background/50 backdrop-blur-sm",
      type === 'full' && "fixed z-50"
    )}>
      <div className="flex flex-col items-center gap-2 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
} 