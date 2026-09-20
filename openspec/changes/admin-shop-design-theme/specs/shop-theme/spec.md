## Purpose

The application's light/dark visual theme — palette, typography, and shape — applied consistently across the whole application, plus the toggle that switches between the two.

## ADDED Requirements

### Requirement: Light and dark theme
The system SHALL provide a light theme and a dark theme, each defining background, surface, text, and primary/accent colors, applied consistently across the application's UI.

#### Scenario: Default theme on load
- **WHEN** a user opens the application without a previously selected theme
- **THEN** the system renders the application in the light theme

### Requirement: Theme toggle
The system SHALL provide a control that switches the application between the light and dark theme.

#### Scenario: Switching to dark theme
- **WHEN** a user selects the theme toggle while the light theme is active
- **THEN** the system switches the application's visual theme to dark, restyling the app bar, drawer, and page content accordingly

#### Scenario: Switching back to light theme
- **WHEN** a user selects the theme toggle while the dark theme is active
- **THEN** the system switches the application's visual theme back to light
