import { useRef, useMemo } from 'react';
import { Button } from '@/shared/ui/Button';
import { DollarSign, Trash2, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area,
    XAxis
} from 'recharts';
import type { Transaction, FinanceSummary } from '@/shared/types';
import { motion, AnimatePresence } from 'framer-motion';
import { BentoCard } from '@/shared/ui/BentoCard';

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
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        let runningBalance = 0;
        return sorted.map(t => {
            const amount = Number(t.amount);
            if (t.type === 'income') runningBalance += amount;
            else runningBalance -= amount;

            return {
                name: new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                value: runningBalance
            };
        });
    }, [transactions]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Balance History Chart (New) */}
            <BentoCard
                title="Fluxo de Caixa"
                icon={TrendingUp}
                className="lg:col-span-2 xl:col-span-2 h-[300px]"
            >
                <div className="h-full w-full pt-4">
                    {balanceHistoryData.length > 0 ? (
                        <div className="w-full h-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={balanceHistoryData}>
                                    <defs>
                                        <linearGradient id="gradient-balance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#52525b"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#18181b',
                                            border: '1px solid #27272a',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                                        }}
                                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                                        labelStyle={{ display: 'none' }}
                                        cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        formatter={(value: number | string) => `R$ ${Number(value).toFixed(2)}`}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        fill="url(#gradient-balance)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground font-mono text-sm">
                            Dados insuficientes
                        </div>
                    )}
                </div>
            </BentoCard>

            {/* Expenses Chart */}
            <BentoCard
                title="Gastos por Categoria"
                icon={PieChartIcon}
                className="h-[300px]"
            >
                <div className="h-full w-full pt-4 relative">
                    {!pieData.length ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground font-mono text-sm pb-8">
                            Dados insuficientes
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
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
                                    formatter={(value: number | string) => `R$ ${Number(value).toFixed(2)}`}
                                />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    wrapperStyle={{ fontSize: '10px', color: '#a1a1aa', paddingTop: '0px' }}
                                    iconType="circle"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </BentoCard>

            {/* Transactions List */}
            <BentoCard
                title="Últimas Transações"
                icon={DollarSign}
                className="lg:col-span-2 xl:col-span-3 min-h-[300px]"
            >
                <div className="pt-4  pb-2">
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
                                        className="flex items-center justify-between p-4 bg-zinc-900/40 rounded-xl border border-white/5 hover:border-white/10 hover:bg-zinc-800/50 transition-all duration-200 group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className={clsx(
                                                "w-1 h-8 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                                                t.type === 'income' ? "bg-green-500 shadow-green-500/20" : "bg-red-500 shadow-red-500/20"
                                            )} />
                                            <div>
                                                <div className="font-medium text-white">{t.description}</div>
                                                <div className="text-xs text-gray-500 font-mono flex gap-2">
                                                    <span>{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                                                    <span className="text-zinc-600">•</span>
                                                    <span className="uppercase tracking-wider text-[10px]">{t.category}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 relative z-10">
                                            <span className={clsx(
                                                "font-mono font-medium tracking-tight",
                                                t.type === 'income' ? "text-green-400" : "text-red-400"
                                            )}>
                                                {t.type === 'income' ? '+' : '-'} R$ {Number(t.amount).toFixed(2)}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
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
            </BentoCard>
        </div>
    );
}
