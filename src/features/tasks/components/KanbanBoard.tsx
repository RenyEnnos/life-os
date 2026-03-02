import React, { useMemo, useState } from 'react';
import { 
    DndContext, 
    DragOverlay, 
    closestCorners, 
    KeyboardSensor, 
    PointerSensor, 
    useSensor, 
    useSensors, 
    DragStartEvent, 
    DragEndEvent, 
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useTasks } from '../hooks/useTasks';
import { KanbanColumn } from './KanbanColumn';
import { Task, TaskStatus } from '@/shared/types';
import { Loader } from '@/shared/ui/Loader';
import { useToast } from '@/shared/ui/useToast';
import { TaskItem } from './TaskItem';

const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

export function KanbanBoard() {
    const { tasks, isLoading, updateTask, deleteTask } = useTasks();
    const { showToast } = useToast();
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10, // Increased distance for better stability
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const tasksByStatus = useMemo(() => {
        const result: Record<TaskStatus, Task[]> = {
            'todo': [],
            'in-progress': [],
            'done': []
        };

        // Filter out tasks without IDs to prevent dnd-kit hangs
        const validTasks = (tasks || []).filter(t => !!t?.id);

        validTasks.forEach((task) => {
            const status = task.status || (task.completed ? 'done' : 'todo');
            if (result[status]) {
                result[status].push(task);
            } else {
                result['todo'].push(task);
            }
        });

        return result;
    }, [tasks]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = (tasks || []).find(t => t.id === active.id);
        if (task) setActiveTask(task);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const taskId = active.id as string;
        const overId = over.id as string;

        // Find the status of the column we dropped into
        let newStatus: TaskStatus | null = null;
        if (['todo', 'in-progress', 'done'].includes(overId)) {
            newStatus = overId as TaskStatus;
        } else {
            // Dropped over another task, find its column
            const overTask = (tasks || []).find(t => t.id === overId);
            if (overTask) {
                newStatus = (overTask.status || (overTask.completed ? 'done' : 'todo')) as TaskStatus;
            }
        }

        const task = (tasks || []).find(t => t.id === taskId);
        const currentStatus = (task?.status || (task?.completed ? 'done' : 'todo')) as TaskStatus;

        if (newStatus && newStatus !== currentStatus) {
            try {
                await updateTask.mutateAsync({
                    id: taskId,
                    updates: {
                        status: newStatus,
                        completed: newStatus === 'done'
                    }
                });
                showToast(`Tarefa movida para ${newStatus}.`, 'success');
            } catch (error) {
                console.error(error);
                showToast('Erro ao mover tarefa.', 'error');
            }
        }
    };

    const handleToggle = async (task: Task) => {
        try {
            await updateTask.mutateAsync({
                id: task.id,
                updates: {
                    completed: !task.completed,
                    status: !task.completed ? 'done' : 'todo'
                }
            });
            showToast(task.completed ? 'Tarefa reaberta.' : 'Tarefa concluída.', 'success');
        } catch (error) {
            console.error(error);
            showToast('Erro ao atualizar tarefa.', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja realmente excluir esta tarefa?')) return;
        try {
            await deleteTask.mutateAsync(id);
            showToast('Tarefa removida.', 'info');
        } catch (error) {
            console.error(error);
            showToast('Erro ao remover tarefa.', 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader text="Carregando quadro..." />
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col lg:flex-row gap-6 w-full overflow-x-auto pb-4 custom-scrollbar min-h-[600px] items-start">
                <KanbanColumn
                    title="A Fazer"
                    status="todo"
                    tasks={tasksByStatus['todo']}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                />
                <KanbanColumn
                    title="Em Progresso"
                    status="in-progress"
                    tasks={tasksByStatus['in-progress']}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                />
                <KanbanColumn
                    title="Concluído"
                    status="done"
                    tasks={tasksByStatus['done']}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                />
            </div>
            
            <DragOverlay dropAnimation={dropAnimation}>
                {activeTask ? (
                    <div className="w-[300px] cursor-grabbing rotate-3 scale-105 transition-transform">
                        <TaskItem
                            task={activeTask}
                            onToggle={() => {}}
                            onDelete={() => {}}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
