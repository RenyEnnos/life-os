import React from 'react';
import { Card, Button, ProgressBar } from '../components/Widgets';

const HABITS = [
    { id: 1, title: 'Meditate', sub: 'Binary', icon: 'self_improvement', completed: false },
    { id: 2, title: 'Drink Water', sub: '6/8 glasses', icon: 'water_drop', completed: false, progress: 75 },
    { id: 3, title: 'Workout', sub: 'Binary', icon: 'fitness_center', completed: true },
    { id: 4, title: 'Read 10 pages', sub: 'Binary', icon: 'auto_stories', completed: false },
];

export const Habits: React.FC = () => {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-white text-4xl font-black tracking-tighter font-display">Habits & Routines</h1>
                <div className="flex gap-2">
                    <Button variant="primary" icon="add">New Habit</Button>
                    <Button variant="secondary" icon="playlist_add">New Routine</Button>
                </div>
            </div>

            {/* Areas Filter */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                {['Health', 'Work', 'Personal'].map(area => (
                    <button key={area} className="flex items-center gap-2 px-4 py-2 bg-[#142e14] rounded-sm border border-[#224922] text-sm font-bold hover:bg-[#224922] transition-colors">
                        Area: {area}
                        <span className="material-symbols-outlined text-base">expand_more</span>
                    </button>
                ))}
            </div>

            <h2 className="text-2xl font-bold font-display border-b border-[#224922] pb-2">Daily Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {HABITS.map(habit => (
                    <div key={habit.id} className="bg-[#142e14]/50 border border-[#224922] p-4 rounded-sm flex flex-col justify-between gap-4 hover:border-primary/30 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-sm bg-[#102310] border border-[#224922] flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-2xl">{habit.icon}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{habit.title}</h3>
                                    <p className="text-primary text-xs font-mono">{habit.sub}</p>
                                </div>
                            </div>
                            {!habit.progress && (
                                <button 
                                    className={`size-8 rounded-sm border-2 flex items-center justify-center transition-all ${habit.completed ? 'bg-primary border-primary text-black' : 'border-[#316831] hover:border-primary text-transparent'}`}
                                >
                                    <span className="material-symbols-outlined text-lg">check</span>
                                </button>
                            )}
                        </div>
                        {habit.progress !== undefined && (
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-white/50">Progress</span>
                                    <span className="text-xs text-primary font-bold">{habit.progress}%</span>
                                </div>
                                <div className="h-2 bg-[#102310] rounded-sm overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${habit.progress}%` }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold font-display mb-4">Routines</h2>
                    <div className="flex flex-col gap-4">
                        <Card className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold">Morning Routine</h3>
                                    <p className="text-primary text-xs font-mono">66% Complete</p>
                                </div>
                                <span className="material-symbols-outlined text-4xl text-yellow-500">wb_sunny</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {['Make Bed', 'Meditate', 'Plan Day'].map((item, i) => (
                                    <div key={item} className="flex justify-between items-center bg-[#102310] p-3 rounded-sm border border-transparent hover:border-[#224922]">
                                        <span className="text-sm font-medium">{item}</span>
                                        <input type="checkbox" defaultChecked={i < 2} className="appearance-none size-4 border border-[#316831] rounded-sm checked:bg-primary checked:border-primary" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
                
                <div className="lg:col-span-1">
                    <h2 className="text-2xl font-bold font-display mb-4">Streak</h2>
                    <Card className="flex flex-col gap-4 items-center text-center">
                         <div className="grid grid-cols-7 gap-2 w-full">
                            {['M','T','W','T','F','S','S'].map((d, i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <span className="text-xs text-primary font-mono">{d}</span>
                                    <div className={`w-full aspect-[4/5] rounded-sm ${i === 4 ? 'bg-primary ring-2 ring-offset-2 ring-offset-[#142e14] ring-primary' : i > 4 ? 'bg-[#224922]' : 'bg-primary/50'}`}></div>
                                </div>
                            ))}
                         </div>
                         <div className="mt-2">
                             <h4 className="font-bold text-white">Friday: 4/4 Habits</h4>
                             <p className="text-primary text-sm font-mono">Perfect day!</p>
                         </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
