import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import type { FinanceSummary } from '@/shared/types';
import { Card, Metric, Text, BadgeDelta, Flex, Grid } from "@tremor/react";

interface FinanceSummaryCardsProps {
    summary: FinanceSummary | undefined;
}

export function FinanceSummaryCards({ summary }: FinanceSummaryCardsProps) {
    const income = summary?.income || 0;
    const expenses = summary?.expenses || 0;
    const balance = summary?.balance || 0;

    return (
        <Grid numItemsSm={1} numItemsMd={3} className="gap-4">
            <Card className="max-w-full mx-auto" decoration="top" decorationColor="emerald">
                <Flex alignItems="start">
                    <div>
                        <Text className="font-medium uppercase tracking-wider text-xs text-zinc-400">Receitas</Text>
                        <Metric className="mt-1 font-bold text-emerald-500">
                            R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Metric>
                    </div>
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <TrendingUp className="text-emerald-500" size={20} />
                    </div>
                </Flex>
            </Card>

            <Card className="max-w-full mx-auto" decoration="top" decorationColor="rose">
                <Flex alignItems="start">
                    <div>
                        <Text className="font-medium uppercase tracking-wider text-xs text-zinc-400">Despesas</Text>
                        <Metric className="mt-1 font-bold text-rose-500">
                            R$ {expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Metric>
                    </div>
                    <div className="p-2 bg-rose-500/10 rounded-lg">
                        <TrendingDown className="text-rose-500" size={20} />
                    </div>
                </Flex>
            </Card>

            <Card className="max-w-full mx-auto" decoration="top" decorationColor={balance >= 0 ? "blue" : "red"}>
                <Flex alignItems="start">
                    <div>
                        <Text className="font-medium uppercase tracking-wider text-xs text-zinc-400">Saldo Atual</Text>
                        <Metric className={`mt-1 font-bold ${balance >= 0 ? "text-blue-400" : "text-red-400"}`}>
                            R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Metric>
                    </div>
                    <Flex flexDirection="col" alignItems="end" className="space-y-2">
                        <div className={`p-2 rounded-lg ${balance >= 0 ? "bg-blue-500/10" : "bg-red-500/10"}`}>
                            <DollarSign className={balance >= 0 ? "text-blue-400" : "text-red-400"} size={20} />
                        </div>
                        <BadgeDelta deltaType={balance >= 0 ? "moderateIncrease" : "moderateDecrease"} size="xs">
                            {balance >= 0 ? "Positivo" : "Negativo"}
                        </BadgeDelta>
                    </Flex>
                </Flex>
            </Card>
        </Grid>
    );
}
