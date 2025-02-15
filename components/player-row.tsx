"use client"

import { ChevronDown } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface PlayerRowProps {
  player: {
    name: string
    position: string
    minutes: number
  }
  onMinutesChange: (minutes: number) => void
}

export function PlayerRow({ player, onMinutesChange }: PlayerRowProps) {
  return (
    <Collapsible className="rounded-lg border bg-card">
      <div className="flex items-center p-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{player.name}</span>
            <span className="text-sm text-muted-foreground">{player.position}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-[2]">
          <input
            type="number"
            value={player.minutes}
            onChange={(e) => onMinutesChange(Number(e.target.value))}
            className="w-16 px-2 py-1 rounded-md border text-center"
          />
          <Slider
            defaultValue={[player.minutes]}
            max={48}
            step={0.5}
            className="flex-1"
            onValueChange={([value]) => onMinutesChange(value)}
          />
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="p-4 pt-0 border-t">
        <div className="grid grid-cols-4 gap-4">{/* Player detailed stats will go here */}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

