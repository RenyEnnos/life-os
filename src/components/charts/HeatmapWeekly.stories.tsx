import React from 'react'
import HeatmapWeekly from './HeatmapWeekly'

export default { title: 'Charts/HeatmapWeekly', component: HeatmapWeekly }

const sample = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map((d,i)=>({ label: d, value: i%3 }))

export const Basic = () => <HeatmapWeekly data={sample} />
