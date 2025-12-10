# media-proxy Specification

## Purpose

Provide image search capabilities via server-side Unsplash proxy, enabling auto-generated project covers without exposing API keys.

## ADDED Requirements

### Requirement: Image Search Proxy Endpoint

The system SHALL provide a search proxy endpoint for Unsplash images.

#### Scenario: User searches for images with valid query
- **GIVEN** a user is authenticated
- **WHEN** the frontend calls `GET /api/media/images?query=beach%20vacation`
- **THEN** the API returns JSON with shape `{ images: string[], total: number }`
- **AND** images are optimized URLs with `w=600` parameter
- **AND** response status is 200

#### Scenario: Pagination is supported
- **GIVEN** a user is authenticated
- **WHEN** the frontend calls `GET /api/media/images?query=nature&page=2`
- **THEN** the API returns the second page of results

#### Scenario: Empty query is rejected
- **GIVEN** a user is authenticated
- **WHEN** the frontend calls `GET /api/media/images?query=`
- **THEN** the API returns status 400
- **AND** the response contains an error message

#### Scenario: Debounce header is included
- **GIVEN** a user is authenticated
- **WHEN** any successful image search is made
- **THEN** the response includes header `X-Debounce-Recommended: 800`

---

### Requirement: Project Cover Auto-Population

The system SHALL automatically fetch a cover image when a project title is entered.

#### Scenario: Cover image loads after title input
- **GIVEN** user opens ProjectModal
- **WHEN** user types a project title and waits 800ms
- **THEN** the system fetches images matching the title
- **AND** displays the first image as the cover preview

#### Scenario: Cover image shows loading state
- **GIVEN** user is typing a project title
- **WHEN** image fetch is in progress
- **THEN** an animated gradient skeleton is displayed

#### Scenario: User can shuffle cover images
- **GIVEN** a cover image is displayed
- **WHEN** user clicks "Shuffle" button
- **THEN** the system fetches the next page of results
- **AND** displays a different image

#### Scenario: No results shows gradient fallback
- **GIVEN** image search returns no results
- **WHEN** cover area is visible
- **THEN** a gradient placeholder is displayed instead of broken image
