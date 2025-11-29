import { useState } from 'react';
import { X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAI } from '@/hooks/useAI';
import { Tag } from '@/components/ui/Tag';

interface CreateTaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export function CreateTaskDialog({ isOpen, onClose, onSubmit }: CreateTaskDialogProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');

    const { generateTags } = useAI();
    const [isGeneratingTags, setIsGeneratingTags] = useState(false);

    const handleGenerateTags = async () => {
        if (!title) return;
        setIsGeneratingTags(true);
        try {
            const result = await generateTags.mutateAsync({
                context: `Title: ${title}\nDescription: ${description}`,
                type: 'task'
            });
            if (result.tags) {
                // Merge unique tags
                setTags(prev => Array.from(new Set([...prev, ...result.tags!])));
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

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title,
            description,
            due_date: dueDate ? new Date(dueDate).toISOString() : null,
            completed: false,
            tags
        });
        setTitle('');
        setDescription('');
        setDueDate('');
        setTags([]);
        setNewTag('');
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
                    <h2 className="text-2xl font-bold text-primary font-mono mb-6">NOVA TAREFA</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Título</label>
                            <Input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Pagar conta de luz"
                                className="bg-surface/50 focus:bg-surface transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Descrição (Opcional)</label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-surface/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono focus:bg-surface transition-colors"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Detalhes..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Data de Vencimento</label>
                            <Input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="bg-surface/50 focus:bg-surface transition-colors"
                            />
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
                                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                                            <X size={12} />
                                        </button>
                                    </Tag>
                                ))}
                            </div>
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
