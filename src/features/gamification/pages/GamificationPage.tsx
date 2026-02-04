import React from 'react';

export const GamificationPage = () => {
  return (
    <div className="min-h-screen bg-oled text-white font-display selection:bg-primary/30">
      
<div className="flex h-screen w-full overflow-hidden bg-background-dark">
{/* Sidebar Navigation */}
<aside className="w-64 glass-panel m-4 rounded-xl flex flex-col justify-between p-6">
<div className="flex flex-col gap-8">
<div className="flex items-center gap-3">
<div className="size-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center">
<span className="material-symbols-outlined text-white">bolt</span>
</div>
<h2 className="text-xl font-bold tracking-tight">LifeOS</h2>
</div>
<nav className="flex flex-col gap-2">
<div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary/20 text-primary border border-primary/20">
<span className="material-symbols-outlined">dashboard</span>
<p className="text-sm font-semibold leading-normal">Dashboard</p>
</div>
<div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
<span className="material-symbols-outlined">swords</span>
<p className="text-white/70 text-sm font-medium leading-normal">Quest Board</p>
</div>
<div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
<span className="material-symbols-outlined">inventory_2</span>
<p className="text-white/70 text-sm font-medium leading-normal">Inventory</p>
</div>
<div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
<span className="material-symbols-outlined">account_tree</span>
<p className="text-white/70 text-sm font-medium leading-normal">Skill Tree</p>
</div>
<div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
<span className="material-symbols-outlined">storefront</span>
<p className="text-white/70 text-sm font-medium leading-normal">Shop</p>
</div>
</nav>
</div>
<button className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
<span className="material-symbols-outlined text-[20px]">add</span>
<span>New Quest</span>
</button>
</aside>
{/* Main Content Area */}
<main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
<div className="max-w-6xl mx-auto flex flex-col gap-6">
{/* Top Row: Avatar Card & Stats */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
{/* ProfileHeader */}
<div className="lg:col-span-5 glass-panel rounded-xl p-8 flex flex-col items-center justify-center gap-6">
<div className="relative">
<div className="absolute -inset-1 bg-gradient-to-tr from-primary to-purple-500 rounded-full blur opacity-40"></div>
<div className="relative bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-[#050505]" data-alt="Modern stylized portrait of a strategist avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuChEnTpgMz68EcXASUGiFrkYK-AfD1FCu8LMCDpimSE6gIWH-Tr7QCeOS29_WXYwu6HD4OB6K2Pid39lefP5GLH_Ka7g_GdHdG-X1ns0lMOADz_RNqGycheXBZunS5jb4Xae8A6ym2UbXT4A2e9IhhOs5JwqYfmuM2IpUyFoYmnMC4lkkCwkwi5Pv_RRNHoHGIodMPZsKXNvnYIF6aNY-_ynnEUqPPIKFUF74EHNCExhqqWHDjPNBzLpLhXmEAN8sbD6K-6fuL-K1M")' }}>
</div>
</div>
<div className="text-center">
<h1 className="text-2xl font-bold text-white tracking-tight">LifeOS Strategist</h1>
<p className="text-primary font-semibold text-lg">Level 42</p>
<p className="text-white/50 text-sm font-medium mt-1">Class: Strategist</p>
</div>
<div className="w-full flex flex-col gap-2">
<div className="flex justify-between items-end">
<p className="text-xs font-bold text-white/40 uppercase tracking-widest">Experience</p>
<p className="text-sm font-bold text-white">8,450 / 10,000 XP</p>
</div>
<div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(168,85,247,0.5)]" style={{ width: "84.5%" }}></div>
</div>
</div>
</div>
{/* Stats Radar */}
<div className="lg:col-span-7 glass-panel rounded-xl p-8">
<div className="flex justify-between items-start mb-6">
<div>
<h3 className="text-white text-lg font-bold">Stats Radar</h3>
<div className="flex gap-2 items-center mt-1">
<p className="text-3xl font-bold tracking-tight">62 <span className="text-sm text-white/40 font-normal">AVG</span></p>
<span className="bg-[#0bda73]/20 text-[#0bda73] text-[10px] font-bold px-2 py-0.5 rounded-full">+5%</span>
</div>
</div>
<button className="p-2 hover:bg-white/5 rounded-lg text-white/40 transition-colors">
<span className="material-symbols-outlined">info</span>
</button>
</div>
<div className="grid grid-cols-5 gap-4 items-end h-40 mt-4">
<div className="flex flex-col items-center gap-3 group">
<div className="w-full bg-primary/20 rounded-t-lg transition-all group-hover:bg-primary/30" style={{ height: "85%" }}></div>
<p className="text-[11px] font-bold text-white/40 uppercase">Int</p>
</div>
<div className="flex flex-col items-center gap-3 group">
<div className="w-full bg-primary/20 rounded-t-lg transition-all group-hover:bg-primary/30" style={{ height: "40%" }}></div>
<p className="text-[11px] font-bold text-white/40 uppercase">Str</p>
</div>
<div className="flex flex-col items-center gap-3 group">
<div className="w-full bg-primary/20 rounded-t-lg transition-all group-hover:bg-primary/30" style={{ height: "60%" }}></div>
<p className="text-[11px] font-bold text-white/40 uppercase">Cha</p>
</div>
<div className="flex flex-col items-center gap-3 group">
<div className="w-full bg-primary/20 rounded-t-lg transition-all group-hover:bg-primary/30" style={{ height: "55%" }}></div>
<p className="text-[11px] font-bold text-white/40 uppercase">Agi</p>
</div>
<div className="flex flex-col items-center gap-3 group">
<div className="w-full bg-primary/20 rounded-t-lg transition-all group-hover:bg-primary/30" style={{ height: "70%" }}></div>
<p className="text-[11px] font-bold text-white/40 uppercase">Sta</p>
</div>
</div>
</div>
</div>
{/* Middle Row: Quest Board (Kanban) */}
<div className="flex flex-col gap-4">
<div className="flex justify-between items-center px-2">
<h2 className="text-xl font-bold tracking-tight">Quest Board</h2>
<button className="text-primary text-sm font-semibold hover:underline">View All Quests</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Main Quests */}
<div className="flex flex-col gap-4">
<div className="flex items-center gap-2 px-2">
<span className="material-symbols-outlined text-primary text-[20px]">stars</span>
<h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Main Quests</h3>
</div>
<div className="flex flex-col gap-3">
<div className="glass-panel p-4 rounded-xl border-l-4 border-primary hover:translate-x-1 transition-transform cursor-pointer">
<div className="flex justify-between items-start mb-2">
<p className="font-bold text-white">Finish Master's Thesis</p>
<span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded uppercase">Epic</span>
</div>
<p className="text-xs text-white/50 mb-3">Reach the final submission stage and get supervisor approval.</p>
<div className="flex justify-between items-center">
<div className="flex -space-x-2">
<div className="w-6 h-6 rounded-full border-2 border-background-dark bg-white/10 flex items-center justify-center">
<span className="material-symbols-outlined text-[12px]">school</span>
</div>
</div>
<p className="text-xs font-bold text-primary">+2,500 XP</p>
</div>
</div>
<div className="glass-panel p-4 rounded-xl border-l-4 border-primary/40 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
<div className="flex justify-between items-start mb-2">
<p className="font-bold text-white">Career Pivot Design</p>
<span className="text-[10px] font-bold bg-white/10 text-white/60 px-2 py-0.5 rounded uppercase">Rare</span>
</div>
<p className="text-xs text-white/50 mb-3">Map out 3 potential career paths for the next decade.</p>
<p className="text-xs font-bold text-primary">+1,200 XP</p>
</div>
</div>
</div>
{/* Side Quests */}
<div className="flex flex-col gap-4">
<div className="flex items-center gap-2 px-2">
<span className="material-symbols-outlined text-white/40 text-[20px]">explore</span>
<h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Side Quests</h3>
</div>
<div className="flex flex-col gap-3">
<div className="glass-panel p-4 rounded-xl border-l-4 border-white/20 hover:translate-x-1 transition-transform cursor-pointer">
<div className="flex justify-between items-center">
<div className="flex flex-col gap-1">
<p className="font-bold text-white">Morning Walk</p>
<p className="text-xs text-white/50">Walk the dog for 30 mins</p>
</div>
<div className="flex items-center gap-1 text-primary">
<span className="material-symbols-outlined text-[16px]">monetization_on</span>
<p className="text-xs font-bold">50</p>
</div>
</div>
</div>
<div className="glass-panel p-4 rounded-xl border-l-4 border-white/20 hover:translate-x-1 transition-transform cursor-pointer">
<div className="flex justify-between items-center">
<div className="flex flex-col gap-1">
<p className="font-bold text-white">Inbox Zero</p>
<p className="text-xs text-white/50">Clear all pending emails</p>
</div>
<div className="flex items-center gap-1 text-primary">
<span className="material-symbols-outlined text-[16px]">monetization_on</span>
<p className="text-xs font-bold">30</p>
</div>
</div>
</div>
<div className="glass-panel p-4 rounded-xl border-l-4 border-[#0bda73]/40 bg-[#0bda73]/5 cursor-default">
<div className="flex justify-between items-center">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-[#0bda73]">check_circle</span>
<p className="font-bold text-white/40 line-through">Gym Session</p>
</div>
<p className="text-xs font-bold text-[#0bda73]">Completed</p>
</div>
</div>
</div>
</div>
</div>
</div>
{/* Bottom Row: Achievements & Shop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
{/* Achievements */}
<div className="lg:col-span-2 glass-panel rounded-xl p-6">
<div className="flex items-center gap-2 mb-6">
<span className="material-symbols-outlined text-[#eab308]">military_tech</span>
<h3 className="text-lg font-bold">Recent Achievements</h3>
</div>
<div className="flex flex-wrap gap-6">
<div className="flex flex-col items-center gap-3 group cursor-help">
<div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#eab308] to-yellow-200 p-0.5 shadow-lg shadow-[#eab308]/20 group-hover:scale-110 transition-transform">
<div className="w-full h-full rounded-full bg-background-dark flex items-center justify-center">
<span className="material-symbols-outlined text-[#eab308] text-3xl">light_mode</span>
</div>
</div>
<div className="text-center">
<p className="text-sm font-bold">Early Bird</p>
<p className="text-[10px] text-white/40 font-medium uppercase">30 Day Streak</p>
</div>
</div>
<div className="flex flex-col items-center gap-3 group cursor-help">
<div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#eab308] to-yellow-200 p-0.5 shadow-lg shadow-[#eab308]/20 group-hover:scale-110 transition-transform">
<div className="w-full h-full rounded-full bg-background-dark flex items-center justify-center">
<span className="material-symbols-outlined text-[#eab308] text-3xl">terminal</span>
</div>
</div>
<div className="text-center">
<p className="text-sm font-bold">Code Warrior</p>
<p className="text-[10px] text-white/40 font-medium uppercase">500 Commits</p>
</div>
</div>
<div className="flex flex-col items-center gap-3 group opacity-40 grayscale">
<div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
<span className="material-symbols-outlined text-white/20 text-3xl">lock</span>
</div>
<div className="text-center">
<p className="text-sm font-bold text-white/40">???</p>
<p className="text-[10px] text-white/20 font-medium uppercase">Locked</p>
</div>
</div>
</div>
</div>
{/* Shop Widget */}
<div className="glass-panel rounded-xl p-6">
<div className="flex justify-between items-center mb-6">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">shopping_bag</span>
<h3 className="text-lg font-bold">Reward Shop</h3>
</div>
<div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
<span className="material-symbols-outlined text-primary text-[16px]">monetization_on</span>
<span className="text-sm font-bold text-primary">1,240</span>
</div>
</div>
<div className="flex flex-col gap-4">
<div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group cursor-pointer">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
<span className="material-symbols-outlined text-red-500">fastfood</span>
</div>
<div>
<p className="text-sm font-bold">Cheat Meal</p>
<p className="text-[10px] text-white/40">One-time use</p>
</div>
</div>
<div className="text-right">
<p className="text-xs font-bold group-hover:text-primary transition-colors">500 LC</p>
</div>
</div>
<div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group cursor-pointer">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
<span className="material-symbols-outlined text-blue-500">videogame_asset</span>
</div>
<div>
<p className="text-sm font-bold">Gaming Hour</p>
<p className="text-[10px] text-white/40">Unrestricted play</p>
</div>
</div>
<div className="text-right">
<p className="text-xs font-bold group-hover:text-primary transition-colors">250 LC</p>
</div>
</div>
<button className="text-center py-2 text-xs font-bold text-white/40 hover:text-white transition-colors">
                                Browse all rewards
                            </button>
</div>
</div>
</div>
</div>
</main>
</div>

    </div>
  );
};
