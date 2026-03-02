# Research: 05 - Financial Management

## Current State Analysis
- **Model**: `Transaction` and `Budget` types are defined in `src/features/finances/types.ts`.
- **Backend**: `finances.api.ts` exists but needs to be audited for filtering/sorting support.
- **Components**: 
  - `FinanceCharts.tsx`: Good base with Recharts, but needs more interactivity.
  - `FinancesPage.tsx`: **CRITICAL**. Currently contains mock HTML/SVG instead of real components. Needs a complete refactor to use `useFinances`, `useTransactions`, and existing sub-components.
- **Success Criteria (Gap Analysis)**:
  - [x] Log income/expenses (TransactionForm exists).
  - [ ] Dashboard summary cards (Exists but UI in `FinancesPage` is mock).
  - [ ] Interactive charts (Exists in `FinanceCharts` but not fully integrated into page).
  - [ ] Sorting and Filtering (NOT IMPLEMENTED).

## Technical Strategy
1. **Refactor FinancesPage**: Replace the current mock-heavy page with a data-driven one using `useTransactions` and `useFinances` hooks.
2. **Unified Summary**: Ensure summary cards (Balance, Income, Expenses) reflect real-time data from the backend.
3. **Advanced Filtering**: Implement a filter bar (Category, Date Range, Type) that updates the `useTransactions` query.
4. **Budget Progress**: Implement visual indicators for budget limits vs. actual spending.

## Requirements Mapping
- **FIN-01**: Log income/expenses with categories.
- **FIN-02**: Real-time summary cards.
- **FIN-03**: Interactive trend charts.
- **FIN-04**: Sorting and filtering of history.

## Proposed Waves
- **Wave 1**: Page Refactoring & Real Data Integration.
- **Wave 2**: Filters, Sorting & Search UI/Logic.
- **Wave 3**: Budget Visualization & Final Polish.
