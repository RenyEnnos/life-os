# Health API

- Base: `/api/health`
- Auth required

## Endpoints
- `GET /api/health` → List metrics
- `POST /api/health` → Create metric
  - Body: `{ metric_type: string, value: number, unit?: string, recorded_date: string (YYYY-MM-DD) }`
- `PUT /api/health/:id` → Update metric
- `DELETE /api/health/:id` → Remove metric

## Responses
- Standard statuses
