import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Player, TeamTotals } from "@/lib/types/minutes-adjuster";
import { StatDisplay } from "./stat-display";

interface PlayerCardProps {
  player: Player;
  onMinutesChange: (playerId: string, minutes: number) => void;
  teamTotals: TeamTotals;
  isExpanded: boolean;
  onToggleExpand: () => void;
  showDifferences: boolean;
}

export const PlayerCard = ({
  player,
  onMinutesChange,
  teamTotals,
  isExpanded,
  onToggleExpand,
  showDifferences,
}: PlayerCardProps) => {
  const handleSliderChange = (value: number[]) => {
    onMinutesChange(player.PlayerId, value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 48) {
      onMinutesChange(player.PlayerId, value);
    }
  };

  const minutesDiff = player.Minutes - player.originalMinutes;
  const minutesPercentage = ((player.Minutes / teamTotals.minutes) * 100).toFixed(1);

  return (
    <Card className="w-full bg-[#080808] hover:bg-[#101010] transition-colors duration-200 rounded-lg">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-medium">{player.Player}</h3>
              <span className="text-zinc-500 text-sm">{player.Position}</span>
            </div>
            <div className="text-sm text-zinc-500">
              {minutesPercentage}% of team minutes
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white font-medium">
                {player.Minutes.toFixed(1)}
                <span className="text-zinc-500 text-xs ml-1">mins</span>
              </div>
              {showDifferences && (
                <div className={`text-xs ${
                  minutesDiff > 0 
                    ? 'text-emerald-500' 
                    : minutesDiff < 0 
                    ? 'text-red-500' 
                    : 'text-zinc-500'
                }`}>
                  {minutesDiff > 0 ? '+' : ''}{minutesDiff.toFixed(1)} mins
                </div>
              )}
            </div>
            <button
              onClick={onToggleExpand}
              className="p-1 hover:bg-white/5 rounded-full transition-colors"
              aria-label={isExpanded ? "Collapse player stats" : "Expand player stats"}
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-zinc-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-zinc-400" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-4">
            <Slider
              value={[player.Minutes]}
              onValueChange={handleSliderChange}
              min={0}
              max={48}
              step={0.5}
              className="flex-1"
            />
            <Input
              type="number"
              value={player.Minutes}
              onChange={handleInputChange}
              className="w-20 text-right bg-transparent border-0 text-white"
              min={0}
              max={48}
              step={0.5}
            />
          </div>

          {isExpanded && (
            <div className="grid grid-cols-7 gap-6 pt-6 border-t border-white/5">
              <StatDisplay
                label="PTS"
                value={player.scaledStats.Points}
                originalValue={player.originalStats.Points}
                showPercentageOfTeam
                teamTotal={teamTotals.Points}
              />
              <StatDisplay
                label="REB"
                value={player.scaledStats.Rebounds}
                originalValue={player.originalStats.Rebounds}
                showPercentageOfTeam
                teamTotal={teamTotals.Rebounds}
              />
              <StatDisplay
                label="AST"
                value={player.scaledStats.Assists}
                originalValue={player.originalStats.Assists}
                showPercentageOfTeam
                teamTotal={teamTotals.Assists}
              />
              <StatDisplay
                label="STL"
                value={player.scaledStats.Steals}
                originalValue={player.originalStats.Steals}
                showPercentageOfTeam
                teamTotal={teamTotals.Steals}
              />
              <StatDisplay
                label="BLK"
                value={player.scaledStats.Blocks}
                originalValue={player.originalStats.Blocks}
                showPercentageOfTeam
                teamTotal={teamTotals.Blocks}
              />
              <StatDisplay
                label="TOV"
                value={player.scaledStats.Turnovers}
                originalValue={player.originalStats.Turnovers}
                showPercentageOfTeam
                teamTotal={teamTotals.Turnovers}
              />
              <StatDisplay
                label="3PM"
                value={player.scaledStats["3PM"]}
                originalValue={player.originalStats["3PM"]}
                showPercentageOfTeam
                teamTotal={teamTotals["3PM"]}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
