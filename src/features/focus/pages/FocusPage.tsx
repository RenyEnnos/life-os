import React from 'react';

export const FocusPage = () => {
  return (
    <div className="min-h-screen bg-oled text-white font-display selection:bg-primary/30">
      
<div className="flex h-screen w-full">
{/* Collapsed Sidebar */}
<aside className="w-16 flex flex-col items-center py-8 border-r border-white/5 bg-background-dark">
<div className="mb-10">
<div className="size-8 rounded-full bg-primary flex items-center justify-center">
<span className="material-symbols-outlined text-white text-lg">bolt</span>
</div>
</div>
<nav className="flex flex-col gap-8 flex-1">
<button className="text-white/40 hover:text-white transition-colors">
<span className="material-symbols-outlined">dashboard</span>
</button>
<button className="text-white hover:text-primary transition-colors">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
</button>
<button className="text-white/40 hover:text-white transition-colors">
<span className="material-symbols-outlined">check_circle</span>
</button>
<button className="text-white/40 hover:text-white transition-colors">
<span className="material-symbols-outlined">calendar_today</span>
</button>
</nav>
<button className="text-white/40 hover:text-white transition-colors">
<span className="material-symbols-outlined">settings</span>
</button>
</aside>
{/* Main Content */}
<main className="flex-1 flex flex-col items-center justify-center relative">
{/* Center Stage: Timer */}
<div className="flex flex-col items-center gap-12">
<div className="relative flex items-center justify-center">
{/* Circular Progress Ring */}
<div className="circular-progress size-[420px] rounded-full flex items-center justify-center glow-effect">
<div className="text-center">
<span className="text-[110px] font-light tracking-tighter leading-none">25:00</span>
</div>
</div>
{/* Subtle ambient particle effect container */}
<div className="absolute inset-0 rounded-full border border-primary/10 animate-pulse"></div>
</div>
<div className="text-center">
<h2 className="text-3xl font-light text-white tracking-wide">Drafting Project Proposal</h2>
<p className="text-white/30 text-sm mt-3 tracking-widest uppercase">Deep Work Session</p>
</div>
</div>
{/* Bottom Controls Container */}
<div className="absolute bottom-12 flex flex-col items-center gap-6">
{/* Main Controls Pill */}
<div className="glass-pill rounded-full px-2 py-2 flex items-center gap-1">
<button className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-all">
<span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
<span className="text-sm font-bold uppercase tracking-wider">Pause</span>
</button>
<button className="flex items-center justify-center size-12 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all">
<span className="material-symbols-outlined">stop</span>
</button>
<div className="w-px h-6 bg-white/10 mx-1"></div>
<button className="flex items-center justify-center px-5 h-12 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all">
<span className="text-sm font-medium">+5m</span>
</button>
</div>
{/* Ambient Toggle */}
<div className="glass-pill rounded-full px-4 py-2 flex items-center gap-3">
<span className="material-symbols-outlined text-primary text-lg">water_drop</span>
<span className="text-xs font-medium text-white/70">Rainy Mood</span>
<div className="w-8 h-4 bg-primary/30 rounded-full relative flex items-center px-0.5">
<div className="size-3 bg-primary rounded-full ml-auto"></div>
</div>
</div>
</div>
{/* Stats Badge */}
<div className="absolute bottom-12 right-12 text-right">
<p className="text-white/40 text-sm font-light tracking-tight">
                    Today: <span className="text-white font-medium">4h 15m</span> deep work
                </p>
</div>
{/* Top Header (Minimal) */}
<div className="absolute top-12 left-12 flex items-center gap-4">
<div className="size-2 rounded-full bg-primary animate-pulse"></div>
<span className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium">Focus Active</span>
</div>
</main>
</div>

    </div>
  );
};
