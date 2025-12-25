import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { CreateTaskForm } from './CreateTaskForm';
import type { Task } from '@/shared/types';

interface CreateTaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Task>) => void;
}

export function CreateTaskDialog({ isOpen, onClose, onSubmit }: CreateTaskDialogProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card
                className="w-full max-w-md border-primary/20 bg-background relative"
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-task-title"
            >
                <button
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                    <X size={20} />
                </button>

                <div className="p-6">
                    <h2 id="create-task-title" className="text-2xl font-bold text-primary font-mono mb-6">NOVA TAREFA</h2>

                    <CreateTaskForm
                        onSubmit={(data) => {
                            onSubmit(data);
                            onClose();
                        }}
                        onCancel={onClose}
                    />
                </div>
            </Card>
        </div>
    );
}
