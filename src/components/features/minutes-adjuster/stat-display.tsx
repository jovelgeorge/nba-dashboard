import { cn } from "@/lib/utils";

interface StatDisplayProps {
  value: number;
  originalValue: number;
  label: string;
  showPercentageOfTeam?: boolean;
  teamTotal?: number;
}

export const StatDisplay = ({
  value,
  originalValue,
  label,
  showPercentageOfTeam = false,
  teamTotal,
}: StatDisplayProps) => {
  const diff = value - originalValue;
  const percentDiff = ((diff / originalValue) * 100).toFixed(1);
  const percentOfTeam = teamTotal ? ((value / teamTotal) * 100).toFixed(1) : null;

  return (
    <div className="text-center">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value.toFixed(1)}</div>
      <div className="text-xs space-x-1">
        <span
          className={`${
            diff === 0
              ? "text-muted-foreground"
              : diff > 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {diff > 0 ? "+" : ""}
          {diff.toFixed(1)}
        </span>
        <span className="text-muted-foreground">
          ({diff > 0 ? "+" : ""}
          {percentDiff}%)
        </span>
      </div>
      {showPercentageOfTeam && percentOfTeam && (
        <div className="text-xs text-muted-foreground mt-1">
          {percentOfTeam}% of team
        </div>
      )}
    </div>
  );
};
