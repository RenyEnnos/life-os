# Media Hub Specification

## Purpose
Provide a robust service for fetching and managing aesthetic assets (covers, backgrounds) for projects and dashboard elements, ensuring functionality across all environments (dev/prod).

## ADDED Requirements

### Requirement: Unsplash Image Search
The system SHALL provide an interface to search and select images from Unsplash for Project covers.

#### Scenario: User searches for cover
- **WHEN** user types a query in the "Cover Image" modal
- **THEN** the system fetches results from the Unsplash proxy endpoint (`/api/media/images`)
- **AND** displays the images in a grid
- **AND** handles pagination or infinite scroll (optional for v1)

### Requirement: Environment Agnostic Fetching
The frontend SHALL use the correct API base URL when fetching media assets, avoiding hardcoded localhost references.

#### Scenario: API Call in Production
- **WHEN** the app is running in a production environment (not localhost:5173)
- **THEN** API calls are directed to the same origin (`/api/...`) or the configured backend URL
- **AND** CORS headers are respected
