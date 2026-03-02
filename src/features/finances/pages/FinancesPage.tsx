import React, { useState } from 'react';
import { useFinances } from '../hooks/useFinances';
import { FinanceSummaryCards } from '../components/FinanceSummaryCards';
import { FinanceCharts } from '../components/FinanceCharts';
import { TransactionModal } from '../components/TransactionModal';
import { Plus } from 'lucide-react';

export const FinancesPage = () => {
  const { transactions, summary, isLoading, createTransaction, deleteTransaction } = useFinances();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stats Summary Cards */}
              <FinanceSummaryCards summary={summary} />

              {/* Charts and Transactions */}
              <FinanceCharts 
                transactions={transactions} 
                summary={summary}
                onDeleteTransaction={(id) => deleteTransaction.mutate(id)}
              />
            </div>
          )}
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

