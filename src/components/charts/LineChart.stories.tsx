import React from 'react'
import LineChart from './LineChart'

export default { title: 'Charts/LineChart', component: LineChart }

const sample = Array.from({ length: 7 }).map((_, i) => ({ day: `D${i+1}`, value: (i+1)*1000 }))

export const Basic = () => <LineChart data={sample} xKey="day" yKey="value" />
export const CustomColor = () => <LineChart data={sample} xKey="day" yKey="value" color="#00ffaa" />
