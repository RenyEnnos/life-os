import React from 'react';

export const CalendarPage = () => {
  return (
    <div className="min-h-screen bg-oled text-white font-display selection:bg-primary/30">
      
<div className="flex h-screen overflow-hidden">
{/* SideNavBar */}
<aside className="w-64 glass-surface flex flex-col m-4 mr-0">
<div className="p-6 flex flex-col gap-8 h-full">
<div className="flex items-center gap-3">
<div className="bg-primary/20 p-2 rounded-xl">
<span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
</div>
<div className="flex flex-col">
<h1 className="text-white text-lg font-bold leading-tight tracking-tight">LifeOS</h1>
<p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Professional</p>
</div>
</div>
<nav className="flex flex-col gap-1.5 grow">
<div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer text-gray-400">
<span className="material-symbols-outlined">grid_view</span>
<p className="text-sm font-medium">Dashboard</p>
</div>
<div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary cursor-pointer active-glow">
<span className="material-symbols-outlined">calendar_today</span>
<p className="text-sm font-semibold">Calendar</p>
</div>
<div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer text-gray-400">
<span className="material-symbols-outlined">check_box</span>
<p className="text-sm font-medium">Tasks</p>
</div>
<div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer text-gray-400">
<span className="material-symbols-outlined">description</span>
<p className="text-sm font-medium">Notes</p>
</div>
<div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer text-gray-400">
<span className="material-symbols-outlined">monitoring</span>
<p className="text-sm font-medium">Analytics</p>
</div>
</nav>
<div className="mt-auto flex flex-col gap-2">
<div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer text-gray-400">
<span className="material-symbols-outlined">settings</span>
<p className="text-sm font-medium">Settings</p>
</div>
<div className="flex items-center gap-3 p-2 bg-white/5 rounded-2xl">
<div className="w-10 h-10 rounded-full bg-cover" data-alt="Profile photo of a professional user" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAjedDLIqaa4FQC_NNYr9rpMEJcRGC7CqOxVJHXbCuT_ZQThuUhDwEUMWZ7yaDFk-ZaSvvSnXNK7a06Qnq_W4EHaaZTIG-vFOyNPk5PsQfABYcomAQVmMdlW7YxtV_BSVKVRq3dn72HI0G9iDoRlSSAMkqLyNPkhyseCDEYqlKY_K5Pu016d3mnYeJvBdsuHqkprhDmq9uhfffN2-vvJs5bA7M_0JycjKk2Vw3fg7984qA1U4j_13tvoKQ1PQNw6kxusiVEQCD_r4Q")' }}></div>
<div className="flex flex-col">
<p className="text-sm font-bold">Alex Chen</p>
<p className="text-[10px] text-gray-500">Premium Member</p>
</div>
</div>
</div>
</div>
</aside>
{/* Main Content Area */}
<main className="flex-1 flex flex-col overflow-hidden">
{/* Header */}
<header className="flex items-center justify-between px-8 py-6">
<div className="flex flex-col gap-1">
<h2 className="text-3xl font-black tracking-tight">Schedule</h2>
<p className="text-gray-500 text-sm">August 12 - August 18, 2024</p>
</div>
<div className="flex items-center gap-6">
{/* SegmentedButtons */}
<div className="flex h-11 items-center glass-surface rounded-full p-1.5 w-64">
<button className="flex-1 h-full flex items-center justify-center rounded-full text-sm font-medium text-gray-500">Day</button>
<button className="flex-1 h-full flex items-center justify-center rounded-full bg-primary/20 text-primary active-glow text-sm font-bold">Week</button>
<button className="flex-1 h-full flex items-center justify-center rounded-full text-sm font-medium text-gray-500">Month</button>
</div>
<button className="flex items-center gap-2 bg-primary px-6 h-11 rounded-full text-white text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
<span className="material-symbols-outlined text-lg">add</span>
<span>New Event</span>
</button>
</div>
</header>
{/* Calendar Container */}
<div className="flex-1 flex px-8 pb-8 gap-6 overflow-hidden">
<div className="flex-1 glass-surface rounded-[2rem] overflow-hidden flex flex-col">
{/* Calendar Header */}
<div className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-white/10">
<div className="p-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-center self-center">GMT+2</div>
<div className="p-4 text-center border-l border-white/5">
<p className="text-xs text-gray-500 font-bold">MON</p>
<p className="text-lg font-bold">12</p>
</div>
<div className="p-4 text-center border-l border-white/5 bg-primary/5 relative">
<div className="absolute inset-0 border-b-2 border-primary"></div>
<p className="text-xs text-primary font-bold">TUE</p>
<p className="text-lg font-bold text-primary">13</p>
<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full blur-[2px]"></div>
</div>
<div className="p-4 text-center border-l border-white/5">
<p className="text-xs text-gray-500 font-bold">WED</p>
<p className="text-lg font-bold">14</p>
</div>
<div className="p-4 text-center border-l border-white/5">
<p className="text-xs text-gray-500 font-bold">THU</p>
<p className="text-lg font-bold">15</p>
</div>
<div className="p-4 text-center border-l border-white/5">
<p className="text-xs text-gray-500 font-bold">FRI</p>
<p className="text-lg font-bold">16</p>
</div>
<div className="p-4 text-center border-l border-white/5">
<p className="text-xs text-gray-400 font-bold">SAT</p>
<p className="text-lg font-bold text-gray-400">17</p>
</div>
<div className="p-4 text-center border-l border-white/5">
<p className="text-xs text-gray-400 font-bold">SUN</p>
<p className="text-lg font-bold text-gray-400">18</p>
</div>
</div>
{/* Scrollable Grid */}
<div className="flex-1 overflow-y-auto relative custom-scrollbar">
<div className="grid grid-cols-[100px_repeat(7,1fr)] grid-rows-[repeat(15,80px)]">
{/* Time Column */}
<div className="row-span-full border-r border-white/5">
<div className="h-20 flex items-center justify-center text-xs font-medium text-gray-600 border-b border-white/5">08:00 AM</div>
<div className="h-20 flex items-center justify-center text-xs font-medium text-gray-600 border-b border-white/5">09:00 AM</div>
<div className="h-20 flex items-center justify-center text-xs font-medium text-gray-600 border-b border-white/5">10:00 AM</div>
<div className="h-20 flex items-center justify-center text-xs font-medium text-gray-600 border-b border-white/5">11:00 AM</div>
<div className="h-20 flex items-center justify-center text-xs font-medium text-gray-600 border-b border-white/5">12:00 PM</div>
<div className="h-20 flex items-center justify-center text-xs font-medium text-gray-600 border-b border-white/5">01:00 PM</div>
<div className="h-20 flex items-center justify-center text-xs font-medium text-gray-600 border-b border-white/5">02:00 PM</div>
<div className="h-20 flex items-center justify-center text-xs font-medium text-gray-600 border-b border-white/5">03:00 PM</div>
<div className="h-20 flex items-center justify-center text-xs font-medium text-gray-600 border-b border-white/5">04:00 PM</div>
<div className="h-20 flex items-center justify-center text-xs font-medium text-gray-600 border-b border-white/5">05:00 PM</div>
<div className="h-20 flex items-center justify-center text-xs font-medium text-gray-600 border-b border-white/5">06:00 PM</div>
<div className="h-20 flex items-center justify-center text-xs font-medium text-gray-600 border-b border-white/5">07:00 PM</div>
<div className="h-20 flex items-center justify-center text-xs font-medium text-gray-600 border-b border-white/5">08:00 PM</div>
<div className="h-20 flex items-center justify-center text-xs font-medium text-gray-600 border-b border-white/5">09:00 PM</div>
<div className="h-20 flex items-center justify-center text-xs font-medium text-gray-600 border-b border-white/5">10:00 PM</div>
</div>
{/* Grid Cells & Events */}
{/* Tuesday 13th Events */}
<div className="relative col-start-3 row-start-2 row-span-2 p-2">
<div className="absolute inset-1.5 bg-primary/20 border-l-4 border-primary rounded-xl p-3 flex flex-col gap-1 active-glow">
<span className="text-xs font-bold text-primary uppercase">09:00 - 11:00</span>
<span className="text-sm font-bold text-white">Deep Work</span>
<div className="flex -space-x-2 mt-auto">
<div className="w-5 h-5 rounded-full border border-black bg-primary flex items-center justify-center text-[8px] font-bold">AC</div>
</div>
</div>
</div>
<div className="relative col-start-3 row-start-7 row-span-1 p-2">
<div className="absolute inset-1.5 bg-emerald-500/20 border-l-4 border-emerald-500 rounded-xl p-3 flex flex-col gap-1">
<span className="text-xs font-bold text-emerald-500 uppercase">14:00 - 15:00</span>
<span className="text-sm font-bold text-white">Team Sync</span>
</div>
</div>
<div className="relative col-start-3 row-start-11 row-span-2 p-2">
<div className="absolute inset-1.5 bg-purple-500/20 border-l-4 border-purple-500 rounded-xl p-3 flex flex-col gap-1">
<span className="text-xs font-bold text-purple-400 uppercase">18:00 - 19:30</span>
<span className="text-sm font-bold text-white">Gym Session</span>
</div>
</div>
{/* Monday 12th Event */}
<div className="relative col-start-2 row-start-11 row-span-2 p-2">
<div className="absolute inset-1.5 bg-purple-500/10 border-l-4 border-purple-500/40 rounded-xl p-3 flex flex-col gap-1">
<span className="text-xs font-bold text-purple-400/60 uppercase">18:00 - 19:30</span>
<span className="text-sm font-bold text-white/50">Gym Session</span>
</div>
</div>
{/* Thursday 15th Event */}
<div className="relative col-start-5 row-start-2 row-span-2 p-2">
<div className="absolute inset-1.5 bg-primary/10 border-l-4 border-primary/40 rounded-xl p-3 flex flex-col gap-1">
<span className="text-xs font-bold text-primary/60 uppercase">09:00 - 11:00</span>
<span className="text-sm font-bold text-white/50">Deep Work</span>
</div>
</div>
{/* Fill background lines */}
<div className="col-start-2 col-span-7 row-span-full">
<div className="h-20 border-b border-white/5 w-full"></div>
<div className="h-20 border-b border-white/5 w-full"></div>
<div className="h-20 border-b border-white/5 w-full"></div>
<div className="h-20 border-b border-white/5 w-full"></div>
<div className="h-20 border-b border-white/5 w-full"></div>
<div className="h-20 border-b border-white/5 w-full"></div>
<div className="h-20 border-b border-white/5 w-full"></div>
<div className="h-20 border-b border-white/5 w-full"></div>
<div className="h-20 border-b border-white/5 w-full"></div>
<div className="h-20 border-b border-white/5 w-full"></div>
<div className="h-20 border-b border-white/5 w-full"></div>
<div className="h-20 border-b border-white/5 w-full"></div>
<div className="h-20 border-b border-white/5 w-full"></div>
<div className="h-20 border-b border-white/5 w-full"></div>
<div className="h-20 border-b border-white/5 w-full"></div>
</div>
</div>
</div>
</div>
{/* Right Sidebar / Info */}
<div className="w-80 flex flex-col gap-6">
{/* CalendarPicker mini */}
<div className="glass-surface rounded-2xl p-4">
<div className="flex items-center justify-between mb-4">
<h3 className="font-bold text-sm">August 2024</h3>
<div className="flex gap-2">
<button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5">
<span className="material-symbols-outlined text-sm">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5">
<span className="material-symbols-outlined text-sm">chevron_right</span>
</button>
</div>
</div>
<div className="grid grid-cols-7 gap-y-2 text-center">
<div className="text-[10px] font-bold text-gray-500">S</div>
<div className="text-[10px] font-bold text-gray-500">M</div>
<div className="text-[10px] font-bold text-gray-500">T</div>
<div className="text-[10px] font-bold text-gray-500">W</div>
<div className="text-[10px] font-bold text-gray-500">T</div>
<div className="text-[10px] font-bold text-gray-500">F</div>
<div className="text-[10px] font-bold text-gray-500">S</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer text-gray-600">28</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer text-gray-600">29</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer text-gray-600">30</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer text-gray-600">31</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">1</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">2</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">3</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">4</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">5</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">6</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">7</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">8</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">9</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">10</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">11</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">12</div>
<div className="text-xs py-1 rounded-full bg-primary text-white active-glow font-bold">13</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">14</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">15</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">16</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">17</div>
<div className="text-xs py-1 rounded-lg hover:bg-white/5 cursor-pointer">18</div>
</div>
</div>
{/* Up Next Card */}
<div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
<div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all"></div>
<div className="relative z-10 flex flex-col gap-4">
<div className="flex items-center justify-between">
<span className="bg-primary/20 text-primary text-[10px] font-bold uppercase px-2 py-1 rounded-lg tracking-wider">Up Next</span>
<span className="text-gray-400 text-[10px] font-medium uppercase tracking-widest">In 20 min</span>
</div>
<div className="flex flex-col gap-1">
<h4 className="text-xl font-bold leading-tight">Team Sync</h4>
<div className="flex items-center gap-2 text-primary">
<span className="material-symbols-outlined text-sm">videocam</span>
<p className="text-xs font-medium">Zoom Meeting</p>
</div>
</div>
<button className="w-full bg-primary text-white rounded-xl py-3 text-sm font-bold active-glow">
                                Join Call
                            </button>
</div>
</div>
{/* Category Summary */}
<div className="glass-surface rounded-2xl p-6 flex flex-col gap-4">
<h3 className="font-bold text-sm">Today's Focus</h3>
<div className="space-y-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-1.5 h-6 bg-primary rounded-full"></div>
<p className="text-sm font-medium">Work</p>
</div>
<p className="text-sm font-bold">4.5h</p>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
<p className="text-sm font-medium">Meetings</p>
</div>
<p className="text-sm font-bold">1.0h</p>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
<p className="text-sm font-medium">Health</p>
</div>
<p className="text-sm font-bold">1.5h</p>
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
