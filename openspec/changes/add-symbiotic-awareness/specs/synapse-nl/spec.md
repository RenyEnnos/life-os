# synapse-nl Specification

## Purpose

Extend Synapse command palette to interpret natural language task input and automatically populate task fields.

> **Related**: This extends [synapse-bar](file:///c:/Users/pedro/Documents/life-os/openspec/specs/synapse-bar/spec.md) specification.

## ADDED Requirements

### Requirement: NL Task Parsing Endpoint

The system SHALL provide an AI endpoint that extracts structured task data from natural language.

#### Scenario: NL input is parsed successfully
- **GIVEN** a user is authenticated
- **WHEN** the frontend calls `POST /api/ai/parse-task` with `{ input: "Buy flowers tomorrow at 10am" }`
- **THEN** the API returns JSON with shape `{ title, dueDate, dueTime, priority }`
- **AND** `title` is "Buy flowers"
- **AND** `dueDate` is tomorrow's date in ISO format
- **AND** `dueTime` is "10:00"

#### Scenario: Temporal context is injected
- **GIVEN** server time is 2025-12-10T16:00:00
- **WHEN** user input contains "tomorrow"
- **THEN** `dueDate` is 2025-12-11

#### Scenario: Input without time returns null time
- **GIVEN** a user is authenticated
- **WHEN** input is "Clean the garage"
- **THEN** `dueDate` is null
- **AND** `dueTime` is null
- **AND** `priority` is null

#### Scenario: Empty input is rejected
- **GIVEN** a user is authenticated
- **WHEN** the frontend calls `POST /api/ai/parse-task` with `{ input: "" }`
- **THEN** the API returns status 400

---

### Requirement: Synapse NL Detection

The system SHALL detect when Synapse input is natural language vs. a command.

#### Scenario: Command inputs are not sent to AI
- **GIVEN** Synapse Bar is open
- **WHEN** user types `/projects`
- **THEN** the input is treated as a navigation command
- **AND** no AI request is made

#### Scenario: Multi-word inputs trigger NL parsing
- **GIVEN** Synapse Bar is open
- **WHEN** user types "Send invoice to client Friday"
- **THEN** the input is sent to `/api/ai/parse-task`
- **AND** a visual loading indicator is shown

---

### Requirement: Synapse Task Modal Integration

The system SHALL open a pre-filled task modal after successful NL parsing.

#### Scenario: Parsed fields populate task modal
- **GIVEN** NL parsing returns valid structured data
- **WHEN** parsing completes
- **THEN** Synapse Bar closes
- **AND** task creation modal opens with pre-filled title, date, and priority

#### Scenario: Parsing failure falls back gracefully
- **GIVEN** AI returns an error or invalid JSON
- **WHEN** parsing fails
- **THEN** task modal opens with raw input as title only
- **AND** other fields are empty
- **AND** no error is shown to user

---

### Requirement: Synapse NL Visual Feedback

The system SHALL provide visual feedback during AI processing.

#### Scenario: Loading state during parsing
- **GIVEN** Synapse is sending input to AI
- **WHEN** request is in flight
- **THEN** a pulsing border animation is displayed on Synapse Bar
- **AND** input is disabled

#### Scenario: Loading state clears on completion
- **GIVEN** AI parsing completes (success or failure)
- **WHEN** response is received
- **THEN** loading animation stops immediately
