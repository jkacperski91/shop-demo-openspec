## Purpose

Provides a containerized database for local development so the backend has a real, disposable, environment-independent database without requiring a database server to be installed on the developer's machine.

## ADDED Requirements

### Requirement: Local database provisioning via a single command
The system SHALL provide a way to start a local database instance using a single documented command, without requiring the database engine to be installed on the host machine.

#### Scenario: Starting the local database
- **WHEN** a developer runs the documented start command from the repository root
- **THEN** a database instance becomes available on a known host and port for the backend to connect to

#### Scenario: Stopping the local database
- **WHEN** a developer runs the documented stop command
- **THEN** the database instance stops accepting connections and no longer runs in the background

### Requirement: Data persistence across restarts
The system SHALL persist database data across restarts of the local database instance unless the developer explicitly resets it.

#### Scenario: Restarting preserves data
- **WHEN** the local database instance is stopped and started again without an explicit reset action
- **THEN** previously stored data is still present after the restart

#### Scenario: Explicit reset clears data
- **WHEN** a developer runs the documented reset command
- **THEN** the database returns to an empty/initial state the next time it starts

### Requirement: Backend connects to the local database
The system SHALL allow the backend service to connect to the local database instance using the local development configuration.

#### Scenario: Backend connects successfully
- **WHEN** the local database instance is running and the backend is started with local development configuration
- **THEN** the backend successfully establishes a connection to the database

#### Scenario: Backend fails to connect when database is not running
- **WHEN** the backend is started with local development configuration while the local database instance is not running
- **THEN** the backend reports a connection failure (e.g., via its health endpoint) rather than silently appearing healthy
