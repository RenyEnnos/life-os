import React from 'react';
import { motion } from 'framer-motion';
import { useUserXP } from '@/features/gamification/hooks/useUserXP';
import { cn } from '@/shared/lib/cn';

interface UserLevelStatusProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UserLevelStatus: React.FC<UserLevelStatusProps> = ({ 
  className,
  size = 'md' 
}) => {
  const { userXP, isLoading } = useUserXP();

  if (isLoading || !userXP) {
    return (
      <div className={cn("animate-pulse bg-zinc-800/50 rounded-full", className)} 
           style={{ width: size === 'sm' ? 32 : size === 'md' ? 48 : 64, 
                    height: size === 'sm' ? 32 : size === 'md' ? 48 : 64 }} />
    );
  }

  const { level, current_xp } = userXP;
  const xp_to_next_level = (userXP as any).xp_to_next_level || (userXP as any).next_level_xp || 1000;
  
  // Calculate progress percentage
  // Assuming current_xp is XP in current level and xp_to_next_level is total needed for this level
  // Or if they are cumulative, we might need more info. 
  // But based on the names, let's assume current_xp / xp_to_next_level works for the current level progress.
  const progress = Math.min(100, Math.max(0, (current_xp / (xp_to_next_level || 1)) * 100));

  const dimensions = {
    sm: { outer: 36, inner: 32, stroke: 2 },
    md: { outer: 48, inner: 42, stroke: 3 },
    lg: { outer: 64, inner: 58, stroke: 4 },
  };

  const { outer, inner, stroke } = dimensions[size];
  const radius = (inner - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center group cursor-help", className)}>
      <svg width={outer} height={outer} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          className="text-zinc-800/50"
        />
        {/* Progress Circle */}
        <motion.circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"
          strokeLinecap="round"
        />
      </svg>
      
      {/* Level Badge */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-zinc-900 rounded-full flex items-center justify-center shadow-inner"
             style={{ width: inner - stroke * 2, height: inner - stroke * 2 }}>
          <span className="text-[10px] font-bold text-white tracking-tighter">
            L{level}
          </span>
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute left-full ml-4 bg-zinc-900/95 backdrop-blur-md border border-white/10 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[100] whitespace-nowrap shadow-2xl translate-x-[-10px] group-hover:translate-x-0">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center gap-4">
            <span className="text-xs font-medium text-zinc-400">Nível {level}</span>
            <span className="text-[10px] font-mono text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-32 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary"
            />
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            {current_xp} / {xp_to_next_level} XP
          </span>
        </div>
      </div>
    </div>
  );
};
