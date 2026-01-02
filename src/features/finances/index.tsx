import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useFinances } from '@/features/finances/hooks/useFinances';
import type { FinanceSummary, Transaction } from '@/shared/types';
import { Loader } from '@/shared/ui/Loader';
import { TransactionModal } from './components/TransactionModal';
// Removed NeonChart in favor of minimal inline bars
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';

// Removed sampleTransactions fallback

const computeSummary = (transactions: Transaction[] = []): FinanceSummary => {
    const income = transactions.filter((t) => t.type === 'income').reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const expenses = transactions.filter((t) => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const byCategory = transactions.reduce<Record<string, number>>((acc, t) => {
        const cat = t.category || 'Outros';
        const value = Math.abs(Number(t.amount || 0));
        acc[cat] = (acc[cat] || 0) + value;
        return acc;
    }, {});

    return {
        income,
        expenses,
        balance: income - expenses,
        byCategory
    };
};

const safeParseDate = (value?: string | null) => {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
};

export default function FinancesPage() {
    const { transactions, summary, isLoading, createTransaction, deleteTransaction } = useFinances();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (searchParams.get('new') === 'true') {
            setIsModalOpen(true);
        }
    }, [searchParams]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (searchParams.get('new') === 'true') {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.delete('new');
                return newParams;
            });
        }
    };

    const isEmpty = !transactions || transactions.length === 0;

    const transactionsToShow = useMemo<Transaction[]>(() => {
        return (transactions || []).slice().sort((a, b) => {
            const aDate = safeParseDate(a.date);
            const bDate = safeParseDate(b.date);
            return (bDate?.getTime() || 0) - (aDate?.getTime() || 0);
        });
    }, [transactions]);

    const summaryToShow = useMemo<FinanceSummary>(() => {
        if (summary) return summary;
        return computeSummary(transactionsToShow);
    }, [summary, transactionsToShow]);

    const cashFlowData = useMemo(() => {
        if (!transactionsToShow.length) return [];
        const ordered = [...transactionsToShow].sort((a, b) => {
            const aDate = safeParseDate(a.date);
            const bDate = safeParseDate(b.date);
            return (aDate?.getTime() || 0) - (bDate?.getTime() || 0);
        });
        const months: string[] = [];
        const monthTotals = new Map<string, number>();
        ordered.forEach((t) => {
            const parsed = safeParseDate(t.date);
            if (!parsed) return;
            const key = format(parsed, 'MMM');
            if (!months.includes(key)) months.push(key);
            const delta = t.type === 'income' ? Number(t.amount || 0) : -Number(t.amount || 0);
            monthTotals.set(key, (monthTotals.get(key) || 0) + delta);
        });
        return months.map((m) => ({ name: m, value: Number((monthTotals.get(m) || 0).toFixed(2)) }));
    }, [transactionsToShow]);

    const monthlyCapTarget = summaryToShow.income > 0 ? summaryToShow.income * 0.7 : 0;
    const monthlyCapPct = monthlyCapTarget > 0 ? Math.min(100, Math.round((summaryToShow.expenses / monthlyCapTarget) * 100)) : 0;
    const investmentTotal = transactionsToShow
        .filter((t) => (t.category || '').toLowerCase().includes('invest'))
        .reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const netDeltaPercent = summaryToShow.income > 0
        ? ((summaryToShow.balance) / Math.max(summaryToShow.income, 1)) * 100
        : 0;

    return (
        <div className="dashboard-shell relative h-screen w-full overflow-hidden">
            

            <div className="relative flex h-full w-full overflow-hidden z-10">
                {/* Sidebar Navigation removed - using global AppLayout Sidebar */}
                <main className="flex-1 h-full overflow-y-auto relative p-4 lg:p-10 flex flex-col gap-8 max-w-7xl mx-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-1 items-center justify-center">
                            <Loader text="CARREGANDO FINANÇAS..." />
                        </div>
                    ) : (
                        <>
                            <header className="w-full flex flex-col gap-6">
                                <div className="flex items-end justify-between px-2">
                                    <div>
                                        <h2 className="text-[11px] text-zinc-500 font-medium tracking-widest uppercase mb-1">Financial Overview</h2>
                                        <h1 className="text-4xl lg:text-5xl font-light text-white tracking-tight">Wealth Manager</h1>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            className="px-4 py-2 rounded-lg border border-white/10 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                                            onClick={() => setIsModalOpen(true)}
                                        >
                                            Nova Transação
                                        </button>
                                        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/40 border border-white/5 text-zinc-300 text-sm backdrop-blur-md">
                                            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(48,140,232,0.6)]" />
                                            Sync Active
                                        </div>
                                    </div>
                                </div>
                            </header>

                            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
                                <div className="lg:col-span-4 glass-card rounded-3xl bg-glass-surface backdrop-blur-xl border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group">
                                    <div className="absolute bottom-0 left-0 right-0 h-28 opacity-30 pointer-events-none z-0 translate-y-4">
                                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 120">
                                            <defs>
                                                <linearGradient id="sparklineGradientFinance" x1="0" x2="0" y1="0" y2="1">
                                                    <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
                                                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M0,90 C50,70 120,100 160,50 C220,20 260,70 320,30 C360,10 400,70 400,70 L400,120 L0,120 Z" fill="url(#sparklineGradientFinance)" />
                                            <path d="M0,90 C50,70 120,100 160,50 C220,20 260,70 320,30 C360,10 400,70 400,70" fill="none" stroke="white" strokeWidth="2" />
                                        </svg>
                                    </div>
                                    <div className="flex justify-between items-start z-10">
                                        <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Total Balance</span>
                                        <button className="text-zinc-500 hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-lg">visibility</span>
                                        </button>
                                    </div>
                                    <div className="mt-10 z-10">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-thin text-zinc-500">$</span>
                                            <span className="text-5xl font-thin tracking-tighter text-white tabular-nums">{summaryToShow.balance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-4">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full border text-[10px] font-medium tracking-wide flex items-center gap-1",
                                                netDeltaPercent >= 0
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                                            )}>
                                                <span className="material-symbols-outlined text-[12px]">{netDeltaPercent >= 0 ? 'arrow_outward' : 'south_east'}</span>
                                                {netDeltaPercent.toFixed(1)}%
                                            </span>
                                            <span className="text-xs text-zinc-600">vs mês anterior</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-8 glass-card rounded-3xl bg-glass-surface backdrop-blur-xl border border-white/10 p-6 flex flex-col min-h-[320px]">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex flex-col">
                                            <h3 className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Cash Flow</h3>
                                            <span className="text-white text-lg font-light tracking-tight mt-1">Net Income Trend</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-white uppercase hover:bg-white/10 transition-colors">YTD</button>
                                            <button className="px-3 py-1 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 text-[10px] text-zinc-500 hover:text-zinc-300 uppercase transition-colors">1Y</button>
                                        </div>
                                    </div>
                                    <div className="flex-1 relative w-full flex items-end justify-between gap-1 px-1 pb-2">
                                        {cashFlowData.length === 0 ? (
                                            <div className="w-full h-[220px] flex items-center justify-center text-sm text-zinc-500 border border-dashed border-white/5 rounded-2xl">
                                                Sem dados suficientes
                                            </div>
                                        ) : (
                                            <div className="w-full h-[240px] flex items-end gap-2">
                                                {cashFlowData.map((d, idx) => {
                                                    const height = `${Math.min(100, Math.max(10, Math.round((Math.abs(d.value) / Math.max(1, Math.max(...cashFlowData.map(x => Math.abs(x.value))))) * 100)))}%`;
                                                    const positive = d.value >= 0;
                                                    return (
                                                        <div key={idx} className="group relative flex-1 h-full flex items-end justify-center">
                                                            <div
                                                                className={cn(
                                                                    "w-5 rounded-sm transition-colors",
                                                                    positive ? "bg-emerald-500/80 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-red-500/70 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                                                                )}
                                                                style={{ height }}
                                                                title={`${d.name}: ${d.value}`}
                                                            />
                                                            <div className="absolute -bottom-5 text-[10px] text-zinc-400">
                                                                {d.name}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-6 glass-card rounded-2xl bg-glass-surface backdrop-blur-xl border border-white/10 p-5 flex flex-col justify-between min-h-[160px]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Monthly Cap</span>
                                        <span className="text-xs text-zinc-400">{monthlyCapPct}%</span>
                                    </div>
                                    <div className="mb-4">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-light text-white">R$ {summaryToShow.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                            <span className="text-xs text-zinc-600">/ R$ {monthlyCapTarget.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full" style={{ width: `${monthlyCapPct}%` }} />
                                    </div>
                                </div>

                                <div className="lg:col-span-6 glass-card rounded-2xl bg-glass-surface backdrop-blur-xl border border-white/10 p-5 flex flex-col justify-between min-h-[160px]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Investments</span>
                                        <span className="text-xs text-emerald-400">+12%</span>
                                    </div>
                                    <div className="mb-4">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-light text-white">R$ {investmentTotal.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                            <span className="text-xs text-emerald-500">Automated</span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-emerald-500" style={{ width: '45%' }} />
                                        <div className="h-full bg-indigo-500" style={{ width: '30%' }} />
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card rounded-3xl bg-glass-surface backdrop-blur-xl border border-white/10 p-6 lg:p-8 flex flex-col">
                                <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
                                    <h3 className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Transaction Stream</h3>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="ghost"
                                            className="text-xs flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-white/5"
                                            onClick={() => setIsModalOpen(true)}
                                        >
                                            <Plus size={14} /> Adicionar
                                        </Button>
                                        <button className="text-zinc-500 hover:text-white transition-colors text-xs flex items-center gap-1">
                                            Ver tudo <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col divide-y divide-white/5">
                                    {transactionsToShow.length === 0 && (
                                        <div className="w-full py-10 flex items-center justify-center text-sm text-zinc-500 border border-dashed border-white/5 rounded-2xl">
                                            Nenhuma transação. Adicione uma nova para começar.
                                        </div>
                                    )}
                                    {transactionsToShow.map((t) => (
                                        <div key={t.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors",
                                                    t.type === 'income' ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-zinc-800 border border-white/5"
                                                )}>
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        {t.type === 'income' ? 'work' : 'payments'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-zinc-200 text-sm font-medium">{t.description}</span>
                                                    <span className="text-zinc-600 text-xs">
                                                        {t.category} • {(() => {
                                                            const parsed = safeParseDate(t.date);
                                                            return parsed ? format(parsed, 'MMM dd, HH:mm') : 'Data inválida';
                                                        })()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={cn(
                                                    "block font-mono font-medium tabular-nums",
                                                    t.type === 'income' ? "text-emerald-400" : "text-red-400"
                                                )}>
                                                    {t.type === 'income' ? '+' : '-'} R$ {Number(t.amount).toFixed(2)}
                                                </span>
                                                {!isEmpty && (
                                                    <button
                                                        className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-zinc-500 hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
                                                        onClick={() => deleteTransaction.mutate(t.id)}
                                                        aria-label={`Delete transaction: ${t.description}`}
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>

            {isModalOpen && (
                <TransactionModal onClose={handleCloseModal} onSubmit={createTransaction.mutate} />
            )}
        </div>
    );
}
