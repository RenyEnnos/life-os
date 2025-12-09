# Capability: Harden Security

## Context
Several security vulnerabilities were identified: conflict in RLS policies allowing potentially unauthorized access, unvalidated PUT endpoints, lack of CSV input sanitization, and permissive CORS/headers settings.

## ADDED Requirements

### Requirement: Input Validation
The system MUST validate all API request bodies against strict schemas (Zod).
#### Scenario: Invalid PUT request
Given a PUT endpoint `/api/transactions/:id`
When a client sends a payload with extra fields or invalid types
Then the API returns a 400 Bad Request
And the database record is NOT updated.

#### Scenario: CSV Injection attempt
Given the CSV import endpoint
When a user uploads a CSV containing cells starting with `=`, `+`, `-`, or `@`
Then the system sanitizes these characters (e.g., by escaping or stripping) before processing/storing.

### Requirement: Access Control
The system MUST enforce Row Level Security (RLS) correctly without conflicting grants.
#### Scenario: Anonymous Access
Given the public schema RLS is enabled
When an unauthenticated user attempts to query a protected table
Then the query is denied by the database policy
And no data is returned.

### Requirement: Network Security
The system MUST use secure headers and restrictive CORS policies in production.
#### Scenario: Production Deployment
Given the application is running in `production` mode
When a client requests a resource
Then the response includes security headers (Helmet defaults)
And CORS is restricted to the specific production domains.
