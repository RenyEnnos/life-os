# Change: Stabilize Core Maturity

## Why
The application has several critical maturity gaps identified in recent analysis:
1.  **Context HUD (Synapse)**: Reported as mocked/missing consumer.
2.  **Integrations**: Calendar OAuth and Media proxies are broken or insecure.
3.  **AI/Journaling**: Users report 404s on Chat.
4.  **Data Persistence**: Delete operations are destructive or inconsistent.
5.  **Security/Realtime**: Report suggests Auth guards and Realtime token usage/security gaps.

## What Changes
This change aims to stabilize the core pillars of the application by:
1.  **Persistence Layer**: Implementing a consistent Soft Delete strategy across repositories.
2.  **Integrations**: Verifying and fixing Calendar OAuth flow and Media proxy security.
3.  **AI Services**: Ensuring AI routes are correctly mounted and accessible.
4.  **Verification**: Verified "reported" broken features and fixing them only if truly broken.

## Impact
- ** Reliability**: Data will be safer with true Soft Delete.
- ** Functionality**: AI and Calendar features will actually work.
- ** Security**: Realtime and API endpoints will be properly secured.
- ** Specs**: New capabilities `persistence`, `integrations`, `ai-assistant` added.
