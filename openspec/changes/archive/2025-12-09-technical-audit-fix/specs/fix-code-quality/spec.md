# Capability: Fix Code Quality

## Context
The codebase currently uses `any` in multiple places, defeating the purpose of TypeScript. Documentation structure is inconsistent, and types are manually maintained instead of generated from the database schema.

## ADDED Requirements

### Requirement: Type Safety
The system MUST enforce strict typing and forbid implicit or explicit `any`.
#### Scenario: Developer attempts to use `any`
Given strict linting rules are enabled
When a developer writes `const x: any = ...`
Then the build or lint process fails with an explicit error.

### Requirement: Database Types
The system MUST use database types generated directly from the Supabase schema.
#### Scenario: Schema change
Given the database schema is updated using migrations
When the developer runs `npm run types:generate`
Then the `src/shared/types/database.ts` file is updated to reflect the new schema
And `src/shared/types.ts` uses these generated types for its entities.
