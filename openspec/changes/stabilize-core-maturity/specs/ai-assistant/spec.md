## ADDED Requirements
### Requirement: AI Conversation
The system SHALL provide a responsive CHAT endpoint for the Neural Nexus.

#### Scenario: User sends message
- **WHEN** user types in AI Chat
- **THEN** frontend calls `POST /api/ai/chat`
- **AND** backend orchestrates `aiManager` response
- **AND** usage is logged
