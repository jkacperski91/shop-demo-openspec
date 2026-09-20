## MODIFIED Requirements

### Requirement: Product listing
The system SHALL display all persisted products in a card grid on the product listing view, retrieved from the backend's product API. Each card SHALL show a placeholder image, a static placeholder category label, the product's name, and its price formatted as currency.

#### Scenario: Listing existing products
- **WHEN** a user opens the product listing view and products exist
- **THEN** the system displays a card for every persisted product, showing its name and its price formatted as currency

#### Scenario: Listing when catalog is empty
- **WHEN** a user opens the product listing view and no products exist
- **THEN** the system displays the listing view without product cards, rather than an error

## ADDED Requirements

### Requirement: Decorative catalog browsing controls
The system SHALL display a category filter chip row, a sort control, and a pagination control on the product listing view, matching the design mockup's layout. Selecting any of these controls SHALL NOT change the set or order of products displayed.

#### Scenario: Selecting a category chip has no effect on results
- **WHEN** a user selects a category filter chip
- **THEN** the displayed products remain unchanged

#### Scenario: Changing the sort control has no effect on results
- **WHEN** a user changes the sort control's value
- **THEN** the displayed products remain unchanged

#### Scenario: Selecting a pagination control has no effect on results
- **WHEN** a user selects a pagination control
- **THEN** the displayed products remain unchanged

### Requirement: Inert add-to-cart control on product cards
Each product card SHALL display an "Add to cart" control that does not add the product to any cart or perform any other action.

#### Scenario: Selecting Add to cart has no effect
- **WHEN** a user selects the "Add to cart" control on a product card
- **THEN** no product is added to any cart and the displayed page is unchanged

### Requirement: Placeholder navigation items
The navigation drawer SHALL display "Orders", "Customers", and "Settings" items alongside the existing "Products" item. Selecting any of these three items SHALL NOT navigate anywhere.

#### Scenario: Selecting a placeholder navigation item has no effect
- **WHEN** a user selects "Orders", "Customers", or "Settings" in the drawer
- **THEN** the system does not navigate and the current view remains displayed

## REMOVED Requirements

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

**Reason**: The product listing view was redesigned as a card grid matching a design mockup and no longer exposes a per-card edit action.
**Migration**: The `/products/$id/edit` route and form still exist unchanged. A future change will add an edit entry point back onto the product card (or another surface) and restore this requirement.

### Requirement: Product deletion
The system SHALL let a user delete an existing product from the product listing view only after confirming the action.

#### Scenario: Confirming deletion removes the product
- **WHEN** a user selects the delete action for a product row and confirms the deletion
- **THEN** the system deletes the product through the backend's product API and removes it from the product listing view

#### Scenario: Canceling deletion leaves the product unchanged
- **WHEN** a user selects the delete action for a product row and cancels the confirmation
- **THEN** the system does not delete the product and the product listing view is unchanged

**Reason**: The product listing view was redesigned as a card grid matching a design mockup and no longer exposes a per-card delete action or the delete-confirmation dialog.
**Migration**: A future change will add a delete entry point back onto the product card (or another surface) and restore this requirement.
