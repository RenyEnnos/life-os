import React from 'react'
import { BarChart as RCBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { chartTheme } from './theme'

type Props = { data: Array<Record<string, unknown>>; xKey: string; yKey: string; color?: string }

export default function BarChart({ data, xKey, yKey, color }: Props) {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer>
        <RCBarChart data={data}>
          <CartesianGrid stroke={chartTheme.gridColor()} strokeDasharray="3 3" />
          <XAxis dataKey={xKey} stroke={chartTheme.axisColor()} tick={{ fill: chartTheme.axisColor(), fontFamily: 'Inter, sans-serif' }} />
          <YAxis stroke={chartTheme.axisColor()} tick={{ fill: chartTheme.axisColor(), fontFamily: 'Inter, sans-serif' }} />
          <Tooltip wrapperClassName="font-sans" contentStyle={{ background: chartTheme.tooltipBg(), border: `1px solid ${chartTheme.tooltipBorder()}`, color: chartTheme.tooltipText() }} />
          <Bar dataKey={yKey} fill={color || chartTheme.barColor()} />
        </RCBarChart>
      </ResponsiveContainer>
    </div>
  )
}
