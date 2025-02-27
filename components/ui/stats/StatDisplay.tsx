import { cn } from "@/lib/utils";

export interface StatDisplayProps {
  label: string;
  current: number;
  difference: number;
  percentage?: number;
  className?: string;
  valueClassName?: string;
  differenceClassName?: string;
  percentageClassName?: string;
  showDifference?: boolean;
  showPercentage?: boolean;
  precision?: number;
}

export function StatDisplay({ 
  label, 
  current, 
  difference, 
  percentage,
  className,
  valueClassName,
  differenceClassName,
  percentageClassName,
  showDifference = true,
  showPercentage = true,
  precision = 1
}: StatDisplayProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={cn("font-medium", valueClassName)}>
        {current.toFixed(precision)}
        {showDifference && difference !== 0 && (
          <span className={cn(
            "ml-1 text-sm",
            difference > 0 ? "text-green-500" : "text-red-500",
            differenceClassName
          )}>
            ({difference > 0 ? "+" : ""}{difference.toFixed(precision)})
          </span>
        )}
      </div>
      {showPercentage && percentage !== undefined && percentage !== 0 && (
        <div className={cn(
          "text-xs",
          percentage > 0 ? "text-green-500" : "text-red-500",
          percentageClassName
        )}>
          {percentage > 0 ? "+" : ""}{percentage.toFixed(precision)}%
        </div>
      )}
    </div>
  );
} 