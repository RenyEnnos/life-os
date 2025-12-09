# Capability: Improve Reliability

## Context
Test coverage is critically low (2 frontend tests), and there is no production error monitoring. CI pipeline checks are minimal.

## ADDED Requirements

### Requirement: Observability
The system MUST report runtime errors to a monitoring service (Sentry).
#### Scenario: Client-side error
Given a user experiences a crash or unhandled exception in the browser
Then the error stack trace and context are sent to Sentry.

#### Scenario: Server-side error
Given an API endpoint fails with an unhandled exception
Then the error is logged to Sentry
And strict structured logging (Pino) is output to stdout.

### Requirement: Automated Verification
The system MUST include unit tests for critical business logic paths.
#### Scenario: CI Pipeline
Given a Pull Request is opened
When the CI workflow runs
Then it executes the build process
And runs all unit/integration tests
And fails if any step errors.
