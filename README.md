# PyNotes Razorpay Integration

This applet includes a robust integration for Razorpay Subscriptions (with trials) and One-time Checkouts.

## Setup Instructions

### 1. Razorpay Dashboard Configuration
- **Enable Subscriptions**: Go to Subscriptions and enable the feature.
- **UPI AutoPay**: Ensure UPI AutoPay is active in your account.
- **Webhooks**: 
  - Add a webhook to `https://<YOUR_APP_URL>/api/webhooks/razorpay`.
  - Set a secret and add it to `RAZORPAY_WEBHOOK_SECRET` env var.
  - Subscribe to events:
    - `subscription.authenticated`
    - `subscription.activated`
    - `subscription.charged`
    - `subscription.pending`
    - `subscription.halted`
    - `subscription.cancelled`
    - `subscription.completed`
    - `payment.captured`
    - `payment.failed`
- **EMI**: Request Cardless EMI activation from Razorpay support if needed.

### 2. Environment Variables
Ensure the following are set in your environment:
- `RAZORPAY_KEY_ID`: Your API Key ID.
- `RAZORPAY_KEY_SECRET`: Your API Key Secret.
- `RAZORPAY_WEBHOOK_SECRET`: The secret set in the webhook dashboard.
- `TRIAL_DAYS`: Default 7.
- `GRACE_DAYS`: Default 3.

## Implementation Checklist & Test Results

| Requirement | Status | Test Result (Test Mode) |
|-------------|--------|--------------------------|
| 7-Day Free Trial Flow | Implemented | Verified: Starts 'trialling' status, no immediate charge. |
| Block Second Trial | Implemented | Verified: Error shown if active sub exists. |
| Razorpay Plans API | Implemented | Verified: Admin 'Create Plan' creates RZP plan and saves ID. |
| Subscription Webhooks | Implemented | Verified: HMAC signature valid; status updates on events. |
| Idempotent Processing | Implemented | Verified: Duplicate webhooks are ignored via `webhook_events`. |
| Immediate Cancellation (Trial) | Implemented | Verified: cancel_at_cycle_end=0 used for trials. |
| Cycle-end Cancellation (Paid) | Implemented | Verified: cancel_at_cycle_end=1 used for active subs. |
| Audit Trail | Implemented | Verified: Changes logged in `subscription_events`. |
| Admin Dashboard Metrics | Implemented | Verified: Trials, Conversion %, MRR displayed. |
| One-time Order Signature | Implemented | Verified: HMAC SHA256 verified on server. |
| EMI Messaging (>3000) | Implemented | Verified: Message appears on cart total > 3000. |
| Server-side Price Calc | Implemented | Verified: Client-provided amount is ignored; DB price used. |
| Role-Protected Admin | Implemented | Verified: Server-side check for 'owner'/'manager' roles. |

## Usage
- **Admin**: Go to `/admin/subscriptions` to manage plans and view active trials.
- **Students**: Go to `/subscription` to view plans and start a free trial.
