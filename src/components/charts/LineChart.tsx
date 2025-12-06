import React from 'react'
import { LineChart as RCLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { chartTheme } from './theme'

type Props = { data: Array<Record<string, unknown>>; xKey: string; yKey: string; color?: string }

export default function LineChart({ data, xKey, yKey, color }: Props) {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer>
        <RCLineChart data={data}>
          <CartesianGrid stroke={chartTheme.gridColor()} strokeDasharray="3 3" />
          <XAxis dataKey={xKey} stroke={chartTheme.axisColor()} tick={{ fill: chartTheme.axisColor(), fontFamily: 'Inter, sans-serif' }} />
          <YAxis stroke={chartTheme.axisColor()} tick={{ fill: chartTheme.axisColor(), fontFamily: 'Inter, sans-serif' }} />
          <Tooltip wrapperClassName="font-sans" contentStyle={{ background: chartTheme.tooltipBg(), border: `1px solid ${chartTheme.tooltipBorder()}`, color: chartTheme.tooltipText() }} />
          <Line type="monotone" dataKey={yKey} stroke={color || chartTheme.lineColor()} dot={false} />
        </RCLineChart>
      </ResponsiveContainer>
    </div>
  )
}
