import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils'; 
import { AlertCircle } from 'lucide-react';
import type { MinutesInputProps } from '.';

export function MinutesInput({ 
  minutes, 
  originalMinutes, 
  onChange,
  validationError
}: MinutesInputProps) {
  const difference = minutes - originalMinutes;
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={minutes}
              onChange={(e) => onChange(Number(e.target.value))}
              className={cn(
                "w-20 text-right",
                validationError && "border-red-500 focus-visible:ring-red-500"
              )}
              min={0}
              max={48}
              step={0.5}
              aria-invalid={!!validationError}
            />
            <span className="text-sm font-medium">min</span>
          </div>
          {difference !== 0 && (
            <span className={cn(
              "text-xs font-medium",
              difference > 0 ? "text-green-500" : "text-red-500"
            )}>
              {difference > 0 ? '+' : ''}{difference.toFixed(1)}
            </span>
          )}
        </div>
        <Slider
          value={[minutes]}
          onValueChange={([value]) => onChange(value)}
          max={48}
          step={0.5}
          className={cn(
            "w-40",
            validationError && "text-red-500"
          )}
        />
      </div>
      
      {validationError && (
        <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
          <AlertCircle className="h-3 w-3" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
} 