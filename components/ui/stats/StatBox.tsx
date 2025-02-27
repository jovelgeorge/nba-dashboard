import { cn } from "@/lib/utils";

export interface StatBoxProps {
  label: string;
  value: number;
  difference?: number;
  isMinutes?: boolean;
  maxMinutes?: number;
  className?: string;
  valueClassName?: string;
  differenceClassName?: string;
}

export function StatBox({ 
  label, 
  value, 
  difference, 
  isMinutes = false,
  maxMinutes = 240,
  className,
  valueClassName,
  differenceClassName
}: StatBoxProps) {
  const formattedValue = value.toFixed(1);
  const isValid = isMinutes ? value === maxMinutes : true;

  return (
    <div className={cn(
      "rounded-lg p-3 bg-card border",
      className
    )}>
      <div className="text-sm font-medium text-muted-foreground">
        {label}
      </div>
      <div className={cn(
        "text-xl font-bold",
        isMinutes ? (isValid ? "text-green-500" : "text-red-500") : "text-primary",
        valueClassName
      )}>
        {formattedValue}
        {isMinutes && `/${maxMinutes}`}
      </div>
      {difference !== undefined && difference !== 0 && (
        <div className={cn(
          "text-sm",
          difference > 0 ? "text-green-500" : "text-red-500",
          differenceClassName
        )}>
          {difference > 0 ? "+" : ""}
          {difference.toFixed(1)}
        </div>
      )}
    </div>
  );
} 