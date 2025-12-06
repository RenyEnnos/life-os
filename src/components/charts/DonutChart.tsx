import React from 'react'
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { chartTheme } from './theme'

type Props = { data: { name: string; value: number }[]; colors?: string[] }

export default function DonutChart({ data, colors }: Props) {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} stroke={chartTheme.tooltipBg()}>
            {data.map((_, i) => (
              <Cell key={i} fill={(colors && colors[i % colors.length]) || (i % 2 === 0 ? chartTheme.barColor() : chartTheme.lineColor())} />
            ))}
          </Pie>
          <Tooltip wrapperClassName="font-sans" contentStyle={{ background: chartTheme.tooltipBg(), border: `1px solid ${chartTheme.tooltipBorder()}`, color: chartTheme.tooltipText() }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
