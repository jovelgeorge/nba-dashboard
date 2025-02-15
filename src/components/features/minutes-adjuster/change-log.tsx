"use client";

import { Card } from "@/components/ui/card";
import { useMinutesAdjusterStore } from "@/store/minutes-adjuster/store";
import { formatDistanceToNow } from "date-fns";

export function ChangeLog() {
  const { changeLog } = useMinutesAdjusterStore();

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Change Log</h2>
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {changeLog.map((entry) => (
          <div
            key={entry.id}
            className="border-b border-border pb-3 last:border-0 last:pb-0"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{entry.playerName}</p>
                <p className="text-sm text-muted-foreground">{entry.team}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  {entry.oldMinutes} → {entry.newMinutes} mins
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {changeLog.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No changes recorded yet
          </p>
        )}
      </div>
    </Card>
  );
}
