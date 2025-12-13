# System Reliability Specification

## Purpose
Ensure that core system plumbing (Authentication, Realtime Updates, Routing) is robust, secure, and reliable, preventing "silent failures" or "ghost features".

## ADDED Requirements

### Requirement: Protected Routes
The system SHALL prevent unauthenticated access to the main dashboard and feature routes.

#### Scenario: Unauthenticated Access Attempt
- **WHEN** an unauthenticated user attempts to access `/dashboard` or `/projects`
- **THEN** the system redirects them to the `/login` page
- **AND** does not render the protected content (flash of unstyled content)

### Requirement: Realtime Updates (SSE)
The system SHALL maintain a robust Server-Sent Events connection for realtime state updates.

#### Scenario: SSE Authentication
- **WHEN** the frontend initiates an `EventSource` connection to `/api/realtime`
- **THEN** it must provide valid credentials (cookie or token) that the backend accepts
- **AND** the connection remains open for the session duration
- **AND** automatically reconnects on drop

### Requirement: Neural Chat Availability
The system SHALL ensure the Neural Assistant chat endpoint is reachable.

#### Scenario: Sending a chat message
- **WHEN** frontend sends a POST to `/api/ai/chat` (or similar)
- **THEN** the backend processes the request and returns a response
- **AND** does not return 404 Not Found
