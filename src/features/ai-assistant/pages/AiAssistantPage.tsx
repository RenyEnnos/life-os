import React from 'react';

export const AiAssistantPage = () => {
  return (
    <div className="min-h-screen bg-oled text-white font-display selection:bg-primary/30">
      
<div className="flex h-screen w-full">
<aside className="w-64 h-full glass-panel flex flex-col p-6 rounded-none border-y-0 border-l-0">
<div className="flex items-center gap-3 mb-12 px-2">
<div className="bg-primary/20 p-2 rounded-[12px]">
<div className="size-6 text-primary">
<svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
</svg>
</div>
</div>
<div>
<h1 className="text-base font-bold tracking-tight">LifeOS</h1>
</div>
</div>
<nav className="flex flex-col gap-1.5 flex-grow">
<a className="flex items-center gap-3 px-4 py-3 rounded-[12px] text-white/50 hover:bg-white/5 transition-all" href="#">
<span className="material-symbols-outlined text-[22px]">dashboard</span>
<span className="text-sm font-medium">Dashboard</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-[12px] nav-item-active transition-all" href="#">
<span className="material-symbols-outlined text-[22px]">smart_toy</span>
<span className="text-sm font-bold">AI Assistant</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-[12px] text-white/50 hover:bg-white/5 transition-all" href="#">
<span className="material-symbols-outlined text-[22px]">calendar_today</span>
<span className="text-sm font-medium">Calendar</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-[12px] text-white/50 hover:bg-white/5 transition-all" href="#">
<span className="material-symbols-outlined text-[22px]">check_circle</span>
<span className="text-sm font-medium">Tasks</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-[12px] text-white/50 hover:bg-white/5 transition-all" href="#">
<span className="material-symbols-outlined text-[22px]">ecg_heart</span>
<span className="text-sm font-medium">Health</span>
</a>
<div className="mt-auto flex flex-col gap-1.5 pt-6 border-t border-white/5">
<a className="flex items-center gap-3 px-4 py-3 rounded-[12px] text-white/50 hover:bg-white/5 transition-all" href="#">
<span className="material-symbols-outlined text-[22px]">settings</span>
<span className="text-sm font-medium">Settings</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-[12px] text-red-400/70 hover:bg-red-400/5 transition-all" href="#">
<span className="material-symbols-outlined text-[22px]">logout</span>
<span className="text-sm font-medium">Logout</span>
</a>
</div>
</nav>
</aside>
<main className="flex-1 flex flex-col h-full bg-oled">
<header className="h-20 flex items-center justify-between px-10 border-b border-white/5">
<div className="flex items-center gap-4">
<h2 className="text-lg font-semibold text-white">AI Assistant</h2>
<div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
<div className="size-1.5 bg-emerald-500 rounded-full"></div>
<span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online</span>
</div>
</div>
<div className="flex items-center gap-4">
<div className="flex items-center gap-3">
<div className="text-right">
<p className="text-sm font-medium">Alex Rivera</p>
</div>
<div className="size-9 rounded-full bg-center bg-cover border border-white/10" data-alt="Portrait of the user Alex Rivera" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYYUvkY7TOGMJcrVcRTpRrjnlTEJaTOxZwmVmWzjcVXKdPE7ynZPVpoiHExV7makC1hgviAzEj6yEzKt08lr2E5MyyMD_FMr85rMyLslgIdsGwwrQpGG5HMET-cxAIu9ChCoDT3i3N_HnettjaZI3xxcFPqQNUnzVzB-KsTJsuT3nmW6VRZpeCo61rvBrxUNvwOxPm6zKf4V4w4vLxTJW_0qcf6a4Nlfh-42F6HdjML-7D7AbwlM_pnuV4PGI-aZjvaYKZScT_ffs')" }}></div>
</div>
</div>
</header>
<section className="flex-1 overflow-y-auto p-10 space-y-6 max-w-4xl mx-auto w-full">
<div className="flex flex-col items-start max-w-[80%]">
<div className="glass-panel px-5 py-4 rounded-[12px] rounded-tl-none">
<p className="text-[15px] leading-relaxed text-white/90">How can I help you optimize your life today?</p>
</div>
<span className="mt-2 ml-1 text-[10px] font-bold text-white/20 uppercase tracking-wider">System</span>
</div>
<div className="flex flex-col items-end max-w-[80%] ml-auto">
<div className="glass-primary px-5 py-4 rounded-[12px] rounded-tr-none">
<p className="text-[15px] leading-relaxed text-white">Show me my focus stats.</p>
</div>
<span className="mt-2 mr-1 text-[10px] font-bold text-primary uppercase tracking-wider">You</span>
</div>
</section>
<footer className="p-8">
<div className="max-w-3xl mx-auto">
<div className="flex items-center gap-3 px-2 py-2 glass-panel rounded-full border-white/10">
<button className="ml-4 flex items-center justify-center text-white/30 hover:text-white transition-colors">
<span className="material-symbols-outlined">add_circle</span>
</button>
<input className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 py-2 text-[15px]" placeholder="Message LifeOS AI..." type="text"/>
<button className="bg-primary size-10 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(48,140,232,0.4)] hover:brightness-110 transition-all">
<span className="material-symbols-outlined text-[20px]">send</span>
</button>
</div>
<p className="text-center text-[10px] text-white/20 mt-4 uppercase tracking-[0.2em]">Personal Assistant Mode â¢ Secure Session</p>
</div>
</footer>
</main>
</div>

    </div>
  );
};
