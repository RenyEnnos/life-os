# weather-context Specification

## Purpose

Provide weather data to frontend components via server-side proxy, enabling context-aware UI without exposing API keys.

## ADDED Requirements

### Requirement: Weather Proxy Endpoint

The system SHALL provide a cached weather proxy endpoint that returns current conditions.

#### Scenario: User requests weather for valid coordinates
- **GIVEN** a user is authenticated
- **WHEN** the frontend calls `GET /api/context/weather?lat=40.71&lon=-74.01`
- **THEN** the API returns JSON with shape `{ condition, description, temp, icon, cached }`
- **AND** response status is 200

#### Scenario: Weather data is cached
- **GIVEN** weather was fetched for coordinates (40.71, -74.01) less than 30 minutes ago
- **WHEN** another request is made for the same coordinates
- **THEN** the cached data is returned
- **AND** the `cached` field is `true`
- **AND** no external API call is made

#### Scenario: Invalid coordinates are rejected
- **GIVEN** a user is authenticated
- **WHEN** the frontend calls `GET /api/context/weather?lat=999&lon=0`
- **THEN** the API returns status 400
- **AND** the response contains an error message

#### Scenario: Missing coordinates are rejected
- **GIVEN** a user is authenticated
- **WHEN** the frontend calls `GET /api/context/weather` without lat/lon
- **THEN** the API returns status 400
- **AND** the response contains an error message

---

### Requirement: Weather Card Display

The system SHALL display current weather conditions in the Dashboard context zone.

#### Scenario: Weather card renders with current conditions
- **GIVEN** user grants geolocation permission
- **WHEN** Dashboard loads
- **THEN** WeatherCard fetches weather data
- **AND** displays temperature, condition description, and weather icon

#### Scenario: Weather card shows empathetic suggestion
- **GIVEN** weather condition is "Rain"
- **WHEN** WeatherCard renders
- **THEN** a contextual suggestion is displayed (e.g., "Great day for indoor focus")

#### Scenario: Weather card handles location denial gracefully
- **GIVEN** user denies geolocation permission
- **WHEN** Dashboard loads
- **THEN** WeatherCard is hidden or shows placeholder
- **AND** no error is thrown

#### Scenario: Weather card shows skeleton while loading
- **GIVEN** weather data is being fetched
- **WHEN** WeatherCard is visible
- **THEN** an animated skeleton placeholder is displayed
