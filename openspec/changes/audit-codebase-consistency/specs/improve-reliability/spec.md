# improve-reliability Specification

## ADDED Requirements

### Requirement: No Mock Fallback
The system MUST NOT use the file-backed mock store and MUST require real Supabase configuration in every environment.

#### Scenario: Missing Supabase credentials
- **WHEN** Supabase credentials are missing at startup
- **THEN** the server fails fast with a clear error
- **AND** no mock storage is used

#### Scenario: Supabase configured in development
- **WHEN** Supabase credentials are configured in development
- **THEN** the server uses the real Supabase client
- **AND** `/api/dev/status` reports `configured=true`
