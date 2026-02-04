import React from 'react';

export const HabitsPage = () => {
  return (
    <div className="min-h-screen bg-oled text-white font-display selection:bg-primary/30">
      
<div className="flex h-screen w-full">
{/* Left Sidebar Navigation */}
<aside className="w-72 h-full glass-panel flex flex-col p-6 sticky top-0 border-r border-glass-border">
<div className="flex items-center gap-3 mb-12">
<div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white blue-glow">
<span className="material-symbols-outlined">bolt</span>
</div>
<div>
<h1 className="text-xl font-bold tracking-tight">LifeOS</h1>
<p className="text-xs text-slate-500 font-medium">STRATEGIST v2.4</p>
</div>
</div>
<nav className="flex-1 flex flex-col gap-2">
<a className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary border border-primary/20" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-semibold text-sm">Dashboard</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition-all" href="#">
<span className="material-symbols-outlined">history</span>
<span className="font-medium text-sm">Habits</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition-all" href="#">
<span className="material-symbols-outlined">trophy</span>
<span className="font-medium text-sm">Challenges</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition-all" href="#">
<span className="material-symbols-outlined">leaderboard</span>
<span className="font-medium text-sm">Leaderboard</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition-all" href="#">
<span className="material-symbols-outlined">settings</span>
<span className="font-medium text-sm">Settings</span>
</a>
</nav>
<div className="mt-auto glass-panel p-4 rounded-xl border border-glass-border">
<div className="flex items-center gap-3 mb-3">
<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50">
<img alt="User Avatar" className="w-full h-full object-cover" data-alt="User profile avatar with blue border" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDR93yqW7PwowweZ2Ag5bXyrXsGZXV3DaKw15cPhp0t8-TTYBn7_yhEO3HWhHi6C-WCEVNBAloU-f4y442grhWwvyDpwBBKYH1mmoEQX3Gga9yBXhCrzrKnfOAPr9fOYs93MMLauZzwT1kUBqG1zNkLUrNeJWjOMQA9EIcDmrNxHaBMC8_W7O2v3vepoEngwkV90KTN0ZvknAUYs-vWaENWkCe2Tjodhi6aygoWxCUTeARAypG-948Xgeo064wVBlu2q1hvPpFWvDA"/>
</div>
<div>
<p className="text-sm font-bold">Alex Chen</p>
<p className="text-[10px] text-slate-500 uppercase tracking-widest">Premium User</p>
</div>
</div>
<button className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors">
                    LOGOUT
                </button>
</div>
</aside>
{/* Main Content Area */}
<main className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
{/* Header Section */}
<header className="flex flex-wrap justify-between items-end gap-6">
<div className="flex flex-col gap-1">
<h2 className="text-4xl font-black tracking-tight text-white">Habit Tracker</h2>
<p className="text-slate-400 font-medium">Today is Monday, October 23rd</p>
</div>
<div className="flex flex-col gap-3 min-w-[320px]">
<div className="flex justify-between items-end">
<span className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold blue-glow">
                            Level 42 Strategist
                        </span>
<span className="text-xs font-bold text-slate-400">840 / 1200 XP</span>
</div>
<div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
<div className="h-full bg-primary blue-glow rounded-full" style={{ width: "70%" }}></div>
</div>
</div>
</header>
{/* Habit Grid */}
<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{/* Morning Routine Card */}
<div className="glass-panel p-6 rounded-lg flex flex-col justify-between group hover:border-success/50 transition-all cursor-pointer">
<div className="flex justify-between items-start mb-6">
<div className="p-3 bg-success/10 rounded-xl text-success border border-success/20">
<span className="material-symbols-outlined text-3xl">wb_sunny</span>
</div>
<div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-white success-glow">
<span className="material-symbols-outlined text-xl">check</span>
</div>
</div>
<div>
<h3 className="text-lg font-bold text-white mb-1">Morning Routine</h3>
<p className="text-sm text-slate-400 mb-4">Meditation â¢ 10m session</p>
<div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-full w-fit">
<span className="material-symbols-outlined text-sm">local_fire_department</span>
<span className="text-xs font-bold uppercase tracking-wider">45 Day Streak</span>
</div>
</div>
</div>
{/* Learning Card */}
<div className="glass-panel p-6 rounded-lg flex flex-col justify-between group hover:border-primary/50 transition-all cursor-pointer">
<div className="flex justify-between items-start mb-6">
<div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
<span className="material-symbols-outlined text-3xl">menu_book</span>
</div>
<div className="w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center text-white/10 group-hover:border-primary group-hover:text-primary transition-all">
<span className="material-symbols-outlined text-xl opacity-0 group-hover:opacity-100 transition-opacity">check</span>
</div>
</div>
<div>
<h3 className="text-lg font-bold text-white mb-1">Learning</h3>
<p className="text-sm text-slate-400 mb-4">Read 20 pages</p>
<div className="space-y-2">
<div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
<span>Progress</span>
<span>5 / 20 pages</span>
</div>
<div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
<div className="h-full bg-primary blue-glow rounded-full" style={{ width: "25%" }}></div>
</div>
</div>
</div>
</div>
{/* Health Card */}
<div className="glass-panel p-6 rounded-lg flex flex-col justify-between group hover:border-primary/50 transition-all cursor-pointer">
<div className="flex justify-between items-start mb-4">
<div className="p-3 bg-blue-400/10 rounded-xl text-blue-400 border border-blue-400/20">
<span className="material-symbols-outlined text-3xl">water_drop</span>
</div>
</div>
<div className="flex items-center gap-6">
<div className="relative flex items-center justify-center">
<svg className="w-20 h-20 -rotate-90">
<circle className="text-white/5" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" stroke-width="6"></circle>
<circle className="text-primary blue-glow" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" stroke-dasharray="213.6" stroke-dashoffset="53.4" stroke-width="6"></circle>
</svg>
<span className="absolute text-sm font-bold text-white">75%</span>
</div>
<div>
<h3 className="text-lg font-bold text-white mb-1">Health</h3>
<p className="text-sm text-slate-400">Drink 2L Water</p>
<p className="text-[10px] text-slate-500 font-bold mt-2">1.5L / 2.0L</p>
</div>
</div>
</div>
</section>
{/* Consistency Heatmap */}
<section className="glass-panel p-8 rounded-lg">
<div className="flex justify-between items-center mb-6">
<h3 className="text-lg font-bold text-white flex items-center gap-2">
<span className="material-symbols-outlined text-primary">calendar_month</span>
                        Consistency Heatmap
                    </h3>
<div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
<span>Less</span>
<div className="flex gap-1">
<div className="heatmap-square bg-white/5"></div>
<div className="heatmap-square bg-success/20"></div>
<div className="heatmap-square bg-success/40"></div>
<div className="heatmap-square bg-success/70"></div>
<div className="heatmap-square bg-success success-glow"></div>
</div>
<span>More</span>
</div>
</div>
<div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
{/* Weekly columns (simulated) */}
<div className="flex flex-col gap-1.5 flex-none" v-for="i in 52">
<div className="heatmap-square bg-success/40"></div>
<div className="heatmap-square bg-success"></div>
<div className="heatmap-square bg-white/5"></div>
<div className="heatmap-square bg-success/70"></div>
<div className="heatmap-square bg-success/20"></div>
<div className="heatmap-square bg-success/40"></div>
<div className="heatmap-square bg-success"></div>
</div>
{/* Repeating squares for visual fill */}
<div className="flex flex-col gap-1.5 flex-none"><div className="heatmap-square bg-success/20"></div><div className="heatmap-square bg-success/70"></div><div className="heatmap-square bg-white/5"></div><div className="heatmap-square bg-success/20"></div><div className="heatmap-square bg-success/40"></div><div className="heatmap-square bg-white/5"></div><div className="heatmap-square bg-white/5"></div></div>
<div className="flex flex-col gap-1.5 flex-none"><div className="heatmap-square bg-success"></div><div className="heatmap-square bg-success"></div><div className="heatmap-square bg-success/70"></div><div className="heatmap-square bg-success"></div><div className="heatmap-square bg-success"></div><div className="heatmap-square bg-success/70"></div><div className="heatmap-square bg-success"></div></div>
<div className="flex flex-col gap-1.5 flex-none"><div className="heatmap-square bg-white/5"></div><div className="heatmap-square bg-white/5"></div><div className="heatmap-square bg-white/5"></div><div className="heatmap-square bg-white/5"></div><div className="heatmap-square bg-white/5"></div><div className="heatmap-square bg-white/5"></div><div className="heatmap-square bg-white/5"></div></div>
<div className="flex flex-col gap-1.5 flex-none"><div className="heatmap-square bg-success/40"></div><div className="heatmap-square bg-success/20"></div><div className="heatmap-square bg-success/70"></div><div className="heatmap-square bg-success/40"></div><div className="heatmap-square bg-success/20"></div><div className="heatmap-square bg-success/70"></div><div className="heatmap-square bg-success/40"></div></div>
<div className="flex flex-col gap-1.5 flex-none"><div className="heatmap-square bg-success/70"></div><div className="heatmap-square bg-success"></div><div className="heatmap-square bg-success/70"></div><div className="heatmap-square bg-success/70"></div><div className="heatmap-square bg-success"></div><div className="heatmap-square bg-success/70"></div><div className="heatmap-square bg-success/70"></div></div>
<div className="flex flex-col gap-1.5 flex-none"><div className="heatmap-square bg-success/20"></div><div className="heatmap-square bg-success/40"></div><div className="heatmap-square bg-success/20"></div><div className="heatmap-square bg-success/40"></div><div className="heatmap-square bg-success/20"></div><div className="heatmap-square bg-success/40"></div><div className="heatmap-square bg-success/20"></div></div>
</div>
<div className="mt-4 flex gap-8">
<div className="flex items-center gap-2">
<span className="text-2xl font-black text-success">312</span>
<span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Total Streaks</span>
</div>
<div className="flex items-center gap-2 border-l border-white/10 pl-8">
<span className="text-2xl font-black text-white">98%</span>
<span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Consistency</span>
</div>
</div>
</section>
</main>
{/* Right Side Panel */}
<aside className="w-80 h-full glass-panel flex flex-col p-6 sticky top-0 border-l border-glass-border">
{/* Leaderboard Section */}
<div className="mb-10">
<h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest flex items-center justify-between">
                    Leaderboard
                    <span className="material-symbols-outlined text-primary text-sm">open_in_new</span>
</h3>
<div className="space-y-4">
<div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
<div className="flex items-center gap-3">
<span className="text-xs font-bold text-primary">#1</span>
<div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
<img alt="Rank 1" className="w-full h-full object-cover" data-alt="Avatar for rank 1 user" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQqi9HsvccUcnlbURtgSYQOfoV4eq71PJ6sRd-RUtnx0ni2LZSTP3BiYJvy5V1I5KBdxk5bmyspw97JfQWtuamdOA0tuMh-P8kKYiqh_8ariE2iDZRJ0-u7uW7-w9VKTfHlW8u2cwP5NgnVlCL6zdFgv9bd_8uR72eRtDY1fTcYQlO2BEWXgKduNEO2A5K9fOgQ3XkhigOZirjZuLdjm8MTqCM2BeGaoqU9acQnfB7t58qhELlbH8-jhm5rtG7O-sYHjCrn-u-6x4"/>
</div>
<span className="text-xs font-bold">ZenMaster</span>
</div>
<span className="text-[10px] font-bold text-slate-500">2,450 XP</span>
</div>
<div className="flex items-center justify-between p-3 border border-white/10 rounded-xl border-dashed">
<div className="flex items-center gap-3">
<span className="text-xs font-bold text-slate-400">#4</span>
<div className="w-8 h-8 rounded-full bg-primary border border-primary/50 overflow-hidden">
<img alt="Your Rank" className="w-full h-full object-cover" data-alt="Current user rank avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLOIWnqxP8XvlJiubT-sy3xS5DHpo8cS5POvRE_2j63OWVoss0UOyHgI8Q9J_2TeH4p4P0XVTCErRnGeVVguSfBIx0kT0QBAeJUOXB2v7nzLK84aFkHwRkp5CElrqS0BN-iZeGJPaNn0Kl_9hYJhE9T-P7btWn7T1eA1PXsJItwqY29CDrd5dPlMkbx-JR8c-7290SiRih_A1Pcq3S30iNg6zzgMQJJpmXSetZ-E2rbnYYsA8Sessap6Cx_3jqLcF3QnkfflYrFOI"/>
</div>
<span className="text-xs font-bold text-white">You</span>
</div>
<span className="text-[10px] font-bold text-slate-500">1,840 XP</span>
</div>
</div>
</div>
{/* Badges Section */}
<div className="mb-10">
<h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Recent Badges</h3>
<div className="grid grid-cols-2 gap-4">
<div className="flex flex-col items-center gap-2 p-4 glass-panel rounded-xl border-glass-border">
<div className="w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center border border-yellow-500/30">
<span className="material-symbols-outlined">wb_twilight</span>
</div>
<span className="text-[10px] font-bold uppercase tracking-tight text-center">Early Bird</span>
</div>
<div className="flex flex-col items-center gap-2 p-4 glass-panel rounded-xl border-glass-border opacity-40">
<div className="w-12 h-12 rounded-full bg-slate-500/20 text-slate-400 flex items-center justify-center border border-white/10">
<span className="material-symbols-outlined">fitness_center</span>
</div>
<span className="text-[10px] font-bold uppercase tracking-tight text-center">Iron Soul</span>
</div>
</div>
</div>
{/* Rewards Section */}
<div className="mt-auto">
<div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 relative overflow-hidden">
<div className="absolute -right-4 -top-4 text-primary/10">
<span className="material-symbols-outlined text-8xl">redeem</span>
</div>
<h3 className="text-xs font-black text-primary uppercase tracking-widest mb-2">Next Reward</h3>
<p className="text-lg font-bold text-white mb-1">Cheat Meal</p>
<p className="text-[10px] text-slate-400 font-medium mb-4">Complete 5 more habits today</p>
<div className="flex gap-1.5">
<div className="h-1 flex-1 bg-primary rounded-full"></div>
<div className="h-1 flex-1 bg-primary rounded-full"></div>
<div className="h-1 flex-1 bg-primary rounded-full"></div>
<div className="h-1 flex-1 bg-white/20 rounded-full"></div>
<div className="h-1 flex-1 bg-white/20 rounded-full"></div>
</div>
</div>
<button className="w-full mt-6 py-4 bg-primary text-white font-black text-sm rounded-xl blue-glow hover:brightness-110 transition-all flex items-center justify-center gap-2">
<span className="material-symbols-outlined">add_circle</span>
                    NEW HABIT
                </button>
</div>
</aside>
</div>

    </div>
  );
};
