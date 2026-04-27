import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { HabitCard } from '../components/HabitCard';
import { HabitContributionGraph } from '../components/HabitContributionGraph';
import { CreateHabitDialog } from '../components/CreateHabitDialog';
import { Loader } from '@/shared/ui/Loader';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Trophy, Target, Activity } from 'lucide-react';

export const HabitsPage = () => {
  const { habits, logs, isLoading, logHabit, createHabit } = useHabits();
  const { profile } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[400px]">
        <Loader text="CALIBRATING HABITS..." />
      </div>
    );
  }

  const userLevel = profile?.level || 1;
  const userXP = profile?.current_xp || profile?.points || 0;
  const xpForNextLevel = userLevel * 1000;
  const xpPercentage = Math.min((userXP / xpForNextLevel) * 100, 100);

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-black tracking-tight text-white uppercase">Habit Tracker</h2>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
            Consistency is the key to mastery.
          </p>
        </div>
        <div className="flex flex-col gap-3 min-w-[320px]">
          <div className="flex justify-between items-end">
            <span className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Trophy size={12} /> Level {userLevel} Strategist
            </span>
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">{userXP} / {xpForNextLevel} XP</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-primary shadow-[0_0_10px_rgba(48,140,232,0.5)] rounded-full transition-all duration-1000" 
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-500">
            <Target size={14} className="text-primary" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">Active Protocols</h2>
          </div>
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-bold uppercase hover:bg-primary/20 transition-all"
          >
            New Habit
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map(habit => {
            const today = new Date().toISOString().split('T')[0];
            const logToday = (logs as any[])?.find(l => l.habit_id === habit.id && l.date === today);
            const isCompleted = logToday ? (logToday.value as number) >= (habit.target_value || 1) : false;
            
            return (
              <HabitCard 
                key={habit.id} 
                habit={habit} 
                isCompleted={isCompleted}
                streak={(habit as any).streak_current || 0}
                currentValue={(logToday?.value as number) || 0}
                onToggle={() => logHabit.mutate({ 
                  id: habit.id, 
                  value: isCompleted ? 0 : (habit.target_value || 1),
                  date: today 
                })}
              />
            );
          })}
          {habits.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">No protocols established</p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-500">
          <Activity size={14} className="text-sky-400" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">Performance History</h2>
        </div>
        <HabitContributionGraph logs={(logs as any) || []} />
      </section>

      <CreateHabitDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        onSubmit={(data) => {
          createHabit.mutate(data);
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
};
