import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils'; 

interface MinutesInputProps {
  minutes: number;
  originalMinutes: number;
  onChange: (minutes: number) => void;
}

export function MinutesInput({ minutes, originalMinutes, onChange }: MinutesInputProps) {
  const difference = minutes - originalMinutes;
  
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={minutes}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-20 text-right"
            min={0}
            max={48}
            step={0.5}
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
        className="w-40"
      />
    </div>
  );
} 