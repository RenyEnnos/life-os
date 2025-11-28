import React from 'react';
import { Card, ProgressBar } from '../components/Widgets';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const HR_DATA = [
  { day: 'M', val: 62 },
  { day: 'T', val: 65 },
  { day: 'W', val: 68 },
  { day: 'T', val: 64 },
  { day: 'F', val: 63 },
  { day: 'S', val: 70 },
  { day: 'S', val: 66 },
];

export const Health: React.FC = () => {
    return (
        <div className="flex flex-col gap-8">
             <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-white text-4xl font-black tracking-tighter font-display">Health Overview</h1>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'BMI', val: '22.5', sub: '+0.1%', subColor: 'text-green-400', context: 'Manual' },
                    { label: 'Sleep', val: '7h 15m', sub: '-5.2%', subColor: 'text-red-400', context: 'Smartwatch' },
                    { label: 'Activity', val: '8,540', sub: '+12%', subColor: 'text-green-400', context: 'Steps' },
                    { label: 'RHR', val: '68 bpm', sub: 'Resting avg', subColor: 'text-green-400', context: 'Smartwatch' },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#142e14]/50 p-6 border border-[#224922] rounded-sm flex flex-col gap-1">
                        <p className="text-white/60 font-medium">{stat.label}</p>
                        <p className="text-3xl font-bold font-display">{stat.val}</p>
                        <div className="flex justify-between items-end mt-2">
                             <p className={`text-sm font-bold ${stat.subColor}`}>{stat.sub}</p>
                             <p className="text-[10px] text-white/30 uppercase font-mono">{stat.context}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Heart Rate Trend" className="lg:col-span-2">
                    <div className="flex gap-4 items-baseline mb-4">
                        <h3 className="text-4xl font-bold font-display">Avg. 65 bpm</h3>
                        <span className="text-red-400 font-mono text-sm">-1.5% last 7 days</span>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={HR_DATA}>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#102310', border: '1px solid #0df20d', color: '#fff' }}
                                    itemStyle={{ color: '#0df20d' }}
                                    cursor={{ stroke: '#0df20d', strokeWidth: 1, strokeDasharray: '5 5' }}
                                />
                                <Line type="monotone" dataKey="val" stroke="#0df20d" strokeWidth={3} dot={{r: 4, fill: '#102310', stroke: '#0df20d', strokeWidth: 2}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between px-2 mt-2">
                        {HR_DATA.map(d => <span key={d.day} className="text-xs font-mono text-white/50">{d.day}</span>)}
                    </div>
                </Card>

                <div className="flex flex-col gap-6">
                    <Card title="Medicine & Reminders" className="flex-1">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 p-3 bg-[#102310] border-l-2 border-yellow-400 rounded-r-sm">
                                <span className="material-symbols-outlined text-yellow-400">medication</span>
                                <div>
                                    <p className="font-bold text-sm">Vitamin D</p>
                                    <p className="text-xs text-white/50">1000 IU • 9:00 PM</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-[#102310] border-l-2 border-red-400 rounded-r-sm opacity-50">
                                <span className="material-symbols-outlined text-red-400">check_circle</span>
                                <div>
                                    <p className="font-bold text-sm line-through">Creatine</p>
                                    <p className="text-xs text-white/50">5g • Taken 8:00 AM</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
