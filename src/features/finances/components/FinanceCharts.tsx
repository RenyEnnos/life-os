import { useRef, useMemo } from 'react';
import { Button } from '@/shared/ui/Button';
import { DollarSign, Trash2, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import type { Transaction, FinanceSummary } from '@/shared/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, AreaChart, DonutChart, Title, Text, Flex, Grid } from "@tremor/react";

interface FinanceChartsProps {
    transactions: Transaction[] | undefined;
    summary: FinanceSummary | undefined;
    onDeleteTransaction: (id: string) => void;
}

const valueFormatter = (number: number) => 
  `R$ ${Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(number).toString()}`;

export function FinanceCharts({ transactions, summary, onDeleteTransaction }: FinanceChartsProps) {
    const listRef = useRef<HTMLDivElement>(null);

    const pieData = summary?.byCategory ? Object.entries(summary.byCategory).map(([name, value]) => ({
        name,
        value
    })) : [];

    const balanceHistoryData = useMemo(() => {
        if (!transactions || transactions.length === 0) return [];

        const sorted = [...transactions].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        let runningBalance = 0;
        return sorted.map(t => {
            const amount = Number(t.amount);
            if (t.type === 'income') runningBalance += amount;
            else runningBalance -= amount;

            return {
                date: new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                "Saldo": runningBalance
            };
        });
    }, [transactions]);

    return (
        <Grid numItemsLg={3} className="gap-6 mt-6">
            {/* Balance History Chart */}
            <Card className="lg:col-span-2">
                <Flex justifyContent="start" className="space-x-2">
                    <TrendingUp className="text-zinc-400" size={20} />
                    <Title>Fluxo de Caixa</Title>
                </Flex>
                <Text className="mt-2 text-zinc-400">Evolução do saldo ao longo do tempo</Text>
                {balanceHistoryData.length > 0 ? (
                    <AreaChart
                        className="h-72 mt-8"
                        data={balanceHistoryData}
                        index="date"
                        categories={["Saldo"]}
                        colors={["indigo"]}
                        valueFormatter={valueFormatter}
                        showLegend={false}
                        yAxisWidth={80}
                    />
                ) : (
                    <div className="h-72 flex items-center justify-center text-zinc-500 font-mono text-sm">
                        Dados insuficientes
                    </div>
                )}
            </Card>

            {/* Expenses Donut Chart */}
            <Card>
                <Flex justifyContent="start" className="space-x-2">
                    <PieChartIcon className="text-zinc-400" size={20} />
                    <Title>Gastos por Categoria</Title>
                </Flex>
                <Text className="mt-2 text-zinc-400">Distribuição de despesas</Text>
                {pieData.length > 0 ? (
                    <div className="mt-8">
                        <DonutChart
                            className="h-72"
                            data={pieData}
                            category="value"
                            index="name"
                            valueFormatter={valueFormatter}
                            colors={["violet", "indigo", "rose", "cyan", "amber", "teal"]}
                        />
                    </div>
                ) : (
                    <div className="h-72 flex items-center justify-center text-zinc-500 font-mono text-sm">
                        Dados insuficientes
                    </div>
                )}
            </Card>

            {/* Transactions List */}
            <Card className="lg:col-span-3">
                <Flex justifyContent="start" className="space-x-2">
                    <DollarSign className="text-zinc-400" size={20} />
                    <Title>Últimas Transações</Title>
                </Flex>
                <div className="mt-6">
                    {!transactions?.length ? (
                        <div className="text-center py-10 text-zinc-500 font-mono text-sm">
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
                                                <div className="text-xs text-zinc-500 font-mono flex gap-2">
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
                                                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
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
            </Card>
        </Grid>
    );
}
