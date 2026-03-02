import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Habit } from '../types';
import * as LucideIcons from 'lucide-react';

interface CreateHabitFormProps {
    initialData?: Partial<Habit>;
    onSubmit: (data: Partial<Habit>) => void;
    onCancel: () => void;
}

const COLORS = [
    { name: 'Emerald', value: '#10b981' },
    { name: 'Sky', value: '#0ea5e9' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Slate', value: '#64748b' },
];

const ICONS = ['Activity', 'Book', 'Coffee', 'Dumbbell', 'Heart', 'Moon', 'Sun', 'Zap', 'Target', 'Smile'];

export function CreateHabitForm({ initialData, onSubmit, onCancel }: CreateHabitFormProps) {
    const [title, setTitle] = useState(initialData?.title || initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [routine, setRoutine] = useState<'morning' | 'afternoon' | 'evening' | 'any'>(initialData?.routine || 'any');

    const [type, setType] = useState<'binary' | 'quantified'>(initialData?.type || 'binary');
    const [targetValue, setTargetValue] = useState<number>(initialData?.target_value || initialData?.goal || 1);
    const [unit, setUnit] = useState(initialData?.unit || '');
    const [color, setColor] = useState(initialData?.color || COLORS[0].value);
    const [icon, setIcon] = useState(initialData?.icon || ICONS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title,
            name: title,
            description,
            routine,
            type,
            target_value: targetValue,
            goal: targetValue,
            unit,
            color,
            icon
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Título</label>
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
                    <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Tipo</label>
                    <select
                        className="w-full bg-surface border border-border rounded-md p-2 text-foreground focus:border-primary focus:outline-none font-mono"
                        value={type}
                        onChange={(e) => setType(e.target.value as 'binary' | 'quantified')}
                    >
                        <option value="binary">Sim/Não</option>
                        <option value="quantified">Quantificável</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Meta Diária</label>
                    <input
                        type="number"
                        min="1"
                        className="w-full bg-surface border border-border rounded-md p-2 text-foreground focus:border-primary focus:outline-none font-mono"
                        value={targetValue}
                        onChange={(e) => setTargetValue(Number(e.target.value))}
                        disabled={type === 'binary'}
                    />
                </div>
            </div>

            {type === 'quantified' && (
                <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Unidade (Opcional)</label>
                    <input
                        type="text"
                        className="w-full bg-surface border border-border rounded-md p-2 text-foreground focus:border-primary focus:outline-none font-mono"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        placeholder="Ex: páginas, km, litros"
                    />
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Cor & Ícone</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {COLORS.map((c) => (
                        <button
                            key={c.value}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c.value ? 'border-white scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c.value }}
                            onClick={() => setColor(c.value)}
                            title={c.name}
                        />
                    ))}
                </div>
                <div className="grid grid-cols-5 gap-2">
                    {ICONS.map((i) => {
                        const IconComponent = (LucideIcons as any)[i];
                        return (
                            <button
                                key={i}
                                type="button"
                                className={`flex items-center justify-center p-2 rounded-md border border-border transition-colors ${icon === i ? 'bg-primary/20 border-primary text-primary' : 'bg-surface hover:bg-surface/80 text-muted-foreground'}`}
                                onClick={() => setIcon(i)}
                            >
                                {IconComponent && <IconComponent size={20} />}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Descrição (Opcional)</label>
                <textarea
                    className="w-full bg-surface border border-border rounded-md p-2 text-foreground focus:border-primary focus:outline-none font-mono resize-none h-20"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalhes sobre o hábito..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Rotina</label>
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
                    {initialData ? 'SALVAR' : 'CRIAR'}
                </Button>
            </div>
        </form>
    );
}
