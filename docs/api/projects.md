# Projects & SWOT API

- Base: `/api/projects`
- Auth required

## Endpoints
- `GET /api/projects` → List projects
- `POST /api/projects` → Create project `{ name: string, description?: string, area_of_life?: string[], tags?: string[] }`
- `PUT /api/projects/:id` → Update project
- `DELETE /api/projects/:id` → Delete project

### SWOT
- `GET /api/projects/:id/swot` → List SWOT entries
- `POST /api/projects/:id/swot` → Add SWOT `{ category: 'strength'|'weakness'|'opportunity'|'threat', content: string }`
- `PUT /api/projects/swot/:swotId` → Update SWOT
- `DELETE /api/projects/swot/:swotId` → Delete SWOT
