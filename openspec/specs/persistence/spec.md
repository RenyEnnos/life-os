# persistence Specification

## Purpose
TBD - created by archiving change stabilize-core-maturity. Update Purpose after archive.
## Requirements
### Requirement: Soft Delete
The system SHALL support soft deletion for all primary entities (Tasks, Transactions, etc.), preserving data execution history.

#### Scenario: User deletes an item
- **WHEN** user requests to delete an entity (e.g., Task)
- **THEN** the system marks the entity as deleted (`deleted_at` timestamp)
- **AND** the entity is no longer returned in standard `list` queries
- **AND** the entity remains in the database for audit/recovery

