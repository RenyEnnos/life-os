import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';
import { useAI } from '@/hooks/useAI';
import { Tag } from '@/components/ui/Tag';
import type { Transaction } from '@/shared/types';

interface TransactionModalProps {
    onClose: () => void;
    onSubmit: (payload: Partial<Transaction> & { category?: string }) => void;
}

export function TransactionModal({ onClose, onSubmit }: TransactionModalProps) {
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Outros');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');

    const { generateTags } = useAI();
    const [isGeneratingTags, setIsGeneratingTags] = useState(false);

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

    const categories = ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Outros'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-sm p-6 bg-background border-primary/20">
                <h3 className="font-bold font-mono text-lg mb-4 text-primary">NOVA TRANSAÇÃO</h3>
                <div className="space-y-4">
                    <div className="flex gap-2 p-1 bg-surface rounded border border-border">
                        <button
                            className={clsx("flex-1 py-1.5 rounded text-sm font-mono font-bold transition-colors", type === 'income' ? "bg-green-500/20 text-green-500" : "text-muted-foreground hover:text-foreground")}
                            onClick={() => setType('income')}
                        >
                            RECEITA
                        </button>
                        <button
                            className={clsx("flex-1 py-1.5 rounded text-sm font-mono font-bold transition-colors", type === 'expense' ? "bg-red-500/20 text-red-500" : "text-muted-foreground hover:text-foreground")}
                            onClick={() => setType('expense')}
                        >
                            DESPESA
                        </button>
                    </div>

                    <input
                        type="number"
                        placeholder="Valor (R$)"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Descrição"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />

                    <select
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <input
                        type="date"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={date}
                        onChange={e => setDate(e.target.value)}
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
                                disabled={isGeneratingTags || !description}
                            >
                                <Plus size={12} className={isGeneratingTags ? "animate-pulse" : ""} />
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
                            <Button type="button" variant="outline" onClick={addTag} size="icon" aria-label="Adicionar Tag">
                                <Plus size={16} />
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
                                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive" aria-label={`Remover tag ${tag}`}>
                                        <Trash2 size={12} />
                                    </button>
                                </Tag>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button variant="ghost" onClick={onClose} className="flex-1">CANCELAR</Button>
                        <Button onClick={() => {
                            onSubmit({ type, amount: Number(amount), description, category, transaction_date: date, tags });
                            onClose();
                        }} className="flex-1">SALVAR</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
