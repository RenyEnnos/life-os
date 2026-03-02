import { X } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { CreateHabitForm } from './CreateHabitForm';
import { Habit } from '../types';

interface CreateHabitDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Habit>) => void;
    initialData?: Habit;
}

export function CreateHabitDialog({ isOpen, onClose, onSubmit, initialData }: CreateHabitDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md border-primary/20 bg-background relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    <X size={20} />
                </button>

                <div className="p-6">
                    <h2 className="text-2xl font-bold text-primary font-mono mb-6">
                        {initialData ? 'EDITAR HÁBITO' : 'NOVO HÁBITO'}
                    </h2>

                    <CreateHabitForm
                        initialData={initialData}
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
