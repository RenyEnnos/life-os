import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Assignment } from '../types';
import { Badge } from '@/shared/ui/Badge';
import { cn } from '@/shared/lib/cn';
import { format } from 'date-fns';

interface AssignmentKanbanProps {
    assignments: Assignment[];
    onStatusChange?: (id: string, newStatus: Assignment['status']) => void;
}

const COLUMNS = [
    { id: 'todo', title: 'To Do', color: 'bg-zinc-800' },
    { id: 'submitted', title: 'Submitted', color: 'bg-blue-900/20' },
    { id: 'graded', title: 'Graded', color: 'bg-green-900/20' }
] as const;

export function AssignmentKanban({ assignments, onStatusChange }: AssignmentKanbanProps) {

    const getColumnAssignments = (status: Assignment['status']) => {
        return assignments.filter(a => a.status === status);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-x-auto pb-4">
            {COLUMNS.map(col => (
                <div key={col.id} className="flex flex-col gap-4 min-w-[300px]">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                        <h3 className="font-bold text-zinc-300">{col.title}</h3>
                        <Badge tone="outline" className="bg-zinc-800 border-zinc-700">
                            {getColumnAssignments(col.id as any).length}
                        </Badge>
                    </div>

                    <div className={cn("flex-1 p-2 rounded-xl space-y-3 min-h-[200px]", col.color)}>
                        {getColumnAssignments(col.id as any).map(assignment => (
                            <Card key={assignment.id} className="bg-zinc-900 border-zinc-800 hover:border-primary/50 cursor-grab active:cursor-grabbing transition-colors">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-medium text-sm text-zinc-200 line-clamp-2">
                                            {assignment.title}
                                        </h4>
                                        {assignment.grade && (
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
                                            "px-2 py-0.5 rounded-full bg-zinc-800",
                                            assignment.type === 'exam' && "text-red-400",
                                            assignment.type === 'project' && "text-purple-400"
                                        )}>
                                            {assignment.type}
                                        </span>
                                        <span>{format(new Date(assignment.due_date), 'MMM d')}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {getColumnAssignments(col.id as any).length === 0 && (
                            <div className="h-24 border-2 border-dashed border-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 text-sm">
                                Empty
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
