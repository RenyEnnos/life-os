import React from 'react';
import { Card, Button, ProgressBar } from '../components/Widgets';

export const Rewards: React.FC = () => {
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-white text-4xl font-black tracking-tighter font-display">Rewards & Life Score</h1>
            
            <div className="bg-[#142e14]/50 border border-[#224922] p-8 rounded-sm">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3 flex flex-col justify-center items-center text-center p-4">
                        <p className="text-primary text-[120px] font-black leading-none font-display drop-shadow-[0_0_15px_rgba(13,242,13,0.3)]">850</p>
                        <p className="text-2xl font-bold mt-2">Life Score</p>
                        <div className="flex items-center gap-2 mt-2 text-primary">
                            <span className="material-symbols-outlined">trending_up</span>
                            <span>Improving</span>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-2/3 flex flex-col gap-6 justify-center border-t md:border-t-0 md:border-l border-[#224922] pt-6 md:pt-0 md:pl-8">
                        <ProgressBar progress={85} label="Habit Consistency" />
                        <ProgressBar progress={92} label="Task Completion" />
                        <ProgressBar progress={78} label="Health Metrics" />
                        <ProgressBar progress={88} label="Financial Org" />
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold font-display mt-4">Available Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex flex-col gap-2 relative opacity-60">
                     <span className="absolute top-4 right-4 text-[10px] font-bold bg-[#102310] px-2 py-1 rounded-full border border-[#224922] text-white/50">LOCKED</span>
                     <h3 className="text-lg font-bold">Weekend Getaway</h3>
                     <p className="text-sm text-white/50 mb-4">Criteria: Reach 1000 Life Score</p>
                     <ProgressBar progress={85} label="850 / 1000" />
                </Card>
                 <Card className="flex flex-col gap-2 relative opacity-60">
                     <span className="absolute top-4 right-4 text-[10px] font-bold bg-[#102310] px-2 py-1 rounded-full border border-[#224922] text-white/50">LOCKED</span>
                     <h3 className="text-lg font-bold">New Video Game</h3>
                     <p className="text-sm text-white/50 mb-4">Criteria: 30 days journaling</p>
                     <ProgressBar progress={70} label="21 / 30 Days" />
                </Card>
                 <Card className="flex flex-col gap-2 relative border-primary/50 shadow-[0_0_10px_rgba(13,242,13,0.1)]">
                     <span className="absolute top-4 right-4 text-[10px] font-bold bg-primary text-black px-2 py-1 rounded-full">UNLOCKED</span>
                     <h3 className="text-lg font-bold text-white">Guilt-Free Pizza</h3>
                     <p className="text-sm text-white/50 mb-4">Criteria: No overdue tasks (2wks)</p>
                     <ProgressBar progress={100} label="Complete" />
                     <Button className="mt-2" variant="primary">Claim</Button>
                </Card>
            </div>
            
            <h2 className="text-2xl font-bold font-display mt-4">Badges</h2>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {[
                    { icon: 'local_fire_department', label: '30 Day Streak', active: true },
                    { icon: 'verified', label: 'Weekly Warrior', active: true },
                    { icon: 'monitoring', label: 'Finance Guru', active: true },
                    { icon: 'clear_day', label: 'Early Riser', active: false },
                    { icon: 'checklist', label: 'Task Master', active: false },
                ].map((badge, i) => (
                    <div key={i} className={`flex flex-col items-center p-4 border rounded-sm bg-[#142e14]/30 ${badge.active ? 'border-primary/30' : 'border-[#224922] opacity-40'}`}>
                        <div className={`size-16 rounded-full flex items-center justify-center mb-2 ${badge.active ? 'bg-primary/20 text-primary' : 'bg-[#102310] text-white/30'}`}>
                            <span className="material-symbols-outlined text-3xl">{badge.icon}</span>
                        </div>
                        <p className="text-xs font-bold text-center">{badge.label}</p>
                    </div>
                ))}
             </div>
        </div>
    );
};
