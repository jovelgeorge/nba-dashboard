/**
 * ValidationWarning Component
 * 
 * A flexible warning component that can display different types of validation warnings.
 * It supports both simple message lists and complex validation results with team minute validations.
 */

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TeamMinutesValidation, ValidationType } from '@/types';

export type ValidationWarningProps = 
  | { 
      type: 'minutes'; 
      validation: TeamMinutesValidation;
      className?: string;
    }
  | { 
      type: 'messages'; 
      title?: string;
      messages: string[];
      className?: string;
    }
  | {
      type: 'file' | 'data';
      title?: string;
      messages: string[];
      className?: string;
    };

export const ValidationWarning = (props: ValidationWarningProps) => {
  const { type, className } = props;

  // Common title map based on type
  const titleMap: Record<ValidationType, string> = {
    minutes: 'Team Minutes Warning',
    data: 'Data Validation Warning',
    file: 'File Upload Warning'
  };

  let title = '';
  let messages: string[] = [];

  if (type === 'minutes') {
    const { validation } = props;
    title = titleMap[type];
    messages = validation.playerErrors;
  } else {
    title = props.title || titleMap[type as ValidationType] || 'Warning';
    messages = props.messages;
  }

  if (messages.length === 0) {
    return null;
  }

  return (
    <Alert 
      variant="destructive" 
      className={cn("border-amber-500 bg-amber-50 text-amber-900", className)}
    >
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {messages.length === 1 ? (
          <p>{messages[0]}</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {messages.map((message, idx) => (
              <li key={idx} className="text-sm">{message}</li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  );
}; 