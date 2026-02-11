import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FinanceCharts } from '../FinanceCharts';
import React from 'react';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Recharts ResponsiveContainer to render children directly
vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div style={{ width: 500, height: 300 }}>{children}</div>,
  };
});

describe('FinanceCharts', () => {
  const mockTransactions = [
    {
      id: '1',
      date: new Date().toISOString(),
      amount: 100,
      type: 'income',
      description: 'Salary',
      category: 'Work',
      user_id: 'user1',
      created_at: new Date().toISOString()
    },
    {
        id: '2',
        date: new Date().toISOString(),
        amount: 50,
        type: 'expense',
        description: 'Food',
        category: 'Food',
        user_id: 'user1',
        created_at: new Date().toISOString()
      }
  ];

  const mockSummary = {
    totalIncome: 100,
    totalExpenses: 50,
    balance: 50,
    byCategory: { 'Food': 50 }
  };

  const mockOnDelete = vi.fn();

  it('renders without crashing', () => {
    render(
      <FinanceCharts
        transactions={mockTransactions}
        summary={mockSummary}
        onDeleteTransaction={mockOnDelete}
      />
    );
    expect(screen.getByText('Fluxo de Caixa')).toBeInTheDocument();
    expect(screen.getByText('Gastos por Categoria')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });
});
