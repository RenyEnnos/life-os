import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskItem } from './TaskItem';
import { Task } from '@/shared/types';

interface SortableTaskItemProps {
    id: string;
    task: Task;
    onToggle: () => void;
    onDelete: () => void;
}

export function SortableTaskItem({ id, task, onToggle, onDelete }: SortableTaskItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id,
        data: {
            type: 'Task',
            task,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
        >
            <TaskItem 
                task={task} 
                onToggle={onToggle} 
                onDelete={onDelete} 
            />
        </div>
    );
}
