import React from 'react';

export const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-oled text-white font-display selection:bg-primary/30">
      
<div className="flex h-screen w-full">
{/* Side Navigation Bar */}
<aside className="w-64 flex flex-col glass-effect bg-glass-nav border-r border-white/5 p-6 justify-between">
<div className="flex flex-col gap-8">
<div className="flex gap-3 items-center">
<div className="bg-primary/20 p-2 rounded-lg">
<span className="material-symbols-outlined text-primary">auto_awesome_motion</span>
</div>
<div className="flex flex-col">
<h1 className="text-white text-base font-bold leading-none">LifeOS</h1>
<p className="text-[#9dabb8] text-xs font-normal">Productivity Suite</p>
</div>
</div>
<nav className="flex flex-col gap-2">
<div className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#9dabb8] hover:text-white transition-colors cursor-pointer">
<span className="material-symbols-outlined">dashboard</span>
<p className="text-sm font-medium">Dashboard</p>
</div>
<div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-primary/10 text-white cursor-pointer">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>view_kanban</span>
<p className="text-sm font-medium">Projects</p>
</div>
<div className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#9dabb8] hover:text-white transition-colors cursor-pointer">
<span className="material-symbols-outlined">check_box</span>
<p className="text-sm font-medium">Tasks</p>
</div>
<div className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#9dabb8] hover:text-white transition-colors cursor-pointer">
<span className="material-symbols-outlined">calendar_today</span>
<p className="text-sm font-medium">Calendar</p>
</div>
<div className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#9dabb8] hover:text-white transition-colors cursor-pointer">
<span className="material-symbols-outlined">settings</span>
<p className="text-sm font-medium">Settings</p>
</div>
</nav>
</div>
<button className="flex min-w-full items-center justify-center rounded-xl h-12 bg-primary text-white text-sm font-bold tracking-[0.015em] hover:bg-primary/90 transition-all">
<span className="material-symbols-outlined mr-2">add</span>
<span className="truncate">New Project</span>
</button>
</aside>
{/* Main Content Area */}
<main className="flex-1 flex flex-col overflow-hidden">
{/* Header Section */}
<header className="p-8 pb-4">
<div className="flex justify-between items-center mb-6">
<h2 className="text-4xl font-black tracking-tight">Projects</h2>
<div className="flex gap-3">
<button className="flex items-center justify-center rounded-xl h-10 px-4 bg-[#293038] text-white text-sm font-bold hover:bg-[#343d47] transition-colors">
<span className="material-symbols-outlined mr-2 text-sm">filter_list</span>
                            Filter
                        </button>
<button className="flex items-center justify-center rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all">
<span className="material-symbols-outlined mr-2 text-sm">add_column_left</span>
                            Add Column
                        </button>
</div>
</div>
{/* Toggles and Segmented Controls */}
<div className="flex justify-between items-center border-b border-white/5 pb-4">
<div className="flex gap-8">
<a className="flex flex-col items-center justify-center border-b-[3px] border-primary text-white gap-1 pb-3 px-2" href="#">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>view_column</span>
<p className="text-sm font-bold tracking-tight">Board</p>
</a>
<a className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-[#9dabb8] hover:text-white gap-1 pb-3 px-2" href="#">
<span className="material-symbols-outlined">format_list_bulleted</span>
<p className="text-sm font-bold tracking-tight">List</p>
</a>
</div>
<div className="flex h-10 w-48 items-center justify-center rounded-xl bg-[#18181b] p-1 border border-white/5">
<label className="flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 bg-[#293038] text-white text-xs font-bold">
<span>Active</span>
<input checked={true} className="hidden" name="status" type="radio" value="Active"/>
</label>
<label className="flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 text-[#9dabb8] text-xs font-bold hover:text-white">
<span>Archived</span>
<input className="hidden" name="status" type="radio" value="Archived"/>
</label>
</div>
</div>
</header>
{/* Kanban Board */}
<section className="flex-1 flex gap-6 p-8 pt-2 overflow-x-auto custom-scrollbar">
{/* Column: To Do */}
<div className="min-w-[320px] flex flex-col gap-4">
<div className="flex items-center justify-between px-1">
<h3 className="text-sm font-bold uppercase tracking-widest text-[#9dabb8]">To Do (2)</h3>
<span className="material-symbols-outlined text-[#9dabb8] text-lg">more_horiz</span>
</div>
<div className="flex flex-col gap-4">
{/* Card 1 */}
<div className="p-4 rounded-xl glass-effect bg-glass-card border border-white/5 hover:border-white/20 cursor-pointer group">
<div className="flex justify-between items-start mb-3">
<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 uppercase">Private</span>
<span className="material-symbols-outlined text-transparent group-hover:text-white/40 text-sm transition-colors">edit</span>
</div>
<h4 className="text-white font-semibold mb-2">Home Renovation</h4>
<div className="flex items-center gap-2 text-[#9dabb8]">
<span className="material-symbols-outlined text-xs">calendar_month</span>
<span className="text-[11px]">Due Oct 12</span>
</div>
</div>
{/* Card 2 */}
<div className="p-4 rounded-xl glass-effect bg-glass-card border border-white/5 hover:border-white/20 cursor-pointer group">
<div className="flex justify-between items-start mb-3">
<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 uppercase">Leisure</span>
<span className="material-symbols-outlined text-transparent group-hover:text-white/40 text-sm transition-colors">edit</span>
</div>
<h4 className="text-white font-semibold mb-2">Travel Planning</h4>
<div className="flex items-center gap-2 text-[#9dabb8]">
<span className="material-symbols-outlined text-xs">map</span>
<span className="text-[11px]">Japan Trip 2024</span>
</div>
</div>
</div>
</div>
{/* Column: In Progress */}
<div className="min-w-[320px] flex flex-col gap-4">
<div className="flex items-center justify-between px-1">
<h3 className="text-sm font-bold uppercase tracking-widest text-[#9dabb8]">In Progress (2)</h3>
<span className="material-symbols-outlined text-[#9dabb8] text-lg">more_horiz</span>
</div>
<div className="flex flex-col gap-4">
{/* Card 3 (Selected) */}
<div className="p-4 rounded-xl glass-effect bg-glass-card border-2 border-primary cursor-pointer shadow-[0_0_20px_rgba(48,140,232,0.15)]">
<div className="flex justify-between items-start mb-3">
<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase">Code</span>
<div className="flex -space-x-2">
<div className="w-5 h-5 rounded-full border border-black bg-gray-600" data-alt="Team member profile picture 1"></div>
<div className="w-5 h-5 rounded-full border border-black bg-gray-500" data-alt="Team member profile picture 2"></div>
</div>
</div>
<h4 className="text-white font-semibold mb-3">LifeOS 2.5 Dev</h4>
<div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
<div className="h-full bg-primary" style={{ width: "45%" }}></div>
</div>
<div className="flex justify-between text-[10px] font-bold text-[#9dabb8]">
<span>45% Complete</span>
<span>12/24 Tasks</span>
</div>
</div>
{/* Card 4 */}
<div className="p-4 rounded-xl glass-effect bg-glass-card border border-white/5 hover:border-white/20 cursor-pointer group">
<div className="flex justify-between items-start mb-3">
<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 uppercase">Uni</span>
<span className="material-symbols-outlined text-transparent group-hover:text-white/40 text-sm transition-colors">edit</span>
</div>
<h4 className="text-white font-semibold mb-2">Thesis Research</h4>
<div className="flex items-center gap-2 text-[#9dabb8]">
<span className="material-symbols-outlined text-xs">book</span>
<span className="text-[11px]">8 Sources Cited</span>
</div>
</div>
</div>
</div>
{/* Column: Done */}
<div className="min-w-[320px] flex flex-col gap-4">
<div className="flex items-center justify-between px-1">
<h3 className="text-sm font-bold uppercase tracking-widest text-[#9dabb8]">Done (1)</h3>
<span className="material-symbols-outlined text-[#9dabb8] text-lg">more_horiz</span>
</div>
<div className="flex flex-col gap-4">
{/* Card 5 */}
<div className="p-4 rounded-xl glass-effect bg-glass-card border border-white/5 hover:border-white/20 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
<div className="flex justify-between items-start mb-3">
<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 uppercase">Finance</span>
<span className="material-symbols-outlined text-green-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
<h4 className="text-white font-semibold mb-2 line-through decoration-white/20">Q3 Finance Review</h4>
<div className="flex items-center gap-2 text-[#9dabb8]">
<span className="material-symbols-outlined text-xs">schedule</span>
<span className="text-[11px]">Completed yesterday</span>
</div>
</div>
</div>
</div>
</section>
</main>
{/* Right Metadata Panel */}
<aside className="w-80 flex flex-col glass-effect bg-glass-nav border-l border-white/5 p-8 overflow-y-auto custom-scrollbar">
<div className="mb-8">
<div className="flex items-center justify-between mb-2">
<span className="text-xs font-bold text-primary uppercase">Active Project</span>
<span className="material-symbols-outlined text-[#9dabb8] cursor-pointer">close</span>
</div>
<h3 className="text-2xl font-black mb-2">LifeOS 2.5 Dev</h3>
<p className="text-[#9dabb8] text-sm leading-relaxed">System architecture redesign and implementation of glass-morphism components.</p>
</div>
<div className="mb-8">
<h4 className="text-sm font-bold text-white mb-4 flex items-center">
<span className="material-symbols-outlined text-sm mr-2">flag</span> Milestones
                </h4>
<div className="space-y-4">
<div className="flex items-start gap-3 group">
<div className="mt-1 w-4 h-4 rounded border-2 border-primary flex items-center justify-center bg-primary text-white">
<span className="material-symbols-outlined text-[10px] font-black">check</span>
</div>
<div className="flex flex-col">
<span className="text-sm font-medium text-white/90">Component Library</span>
<span className="text-[11px] text-[#9dabb8]">Completed Sep 15</span>
</div>
</div>
<div className="flex items-start gap-3 group">
<div className="mt-1 w-4 h-4 rounded border-2 border-primary bg-primary/20"></div>
<div className="flex flex-col">
<span className="text-sm font-medium text-white">Database Migration</span>
<span className="text-[11px] text-primary">In Progress</span>
</div>
</div>
<div className="flex items-start gap-3 group">
<div className="mt-1 w-4 h-4 rounded border-2 border-white/20"></div>
<div className="flex flex-col">
<span className="text-sm font-medium text-white/40">User Beta Testing</span>
<span className="text-[11px] text-[#9dabb8]">Starts Oct 05</span>
</div>
</div>
</div>
</div>
<div className="mb-8">
<h4 className="text-sm font-bold text-white mb-4 flex items-center">
<span className="material-symbols-outlined text-sm mr-2">group</span> Team Members
                </h4>
<div className="space-y-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="size-8 rounded-full bg-center bg-cover border border-white/10" data-alt="Alex Rivera profile picture" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAzlSnkEnBKkkytG14Pe8s6VyKNkrdPQN4n6a5oH-leOhvO3sRG-lAH8CSYiiLZYOuvZzBUtAnk_CNHSSoCieUBRHTuDnYgfaTRRK1teZh9vR3KSSbUXFTzToVwWKO0jiHYQvlP72iSavk1hMjeqPfJmehk6J7rGatIVq5kyj8JEPyGYM0B3aKC03JVB-iDSePaheH6uf6GQtpSIVbvtrKQHVfXviofOqCIsHLx9f_0OsnVXu78UdTzgZC7oKAdBnwSM6_CeEln6e4")' }}></div>
<div className="flex flex-col">
<span className="text-xs font-bold">Alex Rivera</span>
<span className="text-[10px] text-[#9dabb8]">Lead Designer</span>
</div>
</div>
<span className="material-symbols-outlined text-[#9dabb8] text-sm">chat_bubble</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="size-8 rounded-full bg-center bg-cover border border-white/10" data-alt="Sarah Chen profile picture" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBIlnDxo_5z-y-dRlxJZBZVeFRJ8IuJzST73KV8mpAtQyYPg-e0CZBr59BntjKxC6BzW_fKbZajyU_Ea92s1CQ_mD13JeJf0raXRemeqexzrMxFvKRBOU0Jxvj-bbPDoht8X--MIIbOlqBnWoZiir5-4QMrBbpAQ7Q5HFMZ5pmIRYlC3AGif588fPY8qdTaak_dNlvuhtxtwjcEzZS-bUVxA_WXWB-c_4vMfcZDrebhuwX1KZh2b3HQIBX8tg4mVGy_cG6z9_2rbUs")' }}></div>
<div className="flex flex-col">
<span className="text-xs font-bold">Sarah Chen</span>
<span className="text-[10px] text-[#9dabb8]">Backend Dev</span>
</div>
</div>
<span className="material-symbols-outlined text-[#9dabb8] text-sm">chat_bubble</span>
</div>
</div>
<button className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 text-[11px] font-bold hover:bg-white/5 transition-colors">
<span className="material-symbols-outlined text-sm">person_add</span>
                    Manage Team
                </button>
</div>
<div className="mt-auto p-4 rounded-xl bg-primary/10 border border-primary/20">
<div className="flex items-center gap-2 mb-2">
<span className="material-symbols-outlined text-primary text-sm">info</span>
<span className="text-[11px] font-bold text-primary uppercase">Pro Tip</span>
</div>
<p className="text-[11px] text-white/70 leading-relaxed">Press <kbd className="px-1 rounded bg-white/10 text-white">Cmd</kbd> + <kbd className="px-1 rounded bg-white/10 text-white">K</kbd> to quickly switch between boards and tasks.</p>
</div>
</aside>
</div>

    </div>
  );
};
