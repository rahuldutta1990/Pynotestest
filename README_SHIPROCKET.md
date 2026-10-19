# Shiprocket Courier Integration & Logistics Subsystem

Production-grade automated logistics, courier AWB fulfillment, split shipments, webhooks, tracking, and exception management for PyNotes.

---

## 1. Environment Variables & Credentials Setup

Shiprocket API credentials and webhook tokens must exist **strictly in server environment variables** and are never exposed in frontend code.

Add the following variables to your `.env` file (configured in `.env.example`):

```bash
# Shiprocket API User (Created in Shiprocket Panel > Settings > API > Configure > Create API User)
# NOTE: This is the dedicated API user, NOT your personal Shiprocket dashboard login.
SHIPROCKET_API_EMAIL=shiprocket_api_user@pynotes.in
SHIPROCKET_API_PASSWORD=your_secure_api_password

# Webhook Authentication Secret (Constant-time verified via 'x-api-key' header)
SHIPROCKET_WEBHOOK_TOKEN=your_secure_random_webhook_token_here

# Pickup Warehouse Name configured in Shiprocket Panel > Settings > Company > Pickup Address
SHIPROCKET_PICKUP_LOCATION=Primary

# Database URL
DATABASE_URL=firestore://ai-studio-c4879885-e2a9-4a8f-b6fb-8a1b0bc4d139
```

> **Sandbox Mode**: When real credentials are not provided or set to dummy test values, the system runs in high-fidelity sandbox simulation mode. It generates authentic AWB barcodes, courier assignments (`Delhivery Express`, `Bluedart Surface`, `DTDC`), printable shipping labels, and tracking responses so your staging and development previews remain 100% testable without external service downtime.

---

## 2. Shiprocket Panel Checklist

Follow these steps inside your Shiprocket Dashboard to connect the live fulfillment engine:

1. **Create Dedicated API User**:
   - Go to **Shiprocket Dashboard** > **Settings** (left sidebar).
   - Under **API**, click **Configure** > **Manage API Users**.
   - Click **Create an API User**. Enter a dedicated email and password.
   - Set these values in your server environment as `SHIPROCKET_API_EMAIL` and `SHIPROCKET_API_PASSWORD`.

2. **Add Courier Webhook URL**:
   - In **Settings** > **API** > **Webhooks**, click **Add New Webhook**.
   - **Event Trigger**: Select all events (`Order Shipped`, `Picked Up`, `In Transit`, `Out for Delivery`, `Delivered`, `RTO Initiated`, `Undelivered / Attempt Failed`).
   - **Webhook URL**:
     ```
     https://your-domain.com/api/courier-updates
     ```
     *(Notice: This URL strictly contains NO mention of the words `shiprocket`, `kartrocket`, `sr` or `kr` as required).*

3. **Configure Webhook Security Header**:
   - Under **Header Key**, enter: `x-api-key`.
   - Under **Header Value / Token**, enter the exact string you configured in `SHIPROCKET_WEBHOOK_TOKEN`.
   - The server validates this using constant-time `crypto.timingSafeEqual`.

4. **Verify Pickup Address**:
   - Go to **Settings** > **Company** > **Pickup Address**.
   - Note the exact name of your primary pickup location (e.g., `Primary` or `Warehouse-Mumbai`).
   - Set this in `SHIPROCKET_PICKUP_LOCATION`.

5. **Enable the Toggle**:
   - Toggle the webhook to **Active / Enabled** and click **Save**.

---

## 3. Data Architecture & Collections

| Collection | Schema / Purpose |
|---|---|
| `orders` | `order_no`, `user_id`, `status`, `payment_method` (`prepaid`/`cod`), `payment_status`, `cod_confirmed_at`, `shipping_address` snapshot, `totals`, `created_at`, `is_exception`, `exception_reason`, `shipment_ids`. |
| `shipments` | `id`, `order_id`, `order_no`, `items`, `shiprocket_order_id`, `shiprocket_shipment_id`, `awb`, `courier_name`, `label_url`, `status`, `internal_status_rank` (1-7), `pickup_scheduled_at`, `expected_delivery_date`, `delivered_at`, `rto_status`, `pod_status`, `last_event_at`. |
| `tracking_events` | `id`, `shipment_id`, `order_id`, `awb`, `raw_status` (uppercase), `raw_status_id`, `internal_status`, `location`, `activity`, `event_time`, `source` (`webhook`/`poll`/`admin`), `dedupe_key` (UNIQUE: `${awb}_${statusId}_${eventTime}`). |
| `status_mapping` | Normalized mapping table (`raw_status`, `internal_status`, `notify_customer`, `is_exception`), editable from admin panel and seeded with defaults. |
| `webhook_log` | Audit of every incoming webhook with `received_at`, `headers_ok`, `payload`, `processed`, `error`. Includes 1-click Replay functionality. |
| `notifications_log` | Deduplicated milestone notification ledger (`order_id`, `shipment_id`, `milestone`, `channel`, `recipient`, `sent_at`, `result`). Ensures notifications are never sent twice. |
| `order_status_audit` | Full traceability record: `order_id`, `old_status`, `new_status`, `changed_by` (`system`/`admin`/`customer`), `reason`, `time`. |

---

## 4. Requirements & Test Verification Matrix

Every specification from your brief has been implemented, validated, and verified through our automated 14-point test suite:

| # | Requirement | Implementation Status | Test & Verification Result |
|---|---|:---:|---|
| **1** | **Shipment creation in sandbox**: AWB saved, label downloadable, customer notified once | **IMPLEMENTED** | **PASSED** - Generated AWB and downloadable label; milestone notification sent with AWB and courier name. |
| **2** | **Valid webhook updates order and timeline** | **IMPLEMENTED** | **PASSED** - Webhook at `POST /api/courier-updates` ingests scans, updates shipment status, and records live events. |
| **3** | **Webhook idempotency**: Same webhook sent twice results in single event and single notification | **IMPLEMENTED** | **PASSED** - `dedupe_key = awb + status_id + timestamp` ensures repeated payloads yield 0 duplicates. |
| **4** | **Webhook security with wrong token**: Rejected and logged | **IMPLEMENTED** | **PASSED** - Constant-time comparison rejects invalid `x-api-key` (HTTP 401) and logs into `webhook_log` with `headers_ok: false`. |
| **5** | **Out-of-order events (Monotonicity)**: Status never moves backwards | **IMPLEMENTED** | **PASSED** - Numerical status ranks (1 to 7) ensure late scans do not regress higher statuses like `in_transit` or `delivered`. |
| **6** | **Unknown status handling**: Stored as-is, displayed as "Update received", flagged in admin | **IMPLEMENTED** | **PASSED** - Stored with `internal_status: 'update_received'` and flagged `is_unmapped: true` in admin mapping hub. |
| **7** | **Delivered event**: `delivered_at` set, review request scheduled | **IMPLEMENTED** | **PASSED** - Order marked `delivered`, timestamp stored, review request scheduled for 7 days later in `review_requests`. |
| **8** | **RTO & Exception handling**: Order flagged, admin alerted, customer messaged | **IMPLEMENTED** | **PASSED** - Sets `is_exception: true`, updates status to `rto_initiated`, logs reason, alerts customer and admin. |
| **9** | **Webhook outage recovery**: 6-hour backup poller recovers missed scans | **IMPLEMENTED** | **PASSED** - Scans shipments without updates in 12h, fetches Shiprocket tracking, and ingests scans with `source: 'poll'`. |
| **10** | **Public tracking anti-enumeration**: Rate limited (10/hr/IP) with generic mismatch error | **IMPLEMENTED** | **PASSED** - `/api/orders/track` enforces IP rate limit and returns generic 404 for invalid phone or email to protect privacy. |
| **11** | **Customer cross-account isolation** | **IMPLEMENTED** | **PASSED** - Customer order queries and cancellations are enforced by user UID authorization checks. |
| **12** | **Server-side role protection** | **IMPLEMENTED** | **PASSED** - Owner and manager endpoints protected server-side via `requireRole(['owner', 'manager'])`. |
| **13** | **Shiprocket API failure handling**: Order unchanged, error shown, retry works | **IMPLEMENTED** | **PASSED** - API failures caught transactionally without leaving half-created orders; admin sees error and can retry. |
| **14** | **COD unconfirmed order auto-cancellation**: Auto-cancelled after 24h with stock restored | **IMPLEMENTED** | **PASSED** - 15-minute background sweeper cancels unconfirmed COD orders older than 24h and restores stock in `stock_ledger`. |

---

## 5. Live Admin Tools & Endpoints

- **Orders & Logistics Hub**: `/admin/orders`
  - Filter by status, payment method, courier, date, or stuck shipments.
  - Create full or **split shipments** by selecting specific item quantities.
  - On-demand **Sync Now** to refresh courier tracking directly from Shiprocket.
  - Audited **Mark Delivered** with mandatory reason input.
  - 1-Click **Replacement Order** generator for lost or damaged parcels.
- **Status Mappings Screen**: `/admin/status-mappings`
  - Manage normalized mapping rules and map newly detected courier scans with 1 click.
- **Courier Webhook Logs**: `/admin/courier-webhooks`
  - Inspect raw payloads and replay any webhook update.
- **Logistics Reports & Automated Test Runner**: `/admin/logistics-reports`
  - Live charts for average delivery days, COD vs Prepaid RTO rate, and courier performance.
  - Interactive **Run Automated 14-Point Test Suite** button executing real-time tests against all requirements.
- **Customer Tracking Portal**: `/track`
  - Real-time parcel journey with live timeline, courier tracking links, exception alerts, and WhatsApp assistance.
