import { useState } from 'react';
import { Button } from '@/shared/ui/Button';

interface CreateHabitFormProps {
    onSubmit: (data: { title: string; description?: string; routine: 'morning' | 'afternoon' | 'evening' | 'any'; type: 'binary' | 'numeric'; goal: number }) => void;
    onCancel: () => void;
}

export function CreateHabitForm({ onSubmit, onCancel }: CreateHabitFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [routine, setRoutine] = useState<'morning' | 'afternoon' | 'evening' | 'any'>('any');

    const [type, setType] = useState<'binary' | 'numeric'>('binary');
    const [goal, setGoal] = useState<number>(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, description, routine, type, goal });
    };

    return (
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

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground">Tipo</label>
                    <select
                        className="w-full bg-surface border border-border rounded-md p-2 text-foreground focus:border-primary focus:outline-none font-mono"
                        value={type}
                        onChange={(e) => setType(e.target.value as 'binary' | 'numeric')}
                    >
                        <option value="binary">Sim/Não</option>
                        <option value="numeric">Numérico</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground">Meta Diária</label>
                    <input
                        type="number"
                        min="1"
                        className="w-full bg-surface border border-border rounded-md p-2 text-foreground focus:border-primary focus:outline-none font-mono"
                        value={goal}
                        onChange={(e) => setGoal(Number(e.target.value))}
                        disabled={type === 'binary'}
                    />
                </div>
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
                    onChange={(e) => setRoutine(e.target.value as 'morning' | 'afternoon' | 'evening' | 'any')}
                >
                    <option value="any">Qualquer horário</option>
                    <option value="morning">Manhã</option>
                    <option value="afternoon">Tarde</option>
                    <option value="evening">Noite</option>
                </select>
            </div>

            <div className="pt-4 flex gap-3">
                <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
                    CANCELAR
                </Button>
                <Button type="submit" className="flex-1">
                    CRIAR
                </Button>
            </div>
        </form>
    );
}
