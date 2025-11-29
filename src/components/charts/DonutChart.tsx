import React from 'react'
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts'

type Props = { data: { name: string; value: number }[]; colors?: string[] }

export default function DonutChart({ data, colors = ['#0df20d', '#224922', '#888888'] }: Props) {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} stroke="#0a0f0a">
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip wrapperClassName="font-mono" contentStyle={{ background: '#0a0f0a', border: '1px solid #224922', color: '#fff' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
