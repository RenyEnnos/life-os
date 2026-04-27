import { useUniversity } from '../hooks/useUniversity';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';

export const AssignmentList = () => {
    const { assignments, courses, toggleAssignment, isLoading } = useUniversity();

    const getCourseName = (courseId: string) => {
        return courses.find(c => c.id === courseId)?.name || 'Matéria Desconhecida';
    };

    const getPriorityInfo = (dueDate: string | undefined) => {
        if (!dueDate) return { label: 'Sem data', color: 'text-zinc-500' };
        
        const now = new Date();
        const due = new Date(dueDate);
        const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { label: 'Atrasado', color: 'text-red-500' };
        if (diffDays === 0) return { label: 'Entrega Hoje', color: 'text-orange-500' };
        if (diffDays === 1) return { label: 'Entrega Amanhã', color: 'text-yellow-500' };
        if (diffDays <= 3) return { label: `Em ${diffDays} dias`, color: 'text-primary' };
        
        return { label: due.toLocaleDateString('pt-BR'), color: 'text-zinc-500' };
    };

    if (isLoading) {
        return <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-zinc-900/50 rounded-xl" />)}
        </div>;
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Clock className="text-primary" size={20} />
                    <h3 className="text-xl font-bold text-white tracking-tight">Próximas Entregas</h3>
                </div>
                <span className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
                    Pendentes ({assignments.filter(a => !a.completed).length})
                </span>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 shadow-xl">
                {!assignments?.length ? (
                    <div className="p-12 text-center flex flex-col items-center gap-3">
                        <CheckCircle2 className="text-zinc-800" size={48} />
                        <p className="text-zinc-500 font-medium">Tudo em dia! Nenhuma tarefa pendente.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {assignments.map((assignment) => {
                            const priority = getPriorityInfo(assignment.due_date);
                            return (
                                <div 
                                    key={assignment.id} 
                                    className={cn(
                                        "flex items-center justify-between p-4 transition-colors group",
                                        assignment.completed ? "bg-zinc-950/20" : "hover:bg-white/[0.02]"
                                    )}
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <button 
                                            onClick={() => toggleAssignment(assignment.id)}
                                            className={cn(
                                                "transition-colors rounded-full p-1",
                                                assignment.completed ? "text-primary bg-primary/10" : "text-zinc-700 hover:text-primary/50"
                                            )}
                                        >
                                            {assignment.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                        </button>
                                        <div className="flex-1">
                                            <h5 className={cn(
                                                "font-medium transition-all",
                                                assignment.completed ? "text-zinc-600 line-through" : "text-white"
                                            )}>
                                                {assignment.title}
                                            </h5>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider truncate max-w-[150px]">
                                                    {getCourseName(assignment.course_id)}
                                                </span>
                                                <span className="text-zinc-800 text-[10px]">•</span>
                                                <span className={cn("text-[10px] font-bold uppercase tracking-widest", priority.color)}>
                                                    {priority.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {!assignment.completed && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => toggleAssignment(assignment.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold tracking-tighter hover:bg-primary/10 hover:text-primary uppercase"
                                        >
                                            Marcar Feito
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};
