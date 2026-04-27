import { useUniversity } from '../hooks/useUniversity';
import { BentoCard } from '@/shared/ui/BentoCard';
import { GraduationCap, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export function UniversityWidget() {
    const { assignments, isLoading } = useUniversity();
    
    // Get top 3 upcoming incomplete assignments
    const upcoming = assignments
        .filter(a => !a.completed && a.due_date)
        .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
        .slice(0, 3);

    return (
        <BentoCard 
            title="Próximos Prazos" 
            icon={GraduationCap}
            className="col-span-1 row-span-1"
        >
            <div className="h-full flex flex-col py-2">
                {isLoading ? (
                    <div className="flex-1 flex flex-col gap-2 animate-pulse">
                        {[1, 2].map(i => <div key={i} className="h-10 bg-zinc-900 rounded-lg" />)}
                    </div>
                ) : !upcoming.length ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                        <Clock size={24} className="mb-2" />
                        <p className="text-[10px] font-mono uppercase tracking-widest">Sem entregas pendentes</p>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col gap-3">
                        {upcoming.map(assignment => {
                            const due = new Date(assignment.due_date!);
                            const isUrgent = (due.getTime() - new Date().getTime()) < (24 * 60 * 60 * 1000);
                            
                            return (
                                <div key={assignment.id} className="flex items-center gap-3 group">
                                    <div className={cn(
                                        "w-1 h-8 rounded-full shrink-0",
                                        isUrgent ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" : "bg-primary/40"
                                    )} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-bold text-white truncate group-hover:text-primary transition-colors">
                                            {assignment.title}
                                        </p>
                                        <p className={cn(
                                            "text-[9px] font-mono uppercase tracking-tighter",
                                            isUrgent ? "text-red-400" : "text-zinc-500"
                                        )}>
                                            {isUrgent ? 'URGENTE: ' : ''}
                                            {due.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                        </p>
                                    </div>
                                    {isUrgent && <AlertCircle size={10} className="text-red-500 animate-pulse" />}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </BentoCard>
    );
}
