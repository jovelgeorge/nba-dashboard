"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMinutesAdjusterStore } from "@/store/minutes-adjuster/store";

export function TeamStats() {
  const { players } = useMinutesAdjusterStore();

  const teamStats = useMemo(() => {
    const stats = new Map<string, number>();

    players.forEach((player) => {
      const currentTotal = stats.get(player.team) || 0;
      stats.set(player.team, currentTotal + player.projectedMinutes);
    });

    return Array.from(stats.entries())
      .map(([team, minutes]) => ({
        team,
        minutes,
        difference: minutes - 240,
      }))
      .sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));
  }, [players]);

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Team Minutes</h2>
      <div className="space-y-4">
        {teamStats.map(({ team, minutes, difference }) => (
          <div key={team} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{team}</span>
              <span className="text-sm">{minutes.toFixed(1)} mins</span>
            </div>

            {difference !== 0 && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-sm">
                  {difference > 0
                    ? `${difference.toFixed(1)} minutes over target`
                    : `${Math.abs(difference).toFixed(1)} minutes under target`}
                </AlertDescription>
              </Alert>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
