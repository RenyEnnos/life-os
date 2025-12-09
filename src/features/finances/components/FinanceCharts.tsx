import { useRef, useEffect, useMemo } from 'react';
import { Button } from '@/shared/ui/Button';
import { DollarSign, Trash2, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import type { Transaction, FinanceSummary } from '@/shared/types';
import { NeonChart } from '@/shared/ui/NeonCharts';
import { motion, AnimatePresence } from 'framer-motion';

interface FinanceChartsProps {
    transactions: Transaction[] | undefined;
    summary: FinanceSummary | undefined;
    onDeleteTransaction: (id: string) => void;
}

export function FinanceCharts({ transactions, summary, onDeleteTransaction }: FinanceChartsProps) {
    const listRef = useRef<HTMLDivElement>(null);
    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

    const pieData = summary?.byCategory ? Object.entries(summary.byCategory).map(([name, value]) => ({
        name,
        value
    })) : [];

    // Calculate Balance History
    const balanceHistoryData = useMemo(() => {
        if (!transactions || transactions.length === 0) return [];

        // Sort transactions by date ascending
        const sorted = [...transactions].sort((a, b) =>
            new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
        );

        let runningBalance = 0;
        return sorted.map(t => {
            const amount = Number(t.amount);
            if (t.type === 'income') runningBalance += amount;
            else runningBalance -= amount;

            return {
                name: new Date(t.transaction_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                value: runningBalance
            };
        });
    }, [transactions]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Balance History Chart (New) */}
            <div className="lg:col-span-2 xl:col-span-2 h-[300px] p-6 rounded-2xl border border-white/5 bg-[#111] backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={16} className="text-primary" />
                    <h3 className="font-sans font-medium text-sm text-gray-400 tracking-wider uppercase">
                        Fluxo de Caixa
                    </h3>
                </div>
                {balanceHistoryData.length > 0 ? (
                    <NeonChart
                        title=""
                        data={balanceHistoryData}
                        color="#8b5cf6"
                        className="h-full -mt-4"
                    />
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground font-mono text-sm">
                        Dados insuficientes
                    </div>
                )}
            </div>

            {/* Expenses Chart */}
            <div className="h-[300px] p-6 rounded-2xl border border-white/5 bg-[#111] backdrop-blur-sm flex flex-col">
                <h3 className="font-sans font-medium text-sm text-gray-400 tracking-wider uppercase mb-6 flex items-center gap-2">
                    <PieChartIcon size={16} className="text-primary" />
                    Gastos por Categoria
                </h3>
                <div className="flex-1 relative">
                    {!pieData.length ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground font-mono text-sm">
                            Dados insuficientes
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                    isAnimationActive={true}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                >
                                    {pieData.map((entry: { name: string; value: number }, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#18181b', // zinc-900
                                        border: '1px solid #27272a', // zinc-800
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                    }}
                                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                                    formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                                />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    wrapperStyle={{ fontSize: '12px', color: '#a1a1aa', paddingTop: '10px' }}
                                    iconType="circle"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Transactions List */}
            <div className="lg:col-span-2 xl:col-span-3 p-6 rounded-2xl border border-white/5 bg-[#111] backdrop-blur-sm">
                <h3 className="font-sans font-medium text-sm text-gray-400 tracking-wider uppercase mb-6 flex items-center gap-2">
                    <DollarSign size={16} className="text-primary" />
                    Últimas Transações
                </h3>

                {!transactions?.length ? (
                    <div className="text-center py-10 text-muted-foreground font-mono text-sm">
                        Nenhuma transação encontrada.
                    </div>
                ) : (
                    <div ref={listRef} className="space-y-3">
                        <AnimatePresence>
                            {transactions.map((t: Transaction, index: number) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-white/5 hover:border-white/10 hover:bg-zinc-800/50 transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={clsx(
                                            "w-1 h-8 rounded-full",
                                            t.type === 'income' ? "bg-green-500" : "bg-red-500"
                                        )} />
                                        <div>
                                            <div className="font-medium text-white">{t.description}</div>
                                            <div className="text-xs text-gray-500 font-mono flex gap-2">
                                                <span>{new Date(t.transaction_date).toLocaleDateString('pt-BR')}</span>
                                                <span className="text-zinc-600">•</span>
                                                <span className="uppercase">{t.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={clsx(
                                            "font-mono font-medium",
                                            t.type === 'income' ? "text-green-400" : "text-red-400"
                                        )}>
                                            {t.type === 'income' ? '+' : '-'} R$ {Number(t.amount).toFixed(2)}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                            onClick={() => onDeleteTransaction(t.id)}
                                            aria-label="Excluir transação"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
