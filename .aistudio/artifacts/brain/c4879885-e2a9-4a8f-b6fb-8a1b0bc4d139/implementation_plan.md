# Coupon System Implementation Plan

This plan outlines the implementation of a comprehensive coupon management and redemption system, enabling administrators to create and manage coupons while ensuring secure, server-side validation during the checkout process.

### User Review & Critical Decisions

-   **Timezone Handling**: Timezones will be handled via an admin-configurable setting in the Admin Dashboard, as per user requirement.
-   **RBAC**: Administrators will be identified using an `admin` boolean flag within the user's Firestore document.

### 1. Overview & Core Concept

-   **What It Does**: Enables admins to create discount coupons (percentage or fixed amount), apply them to specific products/categories or the whole store, and provides customers with a secure way to apply these codes at checkout.
-   **Target Audience**: Store Administrators (coupon management) and Customers (discount redemption).
-   **Key Value**: Improves marketing flexibility and boosts sales through targeted promotions.

### 2. User Experience & Visual Design

-   **Admin Flow**: A dedicated "Coupons" section in the Admin Dashboard.
    -   Creation form with fields: Code, Discount Type, Value, Scope (All/Products/Categories), Validity Period, Usage Limits.
    -   Auto-generate code functionality.
    -   List view of all coupons with status (Draft, Active, Paused, Expired) and actions.
    -   Audit log viewing.
-   **Customer Flow**: A "Coupon Code" input field at the checkout summary view.
    -   Real-time validation feedback upon applying a code.
    -   Clear display of the discount amount if applied successfully.

### 3. Key Product Decisions & Trade-Offs

-   **Server-Side Security**: All coupon validation and redemption logic will be handled on the server (using API routes), never trusting client-side calculations.
-   **Data Persistence**: All coupon-related data (`coupons`, `coupon_redemptions`, `coupon_audit_logs`) will be stored in Firestore.
-   **Audit Trail**: Every modification to a coupon or redemption event will be logged in `coupon_audit_logs` for traceability.

### 4. Technical Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                      Client Interface                       │
├─────────────────────┬─────────────────┬─────────────────────┤
│   Admin Dashboard   │                 │   Checkout Flow     │
└──────────┬──────────┘                 └──────────┬──────────┘
           │                                       │
┌──────────▼───────────────────────────────────────▼──────────┐
│                      Server-Side API                        │
│                 (Coupons & Validation Logic)                │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      Firestore DB                           │
│ ┌───────────────┐ ┌──────────────────────┐ ┌───────────────┐│
│ │    Coupons    │ │  Coupon Redemptions  │ │ Audit Logs    ││
│ └───────────────┘ └──────────────────────┘ └───────────────┘│
└─────────────────────────────────────────────────────────────┘
```

-   **Data Model**:
    -   `coupons`: Core entity with rules and scope.
    -   `coupon_redemptions`: Records usage per user/order.
    -   `coupon_audit_logs`: Detailed history of changes.
-   **State Management**:
    -   Client: React `useState` for coupon input and application state in the checkout component.
    -   Database: Server-side validation against current coupon rules fetched from Firestore.
-   **Security**: Firestore rules and server-side check ensuring only `admin` users can perform create/update operations on coupons.
