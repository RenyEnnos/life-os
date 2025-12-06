import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { DollarSign, Trash2, PieChart as PieChartIcon } from 'lucide-react';
import { clsx } from 'clsx';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import type { Transaction } from '@/shared/types';

interface FinanceChartsProps {
    transactions: Transaction[] | undefined;
    summary: any; // Or specific type
    onDeleteTransaction: (id: string) => void;
}

export function FinanceCharts({ transactions, summary, onDeleteTransaction }: FinanceChartsProps) {
    const COLORS = ['#adfa1d', '#ef4444', '#3b82f6', '#eab308', '#a855f7', '#ec4899'];

    const pieData = summary?.byCategory ? Object.entries(summary.byCategory).map(([name, value]) => ({
        name,
        value
    })) : [];

    return (
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
                        {transactions.map((t: Transaction) => (
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
                                        onClick={() => onDeleteTransaction(t.id)}
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
                                    {pieData.map((entry: any, index: number) => (
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
    );
}
