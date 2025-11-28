import React from 'react';
import { Card, Button, ProgressBar } from '../components/Widgets';
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from 'recharts';

const HABIT_DATA = [
  { day: 'Mon', val: 30, active: false },
  { day: 'Tue', val: 80, active: false },
  { day: 'Wed', val: 10, active: false },
  { day: 'Thu', val: 60, active: false },
  { day: 'Fri', val: 75, active: true },
  { day: 'Sat', val: 100, active: false },
  { day: 'Sun', val: 40, active: false },
];

export const Dashboard: React.FC = () => {
    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div>
                    <h1 className="text-white text-4xl font-black tracking-tighter mb-1 font-display">Hello, Dev</h1>
                    <p className="text-white/60 font-mono text-sm">> System status: Nominal. All systems go.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" icon="add_task">Quick Task</Button>
                    <Button variant="primary" icon="bolt">Log Habit</Button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1: Life Score & Habits */}
                <div className="flex flex-col gap-6">
                    <div className="p-6 bg-[#142e14]/40 border border-primary/50 shadow-[0_0_15px_rgba(13,242,13,0.1)] rounded-sm flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-20"><span className="material-symbols-outlined text-6xl">military_tech</span></div>
                        <p className="text-white text-base font-medium font-display">Life Score</p>
                        <p className="text-primary text-7xl font-black tracking-tighter font-display drop-shadow-[0_0_10px_rgba(13,242,13,0.5)]">850</p>
                        <div className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-1 rounded-full text-xs font-bold">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            Trending Up
                        </div>
                    </div>

                    <Card title="Habit Consistency">
                        <div className="mb-4">
                            <p className="text-primary text-3xl font-bold font-display">75% <span className="text-white/50 text-base font-normal">Today</span></p>
                        </div>
                        <div className="h-40 w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={HABIT_DATA}>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12, fontWeight: 'bold'}} />
                                    <Bar dataKey="val" radius={[2, 2, 0, 0]}>
                                        {HABIT_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.active ? '#0df20d' : '#224922'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Column 2: Agenda */}
                <div className="flex flex-col gap-6">
                    <Card title="Today's Agenda" className="h-full">
                        <div className="flex flex-col gap-4 relative">
                            {/* Timeline Line */}
                            <div className="absolute left-[4.5rem] top-2 bottom-2 w-px bg-[#224922]"></div>
                            
                            {[
                                { time: '09:00', title: 'Team Standup', tag: 'Work', color: 'blue' },
                                { time: '11:00', title: 'Design Review', tag: 'Project X', color: 'purple' },
                                { time: '14:00', title: 'Submit Report', tag: 'Urgent', color: 'red' },
                                { time: '18:00', title: 'Gym Session', tag: 'Health', color: 'green' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 relative z-10 group">
                                    <p className="text-white/40 font-mono text-sm w-14 text-right pt-0.5 group-hover:text-primary transition-colors">{item.time}</p>
                                    <div className="size-2 rounded-full bg-[#102310] border-2 border-primary mt-1.5 shrink-0"></div>
                                    <div className="flex flex-col bg-[#102310]/50 p-2 rounded-sm border border-transparent hover:border-white/10 w-full transition-all">
                                        <p className="text-white font-medium">{item.title}</p>
                                        <div className="flex mt-1">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-${item.color}-500/20 text-${item.color}-300 border border-${item.color}-500/20`}>
                                                {item.tag}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Column 3: Health & Finance */}
                <div className="flex flex-col gap-6">
                    <Card title="Health Snapshot">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#102310] p-3 border border-[#224922] rounded-sm">
                                <span className="material-symbols-outlined text-primary mb-1">bed</span>
                                <p className="text-xl font-bold font-display">7h 45m</p>
                                <p className="text-xs text-white/50">Sleep</p>
                            </div>
                            <div className="bg-[#102310] p-3 border border-[#224922] rounded-sm">
                                <span className="material-symbols-outlined text-primary mb-1">directions_walk</span>
                                <p className="text-xl font-bold font-display">8,210</p>
                                <p className="text-xs text-white/50">Steps</p>
                            </div>
                            <div className="bg-[#102310] p-3 border border-[#224922] rounded-sm">
                                <span className="material-symbols-outlined text-primary mb-1">monitor_heart</span>
                                <p className="text-xl font-bold font-display">68 <span className="text-xs font-normal">bpm</span></p>
                                <p className="text-xs text-white/50">RHR</p>
                            </div>
                            <div className="bg-[#102310] p-3 border border-green-500/50 rounded-sm">
                                <span className="material-symbols-outlined text-green-500 mb-1">check_circle</span>
                                <p className="text-xl font-bold font-display text-green-500">Normal</p>
                                <p className="text-xs text-white/50">Status</p>
                            </div>
                        </div>
                    </Card>

                    <Card title="Finance">
                        <div className="flex justify-between items-end mb-4 font-mono">
                            <div>
                                <p className="text-xs text-white/50">Net (Mo)</p>
                                <p className="text-xl font-bold text-white">+$2,050</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-white/50">Burn</p>
                                <p className="text-lg font-bold text-red-400">$3,150</p>
                            </div>
                        </div>
                        <ProgressBar progress={65} color="bg-green-500" label="Budget Usage" />
                    </Card>
                </div>
            </div>
        </div>
    );
};
