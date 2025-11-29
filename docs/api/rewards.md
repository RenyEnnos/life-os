# Rewards API

- Base: `/api/rewards`
- Auth required

## Endpoints
- `GET /api/rewards` → List rewards
- `POST /api/rewards` → Create reward `{ title: string, points_required: number, description?: string, criteria?: object }`
- `PUT /api/rewards/:id` → Update reward
- `DELETE /api/rewards/:id` → Delete reward

## Responses
- Standard statuses
