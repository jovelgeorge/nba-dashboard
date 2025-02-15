"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function DataSourceToggle() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="etr-mode" />
      <Label htmlFor="etr-mode">Use ETR Projections</Label>
    </div>
  )
}

