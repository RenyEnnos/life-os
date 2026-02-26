import React from 'react';
import { BentoGrid } from '@/shared/ui/BentoGrid';
import { BentoCard } from '@/shared/ui/BentoCard';
import { HabitsWidget } from '@/features/habits/components/HabitsWidget';
import { TasksWidget } from '@/features/tasks/components/TasksWidget';
import { HealthWidget } from '@/features/health/components/HealthWidget';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Rocket, Target, Zap, Clock } from 'lucide-react';

export const IndexPage = () => {
  const { profile } = useAuth();
  const userName = profile?.nickname || profile?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white">
            WELCOME BACK, <span className="text-primary">{userName.toUpperCase()}</span>
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-2">
            System status: <span className="text-green-500">All systems operational</span>
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-tight">
            Last Sync: Just now
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {/* SECTION 1: NOW & TODAY */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-zinc-500 mb-4">
            <Zap size={14} className="text-primary" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">Live Executive Dashboard</h2>
          </div>
          
          <BentoGrid>
            {/* ZONE 1: NOW (Urgent Focus) */}
            <BentoCard 
              className="col-span-1 md:col-span-2 row-span-2 bg-primary/5 border-primary/20"
              title="Current Focus"
              icon={Target}
            >
              <div className="flex flex-col justify-between h-full py-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Finish Phase 2 Implementation</h3>
                  <p className="text-sm text-zinc-400">Next milestone: Habits System (Phase 3)</p>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Time Elapsed</p>
                    <p className="text-xl font-bold text-white">4.2h</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Daily XP</p>
                    <p className="text-xl font-bold text-primary">+850</p>
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* ZONE 2: TODAY (Habits & Tasks) */}
            <HabitsWidget />
            <TasksWidget />

            {/* ZONE 3: CONTEXT (Health & Insights) */}
            <HealthWidget />
            
            <BentoCard 
              className="col-span-1 row-span-1" 
              title="Next Event" 
              icon={Clock}
            >
              <div className="flex items-center justify-center h-full">
                <p className="text-xs text-zinc-500 font-mono italic">No upcoming events</p>
              </div>
            </BentoCard>
          </BentoGrid>
        </section>

        {/* SECTION 2: SYSTEM INSIGHTS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-zinc-500 mb-4">
            <Rocket size={14} className="text-purple-500" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">AI Intelligence Layer</h2>
          </div>
          
          <BentoGrid className="auto-rows-[120px]">
             <BentoCard className="col-span-1 md:col-span-2" title="Finance Overview">
                <div className="flex items-center justify-center h-full opacity-30">
                  <p className="text-[10px] font-mono uppercase tracking-widest">Connect Wallet (Phase 5)</p>
                </div>
             </BentoCard>
             <BentoCard className="col-span-1 md:col-span-2" title="AI Recommendations">
                <div className="flex items-center justify-center h-full opacity-30">
                  <p className="text-[10px] font-mono uppercase tracking-widest">Awaiting Data (Phase 7)</p>
                </div>
             </BentoCard>
          </BentoGrid>
        </section>
      </div>
    </div>
  );
};
