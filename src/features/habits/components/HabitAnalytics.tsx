import React from 'react';
import { calculateStreak, calculateCompletionRate } from '../logic/streak';
import { Habit, HabitLog } from '../types';
import { Zap, Target, TrendingUp } from 'lucide-react';

interface HabitAnalyticsProps {
  habit: Habit;
  logs: HabitLog[];
}

export const HabitAnalytics: React.FC<HabitAnalyticsProps> = ({ habit, logs }) => {
  const currentStreak = calculateStreak(logs, habit.id);
  const completionRate30 = calculateCompletionRate(logs, habit.id, 30);
  const totalCompletions = logs.filter(l => l.habit_id === habit.id && l.value > 0).length;

  return (
    <div className="grid grid-cols-3 gap-4 py-4">
      <div className="flex flex-col items-center p-3 rounded-2xl bg-primary/5 border border-primary/10">
        <Zap className="w-4 h-4 text-primary mb-1" />
        <span className="text-xl font-bold text-white">{currentStreak}</span>
        <span className="text-[10px] text-zinc-500 uppercase tracking-tight">Streak</span>
      </div>
      
      <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5">
        <Target className="w-4 h-4 text-zinc-400 mb-1" />
        <span className="text-xl font-bold text-white">{completionRate30}%</span>
        <span className="text-[10px] text-zinc-500 uppercase tracking-tight">30d Rate</span>
      </div>

      <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5">
        <TrendingUp className="w-4 h-4 text-zinc-400 mb-1" />
        <span className="text-xl font-bold text-white">{totalCompletions}</span>
        <span className="text-[10px] text-zinc-500 uppercase tracking-tight">Total</span>
      </div>
    </div>
  );
};
