import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/shared/ui/Card';
import { Assignment } from '../types';
import { Badge } from '@/shared/ui/Badge';
import { cn } from '@/shared/lib/cn';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

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

const DroppableColumn = ({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div ref={setNodeRef} className={cn(className, isOver ? "ring-2 ring-primary ring-opacity-50" : "")}>
            {children}
        </div>
    );
};

const DraggableAssignmentCard = ({ assignment, className }: { assignment: Assignment, className?: string }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: assignment.id,
        data: { assignment }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.3 : 1,
        touchAction: 'none',
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="touch-none">
            <AssignmentCardContent assignment={assignment} className={className} />
        </div>
    );
};

const AssignmentCardContent = ({ assignment, className }: { assignment: Assignment, className?: string }) => (
    <Card className={cn("bg-zinc-950 border-zinc-800 hover:border-primary/50 cursor-grab active:cursor-grabbing transition-colors group select-none", className)}>
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
);


export function AssignmentKanban({ assignments, onStatusChange }: AssignmentKanbanProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [localAssignments, setLocalAssignments] = useState(assignments);

    useEffect(() => {
        setLocalAssignments(assignments);
    }, [assignments]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            // Find which column we droppped into
            const overId = over.id as string;
            // Check if overId is a column ID
            const isColumn = COLUMNS.some(col => col.id === overId);

            if (isColumn) {
                const newStatus = overId as Assignment['status'];
                const assignmentId = active.id as string;

                // Optimistic update
                setLocalAssignments(prev => prev.map(a =>
                    a.id === assignmentId ? { ...a, status: newStatus } : a
                ));

                if (onStatusChange) {
                    onStatusChange(assignmentId, newStatus);
                }
            }
        }
        setActiveId(null);
    };

    const getColumnAssignments = (status: Assignment['status']) => {
        return localAssignments.filter(a => a.status === status);
    };

    const activeAssignment = activeId ? localAssignments.find(a => a.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
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

                            <DroppableColumn
                                id={col.id}
                                className={cn("flex-1 p-2 rounded-xl space-y-3 min-h-[200px] transition-colors", col.color)}
                            >
                                {colAssignments.map(assignment => (
                                    <DraggableAssignmentCard key={assignment.id} assignment={assignment} />
                                ))}

                                {colAssignments.length === 0 && (
                                    <div className="h-24 border-2 border-dashed border-zinc-700/50 rounded-lg flex items-center justify-center text-zinc-600 text-sm font-mono">
                                        Arraste aqui
                                    </div>
                                )}
                            </DroppableColumn>
                        </div>
                    );
                })}
            </div>
            <DragOverlay>
                {activeAssignment ? <AssignmentCardContent assignment={activeAssignment} className="opacity-80 rotate-2 scale-105 cursor-grabbing" /> : null}
            </DragOverlay>
        </DndContext>
    );
}
