import React from 'react'

type Day = { label: string; value: number }
type Props = { data: Day[] }

export default function HeatmapWeekly({ data }: Props) {
  const max = Math.max(1, ...data.map(d => d.value))
  return (
    <div className="grid grid-cols-7 gap-1">
      {data.map((d, i) => {
        const intensity = Math.round((d.value / max) * 100)
        return (
          <div key={i} className="flex flex-col items-center">
            <div className="w-6 h-6 border border-green-700" style={{ backgroundColor: `rgba(13,242,13,${0.2 + 0.8*(intensity/100)})` }} />
            <span className="text-xs text-gray-400 font-mono mt-1">{d.label}</span>
          </div>
        )
      })}
    </div>
  )
}
