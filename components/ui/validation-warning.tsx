import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationWarningProps {
  title?: string;
  messages: string[];
  className?: string;
}

export function ValidationWarning({ title, messages, className }: ValidationWarningProps) {
  if (messages.length === 0) return null;

  return (
    <Alert className={cn("mt-4 border-yellow-500 bg-yellow-500/10", className)}>
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
      {title && <AlertTitle className="ml-2 text-yellow-700">{title}</AlertTitle>}
      <AlertDescription className="ml-2 text-yellow-700">
        <ul className="list-disc list-inside space-y-1">
          {messages.map((message, index) => (
            <li key={index} className="text-sm">
              {message}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
} 