import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/Button';
import { Habit } from '../types';
import * as LucideIcons from 'lucide-react';
import { habitSchema, HabitInput } from '@/shared/schemas/habit';
import { cn } from '@/shared/lib/cn';

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
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<HabitInput>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            title: initialData?.title || initialData?.name || '',
            description: initialData?.description || '',
            routine: initialData?.routine || 'any',
            type: initialData?.type || 'binary',
            target_value: initialData?.target_value || initialData?.goal || 1,
            unit: initialData?.unit || '',
            color: initialData?.color || COLORS[0].value,
            icon: initialData?.icon || ICONS[0],
        }
    });

    const watchType = watch('type');
    const watchColor = watch('color');
    const watchIcon = watch('icon');

    const handleFormSubmit = (data: HabitInput) => {
        onSubmit({
            ...data,
            name: data.title, // Sync name for legacy support
            goal: data.target_value // Sync goal for legacy support
        });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Título</label>
                <input
                    {...register('title')}
                    type="text"
                    className={cn(
                        "w-full bg-surface border rounded-md p-2 text-foreground focus:border-primary focus:outline-none font-mono",
                        errors.title ? "border-rose-500" : "border-border"
                    )}
                    placeholder="Ex: Ler 10 páginas"
                />
                {errors.title && <p className="text-[10px] text-rose-500 font-mono">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Tipo</label>
                    <select
                        {...register('type')}
                        className="w-full bg-surface border border-border rounded-md p-2 text-foreground focus:border-primary focus:outline-none font-mono"
                    >
                        <option value="binary">Sim/Não</option>
                        <option value="quantified">Quantificável</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Meta Diária</label>
                    <input
                        {...register('target_value', { valueAsNumber: true })}
                        type="number"
                        min="1"
                        className="w-full bg-surface border border-border rounded-md p-2 text-foreground focus:border-primary focus:outline-none font-mono"
                        disabled={watchType === 'binary'}
                    />
                </div>
            </div>

            {watchType === 'quantified' && (
                <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Unidade (Opcional)</label>
                    <input
                        {...register('unit')}
                        type="text"
                        className="w-full bg-surface border border-border rounded-md p-2 text-foreground focus:border-primary focus:outline-none font-mono"
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
                            className={cn(
                                "w-8 h-8 rounded-full border-2 transition-transform",
                                watchColor === c.value ? "border-white scale-110" : "border-transparent"
                            )}
                            style={{ backgroundColor: c.value }}
                            onClick={() => setValue('color', c.value)}
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
                                className={cn(
                                    "flex items-center justify-center p-2 rounded-md border border-border transition-colors",
                                    watchIcon === i ? "bg-primary/20 border-primary text-primary" : "bg-surface hover:bg-surface/80 text-muted-foreground"
                                )}
                                onClick={() => setValue('icon', i)}
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
                    {...register('description')}
                    className="w-full bg-surface border border-border rounded-md p-2 text-foreground focus:border-primary focus:outline-none font-mono resize-none h-20"
                    placeholder="Detalhes sobre o hábito..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Rotina</label>
                <select
                    {...register('routine')}
                    className="w-full bg-surface border border-border rounded-md p-2 text-foreground focus:border-primary focus:outline-none font-mono"
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
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? 'PROCESSANDO...' : (initialData ? 'SALVAR' : 'CRIAR')}
                </Button>
            </div>
        </form>
    );
}
