# Journal API

- Base: `/api/journal`
- Auth required

## Endpoints
- `GET /api/journal` → List entries
- `POST /api/journal` → Create entry
  - Body: `{ entry_date: string (YYYY-MM-DD), title?: string, content?: string, tags?: string[] }`
- `PUT /api/journal/:id` → Update entry
- `DELETE /api/journal/:id` → Remove entry

## Responses
- Standard 200/201/400/404
