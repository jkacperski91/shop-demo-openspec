# product-management-ui Specification

## Purpose

Provides the admin navigation shell and product management screens so that shop managers can browse, create, edit, and delete products in the catalog exposed by the backend's product API.

## Requirements

### Requirement: Admin navigation shell
The system SHALL provide a top app bar with a menu control that opens a side drawer, and the drawer SHALL contain a "Products" navigation item that navigates to the product listing view.

#### Scenario: Opening the navigation drawer
- **WHEN** a user selects the menu control in the app bar
- **THEN** the system opens the side drawer showing the "Products" navigation item

#### Scenario: Navigating to Products from the drawer
- **WHEN** a user selects the "Products" item in the drawer
- **THEN** the system navigates to the product listing view

### Requirement: Placeholder navigation items
The navigation drawer SHALL display "Orders", "Customers", and "Settings" items alongside the existing "Products" item. Selecting any of these three items SHALL NOT navigate anywhere.

#### Scenario: Selecting a placeholder navigation item has no effect
- **WHEN** a user selects "Orders", "Customers", or "Settings" in the drawer
- **THEN** the system does not navigate and the current view remains displayed

### Requirement: Product listing
The system SHALL display all persisted products in a card grid on the product listing view, retrieved from the backend's product API. Each card SHALL show a placeholder image, a static placeholder category label, the product's name, and its price formatted as currency.

#### Scenario: Listing existing products
- **WHEN** a user opens the product listing view and products exist
- **THEN** the system displays a card for every persisted product, showing its name and its price formatted as currency

#### Scenario: Listing when catalog is empty
- **WHEN** a user opens the product listing view and no products exist
- **THEN** the system displays the listing view without product cards, rather than an error

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
