# NeighborhoodPickup Commerce Portal - Codex Execution Master Prompt Pack

Use this file as the single source of truth for generating the full app through 10 sequential Codex runs.

## Global Execution Rules

1. All app source code must be created under the `fullstack` directory.
2. All non-code deliverables (design docs, api specs, prompt tracking, questions log, trajectory files) must follow the required submission structure.
3. Frontend must use Vue.js.
4. Backend must use Express with TypeScript.
5. Database must be MySQL.
6. APIs must be REST-style and decoupled from frontend.
7. Authentication must be local username/password only.
8. Do not use email/SMS/push services for notifications.
9. Do not integrate online payment gateways.
10. Settlement must remain internal ledger based.
11. Each prompt must preserve and extend previously implemented functionality.
12. By the end of Prompt 10, the app must be functionally complete for all required features.

---

## Original Prompt (Reference)

Construct a NeighborhoodPickup Commerce Portal supporting offline community group-buying with managed pickup points, group leaders, and transparent member engagement. The Vue.js front end provides a role-based experience for Members, Group Leaders, Reviewers (moderation/arbitration), Finance Clerks, and Administrators. Members browse active buying cycles, follow favorite pickup points and leaders, and participate in threaded discussions on listings and orders with quote-style replies, @mentions, and sortable reply ordering; threads paginate at 20 replies per page and allow quick collapse of content flagged as violating. In-app notifications appear in a local notification center for @mentions and replies and are marked read/unread without relying on email, SMS, or push services. Each pickup point page shows address, business hours, and remaining daily capacity, and members select a pickup window during checkout; if the capacity is exceeded the UI blocks submission and offers the next available window. Group Leaders apply through an onboarding form and are routed to an approval screen where Administrators review credentials and set commission eligibility; performance dashboards show order volume, fulfillment rate, and member feedback trends. When disputes occur, the UI offers an appeals entry point from the hidden content banner or from an order detail screen, allowing a structured appeal submission with local document upload (PDF/JPG/PNG up to 10 MB each, up to 5 files) and status tracking through intake, investigation, and ruling.

The backend uses Express (TypeScript) to expose decoupled REST-style APIs consumed by the Vue.js client over the local network, with MySQL as the system of record for users, pickup points, orders, pricing rules, comments, appeals, and settlements. Authentication is strictly local username/password; passwords require at least 12 characters with complexity rules, are hashed with Argon2, and accounts lock for 15 minutes after 5 failed attempts. Pricing and settlement run as a rule engine that computes traceable line-item totals per order, supporting tiered and capped discounts, member pricing, subsidies, and configurable sales tax by jurisdiction; all amounts settle to an internal ledger (no online payment), and Finance can export reconciliation to CSV for cash/check processing. Group Leader commissions default to 6% of pre-tax item totals unless overridden by pickup point, and withdrawals are risk-controlled with a $500.00 daily limit, a 2-withdrawals-per-week cap, and an admin-maintained blacklist. Key actions generate tamper-evident audit logs (hash-chained entries) for uploads, downloads, sharing, permission changes, approvals, deletes, and rollbacks, searchable by user, time range, and resource and exportable for compliance. Behavior tracking records impressions, clicks, favorites, votes, and watch completion with client- and server-side instrumentation; events use idempotency keys for deduplication, flow through a local queue buffer for asynchronous ingestion, and follow retention policies with hot storage for 90 days and archived storage for 365 days. Sensitive fields (government ID fragments, bank routing for payouts if stored) are encrypted at rest with AES-256 and masked in the UI, and uploaded appeal files are stored on local disk with checksum verification to detect tampering.

---

## Task Breakdown

### 1) Business Logic Breakdown

1. Identity and access control

- Roles: Member, Group Leader, Reviewer, Finance Clerk, Administrator.
- Role guard enforcement in frontend and backend.
- Local login only.
- Password policy: min 12 chars and complexity rules.
- Password hashing with Argon2.
- Account lock for 15 minutes after 5 failed attempts.

2. Community group-buying lifecycle

- Buying cycles with status and participation rules.
- Members browse active cycles and listings.
- Members follow favorite pickup points and leaders.
- Checkout must validate pickup-window capacity in real time.
- Capacity overflow blocks checkout and suggests next available window.

3. Pricing and settlement engine

- Rule engine computes per-line traceable totals.
- Support tiered discounts, capped discounts, member pricing, subsidies, jurisdiction tax.
- Persist rule evaluation details for auditability.
- Settle to internal ledger only.

4. Discussion and moderation

- Threaded discussions on listings and orders.
- Quote-style replies.
- @mentions.
- Sortable replies.
- Pagination fixed at 20 replies/page.
- Flagged content can be quickly collapsed.

5. Notification center

- Local in-app notifications for mentions and replies only.
- Read/unread state management.
- No external channels.

6. Group Leader governance

- Leader onboarding form.
- Admin approval workflow.
- Commission eligibility decision by admin.
- Dashboard metrics: volume, fulfillment rate, feedback trends.

7. Appeals workflow

- Appeal entry from hidden-content banner or order detail.
- Structured form + local document uploads.
- File rules: PDF/JPG/PNG, 10MB max each, up to 5 files.
- Status stages: intake, investigation, ruling.

8. Finance controls

- Default commission = 6% pre-tax item total.
- Pickup-point commission override support.
- Withdrawal limits: $500/day and 2 withdrawals/week.
- Admin blacklist blocks withdrawal.
- Finance reconciliation export to CSV.

9. Security and compliance

- Sensitive data encrypted at rest with AES-256.
- Sensitive values masked in UI.
- Uploaded appeal files stored locally with checksum verification.
- Tamper-evident audit logs with hash chaining.
- Audit search by user/time/resource + export.

10. Behavior tracking and retention

- Track impressions, clicks, favorites, votes, watch completion.
- Client + server instrumentation.
- Idempotency keys for dedup.
- Local queue for async ingestion.
- Retention: hot 90 days, archive 365 days.

### 2) UI Flow Breakdown

1. Authentication flow

- Login screen.
- Lockout warning and blocked login feedback.
- Role-based landing route.

2. Member flow

- Browse active buying cycles.
- Explore listings and pickup points.
- Favorite points and leaders.
- Checkout with pickup window selection and overflow handling.
- Order detail with discussions and appeal entry.
- Notification center for mention/reply events.

3. Group Leader flow

- Onboarding form submit.
- Application status tracking.
- Post-approval dashboard metrics and fulfillment views.

4. Reviewer flow

- Moderation queue.
- Hidden content inspection.
- Appeal review progression across intake/investigation/ruling.

5. Finance Clerk flow

- Settlement and ledger views.
- Commission and withdrawal tools.
- CSV reconciliation exports.

6. Administrator flow

- User/role governance.
- Pickup point management.
- Leader approval and commission eligibility.
- Commission overrides and blacklist management.
- Audit search/export views.

### 3) Database Design Breakdown

1. Identity and access

- users
- roles
- user_roles
- auth_attempts
- sessions

2. Commerce and operations

- pickup_points
- pickup_windows
- pickup_capacity_snapshots
- buying_cycles
- listings
- listing_inventory
- favorites

3. Orders and pricing

- orders
- order_items
- order_pickup_window
- order_status_history
- pricing_rules
- pricing_rule_versions
- tax_jurisdictions

4. Ledger and finance

- ledger_accounts
- ledger_entries
- settlements
- reconciliation_exports
- finance_withdrawals
- withdrawal_limits_tracking
- withdrawal_blacklist

5. Discussion and notifications

- discussions
- comments
- comment_mentions
- comment_flags
- notifications

6. Leader governance

- leaders
- leader_applications
- leader_approvals
- leader_commission_rules
- leader_metrics_daily

7. Appeals and files

- appeals
- appeal_events
- appeal_files

8. Compliance and telemetry

- audit_logs (with previous_hash and current_hash)
- behavior_events_hot
- behavior_events_archive
- ingestion_queue
- ingestion_dedup_keys

9. Security and integrity fields

- encrypted columns for government ID fragments and bank routing (if stored)
- checksum/hash fields for uploaded files

10. Performance and retention

- indexes for role checks, pagination, and search filters
- retention jobs for behavior event lifecycle

---

## 10 Sequential Codex Prompts

## Prompt 1 of 10: Foundation, Auth, RBAC, Baseline Schema

Build the first functional increment of the NeighborhoodPickup Commerce Portal.

Mandatory constraints:

1. Place all app code in `fullstack`.
2. Use Vue.js frontend, Express + TypeScript backend, MySQL database.
3. Keep frontend/backend decoupled via REST APIs.
4. Keep everything local-first.

Implement:

1. Project skeleton with separate frontend/backend apps.
2. Backend setup (TypeScript, linting, env config, migration tooling).
3. Frontend setup (router, store, role-aware layout shell).
4. Local auth:

- Username/password login.
- Password policy: minimum 12 chars + complexity.
- Argon2 hashing.
- Failed-attempt tracking and 15-minute lock after 5 failures.

5. RBAC middleware/guards for Member, Group Leader, Reviewer, Finance Clerk, Administrator.
6. Baseline MySQL schema and migrations:

- users, roles, user_roles, auth_attempts, sessions.

7. Seed script with at least one account per role.
8. APIs:

- POST /auth/login
- POST /auth/logout
- GET /auth/me

9. Minimal UI:

- Login page.
- Role-based home placeholders.

10. Tests:

- login success/fail
- lockout behavior
- role-protected routes.

11. Update documentation with local run instructions.

Definition of Done:

1. Frontend/backend run locally.
2. Login + lockout policy works.
3. RBAC is enforced.
4. Migrations and seeds run.
5. Tests pass.

Return:

1. Files created/updated.
2. Run commands.
3. Test result summary.
4. Remaining gaps for next prompt.

## Prompt 2 of 10: Buying Cycles, Listings, Pickup Points, Capacity, Favorites

Continue from existing implementation without breaking prior features.

Implement:

1. Schema + migrations:

- pickup_points, pickup_windows, pickup_capacity_snapshots
- buying_cycles, listings, listing_inventory
- favorites (pickup points and leaders)

2. APIs:

- GET /buying-cycles/active
- GET /listings?cycleId=
- GET /pickup-points/:id
- POST /favorites/toggle

3. Capacity service:

- compute remaining capacity per day/window.
- expose for UI.
- reusable by checkout.

4. Frontend pages:

- Active cycles page.
- Listing browse page.
- Pickup point detail with address/hours/capacity.
- Favorite toggle UX.

5. Add filtering/sorting/pagination where applicable.
6. Tests:

- active cycle filtering
- favorites persistence
- capacity edge cases.

Definition of Done:

1. Members can browse active cycles and listings.
2. Pickup point detail shows correct capacity/hours.
3. Favorites are persistent.
4. APIs are documented/tested.

Return:

1. Data model summary.
2. Endpoint examples.
3. Test summary and known limitations.

## Prompt 3 of 10: Checkout, Orders, Pricing Rule Engine, Tax, Ledger Posting

Continue from current codebase.

Implement:

1. Schema + migrations:

- orders, order_items, order_pickup_window, order_status_history
- pricing_rules, pricing_rule_versions, tax_jurisdictions
- ledger_accounts, ledger_entries, settlements

2. Pricing engine with traceability:

- line-item calculations
- tiered discounts
- capped discounts
- member pricing
- subsidies
- jurisdiction sales tax
- persisted rule/breakdown traces

3. Checkout:

- member selects pickup window
- hard capacity check at submit time
- if exceeded, reject and return next available window options

4. Settlement:

- internal ledger entries only

5. APIs:

- POST /orders/quote
- POST /orders/checkout
- GET /orders/:id
- GET /finance/ledger

6. Frontend:

- checkout page with pickup window selection
- order detail with full pricing breakdown

7. Tests:

- pricing permutations
- tax correctness
- capacity conflict
- ledger posting validation.

Definition of Done:

1. Checkout respects capacity limits.
2. Pricing engine is traceable and persisted.
3. Settlement entries are generated.
4. Tests pass for core scenarios.

Return:

1. Pricing engine design notes.
2. Capacity conflict UX/API behavior.
3. Test matrix summary.

## Prompt 4 of 10: Discussions, Mentions, Reply Sorting, Flag Collapse, Notification Center

Continue from existing code.

Implement:

1. Schema + migrations:

- discussions, comments, comment_mentions, comment_flags, notifications

2. Discussion features:

- threaded comments on listings and orders
- quote-style reply
- @mentions
- sortable ordering
- pagination fixed at 20 replies/page

3. Moderation UX behavior:

- flagged content collapses quickly
- hidden content banner includes appeal entry shortcut

4. Notifications:

- local in-app center for mention and reply only
- read/unread toggles
- no external messaging channels

5. APIs:

- POST /comments
- GET /threads/:id/comments?page=&sort=
- POST /comments/:id/flag
- GET /notifications
- PATCH /notifications/:id/read-state

6. Frontend:

- thread UI components
- mention highlighting
- collapse/expand flagged content
- notification center page/panel

7. Tests:

- fixed 20-reply pagination
- mention-triggered notifications
- read/unread transitions
- collapse behavior correctness.

Definition of Done:

1. Discussions work on listing and order contexts.
2. In-app notification center is functional.
3. Flagged-content flow supports appeal entry.

Return:

1. Threading architecture summary.
2. Notification state flow summary.
3. Test summary.

## Prompt 5 of 10: Group Leader Onboarding, Approval, Commission Eligibility, Leader Metrics

Continue from existing code.

Implement:

1. Schema + migrations:

- leaders, leader_applications, leader_approvals, leader_commission_rules, leader_metrics_daily

2. Onboarding flow:

- leader application form with validation
- application status tracking
- admin approval/rejection workflow with reason and history
- commission eligibility decision at approval

3. Metrics dashboard:

- order volume
- fulfillment rate
- feedback trend

4. APIs:

- POST /leaders/applications
- GET /leaders/applications/me
- GET /admin/leaders/applications/pending
- POST /admin/leaders/applications/:id/decision
- GET /leaders/dashboard/metrics

5. Frontend:

- leader onboarding page
- admin review queue page
- leader performance dashboard

6. Tests:

- application lifecycle
- admin authorization
- metric aggregation accuracy.

Definition of Done:

1. Leader applies and tracks application status.
2. Admin approval flow is complete.
3. Leader metrics dashboard is functional.

Return:

1. State machine and transitions.
2. Access control summary.
3. Test summary.

## Prompt 6 of 10: Appeals Workflow + Local File Storage + Checksum Integrity

Continue from existing code.

Implement:

1. Schema + migrations:

- appeals, appeal_events, appeal_files

2. Appeal entry points:

- hidden-content banner
- order detail screen

3. Appeal creation:

- structured submission fields
- reason category + narrative + references

4. Upload constraints:

- PDF/JPG/PNG only
- max 10MB each
- max 5 files/appeal
- local disk storage
- checksum generation and persistence for tamper detection

5. Status progression:

- intake -> investigation -> ruling
- maintain event timeline

6. APIs:

- POST /appeals
- POST /appeals/:id/files
- GET /appeals/:id
- GET /appeals/:id/timeline

7. Frontend:

- appeal form UI
- upload widget with constraints/progress/errors
- appeal timeline/status page

8. Tests:

- file type/size/count validation
- checksum verification path
- state transition integrity.

Definition of Done:

1. Appeals can be submitted from both required entry points.
2. File rules are strictly enforced.
3. Timeline/status tracking works.

Return:

1. Upload security design.
2. Appeal status logic.
3. Test summary.

## Prompt 7 of 10: Finance Operations, Commissions, Withdrawal Limits, Blacklist, CSV Reconciliation

Continue from existing code.

Implement:

1. Schema + migrations:

- finance_withdrawals, withdrawal_limits_tracking, withdrawal_blacklist, reconciliation_export_jobs

2. Commission policy:

- default 6% pre-tax item totals
- pickup-point override support

3. Withdrawal controls:

- max $500/day
- max 2 withdrawals/week
- admin-maintained blacklist check

4. Reconciliation:

- finance export to CSV for cash/check workflows

5. APIs:

- GET /finance/commissions
- POST /finance/withdrawals
- GET /finance/withdrawals/eligibility
- GET /finance/reconciliation/export
- CRUD /admin/withdrawal-blacklist

6. Frontend:

- finance clerk dashboard
- withdrawal request and eligibility UI
- reconciliation export actions
- admin blacklist management

7. Tests:

- commission with/without override
- daily/weekly limit enforcement
- blacklist blocking
- CSV format and totals.

Definition of Done:

1. Commission and withdrawal logic is enforced server-side.
2. CSV reconciliation export works.
3. Finance/admin screens support required controls.

Return:

1. Risk-control rules summary.
2. Commission calculation examples.
3. Test summary.

## Prompt 8 of 10: Hash-Chained Audit Logs, Search, Export, and Integrity Verification

Continue from existing code.

Implement:

1. Schema + migrations for audit logs with hash chain:

- actor, action, resource_type, resource_id, timestamp, metadata
- previous_hash, current_hash

2. Log these actions at minimum:

- uploads, downloads, sharing, permission changes, approvals, deletes, rollbacks

3. Hash-chain service:

- append entries with deterministic hash linkage
- provide verification method

4. APIs:

- GET /audit/logs?user=&resource=&from=&to=
- GET /audit/logs/export
- GET /audit/logs/verify-chain

5. Frontend:

- admin compliance/audit search page
- export action
- chain verification status display

6. Tests:

- hash integrity
- tamper detection simulation
- search/filter correctness.

Definition of Done:

1. Critical actions are logged with hash chain.
2. Logs are searchable and exportable.
3. Integrity verification endpoint is operational.

Return:

1. Logged action coverage list.
2. Hash-chain verification behavior.
3. Test summary.

## Prompt 9 of 10: Behavior Analytics Pipeline, Idempotency, Async Queue, Retention, AES-256 + Masking

Continue from existing code.

Implement:

1. Schema + migrations:

- behavior_events_hot, behavior_events_archive, ingestion_queue, ingestion_dedup_keys

2. Instrument events:

- impressions, clicks, favorites, votes, watch completion
- both client and server instrumentation paths

3. Idempotency and dedup:

- generate/validate idempotency keys
- reject duplicates safely

4. Queue ingestion:

- local queue buffer
- async worker processing

5. Retention jobs:

- hot retention: 90 days
- archive retention: 365 days

6. Sensitive data protection:

- AES-256 encryption at rest for government ID fragments and bank routing when stored
- UI masking of sensitive fields

7. APIs:

- POST /behavior/events
- GET /behavior/summary
- GET /admin/jobs/retention-status

8. Tests:

- dedup correctness
- queue reliability
- retention window behavior
- encryption/masking checks.

Definition of Done:

1. Event pipeline is deduplicated and resilient.
2. Retention lifecycle is implemented.
3. Sensitive-data controls are active.

Return:

1. Event lifecycle summary.
2. Security controls summary.
3. Test summary.

## Prompt 10 of 10: Full Integration, E2E Validation, Hardening, and Final Documentation

Continue from existing code and finalize the entire application.

Implement:

1. End-to-end integration across all roles and workflows.
2. E2E tests for:

- local auth + lockout + role routing
- member browse -> checkout with capacity conflict fallback
- threaded discussions + mentions + notificatiocd n center
- leader onboarding + admin approval + leader dashboard
- appeals with local uploads and status timeline
- finance commissions + withdrawals + CSV export
- audit logs + chain verification
- behavior tracking + dedup + retention

3. Standardize API error contracts and validation.
4. Add/verify run scripts:

- migrations
- seeds
- tests
- frontend/backend start

5. Complete required docs and submission artifacts per structure.
6. Final security/compliance sweep:

- AES-256 at rest fields
- masking in UI
- upload checksum verification
- tamper-evident audit logs

7. Resolve all critical lint/type/test failures.

Definition of Done:

1. All original prompt requirements are implemented.
2. App is fully functional locally.
3. Documentation and artifacts are complete.
4. No critical blockers remain.

Return:

1. Final requirement coverage checklist mapped to original prompt.
2. Complete test pass/fail summary.
3. Remaining non-critical technical debt.
4. Exact local reviewer run instructions.

---

## How To Use This File

1. Run Prompt 1 in Codex and wait for full completion.
2. Run Prompt 2 only after Prompt 1 is complete and stable.
3. Repeat sequentially until Prompt 10.
4. Do not skip prompt order; each depends on previous implementation.
5. Require Codex to return explicit file changes, commands, tests, and gaps each time.
