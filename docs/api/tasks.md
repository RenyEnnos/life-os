# Tasks API

- Base: `/api/tasks`
- Auth: `Bearer <token>` required

## Endpoints
- `GET /api/tasks` → List tasks
  - Query params:
    - `page`, `pageSize` (paginação)
    - `startDate`, `endDate` (filtrar por `due_date`)
    - `completed=true|false`
    - `tag` (filtra presença em `tags`)
    - `projectId`
- `POST /api/tasks` → Create task
  - Body: `{ title: string, description?: string, due_date?: string, tags?: string[] }`
- `PUT /api/tasks/:id` → Update task
  - Body: partial Task
- `DELETE /api/tasks/:id` → Remove task

## Responses
- 200/201 with Task object(s); 400 validation error; 404 not found; 500 server error
