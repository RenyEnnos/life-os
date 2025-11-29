import React from 'react'
import { LineChart as RCLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

type Props = { data: any[]; xKey: string; yKey: string; color?: string }

export default function LineChart({ data, xKey, yKey, color = '#0df20d' }: Props) {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer>
        <RCLineChart data={data}>
          <CartesianGrid stroke="#224922" strokeDasharray="3 3" />
          <XAxis dataKey={xKey} stroke="#888" tick={{ fill: '#888', fontFamily: 'monospace' }} />
          <YAxis stroke="#888" tick={{ fill: '#888', fontFamily: 'monospace' }} />
          <Tooltip wrapperClassName="font-mono" contentStyle={{ background: '#0a0f0a', border: '1px solid #224922', color: '#fff' }} />
          <Line type="monotone" dataKey={yKey} stroke={color} dot={false} />
        </RCLineChart>
      </ResponsiveContainer>
    </div>
  )
}
