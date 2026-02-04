import React from 'react';

export const JournalPage = () => {
  return (
    <div className="min-h-screen bg-oled text-white font-display selection:bg-primary/30">
      
<div className="flex h-full w-full">
{/* Main Navigation Sidebar */}
<aside className="w-20 lg:w-64 glass h-full flex flex-col items-center lg:items-stretch p-4 border-r border-white/5">
<div className="flex items-center gap-3 px-3 py-6 mb-4">
<div className="bg-primary size-10 rounded-lg flex items-center justify-center">
<span className="material-symbols-outlined text-white">bolt</span>
</div>
<div className="hidden lg:block">
<h1 className="text-white text-lg font-bold leading-tight">LifeOS</h1>
<p className="text-white/40 text-xs">Digital Workspace</p>
</div>
</div>
<nav className="flex flex-col gap-2 grow">
<div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary/20 text-primary">
<span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>edit_square</span>
<p className="hidden lg:block text-white text-sm font-semibold">Journal</p>
</div>
<div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/5 transition-all">
<span className="material-symbols-outlined">dashboard</span>
<p className="hidden lg:block text-sm font-medium">Dashboard</p>
</div>
<div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/5 transition-all">
<span className="material-symbols-outlined">calendar_today</span>
<p className="hidden lg:block text-sm font-medium">Calendar</p>
</div>
<div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/5 transition-all">
<span className="material-symbols-outlined">checklist</span>
<p className="hidden lg:block text-sm font-medium">Tasks</p>
</div>
</nav>
<div className="pt-4 border-t border-white/5 flex flex-col gap-2">
<div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/5 transition-all">
<span className="material-symbols-outlined">settings</span>
<p className="hidden lg:block text-sm font-medium">Settings</p>
</div>
<div className="flex items-center gap-3 px-3 py-2.5">
<div className="size-8 rounded-full bg-primary/40 flex items-center justify-center text-xs font-bold text-white">JD</div>
<p className="hidden lg:block text-sm font-medium">John Doe</p>
</div>
</div>
</aside>
{/* Entries Sidebar */}
<aside className="w-80 glass flex flex-col h-full border-r border-white/5">
<div className="p-6">
<div className="relative group">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
<span className="material-symbols-outlined text-lg">search</span>
</div>
<input className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-white placeholder-white/30 transition-all" placeholder="Search entries..." type="text"/>
</div>
</div>
<div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-6 space-y-2">
{/* Entry 1 */}
<div className="p-4 rounded-xl bg-primary/10 border border-primary/20 group cursor-pointer transition-all">
<div className="flex justify-between items-start mb-1">
<h4 className="text-white text-sm font-semibold">Today, Oct 24</h4>
<span className="text-[10px] text-white/40">08:30 AM</span>
</div>
<p className="text-white/60 text-xs mb-3 line-clamp-1">Morning Reflection: Focus and Gratitude</p>
<div className="flex gap-2">
<span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">#Work</span>
<span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">#Focus</span>
</div>
</div>
{/* Entry 2 */}
<div className="p-4 rounded-xl hover:bg-white/5 border border-transparent group cursor-pointer transition-all">
<div className="flex justify-between items-start mb-1">
<h4 className="text-white text-sm font-semibold">Yesterday, Oct 23</h4>
<span className="text-[10px] text-white/40">06:15 PM</span>
</div>
<p className="text-white/60 text-xs mb-3 line-clamp-1">Project Ideas for LifeOS Dashboard</p>
<div className="flex gap-2">
<span className="px-2 py-0.5 rounded-full bg-white/10 text-white/40 text-[10px] font-bold">#Creative</span>
</div>
</div>
{/* Entry 3 */}
<div className="p-4 rounded-xl hover:bg-white/5 border border-transparent group cursor-pointer transition-all">
<div className="flex justify-between items-start mb-1">
<h4 className="text-white text-sm font-semibold">Oct 22 - Evening</h4>
<span className="text-[10px] text-white/40">10:00 PM</span>
</div>
<p className="text-white/60 text-xs mb-3 line-clamp-1">Weekly review and reflections on growth</p>
<div className="flex gap-2">
<span className="px-2 py-0.5 rounded-full bg-white/10 text-white/40 text-[10px] font-bold">#Personal</span>
</div>
</div>
</div>
</aside>
{/* Main Writing Area */}
<main className="flex-1 flex flex-col relative h-full">
{/* Top Header & Toolbar */}
<div className="flex flex-col items-center pt-12 pb-6 px-12 z-10">
<div className="w-full max-w-2xl flex justify-between items-end mb-8">
<div className="flex-1">
<input className="bg-transparent border-none text-white text-4xl font-bold p-0 focus:ring-0 w-full mb-1" placeholder="Title..." type="text" value="Morning Reflection"/>
<div className="flex items-center gap-2 text-white/30 text-sm">
<span className="material-symbols-outlined text-sm">event</span>
<span>Thursday, October 24, 2024</span>
<span className="mx-1">â¢</span>
<span>08:30 AM</span>
</div>
</div>
</div>
{/* Floating Toolbar */}
<div className="glass h-14 rounded-full px-4 flex items-center gap-1 shadow-2xl border border-white/10">
<button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">
<span className="material-symbols-outlined">format_bold</span>
</button>
<button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">
<span className="material-symbols-outlined">format_italic</span>
</button>
<button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">
<span className="material-symbols-outlined">format_list_bulleted</span>
</button>
<button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">
<span className="material-symbols-outlined">checklist</span>
</button>
<div className="w-px h-6 bg-white/10 mx-2"></div>
<button className="flex items-center gap-2 px-4 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors text-sm font-semibold">
<span className="material-symbols-outlined text-lg">sentiment_satisfied</span>
                        Add Mood
                    </button>
</div>
</div>
{/* Writing Editor */}
<div className="flex-1 overflow-y-auto custom-scrollbar px-12">
<div className="max-w-2xl mx-auto py-10">
<textarea className="w-full h-full bg-transparent border-none focus:ring-0 text-paper-white text-xl leading-relaxed resize-none p-0 placeholder-white/20 font-light" placeholder="Start writing your thoughts here...">Today I am grateful for...</textarea>
</div>
</div>
</main>
{/* Right Insights Sidebar (Collapsible) */}
<aside className="w-72 glass border-l border-white/5 h-full flex flex-col p-6">
<div className="flex items-center justify-between mb-8">
<h3 className="text-white font-bold text-sm tracking-wide">INSIGHTS</h3>
<span className="material-symbols-outlined text-white/40 cursor-pointer">chevron_right</span>
</div>
<div className="mb-10">
<p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-4">Mood Tracking</p>
<div className="h-32 w-full flex items-end justify-between gap-2 px-1">
<div className="w-full bg-primary/20 rounded-t-lg relative" style={{ height: "40%" }}>
<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-white/40">M</div>
</div>
<div className="w-full bg-primary/40 rounded-t-lg relative" style={{ height: "60%" }}>
<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-white/40">T</div>
</div>
<div className="w-full bg-primary/30 rounded-t-lg relative" style={{ height: "50%" }}>
<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-white/40">W</div>
</div>
<div className="w-full bg-primary rounded-t-lg relative" style={{ height: "85%" }}>
<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-white">T</div>
</div>
<div className="w-full bg-white/5 rounded-t-lg relative" style={{ height: "10%" }}>
<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-white/20">F</div>
</div>
<div className="w-full bg-white/5 rounded-t-lg relative" style={{ height: "10%" }}>
<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-white/20">S</div>
</div>
</div>
</div>
<div>
<p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-4">Related Entries</p>
<div className="space-y-4">
<div className="group cursor-pointer">
<p className="text-white/80 text-xs font-medium mb-1 group-hover:text-primary transition-colors">Oct 17 - Morning Rituals</p>
<p className="text-white/40 text-[10px]">A week ago â¢ #Focus</p>
</div>
<div className="group cursor-pointer">
<p className="text-white/80 text-xs font-medium mb-1 group-hover:text-primary transition-colors">Sep 24 - Goal Setting</p>
<p className="text-white/40 text-[10px]">Last month â¢ #Work</p>
</div>
</div>
</div>
<div className="mt-auto pt-6">
<div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-transparent border border-white/5">
<p className="text-white text-xs font-semibold mb-1">Consistency Streak</p>
<div className="flex items-center gap-2">
<span className="text-2xl font-bold text-white tracking-tighter">14</span>
<span className="text-[10px] text-white/60">DAYS IN A ROW</span>
</div>
</div>
</div>
</aside>
</div>

    </div>
  );
};
