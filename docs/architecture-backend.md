# Backend Architecture Decision: Express vs Serverless (Vercel)

## Evaluation
- Performance: Serverless scales automatically, cold starts mitigated by lightweight handlers; Express requires long-running infra.
- Cost: Serverless pay-per-invocation reduces idle cost; Express needs provisioned servers.
- Scalability: Serverless horizontal scaling by default; Express needs orchestration.
- Maintainability: Serverless aligns with Vercel deployment, simpler pipelines; Express beneficial for complex stateful services.

## Decision
- Adopt Serverless on Vercel for production deployments using `api/index.ts` as the single handler.
- Keep `api/server.ts` for local development (nodemon + tsx), enabling fast iteration.

## Configuration
- `vercel.json` routes `/api/*` to the Node handler.
- All Express routes are mounted in `api/app.ts`, used by both local server and serverless handler.

## Handlers
- Serverless entry: `api/index.ts` → `export default handler(req, res) { return app(req, res) }`.
- Local dev: `api/server.ts` → starts app on `PORT`.
