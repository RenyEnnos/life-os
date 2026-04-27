import { useMemo, useState } from 'react';
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
import { generateKeyBetween } from 'fractional-indexing';
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

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find active task
        const activeTask = (tasks || []).find(t => t.id === activeId);
        if (!activeTask) return;

        // Determine target status
        let newStatus: TaskStatus;
        if (['todo', 'in-progress', 'done'].includes(overId)) {
            newStatus = overId as TaskStatus;
        } else {
            const overTask = (tasks || []).find(t => t.id === overId);
            newStatus = (overTask?.status || (overTask?.completed ? 'done' : 'todo')) as TaskStatus;
        }

        // Get and sort tasks in target column
        const columnTasks = (tasks || [])
            .filter(t => (t.status || (t.completed ? 'done' : 'todo')) === newStatus)
            .sort((a, b) => (a.position || '').localeCompare(b.position || ''));

        const currentStatus = (activeTask.status || (activeTask.completed ? 'done' : 'todo')) as TaskStatus;
        
        // If same position, do nothing
        if (currentStatus === newStatus && activeId === overId) return;

        let newPosition: string;

        if (activeId !== overId) {
            const oldIndexInCol = columnTasks.findIndex(t => t.id === activeId);
            const overIndexInCol = columnTasks.findIndex(t => t.id === overId);
            
            let tempTasks = [...columnTasks];
            if (oldIndexInCol !== -1) {
                // Same column reorder
                tempTasks = arrayMove(columnTasks, oldIndexInCol, overIndexInCol);
            } else {
                // Cross column move
                tempTasks.splice(overIndexInCol, 0, activeTask);
            }

            const finalIndex = tempTasks.findIndex(t => t.id === activeId);
            const beforeTask = tempTasks[finalIndex - 1];
            const afterTask = tempTasks[finalIndex + 1];
            newPosition = generateKeyBetween(beforeTask?.position || null, afterTask?.position || null);
        } else {
            // Dropped on empty column or column header
            const lastTask = columnTasks[columnTasks.length - 1];
            newPosition = generateKeyBetween(lastTask?.position || null, null);
        }

        try {
            await updateTask.mutateAsync({
                id: activeId,
                updates: {
                    status: newStatus,
                    completed: newStatus === 'done',
                    position: newPosition
                }
            });
        } catch (error) {
            console.error('[handleDragEnd] Position update error:', error);
            showToast('Erro ao reordenar tarefa.', 'error');
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
