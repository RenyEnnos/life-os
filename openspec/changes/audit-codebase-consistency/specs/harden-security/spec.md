# harden-security Specification

## ADDED Requirements

### Requirement: Server Secrets Isolation
The system MUST not use client-exposed (VITE_) environment variables for server secrets, and MUST fail fast when `JWT_SECRET` is missing outside tests.

#### Scenario: Missing server secret in production
- **WHEN** `NODE_ENV=production` and `JWT_SECRET` is unset
- **THEN** the server fails to start with an explicit error
- **AND** no requests are served

### Requirement: Protected Diagnostics
The system MUST restrict diagnostic endpoints to authenticated or explicitly enabled environments.

#### Scenario: Unauthenticated diagnostics
- **WHEN** a client requests `/api/db/test-crud` without authentication
- **THEN** the request is rejected with 401
- **AND** no database writes occur

#### Scenario: Production diagnostics disabled
- **WHEN** `NODE_ENV=production` and diagnostics are not explicitly enabled
- **THEN** `/api/dev/status` and `/api/db/*` return 404

### Requirement: CSV Export Sanitization
The system MUST neutralize spreadsheet formula injection in CSV exports.

#### Scenario: Exporting formula-leading values
- **WHEN** a CSV export includes a cell starting with `=`, `+`, `-`, or `@`
- **THEN** the cell is prefixed to render as literal text
- **AND** the stored data remains unchanged

### Requirement: Production CORS Allowlist
The system MUST restrict production CORS to explicit allowlisted origins only.

#### Scenario: Private network origin in production
- **WHEN** a request originates from `http://192.168.0.5:5173` in production
- **THEN** the CORS preflight is rejected
- **AND** the response includes a CORS error
