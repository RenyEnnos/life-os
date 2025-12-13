## ADDED Requirements

### Requirement: Realtime Journal Subscription
The realtime system SHALL subscribe to the correct `journal_entries` table.

#### Scenario: Journal entry created
- **WHEN** a new journal entry is inserted into `journal_entries` table
- **THEN** an SSE event named `journal_entries` SHALL be emitted to subscribed clients

#### Scenario: Client listening for journal updates
- **WHEN** the frontend registers an event listener for `journal_entries`
- **THEN** it SHALL receive events when journal entries are created/updated/deleted

---

### Requirement: SSE Client Cookie Authentication
The frontend SSE client SHALL use cookie-based authentication.

#### Scenario: EventSource with credentials
- **WHEN** `useRealtime` creates an EventSource connection
- **THEN** it SHALL use `{ withCredentials: true }` to include HttpOnly cookies
- **AND** SHALL NOT require a token from localStorage

---

### Requirement: AI Chat Endpoint
The API SHALL provide a chat endpoint for AI conversations.

#### Scenario: Successful chat request
- **WHEN** a POST request to `/api/ai/chat` includes a message
- **AND** the user is authenticated
- **THEN** the response SHALL include an AI-generated message
- **AND** the usage SHALL be logged to `ai_logs`

#### Scenario: Chat with optional context
- **WHEN** a chat request includes a `context` field
- **THEN** the AI generation SHALL use the context as system prompt

#### Scenario: Chat mode selection
- **WHEN** a chat request includes `mode: 'speed'` or `mode: 'deep_reason'`
- **THEN** the AI SHALL use the corresponding strategy (Groq+Gemini Flash vs Gemini Pro)

#### Scenario: Unauthenticated chat request
- **WHEN** a POST request to `/api/ai/chat` is made without authentication
- **THEN** the response SHALL be 401 Unauthorized

---

### Requirement: Calendar Callback Authentication
The calendar OAuth callback SHALL require authentication.

#### Scenario: Authenticated callback
- **WHEN** `/api/calendar/callback` is called with valid authentication
- **THEN** the callback SHALL process the OAuth code for the authenticated user

#### Scenario: Unauthenticated callback
- **WHEN** `/api/calendar/callback` is called without authentication
- **THEN** the response SHALL be 401 Unauthorized
