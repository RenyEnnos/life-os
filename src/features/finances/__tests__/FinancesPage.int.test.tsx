import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FinancesPage from '../index'

const createTransactionMutate = vi.fn()
const deleteTransactionMutate = vi.fn()

vi.mock('../hooks/useFinances', () => ({
  useFinances: () => ({
    transactions: [
      {
        id: 'tx-1',
        description: 'Groceries',
        amount: 120.5,
        type: 'expense',
        category: 'Food',
        date: '2026-03-20T00:00:00.000Z',
      },
      {
        id: 'tx-2',
        description: 'Salary',
        amount: 3500,
        type: 'income',
        category: 'Work',
        date: '2026-03-19T00:00:00.000Z',
      },
    ],
    summary: {
      income: 3500,
      expenses: 120.5,
      balance: 3379.5,
      byCategory: {
        Food: 120.5,
      },
    },
    isLoading: false,
    createTransaction: {
      mutate: createTransactionMutate,
    },
    deleteTransaction: {
      mutate: deleteTransactionMutate,
    },
  }),
}))

vi.mock('../hooks/useBudgets', () => ({
  useBudgets: () => ({
    budgetStatus: [
      {
        categoryId: 'budget-1',
        categoryName: 'Food',
        limit: 500,
        spent: 120.5,
        remaining: 379.5,
        status: 'safe',
        period: 'monthly',
      },
    ],
    isLoading: false,
  }),
}))

vi.mock('../components/FinanceFilterBar', () => ({
  FinanceFilterBar: () => <div data-testid="finance-filter-bar">Finance Filter Bar</div>,
}))

vi.mock('../components/FinanceSummaryCards', () => ({
  FinanceSummaryCards: ({ summary }: { summary?: { balance?: number } }) => (
    <div data-testid="finance-summary-cards">Balance: {summary?.balance}</div>
  ),
}))

vi.mock('../components/FinanceCharts', () => ({
  FinanceCharts: ({
    transactions,
    onDeleteTransaction,
  }: {
    transactions?: Array<{ id: string; description: string }>
    onDeleteTransaction: (id: string) => void
  }) => (
    <div data-testid="finance-charts">
      {transactions?.map((transaction) => (
        <button key={transaction.id} onClick={() => onDeleteTransaction(transaction.id)}>
          Delete {transaction.description}
        </button>
      ))}
    </div>
  ),
}))

vi.mock('../components/BudgetProgressCard', () => ({
  BudgetProgressCard: ({ budgets }: { budgets?: Array<{ categoryName: string }> }) => (
    <div data-testid="budget-progress-card">
      {budgets?.map((budget) => budget.categoryName).join(', ')}
    </div>
  ),
}))

vi.mock('../components/TransactionModal', () => ({
  TransactionModal: ({
    onClose,
    onSubmit,
  }: {
    onClose: () => void
    onSubmit: (payload: { amount: number; description: string; type: 'expense' }) => void
  }) => (
    <div data-testid="transaction-modal">
      <h3>NOVA TRANSAÇÃO</h3>
      <button
        onClick={() =>
          onSubmit({
            amount: 42,
            description: 'Emergency fund',
            type: 'expense',
          })
        }
      >
        Save transaction
      </button>
      <button onClick={onClose}>Close modal</button>
    </div>
  ),
}))

describe('FinancesPage integration', () => {
  beforeEach(() => {
    createTransactionMutate.mockReset()
    deleteTransactionMutate.mockReset()
  })

  it('renders the current finance shell with summary, transactions, and budgets', async () => {
    const user = userEvent.setup()

    render(<FinancesPage />)

    expect(screen.getByRole('heading', { name: /finanças/i })).toBeVisible()
    expect(screen.getByRole('button', { name: /nova transação/i })).toBeVisible()
    expect(screen.getByTestId('finance-filter-bar')).toBeVisible()
    expect(screen.getByTestId('finance-summary-cards')).toHaveTextContent('3379.5')
    expect(screen.getByRole('button', { name: /delete groceries/i })).toBeVisible()
    expect(screen.getByRole('button', { name: /delete salary/i })).toBeVisible()
    expect(screen.getByTestId('budget-progress-card')).toHaveTextContent('Food')

    await user.click(screen.getByRole('button', { name: /delete groceries/i }))

    expect(deleteTransactionMutate).toHaveBeenCalledWith('tx-1')
  })

  it('opens the transaction modal from the CTA and submits through the current desktop flow', async () => {
    const user = userEvent.setup()

    render(<FinancesPage />)

    expect(screen.queryByTestId('transaction-modal')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /nova transação/i }))

    expect(screen.getByTestId('transaction-modal')).toBeVisible()

    await user.click(screen.getByRole('button', { name: /save transaction/i }))

    expect(createTransactionMutate).toHaveBeenCalledWith({
      amount: 42,
      description: 'Emergency fund',
      type: 'expense',
    })
    expect(screen.queryByTestId('transaction-modal')).not.toBeInTheDocument()
  })
})
