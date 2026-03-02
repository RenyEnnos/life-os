import React, { useState } from 'react';
import { useFinances } from '../hooks/useFinances';
import { useBudgets } from '../hooks/useBudgets';
import { FinanceSummaryCards } from '../components/FinanceSummaryCards';
import { FinanceCharts } from '../components/FinanceCharts';
import { FinanceFilterBar } from '../components/FinanceFilterBar';
import { TransactionModal } from '../components/TransactionModal';
import { BudgetProgressCard } from '../components/BudgetProgressCard';
import { Plus } from 'lucide-react';

export const FinancesPage = () => {
  const [filters, setFilters] = useState<Record<string, string>>({
    type: '',
    category: '',
    startDate: '',
    endDate: ''
  });
  
  const { transactions, summary, isLoading: isFinancesLoading, createTransaction, deleteTransaction } = useFinances(filters);
  const { budgetStatus, isLoading: isBudgetsLoading } = useBudgets();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClearFilters = () => {
    setFilters({
      type: '',
      category: '',
      startDate: '',
      endDate: ''
    });
  };

  const isLoading = isFinancesLoading || isBudgetsLoading;

  return (
    <div className="min-h-screen bg-oled text-white font-display selection:bg-primary/30">
      <div className="flex min-h-screen">
        {/* Main Content Area */}
        <main className="flex-1 p-8">
          {/* Header Section */}
          <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-4xl font-black tracking-tight text-white">Finanças</h2>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg shadow-primary/20"
              >
                <Plus size={18} />
                Nova Transação
              </button>
            </div>
          </header>

          <div className="space-y-8">
            <FinanceFilterBar 
              filters={filters} 
              onFilterChange={setFilters} 
              onClear={handleClearFilters} 
            />

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                  {/* Stats Summary Cards */}
                  <FinanceSummaryCards summary={summary} />

                  {/* Charts and Transactions */}
                  <FinanceCharts 
                    transactions={transactions} 
                    summary={summary}
                    onDeleteTransaction={(id) => deleteTransaction.mutate(id)}
                  />
                </div>

                <div className="lg:col-span-4 space-y-8">
                  {/* Budget Progress Card */}
                  <BudgetProgressCard budgets={budgetStatus} isLoading={isBudgetsLoading} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <TransactionModal 
          onClose={() => setIsModalOpen(false)}
          onSubmit={(data) => {
            createTransaction.mutate(data as any);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

