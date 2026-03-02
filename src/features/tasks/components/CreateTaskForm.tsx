import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/Button';
import { Input, TextArea } from '@/shared/ui/Input';
import { useAI } from '@/features/ai-assistant/hooks/useAI';
import { Tag } from '@/shared/ui/Tag';
import { X, Zap } from 'lucide-react';
import { taskSchema, type TaskFormData } from '@/shared/schemas/tasks';
import type { Task, EnergyLevel, TimeBlock } from '@/shared/types';

interface CreateTaskFormProps {
    onSubmit: (data: Partial<Task>) => void;
    onCancel: () => void;
}

export function CreateTaskForm({ onSubmit, onCancel }: CreateTaskFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            due_date: '',
            tags: [],
            energyLevel: 'any',
            timeBlock: 'any',
        }
    });

    const tags = watch('tags') || [];
    const title = watch('title');
    const description = watch('description');
    const [newTag, setNewTag] = useState('');

    const { generateTags } = useAI();
    const [isGeneratingTags, setIsGeneratingTags] = useState(false);

    const handleGenerateTags = async () => {
        if (!title) return;
        setIsGeneratingTags(true);
        try {
            const result = await generateTags.mutateAsync({
                context: `Title: ${title}\nDescription: ${description}`,
                type: 'task',
                force: true
            });
            if (result.tags) {
                setValue('tags', Array.from(new Set([...tags, ...result.tags!])));
            } else {
                const derived = [title, description]
                    .join(' ')
                    .toLowerCase()
                    .split(/\W+/)
                    .filter(Boolean)
                    .slice(0, 3);
                if (derived.length) {
                    setValue('tags', Array.from(new Set([...tags, ...derived])));
                }
            }
        } catch (error) {
            console.error('Failed to generate tags', error);
        } finally {
            setIsGeneratingTags(false);
        }
    };

    const addTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setValue('tags', [...tags, newTag]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setValue('tags', tags.filter(tag => tag !== tagToRemove));
    };

    const onFormSubmit = (data: TaskFormData) => {
        const payload: Partial<Task> = {
            title: data.title,
            description: data.description,
            due_date: data.due_date ? new Date(data.due_date).toISOString() : undefined,
            completed: false,
            tags: data.tags,
            energy_level: data.energyLevel as EnergyLevel,
            time_block: data.timeBlock as TimeBlock,
        };
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Título</label>
                <Input
                    type="text"
                    {...register('title')}
                    error={errors.title?.message}
                    placeholder="Ex: Pagar conta de luz"
                    className="bg-surface/50 focus:bg-surface transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Descrição (Opcional)</label>
                <TextArea
                    {...register('description')}
                    placeholder="Detalhes..."
                    error={errors.description?.message}
                    className="bg-surface/50 focus:bg-surface transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Data de Vencimento</label>
                <Input
                    type="date"
                    {...register('due_date')}
                    error={errors.due_date?.message}
                    className="bg-surface/50 focus:bg-surface transition-colors"
                />
            </div>

            {/* Dynamic Now Fields */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                        Energia
                    </label>
                    <select
                        {...register('energyLevel')}
                        className="w-full bg-surface/50 border border-border rounded-md p-2 text-sm font-mono text-foreground focus:bg-surface focus:border-primary focus:outline-none transition-colors"
                    >
                        <option value="any">Qualquer</option>
                        <option value="high">Alta ⚡</option>
                        <option value="low">Baixa 🌙</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                        Período
                    </label>
                    <select
                        {...register('timeBlock')}
                        className="w-full bg-surface/50 border border-border rounded-md p-2 text-sm font-mono text-foreground focus:bg-surface focus:border-primary focus:outline-none transition-colors"
                    >
                        <option value="any">Qualquer</option>
                        <option value="morning">Manhã ☀️</option>
                        <option value="afternoon">Tarde 🌤️</option>
                        <option value="evening">Noite 🌙</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <label className="text-sm font-mono text-muted-foreground">Tags</label>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs gap-1 text-primary hover:text-primary/80"
                        onClick={handleGenerateTags}
                        disabled={isGeneratingTags || !title}
                    >
                        <Zap size={12} className={isGeneratingTags ? "animate-pulse" : ""} />
                        {isGeneratingTags ? 'GERANDO...' : 'SUGERIR TAGS'}
                    </Button>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 bg-surface border border-border rounded-md p-2 text-foreground focus:border-primary focus:outline-none font-mono text-sm"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag();
                            }
                        }}
                        placeholder="Adicionar tag..."
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                        <X size={16} className="rotate-45" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                        <Tag
                            key={tag}
                            variant="default"
                            className="gap-1 pr-1"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50 rounded-full"
                                aria-label={`Remove tag ${tag}`}
                            >
                                <X size={12} />
                            </button>
                        </Tag>
                    ))}
                </div>
            </div>

            <div className="pt-4 flex gap-3">
                <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
                    CANCELAR
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? 'CRIANDO...' : 'CRIAR'}
                </Button>
            </div>
        </form>
    );
}

