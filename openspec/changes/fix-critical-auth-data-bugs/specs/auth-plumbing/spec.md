## ADDED Requirements

### Requirement: HTTP Client Credentials
The HTTP client SHALL send cookies with every request by setting `credentials: 'include'` by default.

#### Scenario: Authenticated API call
- **WHEN** `apiFetch` is called without explicit `credentials` option
- **THEN** the request SHALL include `credentials: 'include'` to send HttpOnly cookies

#### Scenario: Custom credentials override
- **WHEN** `apiFetch` is called with explicit `credentials: 'omit'`
- **THEN** the request SHALL use the provided credentials value

---

### Requirement: Protected Route Guard
The application SHALL block access to protected routes when user is not authenticated.

#### Scenario: Unauthenticated user accesses protected route
- **WHEN** a user is not logged in
- **AND** navigates to a protected route (e.g., `/`, `/tasks`, `/journal`)
- **THEN** they SHALL be redirected to `/login`

#### Scenario: Loading state during auth check
- **WHEN** auth status is being verified
- **THEN** a loading indicator SHALL be shown instead of route content

#### Scenario: Authenticated user accesses protected route
- **WHEN** a user is logged in
- **THEN** the protected route content SHALL render normally

---

### Requirement: SSE Cookie Authentication
The realtime SSE endpoint SHALL accept authentication via HttpOnly cookies.

#### Scenario: Cookie token accepted
- **WHEN** a request to `/api/realtime/stream` includes a valid JWT in `req.cookies.token`
- **THEN** the SSE stream SHALL be established for that user

#### Scenario: Token priority order
- **WHEN** multiple token sources are available (cookie, query param, header)
- **THEN** cookie SHALL be checked first, then query param, then Authorization header

---

### Requirement: Supabase Fallback Resilience
The Supabase client initialization SHALL fall back to mock store when configuration is incomplete.

#### Scenario: URL exists but key missing
- **WHEN** `SUPABASE_URL` is set but neither `SUPABASE_SERVICE_ROLE_KEY` nor `SUPABASE_ANON_KEY` are set
- **THEN** the system SHALL log a warning and use the mock store (same as when URL is missing)

#### Scenario: Both URL and key missing
- **WHEN** `SUPABASE_URL` is not set
- **THEN** the system SHALL use the mock store silently for local development
