# Habits API

- Base: `/api/habits`
- Auth required

## Endpoints
- `GET /api/habits` → List habits
- `POST /api/habits` → Create habit
  - Body: `{ title: string, description?: string, type?: 'binary'|'numeric', goal?: number, schedule?: object }`
- `PUT /api/habits/:id` → Update habit
- `DELETE /api/habits/:id` → Remove habit

## Responses
- 200/201 success; 400 validation error; 404 not found
