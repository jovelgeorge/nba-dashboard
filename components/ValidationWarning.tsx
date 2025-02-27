/**
 * ValidationWarning Component
 * 
 * A flexible warning component that can display different types of validation warnings.
 * It supports both simple message lists and complex validation results with team minute validations.
 */

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ValidationResult } from '@/lib/validation';

export type ValidationWarningProps = 
  | { 
      type: 'minutes'; 
      validation: ValidationResult;
      className?: string;
    }
  | { 
      type: 'messages'; 
      title?: string;
      messages: string[];
      className?: string;
    };

export const ValidationWarning = (props: ValidationWarningProps) => {
  // No validation issues, don't render anything
  if (
    (props.type === 'minutes' && props.validation.isValid) ||
    (props.type === 'messages' && props.messages.length === 0)
  ) {
    return null;
  }

  // Common styles
  const alertClassNames = cn(
    "border-yellow-500 bg-yellow-500/10",
    props.className
  );

  if (props.type === 'messages') {
    return (
      <Alert className={alertClassNames}>
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        {props.title && (
          <AlertTitle className="ml-2 text-yellow-700 font-medium">
            {props.title}
          </AlertTitle>
        )}
        <AlertDescription className="ml-2 text-yellow-700">
          <ul className="list-disc list-inside space-y-1">
            {props.messages.map((message, index) => (
              <li key={index} className="text-sm">
                {message}
              </li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
  }

  // Minutes validation type
  return (
    <Alert className={alertClassNames}>
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
      <AlertTitle className="ml-2 text-yellow-700 font-medium">
        Minutes Distribution
      </AlertTitle>
      <AlertDescription className="ml-2 text-yellow-700">
        <div className="space-y-2">
          <p className="font-medium">
            Team total: {props.validation.totalMinutes}/240 minutes
            {props.validation.minutesDifference !== 0 && (
              <span className="font-normal">
                {' '}
                ({props.validation.minutesDifference > 0 ? '+' : ''}
                {props.validation.minutesDifference} minutes)
              </span>
            )}
          </p>
          {props.validation.playerErrors.length > 0 && (
            <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
              {props.validation.playerErrors.map((error, index) => (
                <li key={index} className="font-normal">
                  {error.playerName}: {error.error}
                </li>
              ))}
            </ul>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}; 