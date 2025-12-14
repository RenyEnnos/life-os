import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { clsx } from 'clsx';
import { useAI } from '@/features/ai-assistant/hooks/useAI';
import { useCategorySuggester } from '@/features/finances/hooks/useCategorySuggester';
import { Tag } from '@/shared/ui/Tag';
import { Plus, Trash2, CalendarIcon, Coins } from 'lucide-react';
import type { Transaction } from '@/shared/types';
import { Input } from '@/shared/ui/Input';

interface TransactionFormProps {
    onSubmit: (payload: Partial<Transaction> & { category?: string }) => void;
    onCancel: () => void;
}

export function TransactionForm({ onSubmit, onCancel }: TransactionFormProps) {
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Outros');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');

    const { generateTags } = useAI();
    const [isGeneratingTags, setIsGeneratingTags] = useState(false);
    const { suggestedCategory } = useCategorySuggester(description);

    const handleGenerateTags = async () => {
        if (!description) return;
        setIsGeneratingTags(true);
        try {
            const result = await generateTags.mutateAsync({
                context: `Description: ${description}\nCategory: ${category}\nType: ${type}`,
                type: 'finance'
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

    const categories = ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Investimento', 'Salário', 'Outros'];

    return (
        <div className="space-y-4 text-left">
            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-lg border border-white/5">
                <button
                    className={clsx(
                        "py-2 rounded-md text-sm font-mono font-bold transition-all duration-300",
                        type === 'income'
                            ? "bg-green-500/20 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.2)]"
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                    )}
                    onClick={() => setType('income')}
                >
                    RECEITA
                </button>
                <button
                    className={clsx(
                        "py-2 rounded-md text-sm font-mono font-bold transition-all duration-300",
                        type === 'expense'
                            ? "bg-red-500/20 text-red-400 shadow-[0_0_20px_rgba(248,113,113,0.2)]"
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                    )}
                    onClick={() => setType('expense')}
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
                    type="number"
                    placeholder="0.00"
                    className="pl-10 font-mono text-lg"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    autoFocus
                />
            </div>

            {/* Description */}
            <Input
                type="text"
                placeholder="Descrição da transação..."
                value={description}
                onChange={e => setDescription(e.target.value)}
            />

            {/* Category */}
            <div className="space-y-1.5">
                <select
                    className="flex h-10 w-full rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-sm text-zinc-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm focus-visible:outline-none focus-visible:border-white/20 focus-visible:bg-black/35 focus-visible:ring-2 focus-visible:ring-white/15"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    {categories.map(c => <option key={c} value={c} className="bg-zinc-900 text-zinc-200">{c}</option>)}
                </select>

                {suggestedCategory && suggestedCategory !== category && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 px-1">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Sugestão:</span>
                        <button
                            onClick={() => setCategory(suggestedCategory)}
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
                    type="date"
                    className="flex h-10 w-full pl-10 rounded-lg border border-white/5 bg-black/20 px-4 py-2 text-sm text-zinc-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all focus:outline-none focus:border-white/20 focus:bg-black/35 focus:ring-2 focus:ring-white/15"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                />
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
                        disabled={isGeneratingTags || !description}
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
                    {tags.map(tag => (
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
                    {tags.length === 0 && (
                        <span className="text-xs text-zinc-600 italic">Nenhuma tag selecionada</span>
                    )}
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <Button variant="ghost" onClick={onCancel} className="flex-1 hover:bg-white/5">CANCELAR</Button>
                <Button
                    onClick={() => {
                        onSubmit({ type, amount: Number(amount), description, category, date, tags });
                    }}
                    className={clsx(
                        "flex-1 font-bold shadow-lg",
                        type === 'income' ? "bg-green-600 hover:bg-green-700 shadow-green-900/20" : "bg-red-600 hover:bg-red-700 shadow-red-900/20"
                    )}
                >
                    SALVAR
                </Button>
            </div>
        </div>
    );
}
