import { useState, useId } from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useAI } from '@/features/ai-assistant/hooks/useAI';
import { Tag } from '@/shared/ui/Tag';
import { X, Zap } from 'lucide-react';
import type { Task, EnergyLevel, TimeBlock } from '@/shared/types';

interface CreateTaskFormProps {
    onSubmit: (data: Partial<Task>) => void;
    onCancel: () => void;
}

export function CreateTaskForm({ onSubmit, onCancel }: CreateTaskFormProps) {
    const formId = useId();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('any');
    const [timeBlock, setTimeBlock] = useState<TimeBlock>('any');

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
                setTags(prev => Array.from(new Set([...prev, ...result.tags!])));
            } else {
                const derived = [title, description]
                    .join(' ')
                    .toLowerCase()
                    .split(/\W+/)
                    .filter(Boolean)
                    .slice(0, 3);
                if (derived.length) setTags(prev => Array.from(new Set([...prev, ...derived])));
            }
        } catch (error) {
            console.error('Failed to generate tags', error);
        } finally {
            setIsGeneratingTags(false);
        }
    };

    const addTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            title,
            description,
            due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
            completed: false,
            tags
        };
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor={`${formId}-title`} className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Título</label>
                <Input
                    id={`${formId}-title`}
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Pagar conta de luz"
                    className="bg-surface/50 focus:bg-surface transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor={`${formId}-description`} className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Descrição (Opcional)</label>
                <textarea
                    id={`${formId}-description`}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-surface/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono focus:bg-surface transition-colors"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalhes..."
                />
            </div>

            <div className="space-y-2">
                <label htmlFor={`${formId}-due-date`} className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Data de Vencimento</label>
                <Input
                    id={`${formId}-due-date`}
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-surface/50 focus:bg-surface transition-colors"
                />
            </div>

            {/* Dynamic Now Fields */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor={`${formId}-energy`} className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                        Energia
                    </label>
                    <select
                        id={`${formId}-energy`}
                        value={energyLevel}
                        onChange={(e) => setEnergyLevel(e.target.value as EnergyLevel)}
                        className="w-full bg-surface/50 border border-border rounded-md p-2 text-sm font-mono text-foreground focus:bg-surface focus:border-primary focus:outline-none transition-colors"
                    >
                        <option value="any">Qualquer</option>
                        <option value="high">Alta ⚡</option>
                        <option value="low">Baixa 🌙</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor={`${formId}-period`} className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                        Período
                    </label>
                    <select
                        id={`${formId}-period`}
                        value={timeBlock}
                        onChange={(e) => setTimeBlock(e.target.value as TimeBlock)}
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
                    <label htmlFor={`${formId}-new-tag`} className="text-sm font-mono text-muted-foreground">Tags</label>
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
                        id={`${formId}-new-tag`}
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
                    <Button type="button" variant="outline" onClick={addTag} aria-label="Adicionar tag">
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
                <Button type="submit" className="flex-1">
                    CRIAR
                </Button>
            </div>
        </form>
    );
}
