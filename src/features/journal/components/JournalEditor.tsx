import { useState, useEffect } from 'react';
import { Save, X, Zap, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useAI } from '@/features/ai-assistant/hooks/useAI';
import { Tag } from '@/shared/ui/Tag';
import type { JournalEntry } from '@/shared/types';
import { motion } from 'framer-motion';

interface JournalEditorProps {
    entry?: JournalEntry;
    onSave: (data: Partial<JournalEntry>) => void;
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between items-center gap-4 glass-panel p-4 rounded-xl">
                    <input
                        type="text"
                        className="flex-1 bg-transparent text-3xl font-bold font-mono text-white placeholder:text-white/20 focus:outline-none glow-text"
                        placeholder="Título da Entrada..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="date"
                        className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm font-mono text-gray-300 focus:border-primary focus:outline-none"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <textarea
                    className="glass-editor text-gray-200 placeholder:text-gray-600"
                    placeholder="Escreva seus pensamentos..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />

                <div className="glass-panel p-4 rounded-xl space-y-4">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-mono text-gray-400">Tags</label>
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
                            className="flex-1 bg-transparent border-b border-white/10 p-2 text-gray-200 focus:border-primary focus:outline-none font-mono text-sm"
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
                        <Button type="button" variant="outline" onClick={addTag} size="sm">
                            <Plus size={16} />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <Tag
                                key={tag}
                                variant="default"
                                className="gap-1 pr-1 bg-primary/20 text-primary border-primary/20"
                            >
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors">
                                    <X size={12} />
                                </button>
                            </Tag>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={onCancel} className="text-gray-400 hover:text-white">
                        CANCELAR
                    </Button>
                    <Button type="submit" className="gap-2 shadow-lg shadow-primary/20">
                        <Save size={18} />
                        SALVAR
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}
