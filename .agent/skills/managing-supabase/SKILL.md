---
name: managing-supabase
description: Database design, RLS security, and Edge Function management for Supabase. Use when modifying schema, creating policies, or writing backend logic.
---

# Managing Supabase

This skill governs the backend infrastructure of LifeOS. It ensures that all database changes are secure (RLS), typed (TypeScript), and performant.

## When to use this skill
- When the user asks to "create a table" or "add a column".
- When implementing backend logic (Edge Functions).
- When fixing permission/security issues.

## Workflow

### 1. Schema Changes (Migrations)
NEVER run raw SQL in production without a plan.
1.  **Draft**: Write the SQL in a `.sql` file first.
2.  **RLS**: EVERY table must have `alter table x enable row level security;`.
3.  **Policies**: Define `SELECT`, `INSERT`, `UPDATE`, `DELETE` policies immediately.

### 2. Type Generation
After any schema change, you MUST regenerate types to keep the frontend in sync.
```bash
# Example command (adjust for actual project script)
npm run supabase:types
```

### 3. Edge Functions
Use Edge Functions for logic that requires:
-   Bypassing RLS (Service Key).
-   Third-party APIs (AI, Payments).
-   Heavy computation.

## Security Checklist (Mandatory)
-   [ ] Is RLS enabled?
-   [ ] Are policies restrictive enough (e.g., `auth.uid() = user_id`)?
-   [ ] Are service keys used ONLY in Edge Functions?

## Common Snippets

**Standard RLS Policy (User Owns Data):**
```sql
CREATE POLICY "Users can only access their own data"
ON public.table_name
FOR ALL
USING (auth.uid() = user_id);
```

**Get User ID in Edge Function:**
```typescript
const { data: { user } } = await supabase.auth.getUser(req.headers.get('Authorization')!)
```

## Resources
- [Supabase API Docs](https://supabase.com/docs)
