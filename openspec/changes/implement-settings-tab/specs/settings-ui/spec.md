# Spec: Settings UI

**Capability ID:** `settings-ui`
**Feature:** Configuration & Preferences
**Status:** DRAFT

## Summary
The Settings UI provides a centralized hub for managing user preferences (Theme, AI) and monitoring system health (Performance Stats, Logs).

## Requirements

### ADDED Requirements

#### Requirement: Global Appearance Control
The system MUST allow users to toggle between Light and Dark modes.
#### Scenario: User clicks "Theme Toggler"
    -   **Given** the current theme is "System" or "Light",
    -   **When** the user activates the toggle,
    -   **Then** the UI IMMEDIATELY switches to Dark Mode and persists the preference.

#### Requirement: AI Behavior Configuration
The system MUST allow users to enable/disable "Low-IA Mode" to save tokens/cost.

#### Scenario: User enables Low-IA Mode
    -   **When** the toggle is switched ON,
    -   **Then** the system updates the user's profile metadata via API `PUT /auth/profile`.
    -   **And** automatic background AI triggers are disabled.

#### Requirement: Performance Monitoring Dashboard
The system MUST display real-time performance metrics.

#### Scenario: User views Settings
    -   **Then** a "Performance Monitor" card displays Throughput, Average Latency, and P95 Latency.
    -   **And** a "Live Logs" table shows the most recent system execution logs.
