"use client"

import { useState } from "react"
import { PlayerRow } from "@/components/player-row"
import { StatBox } from "@/components/stat-box"

export function TeamDashboard() {
  const [totalMinutes, setTotalMinutes] = useState(240)

  const teamStats = {
    PTS: 112.6,
    REB: 45.0,
    AST: 25.0,
    STL: 9.1,
    BLK: 5.2,
    TOV: 13.8,
    "3PM": 12.7,
  }

  const players = [
    { name: "James Harden", position: "G", minutes: 33.5 },
    { name: "Norman Powell", position: "G", minutes: 33.5 },
    { name: "Ivica Zubac", position: "C", minutes: 31.5 },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">LA Clippers</h2>
          <span className={`text-lg ${totalMinutes === 240 ? "text-green-500" : "text-red-500"}`}>
            {totalMinutes.toFixed(1)}/240 minutes
          </span>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-6">
          {Object.entries(teamStats).map(([key, value]) => (
            <StatBox key={key} label={key} value={value} />
          ))}
        </div>

        <div className="space-y-4">
          {players.map((player) => (
            <PlayerRow
              key={player.name}
              player={player}
              onMinutesChange={(minutes) => {
                // Update total minutes and recalculate stats
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

