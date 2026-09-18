# product-catalog Specification

## Purpose

Provides a persisted catalog of products, manageable through a REST API, so that
downstream shop features (browsing, cart, checkout) have products to operate on.

## Requirements

### Requirement: Product creation
The system SHALL allow a client to create a new product by submitting a name,
description, price, and stock quantity, and SHALL reject creation when required
fields are missing or numeric fields are invalid.

#### Scenario: Successful creation
- **WHEN** a client submits a create request with a name, price >= 0, and stock
  quantity >= 0
- **THEN** the system persists a new product, assigns it a unique identifier, and
  responds with the created product's data including that identifier

#### Scenario: Invalid creation data rejected
- **WHEN** a client submits a create request missing the name, or with a negative
  price or negative stock quantity
- **THEN** the system rejects the request with a validation error and does not
  persist a product

### Requirement: Product listing
The system SHALL allow a client to retrieve the full list of persisted products.

#### Scenario: List returns all products
- **WHEN** a client requests the product collection and products exist
- **THEN** the system responds with the data for every persisted product

#### Scenario: List when catalog is empty
- **WHEN** a client requests the product collection and no products exist
- **THEN** the system responds with an empty list rather than an error

### Requirement: Product retrieval by identifier
The system SHALL allow a client to retrieve a single product by its identifier.

#### Scenario: Existing product returned
- **WHEN** a client requests a product by an identifier that exists
- **THEN** the system responds with that product's data

#### Scenario: Unknown identifier
- **WHEN** a client requests a product by an identifier that does not exist
- **THEN** the system responds with a not-found error

### Requirement: Product update
The system SHALL allow a client to replace an existing product's data, and SHALL
reject the update when required fields are missing or numeric fields are invalid.

#### Scenario: Successful update
- **WHEN** a client submits a full replacement (name, description, price >= 0,
  stock quantity >= 0) for a product identifier that exists
- **THEN** the system replaces the stored product's data and responds with the
  updated product

#### Scenario: Update of unknown identifier
- **WHEN** a client submits an update for a product identifier that does not exist
- **THEN** the system responds with a not-found error and does not create a product

#### Scenario: Invalid update data rejected
- **WHEN** a client submits an update missing the name, or with a negative price
  or negative stock quantity, for a product identifier that exists
- **THEN** the system rejects the request with a validation error and the stored
  product remains unchanged

### Requirement: Product deletion
The system SHALL allow a client to delete an existing product by its identifier.

#### Scenario: Successful deletion
- **WHEN** a client deletes a product identifier that exists
- **THEN** the system removes the product, and a subsequent retrieval of that
  identifier responds with a not-found error

#### Scenario: Deletion of unknown identifier
- **WHEN** a client deletes a product identifier that does not exist
- **THEN** the system responds with a not-found error

### Requirement: Product API documentation
The system SHALL expose machine-readable API documentation and an interactive
documentation UI describing the product endpoints, their request/response shapes,
and validation rules.

#### Scenario: Interactive documentation available
- **WHEN** a client requests the API documentation UI
- **THEN** the system serves interactive documentation listing the product
  endpoints and their expected inputs and outputs
