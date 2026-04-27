import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/Button';
import { clsx } from 'clsx';
import { useAI } from '@/features/ai-assistant/hooks/useAI';
import { useCategorySuggester } from '@/features/finances/hooks/useCategorySuggester';
import { Tag } from '@/shared/ui/Tag';
import { Plus, Trash2, CalendarIcon, Coins } from 'lucide-react';
import type { Transaction } from '@/shared/types';
import { Input } from '@/shared/ui/Input';
import { createTransactionSchema, TransactionInput } from '@/shared/schemas/finances';
import { cn } from '@/shared/lib/cn';

interface TransactionFormProps {
    onSubmit: (payload: Partial<Transaction> & { category?: string }) => void;
    onCancel: () => void;
}

const CATEGORIES = ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Investimento', 'Salário', 'Outros'];

export function TransactionForm({ onSubmit, onCancel }: TransactionFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<TransactionInput>({
        resolver: zodResolver(createTransactionSchema),
        defaultValues: {
            type: 'expense',
            amount: undefined,
            description: '',
            category: 'Outros',
            date: new Date().toISOString().split('T')[0],
            tags: []
        }
    });

    const watchType = watch('type');
    const watchDescription = watch('description');
    const watchCategory = watch('category');
    const watchTags = watch('tags') || [];
    const [newTag, setNewTag] = useState('');

    const { generateTags } = useAI();
    const [isGeneratingTags, setIsGeneratingTags] = useState(false);
    const { suggestedCategory } = useCategorySuggester(watchDescription);

    const handleGenerateTags = async () => {
        if (!watchDescription) return;
        setIsGeneratingTags(true);
        try {
            const result = await generateTags.mutateAsync({
                context: `Description: ${watchDescription}\nCategory: ${watchCategory}\nType: ${watchType}`,
                type: 'finance'
            });
            if (result.tags) {
                setValue('tags', Array.from(new Set([...watchTags, ...result.tags!])));
            }
        } catch (error) {
            console.error('Failed to generate tags', error);
        } finally {
            setIsGeneratingTags(false);
        }
    };

    const addTag = () => {
        if (newTag && !watchTags.includes(newTag)) {
            setValue('tags', [...watchTags, newTag]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setValue('tags', watchTags.filter(tag => tag !== tagToRemove));
    };

    const handleFormSubmit = (data: TransactionInput) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-left">
            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-lg border border-white/5">
                <button
                    type="button"
                    className={clsx(
                        "py-2 rounded-md text-sm font-mono font-bold transition-all duration-300",
                        watchType === 'income'
                            ? "bg-green-500/20 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.2)]"
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                    )}
                    onClick={() => setValue('type', 'income')}
                >
                    RECEITA
                </button>
                <button
                    type="button"
                    className={clsx(
                        "py-2 rounded-md text-sm font-mono font-bold transition-all duration-300",
                        watchType === 'expense'
                            ? "bg-red-500/20 text-red-400 shadow-[0_0_20px_rgba(248,113,113,0.2)]"
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                    )}
                    onClick={() => setValue('type', 'expense')}
                >
                    DESPESA
                </button>
            </div>

            {/* Amount */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Coins size={16} />
                </div>
                <Input
                    {...register('amount', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={cn("pl-10 font-mono text-lg", errors.amount && "border-rose-500")}
                    autoFocus
                />
                {errors.amount && <p className="text-[10px] text-rose-500 font-mono mt-1">{errors.amount.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1">
                <Input
                    {...register('description')}
                    type="text"
                    placeholder="Descrição da transação..."
                    className={cn(errors.description && "border-rose-500")}
                />
                {errors.description && <p className="text-[10px] text-rose-500 font-mono">{errors.description.message}</p>}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
                <select
                    {...register('category')}
                    className="flex h-10 w-full rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-sm text-zinc-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm focus-visible:outline-none focus-visible:border-white/20 focus-visible:bg-black/35 focus-visible:ring-2 focus-visible:ring-white/15"
                >
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-zinc-900 text-zinc-200">{c}</option>)}
                </select>

                {suggestedCategory && suggestedCategory !== watchCategory && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 px-1">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Sugestão:</span>
                        <button
                            type="button"
                            onClick={() => setValue('category', suggestedCategory)}
                            className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full hover:bg-indigo-500/20 transition-all flex items-center gap-1.5 group"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:animate-pulse"></span>
                            {suggestedCategory}
                        </button>
                    </div>
                )}
            </div>

            {/* Date */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                    <CalendarIcon size={16} />
                </div>
                <input
                    {...register('date')}
                    type="date"
                    className={cn(
                        "flex h-10 w-full pl-10 rounded-lg border border-white/5 bg-black/20 px-4 py-2 text-sm text-zinc-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all focus:outline-none focus:border-white/20 focus:bg-black/35 focus:ring-2 focus:ring-white/15",
                        errors.date && "border-rose-500"
                    )}
                />
                {errors.date && <p className="text-[10px] text-rose-500 font-mono mt-1">{errors.date.message}</p>}
            </div>

            {/* Tags */}
            <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Tags</label>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] gap-1 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                        onClick={handleGenerateTags}
                        disabled={isGeneratingTags || !watchDescription}
                    >
                        <Plus size={10} className={isGeneratingTags ? "animate-spin" : ""} />
                        {isGeneratingTags ? 'ANALISANDO...' : 'SUGERIR COM IA'}
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        className="h-8 text-xs"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag();
                            }
                        }}
                        placeholder="Nova tag..."
                    />
                    <Button type="button" variant="secondary" onClick={addTag} size="sm" className="h-8 w-8 p-0">
                        <Plus size={14} />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {watchTags.map(tag => (
                        <Tag
                            key={tag}
                            variant="default"
                            className="gap-1 pr-1 bg-white/5 border-white/10 text-xs py-0.5"
                        >
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors ml-1" aria-label={`Remover tag ${tag}`}>
                                <Trash2 size={10} />
                            </button>
                        </Tag>
                    ))}
                    {watchTags.length === 0 && (
                        <span className="text-xs text-zinc-600 italic">Nenhuma tag selecionada</span>
                    )}
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 hover:bg-white/5">CANCELAR</Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                        "flex-1 font-bold shadow-lg",
                        watchType === 'income' ? "bg-green-600 hover:bg-green-700 shadow-green-900/20" : "bg-red-600 hover:bg-red-700 shadow-red-900/20"
                    )}
                >
                    {isSubmitting ? 'SALVANDO...' : 'SALVAR'}
                </Button>
            </div>
        </form>
    );
}
