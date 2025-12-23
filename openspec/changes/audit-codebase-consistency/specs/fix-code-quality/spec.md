# fix-code-quality Specification

## MODIFIED Requirements

### Requirement: Type Safety
The system MUST enforce strict typing and forbid implicit or explicit `any` in runtime modules (tests are exempt with justification).

#### Scenario: Developer attempts to use `any` in runtime code
- **WHEN** a developer writes `const x: any = ...` in `src/` or `api/` (non-test)
- **THEN** lint or typecheck fails with an explicit error

#### Scenario: Test scaffolding uses `any`
- **WHEN** `any` is used inside a test file
- **THEN** the usage is limited to tests and does not ship to production bundles
