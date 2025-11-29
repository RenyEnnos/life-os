import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface CreateHabitDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export function CreateHabitDialog({ isOpen, onClose, onSubmit }: CreateHabitDialogProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [routine, setRoutine] = useState('any');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, description, routine, type: 'binary', goal: 1 });
        setTitle('');
        setDescription('');
        setRoutine('any');
        onClose();
    };

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
                    <h2 className="text-2xl font-bold text-primary font-mono mb-6">NOVO HÁBITO</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-mono text-muted-foreground">Título</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-surface border border-border rounded-md p-2 text-foreground focus:border-primary focus:outline-none font-mono"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Ler 10 páginas"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-mono text-muted-foreground">Descrição (Opcional)</label>
                            <textarea
                                className="w-full bg-surface border border-border rounded-md p-2 text-foreground focus:border-primary focus:outline-none font-mono resize-none h-20"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Detalhes sobre o hábito..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-mono text-muted-foreground">Rotina</label>
                            <select
                                className="w-full bg-surface border border-border rounded-md p-2 text-foreground focus:border-primary focus:outline-none font-mono"
                                value={routine}
                                onChange={(e) => setRoutine(e.target.value)}
                            >
                                <option value="any">Qualquer horário</option>
                                <option value="morning">Manhã</option>
                                <option value="afternoon">Tarde</option>
                                <option value="evening">Noite</option>
                            </select>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                                CANCELAR
                            </Button>
                            <Button type="submit" className="flex-1">
                                CRIAR
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
}
