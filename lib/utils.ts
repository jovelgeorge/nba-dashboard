export function scaleStats(originalStats: any, originalMinutes: number, newMinutes: number) {
  const scaleFactor = newMinutes / originalMinutes
  const scaledStats = {} as any

  for (const [key, value] of Object.entries(originalStats)) {
    if (key !== "minutes") {
      scaledStats[key] = Number(value) * scaleFactor
    }
  }

  return scaledStats
}

export function formatStat(value: number): string {
  return value.toFixed(1)
}

export async function fetchProjections(source: "ETR" | "UA") {
  // Fetch and parse CSV data based on source
  // This would integrate with the provided CSV files
  return []
}

