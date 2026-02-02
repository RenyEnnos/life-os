import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, AlertTriangle, Plus } from 'lucide-react';
import { WidgetShell } from './WidgetShell';
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';
import { useBudgets } from '@/features/finances/hooks/useBudgets';
import { cn } from '@/shared/lib/cn';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { financesApi } from '@/features/finances/api/finances.api';

export function FinanceWidget() {
    const { finance, isLoading: isDashboardLoading } = useDashboardData();
    const { budgetStatus, isLoading: isBudgetsLoading } = useBudgets();
    const qc = useQueryClient();

    // Quick Add State
    const [isAdding, setIsAdding] = useState(false);
    const [amount, setAmount] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('General');
    const [type, setType] = useState<'income' | 'expense'>('expense');

    const createTransaction = useMutation({
        mutationFn: () => financesApi.create({
            type,
            amount: Number(amount),
            description: desc,
            category: category,
            transaction_date: new Date().toISOString()
        }),
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ['finance'] });
            qc.invalidateQueries({ queryKey: ['budgets'] });
            setIsAdding(false);
            setAmount('');
            setDesc('');
        }
    });

    const isLoading = isDashboardLoading || isBudgetsLoading;

    // Filter only active budgets or top categories
    const relevantBudgets = budgetStatus.slice(0, 3); // Show top 3

    return (
        <WidgetShell
            title="Financeiro"
            subtitle="Fluxo & Orçamento"
            icon={<Wallet size={18} className="text-emerald-400" />}
            className="h-full min-h-[320px]"
            action={
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                >
                    <Plus size={18} className={cn("transition-transform", isAdding && "rotate-45")} />
                </button>
            }
        >
            {isAdding ? (
                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex gap-2 p-1 bg-black/40 rounded-lg">
                        <button
                            onClick={() => setType('expense')}
                            className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-colors", type === 'expense' ? 'bg-red-500/20 text-red-200' : 'text-zinc-500 hover:text-zinc-300')}
                        >
                            Despesa
                        </button>
                        <button
                            onClick={() => setType('income')}
                            className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-colors", type === 'income' ? 'bg-emerald-500/20 text-emerald-200' : 'text-zinc-500 hover:text-zinc-300')}
                        >
                            Receita
                        </button>
                    </div>
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-white/20 outline-none w-full appearance-none"
                    >
                        <option value="General">Geral</option>
                        <option value="Food">Alimentação</option>
                        <option value="Transport">Transporte</option>
                        <option value="Health">Saúde</option>
                        <option value="Entertainment">Lazer</option>
                        <option value="Utilities">Contas</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Valor"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-white/20 outline-none"
                        autoFocus
                    />
                    <input
                        placeholder="Descrição"
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-white/20 outline-none"
                    />
                    <button
                        disabled={!amount || !desc || createTransaction.isPending}
                        onClick={() => createTransaction.mutate()}
                        className="mt-2 bg-white text-black font-medium py-2 rounded-lg text-sm hover:bg-zinc-200 disabled:opacity-50 transition-colors w-full text-center"
                    >
                        {createTransaction.isPending ? 'Salvando...' : 'Confirmar'}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col justify-between h-full gap-6">
                    {/* Main Balance */}
                    <div>
                        <p className="text-sm text-zinc-500 mb-1">Saldo Líquido</p>
                        <div className="flex items-baseline gap-2">
                            <span className={cn("text-3xl md:text-4xl font-light tracking-tighter truncate", finance.balance >= 0 ? "text-white" : "text-red-400")}>
                                R$ {finance.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="flex gap-4 mt-3">
                            <div className="flex items-center gap-1.5 text-xs text-emerald-400/80">
                                <TrendingUp size={14} />
                                <span>+{finance.income?.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-red-400/80">
                                <TrendingDown size={14} />
                                <span>-{finance.expenses?.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Budgets */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Orçamentos</h4>
                            {relevantBudgets.some(b => b.status === 'exceeded') && (
                                <AlertTriangle size={14} className="text-amber-500 animate-pulse" />
                            )}
                        </div>

                        {isLoading && <div className="space-y-2">{[1, 2].map(i => <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />)}</div>}

                        {!isLoading && relevantBudgets.length === 0 && (
                            <div className="p-3 border border-dashed border-white/10 rounded-lg text-xs text-zinc-500 text-center">
                                Sem orçamentos definidos.
                            </div>
                        )}

                        <div className="space-y-3">
                            {relevantBudgets.map(b => (
                                <div key={b.categoryId} className="group">
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-zinc-300">{b.categoryName}</span>
                                        <span className={cn(
                                            b.status === 'exceeded' ? 'text-red-400' : b.status === 'warning' ? 'text-amber-400' : 'text-zinc-500'
                                        )}>
                                            {Math.round((b.spent / b.limit) * 100)}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full rounded-full transition-all duration-500",
                                                b.status === 'safe' && "bg-emerald-500/50 group-hover:bg-emerald-500",
                                                b.status === 'warning' && "bg-amber-500/50 group-hover:bg-amber-500",
                                                b.status === 'exceeded' && "bg-red-500/50 group-hover:bg-red-500"
                                            )}
                                            style={{ width: `${Math.min((b.spent / b.limit) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </WidgetShell>
    );
}
