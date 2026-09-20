## Purpose

A cart drawer that previews the shopping-cart interaction pattern from the design mockup — opening/closing, adjusting item quantities, and a computed subtotal — ahead of a real cart and checkout being built in a future change.

## ADDED Requirements

### Requirement: Cart drawer visibility
The system SHALL provide a cart icon in the app bar that opens a cart drawer, and a control in the drawer that closes it.

#### Scenario: Opening the cart drawer
- **WHEN** a user selects the cart icon in the app bar
- **THEN** the system opens the cart drawer

#### Scenario: Closing the cart drawer
- **WHEN** a user selects the close control in the cart drawer
- **THEN** the system closes the cart drawer

### Requirement: Cart item count indicator
The app bar cart icon SHALL display a badge showing the total quantity of items currently in the cart.

#### Scenario: Badge reflects total quantity
- **WHEN** the cart contains one or more items
- **THEN** the cart icon displays a badge showing the sum of all item quantities

### Requirement: Cart item quantity adjustment
The cart drawer SHALL display a locally-seeded list of cart items, each with a quantity stepper, and SHALL recompute the displayed subtotal when a quantity changes. There is no way to add a real product to this cart.

#### Scenario: Increasing an item's quantity
- **WHEN** a user selects the increase control for a cart item
- **THEN** the system increases that item's displayed quantity by one and updates the displayed subtotal

#### Scenario: Decreasing an item's quantity
- **WHEN** a user selects the decrease control for a cart item at a quantity greater than one
- **THEN** the system decreases that item's displayed quantity by one and updates the displayed subtotal

### Requirement: Inert checkout control
The cart drawer SHALL display a "Checkout" control that does not perform any action.

#### Scenario: Selecting Checkout has no effect
- **WHEN** a user selects the "Checkout" control in the cart drawer
- **THEN** no checkout, navigation, or network request occurs and the cart drawer remains open showing the same items
