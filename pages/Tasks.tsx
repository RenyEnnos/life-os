import React from 'react';
import { Card, Button, Badge } from '../components/Widgets';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CALENDAR_DAYS = Array.from({ length: 35 }, (_, i) => {
    const day = i - 3; // Shift start
    return day > 0 && day <= 30 ? day : null;
});

const TASKS = [
    { id: 1, title: 'Review Q3 analytics report', due: 'Yesterday', tag: 'Work', tagColor: 'blue', status: 'overdue' },
    { id: 2, title: 'Finalize presentation deck', due: '16:00', tag: 'Urgent', tagColor: 'red', status: 'pending' },
    { id: 3, title: 'Follow up with client', due: 'Today', tag: 'Work', tagColor: 'blue', status: 'pending' },
    { id: 4, title: 'Draft project proposal', due: 'Tomorrow', tag: 'Work', tagColor: 'blue', status: 'pending' },
];

export const Tasks: React.FC = () => {
    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-white text-4xl font-black tracking-tighter font-display">Tasks & Calendar</h1>
                <div className="flex items-center gap-4 bg-[#142e14] p-2 pr-4 rounded-full border border-[#224922]">
                    <div className="size-8 rounded-full bg-primary flex items-center justify-center text-black">
                        <span className="material-symbols-outlined text-lg">sync</span>
                    </div>
                    <span className="text-sm font-medium">Google Sync Active</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Calendar */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                    <Card className="p-0 overflow-hidden min-h-[500px] flex flex-col">
                        <div className="flex justify-between items-center p-6 bg-[#142e14]">
                            <h2 className="text-xl font-bold font-display">October 2023</h2>
                            <div className="flex bg-[#102310] rounded-sm p-1 border border-[#224922]">
                                <button className="px-4 py-1 text-xs font-bold text-primary bg-[#224922] rounded-sm">Month</button>
                                <button className="px-4 py-1 text-xs font-bold text-white/50 hover:text-white">Week</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 border-b border-[#224922] bg-[#142e14]">
                            {DAYS.map(d => (
                                <div key={d} className="py-2 text-center text-xs font-mono text-white/50 uppercase">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 flex-1 bg-[#102310] auto-rows-fr">
                            {CALENDAR_DAYS.map((day, i) => (
                                <div key={i} className="min-h-[80px] border border-[#224922] p-2 relative group hover:bg-[#142e14] transition-colors">
                                    {day && (
                                        <>
                                            <span className={`text-sm font-bold ${day === 8 ? 'text-primary' : 'text-white/60'}`}>{day}</span>
                                            {day === 8 && (
                                                <div className="mt-2 text-[10px] bg-purple-500/20 text-purple-300 px-1 py-0.5 rounded-sm border border-purple-500/30 truncate">
                                                    14:00 Design Rev
                                                </div>
                                            )}
                                             {day === 5 && (
                                                <div className="mt-2 text-[10px] bg-blue-500/20 text-blue-300 px-1 py-0.5 rounded-sm border border-blue-500/30 truncate">
                                                    Work Block
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Task List */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold font-display">Inbox</h2>
                        <Button variant="ghost" icon="add">New Task</Button>
                    </div>

                    <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                        {['All', 'Work', 'Personal', 'Urgent'].map(filter => (
                            <button key={filter} className="px-3 py-1 text-xs border border-[#224922] rounded-sm hover:border-primary text-white/70 hover:text-white transition-colors">
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <p className="text-primary text-xs font-bold font-mono tracking-widest mt-2">TODAY</p>
                        {TASKS.slice(0, 3).map((task: any) => (
                            <div key={task.id} className="group bg-[#142e14]/50 p-3 rounded-sm border border-[#224922] hover:border-primary/50 transition-all flex items-start gap-3">
                                <input type="checkbox" className="mt-1 appearance-none w-5 h-5 border-2 border-[#224922] rounded-sm bg-transparent checked:bg-primary checked:border-primary cursor-pointer transition-colors" />
                                <div className="flex-1">
                                    <p className={`font-medium ${task.status === 'overdue' ? 'text-white' : 'text-white'}`}>{task.title}</p>
                                    <div className="flex gap-2 mt-2 items-center">
                                        {task.status === 'overdue' && <span className="text-[10px] font-bold text-red-400">Overdue</span>}
                                        <Badge color={task.tagColor}>{task.tag}</Badge>
                                        <span className="text-xs text-white/40 font-mono">{task.due}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <p className="text-primary text-xs font-bold font-mono tracking-widest mt-4">TOMORROW</p>
                        {TASKS.slice(3).map((task: any) => (
                             <div key={task.id} className="group bg-[#142e14]/50 p-3 rounded-sm border border-[#224922] hover:border-primary/50 transition-all flex items-start gap-3">
                                <input type="checkbox" className="mt-1 appearance-none w-5 h-5 border-2 border-[#224922] rounded-sm bg-transparent checked:bg-primary checked:border-primary cursor-pointer transition-colors" />
                                <div className="flex-1">
                                    <p className="font-medium text-white">{task.title}</p>
                                    <div className="flex gap-2 mt-2 items-center">
                                        <Badge color={task.tagColor}>{task.tag}</Badge>
                                        <span className="text-xs text-white/40 font-mono">{task.due}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
