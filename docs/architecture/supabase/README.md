# Supabase and Prisma boundary

Status: ACTIVE_SUPPORTING \
Authority: derived integration boundary under ADR-0001 and issues #85/#87 \
Audience: contributor; AI agent; security \
Owner: repository maintainer \
Last reviewed: 2026-07-18 \
Review by: 2026-10-16 \
Update trigger: Supabase import/script/migration consumer, Prisma authority or runtime-support change \
Supersedes: none \
Superseded by: none \
Authorizes implementation: no

Prisma is the optional durable persistence adapter for the canonical web MVP. `api/mvpRepositoryMode.ts` selects it only when `LIFEOS_MVP_REPOSITORY=prisma` and `DATABASE_URL` is present; package names or `DATABASE_URL` alone do not select it. Runtime ownership is in `api/prismaMvpRepository.ts` and `api/prisma.ts`; `scripts/migrate-file-to-prisma.ts` owns the migration command; `prisma/schema.prisma` and its migrations own the executable database shape.

Supabase is not the canonical web persistence or identity authority. Its proven consumers are experimental/legacy paths:

- Electron runtime client creation uses the exact `@supabase/supabase-js` import in `electron/auth/desktopSession.ts`. `electron/ipc/authHandler.ts` and `electron/sync/engine.ts` consume its `createDesktopSupabaseClient` abstraction; the package import in the handler is type-only.
- `src/shared/lib/supabase.ts` creates a browser client, but no runtime importer was found: **consumer not proven**. Type-only imports in the shared auth store/API do not establish a runtime consumer or canonical identity provider.
- `supabase/migrations/` describes the legacy/broad-suite provider schema. It does not override Prisma or the canonical Express repository contract.
- `npm run types:generate` is the real Supabase CLI consumer. It generates types only and does not prove a supported Supabase runtime or release lane.

Do not infer support from package names, migrations, generated types, or advisory tests. A future Supabase-backed canonical mode needs an explicit product/runtime decision plus isolated auth, RLS, sync, migration, and rollback evidence.
