interface StatBoxProps {
  label: string
  value: number
  difference?: number
}

export function StatBox({ label, value, difference }: StatBoxProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-2xl font-bold">{value.toFixed(1)}</span>
      {difference && (
        <span className={`text-sm ${difference > 0 ? "text-green-500" : "text-red-500"}`}>
          {difference > 0 ? "+" : ""}
          {difference.toFixed(1)}
        </span>
      )}
    </div>
  )
}

