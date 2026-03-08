import React from 'react';
import { Target, AlertTriangle } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { BudgetStatus } from '../hooks/useBudgets';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface BudgetProgressCardProps {
  budgets: BudgetStatus[];
  isLoading?: boolean;
}

export function BudgetProgressCard({ budgets, isLoading }: BudgetProgressCardProps) {
  if (isLoading) {
    return (
      <BentoCard title="ORÇAMENTOS" icon={Target} className="min-h-[200px]">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      </BentoCard>
    );
  }

  if (budgets.length === 0) {
    return (
      <BentoCard title="ORÇAMENTOS" icon={Target} className="min-h-[200px]">
        <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2">
          <Target size={32} className="opacity-20" />
          <p className="text-sm">Nenhum orçamento definido</p>
        </div>
      </BentoCard>
    );
  }

  return (
    <BentoCard title="ORÇAMENTOS" icon={Target} className="min-h-[200px]">
      <div className="space-y-6 mt-2">
        {(Array.isArray(budgets) ? budgets : []).map((budget) => {
          const percent = Math.min(100, (budget.spent / budget.limit) * 100);
          const isWarning = budget.status === 'warning';
          const isExceeded = budget.status === 'exceeded';

          return (
            <div key={budget.categoryId} className="space-y-2">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                    {budget.categoryName}
                    {isExceeded && <AlertTriangle size={14} className="text-red-500" />}
                  </span>
                  <span className="text-xs text-zinc-500">
                    Restam R$ {budget.remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className={clsx(
                    "text-sm font-mono font-bold",
                    isExceeded ? "text-red-500" : isWarning ? "text-yellow-500" : "text-green-500"
                  )}>
                    {percent.toFixed(0)}%
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase">
                    R$ {budget.spent.toLocaleString('pt-BR')} / R$ {budget.limit.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={clsx(
                    "absolute top-0 left-0 h-full rounded-full",
                    isExceeded ? "bg-gradient-to-r from-red-600 to-red-400" : 
                    isWarning ? "bg-gradient-to-r from-yellow-600 to-yellow-400" : 
                    "bg-gradient-to-r from-green-600 to-green-400"
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </BentoCard>
  );
}
