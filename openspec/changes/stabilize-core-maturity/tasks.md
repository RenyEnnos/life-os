# Tasks

- [x] **Data Persistence**: Implement `deleted_at` filtering in `BaseRepo.list` and `softDelete` method. <!-- id: persistence-soft-delete -->
- [x] **AI Assistant**: Verify `POST /api/ai/chat` connectivity from Frontend and fix 404s. <!-- id: ai-chat-fix -->
- [x] **Integrations**: Verify Calendar OAuth `auth-url` usage and `callback` security. <!-- id: calendar-auth-verify -->
- [x] **Integrations**: Verify Media Proxy `api/routes/media.ts` respects CORS/Cookies. <!-- id: media-proxy-verify -->
- [x] **Synapse**: Verify Context HUD data fetching (`ContextGateway`) and remove mocks if services are ready. <!-- id: synapse-hud-verify -->
- [x] **Realtime**: Verify `useRealtime` connection sends cookies correctly and backend accepts them. <!-- id: realtime-verify -->
- [x] **Security**: Audit `ProtectedRoute` behavior and `api/routes/calendar.ts` exposure. <!-- id: security-audit -->
