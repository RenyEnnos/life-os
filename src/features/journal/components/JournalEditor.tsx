import { useState, useEffect } from 'react';
import { Save, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAI } from '@/hooks/useAI';
import { Tag } from '@/components/ui/Tag';

interface JournalEditorProps {
    entry?: any;
    onSave: (data: any) => void;
    onCancel: () => void;
}

export function JournalEditor({ entry, onSave, onCancel }: JournalEditorProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');

    const { generateTags } = useAI();
    const [isGeneratingTags, setIsGeneratingTags] = useState(false);

    const handleGenerateTags = async () => {
        if (!content) return;
        setIsGeneratingTags(true);
        try {
            const result = await generateTags.mutateAsync({
                context: `Title: ${title}\nContent: ${content}`,
                type: 'journal'
            });
            if (result.tags) {
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

    useEffect(() => {
        if (entry) {
            setTitle(entry.title || '');
            setContent(entry.content || '');
            setDate(entry.entry_date);
            setTags(entry.tags || []);
        }
    }, [entry]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, content, entry_date: date, tags });
    };

    return (
        <Card className="p-6 border-primary/20 bg-background/50 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-between items-center gap-4">
                    <input
                        type="text"
                        className="flex-1 bg-transparent text-2xl font-bold font-mono text-primary placeholder:text-primary/30 focus:outline-none"
                        placeholder="Título da Entrada..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="date"
                        className="bg-surface border border-border rounded px-2 py-1 text-sm font-mono focus:border-primary focus:outline-none"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <textarea
                    className="w-full h-[400px] bg-surface/50 border border-border rounded-md p-4 text-foreground font-mono focus:border-primary focus:outline-none resize-none leading-relaxed"
                    placeholder="Escreva seus pensamentos..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />

                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-mono text-muted-foreground">Tags</label>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs gap-1 text-primary hover:text-primary/80"
                            onClick={handleGenerateTags}
                            disabled={isGeneratingTags || !content}
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

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        CANCELAR
                    </Button>
                    <Button type="submit" className="gap-2">
                        <Save size={18} />
                        SALVAR
                    </Button>
                </div>
            </form>
        </Card>
    );
}
