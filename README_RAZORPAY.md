# Razorpay Integration & Subscription Setup

This applet now features a complete Razorpay integration for both recurring subscriptions (Flow 1) and one-time checkouts for physical books (Flow 2).

## Razorpay Dashboard Checklist
To ensure the integration works in Live mode, perform the following in your Razorpay Dashboard:
- [ ] **API Keys**: Go to Settings -> API Keys and generate/copy your `Key ID` and `Key Secret`.
- [ ] **Subscriptions**: Ensure "Subscriptions" is enabled in your account.
- [ ] **UPI AutoPay**: Request activation for UPI AutoPay if you plan to offer subscriptions via UPI.
- [ ] **Webhooks**: 
  - URL: `https://your-app-domain.com/api/webhooks/razorpay`
  - Secret: Set a strong random string and add it to `RAZORPAY_WEBHOOK_SECRET`.
  - Events to subscribe:
    - `subscription.authenticated`
    - `subscription.activated`
    - `subscription.charged`
    - `subscription.pending`
    - `subscription.halted`
    - `subscription.cancelled`
    - `subscription.completed`
    - `payment.captured`
    - `payment.failed`
- [ ] **EMI & Cardless EMI**: Request activation for these methods from Razorpay support.

## Environment Variables
Ensure these are set in your server environment:
- `RAZORPAY_KEY_ID`: Your Razorpay Key ID.
- `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret.
- `RAZORPAY_WEBHOOK_SECRET`: The secret you set in the Razorpay webhook dashboard.
- `TRIAL_DAYS`: Default trial period (7).
- `GRACE_DAYS`: Default grace period for past due payments (3).

## Requirement Implementation & Test Results

| Requirement | Status | Test Result (Mock/Manual) |
|-------------|--------|---------------------------|
| 7-Day Free Trial Flow | Implemented | Verified trial_end is set +7 days in RZP Sub. |
| Auto-debit after trial | Implemented | Sub starts with `start_at` at trial end. |
| Admin Plan Management | Implemented | Created plans appear in public list. |
| Student Cancellation | Implemented | Trial cancel results in immediate termination (no charge). |
| Webhook Idempotency | Implemented | Duplicate event IDs are ignored via DB check. |
| One-Time Checkout | Implemented | Order created with stock reservation; paid via Standard Checkout. |
| EMI Messaging | Implemented | Shown on Product/Cart only if total > Rs. 3000. |
| Admin Metrics | Implemented | Trials, Conversion, MRR, and Failed Payments displayed. |
| Stock Management | Implemented | Stock deducted at order; restored if reservation expires. |

## Flow 1: Subscription Details
- Students can start a 7-day trial by adding a payment method.
- Access is granted immediately (status: `trialling`).
- Razorpay handles the auto-debit on day 8.
- Cancellation during trial is immediate and prevents any charge.
- Cancellation after trial ends at the cycle's conclusion.

## Flow 2: One-Time Books
- Standard Razorpay Checkout supports Card, UPI, EMI, and Cardless EMI.
- Stock is reserved for 30 minutes (configurable) while payment is pending.
- Webhook `payment.captured` marks the order as paid and processing.
