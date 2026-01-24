import { useState, useEffect, useRef } from 'react';
import { Save, X, Sparkles, BrainCircuit, Calendar, Hash, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useAI } from '@/features/ai-assistant/hooks/useAI';
import type { JournalEntry, JournalInsight } from '@/shared/types';
import { motion, AnimatePresence } from 'framer-motion';
import { journalApi } from '../api/journal.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { InsightCard } from './InsightCard';
import { cn } from '@/shared/lib/cn';

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
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [content]);

    // Neural Resonance State
    const [activeInsight, setActiveInsight] = useState<JournalInsight | null>(null);

    const queryClient = useQueryClient();
    const { generateTags } = useAI();
    const [isGeneratingTags, setIsGeneratingTags] = useState(false);

    const { mutate: analyzeEntry, isPending: isAnalyzing } = useMutation({
        mutationFn: async () => {
            if (!entry?.id) return;
            const tempEntry = { ...entry, title, content, user_id: entry.user_id } as JournalEntry;
            return journalApi.analyzeEntry(tempEntry);
        },
        onSuccess: (data) => {
            if (data) setActiveInsight(data);
            toast.success('Ressonância Neural completa');
            queryClient.invalidateQueries({ queryKey: ['journal'] });
        },
        onError: () => {
            toast.error('O Nexus está silencioso agora');
        }
    });

    const handleAnalyze = () => {
        analyzeEntry();
    };

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
        const normalizedTag = newTag.trim().toLowerCase();
        if (normalizedTag && !tags.includes(normalizedTag)) {
            setTags([...tags, normalizedTag]);
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
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="flex flex-col h-full bg-background-dark/50 backdrop-blur-md"
        >
            {/* Header / Meta Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-4 text-zinc-400">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-2 text-xs font-mono bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        <Calendar size={12} />
                        <input
                            type="date"
                            className="bg-transparent border-none p-0 text-zinc-300 focus:outline-none focus:ring-0 w-24"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {entry?.id && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !content}
                            className="h-8 text-xs gap-1.5 border-primary/20 text-primary hover:text-primary hover:bg-primary/10"
                        >
                            {isAnalyzing ? (
                                <BrainCircuit size={14} className="animate-pulse" />
                            ) : (
                                <Sparkles size={14} />
                            )}
                            {isAnalyzing ? 'Analyzing...' : 'Resonance'}
                        </Button>
                    )}
                    <Button
                        onClick={handleSubmit}
                        className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                    >
                        <Save size={14} />
                        Save Entry
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto py-12 px-8 flex flex-col gap-8">

                    {/* Title Input */}
                    <input
                        type="text"
                        className="w-full bg-transparent border-none text-4xl font-display font-medium text-white placeholder-zinc-700 focus:outline-none focus:ring-0 p-0 leading-tight"
                        placeholder="Untitled Entry"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />

                    {/* Tags Area */}
                    <div className="flex flex-wrap items-center gap-2">
                        <AnimatePresence>
                            {tags.map(tag => (
                                <motion.span
                                    key={tag}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-400 group"
                                >
                                    <Hash size={10} className="text-zinc-600" />
                                    {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                                    >
                                        <X size={10} />
                                    </button>
                                </motion.span>
                            ))}
                        </AnimatePresence>

                        <div className="relative flex items-center">
                            <input
                                type="text"
                                className="bg-transparent border-none text-sm text-zinc-500 placeholder-zinc-700 focus:outline-none focus:ring-0 w-32 py-1"
                                placeholder="+ Add tag..."
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addTag();
                                    }
                                }}
                            />
                            {content.length > 20 && !isGeneratingTags && (
                                <button
                                    type="button"
                                    onClick={handleGenerateTags}
                                    className="ml-2 text-[10px] uppercase tracking-wider text-primary/60 hover:text-primary transition-colors flex items-center gap-1"
                                >
                                    <Sparkles size={10} />
                                    AI Suggest
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <textarea
                        ref={textareaRef}
                        className="w-full min-h-[40vh] bg-transparent border-none resize-none text-lg text-zinc-300 font-mono leading-loose placeholder-zinc-800 focus:outline-none focus:ring-0 p-0 overflow-hidden"
                        placeholder="Start writing..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />

                    {/* Neural Resonance Insight Card */}
                    {(activeInsight || (entry?.insights && entry.insights.length > 0)) && (
                        <div className="pt-8 border-t border-white/5">
                            <InsightCard
                                content={activeInsight?.content || (entry?.insights && entry.insights[0]?.content)!}
                            />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
