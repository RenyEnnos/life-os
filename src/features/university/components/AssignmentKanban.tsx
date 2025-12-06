import React from 'react';
import { Card, CardContent } from '@/shared/ui/Card';
import { Assignment } from '../types';
import { Badge } from '@/shared/ui/Badge';
import { cn } from '@/shared/lib/cn';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AssignmentKanbanProps {
    assignments: Assignment[];
    onStatusChange?: (id: string, newStatus: Assignment['status']) => void;
}

const COLUMNS = [
    { id: 'todo', title: 'A Fazer', color: 'bg-zinc-800' },
    { id: 'submitted', title: 'Entregue', color: 'bg-blue-900/10' },
    { id: 'graded', title: 'Avaliado', color: 'bg-green-900/10' }
] as const;

const TYPE_LABELS: Record<string, string> = {
    exam: 'Prova',
    homework: 'Dever',
    paper: 'Artigo',
    project: 'Projeto'
};

export function AssignmentKanban({ assignments, onStatusChange }: AssignmentKanbanProps) {

    const getColumnAssignments = (status: Assignment['status']) => {
        return assignments.filter(a => a.status === status);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-x-auto pb-4">
            {COLUMNS.map(col => {
                const colAssignments = getColumnAssignments(col.id as any);
                return (
                    <div key={col.id} className="flex flex-col gap-4 min-w-[300px]">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                            <h3 className="font-bold text-zinc-300 font-mono uppercase">{col.title}</h3>
                            <Badge tone="outline" className="bg-zinc-800 border-zinc-700">
                                {colAssignments.length}
                            </Badge>
                        </div>

                        <div className={cn("flex-1 p-2 rounded-xl space-y-3 min-h-[200px]", col.color)}>
                            {colAssignments.map(assignment => (
                                <Card key={assignment.id} className="bg-zinc-950 border-zinc-800 hover:border-primary/50 cursor-grab active:cursor-grabbing transition-colors group">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-medium text-sm text-zinc-200 line-clamp-2 group-hover:text-primary transition-colors">
                                                {assignment.title}
                                            </h4>
                                            {assignment.grade !== undefined && (
                                                <span className={cn(
                                                    "text-xs font-bold px-1.5 py-0.5 rounded",
                                                    assignment.grade >= 7 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                                                )}>
                                                    {assignment.grade}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center text-xs text-zinc-500">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700",
                                                assignment.type === 'exam' && "text-red-400 border-red-900/30",
                                                assignment.type === 'project' && "text-purple-400 border-purple-900/30"
                                            )}>
                                                {TYPE_LABELS[assignment.type] || assignment.type}
                                            </span>
                                            <span>{format(new Date(assignment.due_date), "d 'de' MMM", { locale: ptBR })}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {colAssignments.length === 0 && (
                                <div className="h-24 border-2 border-dashed border-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 text-sm font-mono">
                                    Vazio
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
