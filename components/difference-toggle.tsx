"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function DifferenceToggle() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="diff-mode" />
      <Label htmlFor="diff-mode">Show Differences</Label>
    </div>
  )
}

