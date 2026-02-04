import React from 'react';

export const GradeAnalytics = () => {
    return (
        <section className="space-y-6">
            <div className="glass-panel p-6 rounded-lg text-center flex flex-col items-center justify-center min-h-[220px]">
                <p className="text-zinc-400 text-sm font-medium">Current GPA</p>
                <h2 className="text-6xl font-bold text-white mt-2">3.8</h2>
                <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    <span>+0.2 from last term</span>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-bold text-white">Grade Analytics</h4>
                    <span className="material-symbols-outlined text-zinc-500 text-sm">more_horiz</span>
                </div>
                {/* Simple CSS Chart Placeholder */}
                <div className="h-32 flex items-end justify-between gap-2 px-2">
                    <div className="w-full bg-primary/20 rounded-t-lg relative group" style={{ height: '60%' }}>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-800 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">3.2</div>
                    </div>
                    <div className="w-full bg-primary/40 rounded-t-lg relative group" style={{ height: '75%' }}>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-800 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">3.5</div>
                    </div>
                    <div className="w-full bg-primary/60 rounded-t-lg relative group" style={{ height: '85%' }}>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-800 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">3.6</div>
                    </div>
                    <div className="w-full bg-primary rounded-t-lg relative group" style={{ height: '95%' }}>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-800 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">3.8</div>
                    </div>
                </div>
                <div className="flex justify-between mt-4 text-[10px] text-zinc-500 font-bold uppercase">
                    <span>Fall 23</span>
                    <span>Spr 24</span>
                    <span>Fall 24</span>
                    <span>Spr 25</span>
                </div>
            </div>

            {/* Upcoming Events Card */}
            <div className="glass-panel p-4 rounded-lg bg-primary/5">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm">notifications_active</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-white">Advising Meeting</p>
                        <p className="text-zinc-500 text-[10px]">Tomorrow, 2:00 PM</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
