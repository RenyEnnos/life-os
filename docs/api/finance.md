# Finance API

- Base: `/api/finance`
- Auth required

## Endpoints
- `GET /api/finance/transactions` → List transactions
- `POST /api/finance/transactions` → Create transaction
  - Body: `{ type: 'income'|'expense', amount: number, description: string, transaction_date: string, tags?: string[] }`
- `PUT /api/finance/transactions/:id` → Update transaction
- `DELETE /api/finance/transactions/:id` → Delete transaction
- `GET /api/finance/summary` → Summary `{ income, expense, balance }`

## Responses
- Standard statuses
