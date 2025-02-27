import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ValidationResult } from '@/lib/validation';

interface ValidationWarningProps {
  validation: ValidationResult;
}

export const ValidationWarning = ({ validation }: ValidationWarningProps) => {
  if (validation.isValid) {
    return null;
  }

  return (
    <Alert 
      variant="default" 
      className="mb-4 bg-yellow-50/80 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/50"
    >
      <AlertTitle className="text-yellow-800 dark:text-yellow-300 font-medium">
        Minutes Distribution
      </AlertTitle>
      <AlertDescription className="text-yellow-700 dark:text-yellow-400/90">
        <div className="space-y-2">
          <p className="font-medium">
            Team total: {validation.totalMinutes}/240 minutes
            {validation.minutesDifference !== 0 && (
              <span className="font-normal">
                {' '}
                ({validation.minutesDifference > 0 ? '+' : ''}
                {validation.minutesDifference} minutes)
              </span>
            )}
          </p>
          {validation.playerErrors.length > 0 && (
            <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
              {validation.playerErrors.map((error, index) => (
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