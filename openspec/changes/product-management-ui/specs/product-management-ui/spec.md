## Purpose

Provides the admin navigation shell and product management screens so that shop managers can browse, create, edit, and delete products in the catalog exposed by the backend's product API.

## ADDED Requirements

### Requirement: Admin navigation shell
The system SHALL provide a top app bar with a menu control that opens a side drawer, and the drawer SHALL contain a "Products" navigation item that navigates to the product listing view.

#### Scenario: Opening the navigation drawer
- **WHEN** a user selects the menu control in the app bar
- **THEN** the system opens the side drawer showing the "Products" navigation item

#### Scenario: Navigating to Products from the drawer
- **WHEN** a user selects the "Products" item in the drawer
- **THEN** the system navigates to the product listing view

### Requirement: Product listing
The system SHALL display all persisted products in a table on the product listing view, retrieved from the backend's product API.

#### Scenario: Listing existing products
- **WHEN** a user opens the product listing view and products exist
- **THEN** the system displays a table row for every persisted product, showing its name, price, and stock quantity

#### Scenario: Listing when catalog is empty
- **WHEN** a user opens the product listing view and no products exist
- **THEN** the system displays the listing view without table rows, rather than an error

### Requirement: Product creation
The system SHALL let a user navigate from the product listing view to a product form, and SHALL create a new product from that form's data only when all required fields are valid.

#### Scenario: Navigating to the creation form
- **WHEN** a user selects the "Add new product" action on the product listing view
- **THEN** the system navigates to an empty product form

#### Scenario: Blocked submission for invalid input
- **WHEN** a user submits the product form with the name left empty, or with a negative price or negative stock quantity
- **THEN** the system displays a validation error for each invalid field and does not submit the form

#### Scenario: Successful creation
- **WHEN** a user submits the product form with a valid name, price, and stock quantity
- **THEN** the system creates the product through the backend's product API and returns the user to the product listing view showing the new product

#### Scenario: Creation rejected by the backend
- **WHEN** a user submits the product form with data the client considers valid but the backend's product API rejects
- **THEN** the system keeps the user on the form and displays the error returned by the backend, without navigating away

### Requirement: Product editing
The system SHALL let a user open an existing product's data in the product form from the product listing view, and SHALL replace that product's stored data only when all required fields are valid.

#### Scenario: Navigating to the edit form
- **WHEN** a user selects the edit action for a product row on the product listing view
- **THEN** the system navigates to the product form pre-filled with that product's current data

#### Scenario: Blocked submission for invalid input
- **WHEN** a user edits an existing product's data so the name is empty, or the price or stock quantity is negative, and submits
- **THEN** the system displays a validation error for each invalid field and does not submit the form

#### Scenario: Successful update
- **WHEN** a user edits an existing product's data validly and submits
- **THEN** the system replaces the product's stored data through the backend's product API and returns the user to the product listing view showing the updated data

#### Scenario: Update rejected by the backend
- **WHEN** a user submits an edit the client considers valid but the backend's product API rejects
- **THEN** the system keeps the user on the form and displays the error returned by the backend, without navigating away

### Requirement: Product deletion
The system SHALL let a user delete an existing product from the product listing view only after confirming the action.

#### Scenario: Confirming deletion removes the product
- **WHEN** a user selects the delete action for a product row and confirms the deletion
- **THEN** the system deletes the product through the backend's product API and removes it from the product listing view

#### Scenario: Canceling deletion leaves the product unchanged
- **WHEN** a user selects the delete action for a product row and cancels the confirmation
- **THEN** the system does not delete the product and the product listing view is unchanged
