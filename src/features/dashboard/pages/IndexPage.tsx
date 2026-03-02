import React from 'react';
import { BentoGrid } from '@/shared/ui/BentoGrid';
import { BentoCard } from '@/shared/ui/BentoCard';
import { HabitWidget } from '@/features/dashboard/widgets/HabitWidget';
import { TaskWidget } from '@/features/dashboard/widgets/TaskWidget';
import { HealthWidget } from '@/features/dashboard/widgets/HealthWidget';
import { SynapseWidget } from '@/features/dashboard/widgets/SynapseWidget';
import { UniversityWidget } from '@/features/university/components/UniversityWidget';
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
                  <h3 className="text-2xl font-bold text-white mb-2">Finalizar Implementação GSD</h3>
                  <p className="text-sm text-zinc-400">Próximo Marco: Motor de Gamificação (Fase 8)</p>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Tempo Decorrido</p>
                    <p className="text-xl font-bold text-white">6.2h</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1">XP Diário</p>
                    <p className="text-xl font-bold text-primary">+1450</p>
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* ZONE 2: TODAY (Habits & Tasks) */}
            <HabitWidget />
            <TaskWidget />

            {/* ZONE 3: CONTEXT (Health & Insights) */}
            <HealthWidget />
            
            <UniversityWidget />
          </BentoGrid>
        </section>

        {/* SECTION 2: SYSTEM INSIGHTS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-zinc-500 mb-4">
            <Rocket size={14} className="text-purple-500" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">AI Intelligence Layer</h2>
          </div>
          
          <BentoGrid className="auto-rows-[180px]">
             <BentoCard className="col-span-1 md:col-span-2" title="Finance Overview">
                <div className="flex items-center justify-center h-full opacity-30">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Relatórios Consolidados</p>
                </div>
             </BentoCard>
             <SynapseWidget />
          </BentoGrid>
        </section>
      </div>
    </div>
  );
};
