import { useState } from 'react';
import { Plus, DollarSign } from 'lucide-react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { ShimmerButton } from '@/shared/ui/premium/ShimmerButton'; // Fix import
import { useFinances } from '@/features/finances/hooks/useFinances';
import { Loader } from '@/shared/ui/Loader';
import { EmptyState } from '@/shared/ui/EmptyState';
import { TransactionModal } from './components/TransactionModal';
import { FinanceSummaryCards } from './components/FinanceSummaryCards';
import { FinanceCharts } from './components/FinanceCharts';

export default function FinancesPage() {
    const { transactions, summary, isLoading, createTransaction, deleteTransaction } = useFinances();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-8 pb-20">
            <PageTitle
                title="FINANÇAS"
                subtitle="Fluxo de caixa e alocação de recursos."
                action={
                    <ShimmerButton onClick={() => setIsModalOpen(true)} className="gap-2">
                        <span className="flex items-center gap-2 text-sm font-medium text-white whitespace-pre-wrap leading-none tracking-tight">
                            <Plus size={18} />
                            NOVA TRANSAÇÃO
                        </span>
                    </ShimmerButton>
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
                                <ShimmerButton onClick={() => setIsModalOpen(true)} className="gap-2">
                                    <span className="flex items-center gap-2 text-sm font-medium text-white whitespace-pre-wrap leading-none tracking-tight">
                                        <Plus size={16} /> NOVA TRANSAÇÃO
                                    </span>
                                </ShimmerButton>
                            }
                        />
                    ) : (
                        <>
                            <FinanceSummaryCards summary={summary} />
                            <FinanceCharts
                                transactions={transactions}
                                summary={summary}
                                onDeleteTransaction={deleteTransaction.mutate}
                            />
                        </>
                    )}
                </>
            )}

            {isModalOpen && (
                <TransactionModal onClose={() => setIsModalOpen(false)} onSubmit={createTransaction.mutate} />
            )}
        </div>
    );
}
