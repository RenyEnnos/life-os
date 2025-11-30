import React from 'react'
import { BarChart as RCBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

type Props = { data: Array<Record<string, unknown>>; xKey: string; yKey: string; color?: string }

export default function BarChart({ data, xKey, yKey, color = '#0df20d' }: Props) {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer>
        <RCBarChart data={data}>
          <CartesianGrid stroke="#224922" strokeDasharray="3 3" />
          <XAxis dataKey={xKey} stroke="#888" tick={{ fill: '#888', fontFamily: 'monospace' }} />
          <YAxis stroke="#888" tick={{ fill: '#888', fontFamily: 'monospace' }} />
          <Tooltip wrapperClassName="font-mono" contentStyle={{ background: '#0a0f0a', border: '1px solid #224922', color: '#fff' }} />
          <Bar dataKey={yKey} fill={color} />
        </RCBarChart>
      </ResponsiveContainer>
    </div>
  )
}
