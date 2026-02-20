import React from 'react';

export const IndexPage = () => {
  return (
    <div className="min-h-screen bg-oled text-white font-display selection:bg-primary/30">

      <div className="flex h-screen w-full overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-background-dark">
          {/* Bento Grid */}
          <div className="grid grid-cols-3 grid-rows-[auto_1fr_auto] gap-6 max-w-7xl mx-auto h-full">
            {/* Top-Left (2x1): Welcome Widget */}
            <div className="col-span-2 bento-card rounded-lg p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-black tracking-tight mb-2">Good Afternoon, Pedro</h2>
                  <p className="text-white/50 flex items-center gap-2 text-lg">
                    <span className="material-symbols-outlined text-yellow-500 fill-1">light_mode</span>
                    26Â°C Sunny in Lisbon
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">event</span>
                    <span className="text-sm font-bold tracking-tight">Next: Design Review in 15m</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-6">
                <div className="bg-white/5 p-4 rounded-lg flex-1">
                  <p className="text-xs text-white/30 uppercase font-bold mb-1">Weekly Goal Progress</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">82%</span>
                    <span className="text-xs text-green-400 mb-1">+5% vs last week</span>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg flex-1">
                  <p className="text-xs text-white/30 uppercase font-bold mb-1">Focus Time today</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">4.2h</span>
                    <span className="text-xs text-white/40 mb-1">Target: 6h</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Top-Right (1x1): Focus Timer */}
            <div className="col-span-1 bento-card rounded-lg p-8 flex flex-col items-center justify-center text-center">
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">Focus Session</h3>
              <div className="relative flex items-center justify-center mb-6">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle className="text-white/5" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-primary glow-blue" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="154" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black">25:00</span>
                  <span className="text-[10px] text-white/30 uppercase">Pomodoro</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="size-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined text-white fill-1">play_arrow</span>
                </button>
                <button className="size-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                  <span className="material-symbols-outlined text-white">refresh</span>
                </button>
              </div>
            </div>
            {/* Mid-Left (1x2): Habit Tracker */}
            <div className="col-span-1 row-span-2 bento-card rounded-lg p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-xl">Habit Tracker</h3>
                <span className="material-symbols-outlined text-white/30">more_horiz</span>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 glow-blue flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="size-6 rounded border border-primary flex items-center justify-center bg-primary">
                      <span className="material-symbols-outlined text-sm text-white">check</span>
                    </div>
                    <span className="font-medium text-primary">Meditation</span>
                  </div>
                  <span className="text-xs text-primary/70 font-bold">12 Day Streak</span>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 glow-blue flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-6 rounded border border-primary flex items-center justify-center bg-primary">
                      <span className="material-symbols-outlined text-sm text-white">check</span>
                    </div>
                    <span className="font-medium text-primary">Deep Work</span>
                  </div>
                  <span className="text-xs text-primary/70 font-bold">4 Day Streak</span>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="size-6 rounded border border-white/20 flex items-center justify-center"></div>
                    <span className="font-medium text-white/70">Reading</span>
                  </div>
                  <span className="text-xs text-white/30 uppercase font-bold">20 min</span>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="size-6 rounded border border-white/20 flex items-center justify-center"></div>
                    <span className="font-medium text-white/70">Gym Session</span>
                  </div>
                  <span className="text-xs text-white/30 uppercase font-bold">Target PM</span>
                </div>
              </div>
              <div className="mt-8 p-4 rounded-lg bg-gradient-to-br from-primary/20 to-transparent border border-primary/10">
                <p className="text-sm font-semibold mb-2">Consistency Score</p>
                <div className="flex gap-1">
                  <div className="h-1 flex-1 bg-primary rounded-full"></div>
                  <div className="h-1 flex-1 bg-primary rounded-full"></div>
                  <div className="h-1 flex-1 bg-primary rounded-full"></div>
                  <div className="h-1 flex-1 bg-primary rounded-full"></div>
                  <div className="h-1 flex-1 bg-white/10 rounded-full"></div>
                  <div className="h-1 flex-1 bg-white/10 rounded-full"></div>
                  <div className="h-1 flex-1 bg-white/10 rounded-full"></div>
                </div>
              </div>
            </div>
            {/* Mid-Center (1x1): Quick Actions */}
            <div className="col-span-1 bento-card rounded-lg p-8">
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-8">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="aspect-square rounded-lg bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-2 group">
                  <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">add_task</span>
                  <span className="text-xs font-semibold">New Task</span>
                </button>
                <button className="aspect-square rounded-lg bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-2 group">
                  <span className="material-symbols-outlined text-green-400 group-hover:scale-110 transition-transform">payments</span>
                  <span className="text-xs font-semibold">Log Expense</span>
                </button>
                <button className="aspect-square rounded-lg bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-2 group">
                  <span className="material-symbols-outlined text-orange-400 group-hover:scale-110 transition-transform">timer</span>
                  <span className="text-xs font-semibold">Start Focus</span>
                </button>
                <button className="aspect-square rounded-lg bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-2 group">
                  <span className="material-symbols-outlined text-purple-400 group-hover:scale-110 transition-transform">edit_note</span>
                  <span className="text-xs font-semibold">Journal</span>
                </button>
              </div>
            </div>
            {/* Mid-Right (1x1): Health Widget */}
            <div className="col-span-1 bento-card rounded-lg p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Health</h3>
                <span className="material-symbols-outlined text-primary text-sm">monitor_heart</span>
              </div>
              <div className="flex items-center gap-6 my-4">
                <div className="relative size-24 flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle className="text-white/5" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="6"></circle>
                    <circle className="text-primary" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251" strokeDashoffset="37" strokeWidth="6"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black">85</span>
                    <span className="text-[8px] text-white/30 uppercase">Sleep Score</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary"></span>
                    <span className="text-xs font-medium">Steps: 8.4k</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-green-400"></span>
                    <span className="text-xs font-medium">HRV: 64ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-purple-400"></span>
                    <span className="text-xs font-medium">Rem: 1.5h</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-400 text-base">water_drop</span>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-3/4"></div>
                </div>
                <span className="text-[10px] font-bold">1.5 / 2L</span>
              </div>
            </div>
            {/* Bottom (3x1): Recent Projects */}
            <div className="col-span-3 bento-card rounded-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl">Recent Projects</h3>
                <button className="text-sm font-bold text-primary flex items-center gap-1">
                  View All <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-6 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="size-10 rounded bg-primary/20 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">layers</span>
                  </div>
                  <h4 className="font-bold mb-1">LifeOS 2.5</h4>
                  <p className="text-xs text-white/40 mb-4">Core Architecture &amp; Logic</p>
                  <div className="w-full bg-white/10 h-1 rounded-full">
                    <div className="bg-primary h-full w-4/5 rounded-full"></div>
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="size-10 rounded bg-green-400/20 flex items-center justify-center mb-4 text-green-400 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">school</span>
                  </div>
                  <h4 className="font-bold mb-1">University</h4>
                  <p className="text-xs text-white/40 mb-4">CS50 Web Development</p>
                  <div className="w-full bg-white/10 h-1 rounded-full">
                    <div className="bg-green-400 h-full w-1/3 rounded-full"></div>
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="size-10 rounded bg-orange-400/20 flex items-center justify-center mb-4 text-orange-400 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">palette</span>
                  </div>
                  <h4 className="font-bold mb-1">Side Hustle</h4>
                  <p className="text-xs text-white/40 mb-4">Brand Kit for Client X</p>
                  <div className="w-full bg-white/10 h-1 rounded-full">
                    <div className="bg-orange-400 h-full w-1/2 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-center border border-dashed border-white/10 rounded-lg hover:border-white/30 transition-all cursor-pointer">
                  <div className="flex flex-col items-center gap-2 text-white/30">
                    <span className="material-symbols-outlined">add</span>
                    <span className="text-xs font-bold uppercase tracking-widest">New Project</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

    </div>
  );
};
