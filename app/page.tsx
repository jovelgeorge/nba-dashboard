import { TeamDashboard } from "@/components/team-dashboard"
import { TeamSelector } from "@/components/team-selector"
import { DataSourceToggle } from "@/components/data-source-toggle"
import { DifferenceToggle } from "@/components/difference-toggle"

export default function Page() {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-4xl font-bold mb-6 text-foreground">Player Minutes Adjustment Tool</h1>
      <div className="flex items-center justify-between mb-6">
        <TeamSelector />
        <div className="flex items-center gap-4">
          <DataSourceToggle />
          <DifferenceToggle />
        </div>
      </div>
      <TeamDashboard />
    </div>
  )
}

