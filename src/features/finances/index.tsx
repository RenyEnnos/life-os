import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, Trash2, PieChart as PieChartIcon } from 'lucide-react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useFinances } from '@/hooks/useFinances';
import { clsx } from 'clsx';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { useAI } from '@/hooks/useAI';
import { Tag } from '@/components/ui/Tag';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';

export default function FinancesPage() {
    const { transactions, summary, isLoading, createTransaction, deleteTransaction } = useFinances();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const COLORS = ['#adfa1d', '#ef4444', '#3b82f6', '#eab308', '#a855f7', '#ec4899'];

    const pieData = summary?.byCategory ? Object.entries(summary.byCategory).map(([name, value]) => ({
        name,
        value
    })) : [];

    return (
        <div className="space-y-8 pb-20">
            <PageTitle
                title="FINANÇAS"
                subtitle="Fluxo de caixa e alocação de recursos."
                action={
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                        <Plus size={18} />
                        NOVA TRANSAÇÃO
                    </Button>
                }
            />

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader text="CALCULATING NET WORTH..." />
                </div>
            ) : (
                <>
                    {(!transactions || transactions.length === 0) ? (
                        <EmptyState
                            icon={DollarSign}
                            title="SEM MOVIMENTAÇÃO"
                            description="Nenhum registro financeiro. Inicie o controle de fluxo."
                            action={
                                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                                    <Plus size={16} /> NOVA TRANSAÇÃO
                                </Button>
                            }
                        />
                    ) : (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="p-6 border-border bg-card">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-green-500/10 rounded-full text-green-500">
                                            <TrendingUp size={20} />
                                        </div>
                                        <span className="font-mono text-sm text-muted-foreground font-bold tracking-wider">RECEITAS</span>
                                    </div>
                                    <div className="text-2xl font-bold font-mono text-foreground">
                                        R$ {summary?.income?.toFixed(2) || '0.00'}
                                    </div>
                                </Card>

                                <Card className="p-6 border-border bg-card">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-red-500/10 rounded-full text-red-500">
                                            <TrendingDown size={20} />
                                        </div>
                                        <span className="font-mono text-sm text-muted-foreground font-bold tracking-wider">DESPESAS</span>
                                    </div>
                                    <div className="text-2xl font-bold font-mono text-foreground">
                                        R$ {summary?.expenses?.toFixed(2) || '0.00'}
                                    </div>
                                </Card>

                                <Card className="p-6 border-border bg-card">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                                            <DollarSign size={20} />
                                        </div>
                                        <span className="font-mono text-sm text-muted-foreground font-bold tracking-wider">SALDO</span>
                                    </div>
                                    <div className={clsx(
                                        "text-2xl font-bold font-mono",
                                        (summary?.balance || 0) >= 0 ? "text-primary" : "text-destructive"
                                    )}>
                                        R$ {summary?.balance?.toFixed(2) || '0.00'}
                                    </div>
                                </Card>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Transactions List */}
                                <Card className="md:col-span-2 p-6 border-border bg-card">
                                    <h3 className="font-mono font-bold text-lg mb-4 flex items-center gap-2">
                                        <DollarSign size={20} className="text-primary" />
                                        ÚLTIMAS TRANSAÇÕES
                                    </h3>

                                    {!transactions?.length ? (
                                        <div className="text-center py-10 text-muted-foreground font-mono text-sm">
                                            Nenhuma transação registrada.
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {transactions.map((t: any) => (
                                                <div key={t.id} className="flex items-center justify-between p-3 bg-surface/50 rounded border border-transparent hover:border-primary/30 hover:bg-surface hover:shadow-[0_0_10px_rgba(13,242,13,0.05)] transition-all duration-300 group">
                                                    <div className="flex items-center gap-3">
                                                        <div className={clsx(
                                                            "w-2 h-10 rounded-full",
                                                            t.type === 'income' ? "bg-green-500" : "bg-red-500"
                                                        )} />
                                                        <div>
                                                            <div className="font-bold font-mono text-foreground">{t.description}</div>
                                                            <div className="text-xs text-muted-foreground font-mono flex gap-2">
                                                                <span>{new Date(t.transaction_date).toLocaleDateString('pt-BR')}</span>
                                                                {t.category && <span className="bg-muted px-1.5 rounded text-[10px] uppercase">{t.category}</span>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <span className={clsx(
                                                            "font-mono font-bold",
                                                            t.type === 'income' ? "text-green-500" : "text-red-500"
                                                        )}>
                                                            {t.type === 'income' ? '+' : '-'} R$ {Number(t.amount).toFixed(2)}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                                                            onClick={() => deleteTransaction.mutate(t.id)}
                                                            aria-label="Excluir transação"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>

                                {/* Expenses Chart */}
                                <Card className="p-6 border-border bg-card flex flex-col">
                                    <h3 className="font-mono font-bold text-lg mb-4 flex items-center gap-2">
                                        <PieChartIcon size={20} className="text-primary" />
                                        DESPESAS POR CATEGORIA
                                    </h3>
                                    <div className="flex-1 min-h-[250px]">
                                        {!pieData.length ? (
                                            <div className="h-full flex items-center justify-center text-muted-foreground font-mono text-sm">
                                                Dados insuficientes para análise.
                                            </div>
                                        ) : (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={pieData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {pieData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: '#0a0f0a',
                                                            border: '1px solid #0df20d',
                                                            borderRadius: '4px',
                                                            boxShadow: '0 0 10px rgba(13, 242, 13, 0.2)'
                                                        }}
                                                        itemStyle={{ color: '#0df20d', fontFamily: 'Courier New, monospace', fontWeight: 'bold' }}
                                                        formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                                                    />
                                                    <Legend
                                                        layout="horizontal"
                                                        verticalAlign="bottom"
                                                        align="center"
                                                        wrapperStyle={{ fontSize: '12px', fontFamily: 'Courier New, monospace', paddingTop: '20px', color: '#a0a0a0' }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </>
                    )}
                </>
            )
            }

            {
                isModalOpen && (
                    <TransactionModal onClose={() => setIsModalOpen(false)} onSubmit={createTransaction.mutate} />
                )
            }
        </div >
    );
}

function TransactionModal({ onClose, onSubmit }: any) {
    const [type, setType] = useState('expense');
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
