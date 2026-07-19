# ICMR MIDAS 2.0 (Lite Version)
### Dataset Quality and Trust Framework (Self-Assessment Tool)

The Lite Version of MIDAS 2.0 (Metric-based Integrity and Data Assessment System) is a simplified self-assessment tool designed for Independent Centers to evaluate dataset quality, integrity, interoperability, and privacy. The completed self-assessment forms are submitted to the Nodal Centre for detailed evaluation, validation, and formal Composite Quality Index (CQI) and Privacy-Risk Score (PRS) technical auditing.

---

## 1. Technical Stack

| Layer / Component | Technology / Tool | Purpose / Details |
| :--- | :--- | :--- |
| **Frontend** | Next.js (v16 App Router) + React 19 | Interactive Form UI, client-side routing, and Supabase Auth session management. |
| **Backend** | FastAPI (Python) | API engine handling score calculations, Redis caching logic, and file validation. |
| **Database** | Supabase PostgreSQL | Relational storage for submitted assessments and answers. |
| **ORM** | SQLModel | Pydantic-compatible SQLAlchemy database model layer. |
| **Database Migrations** | Alembic | Schema versioning and migration deployment tool. |
| **Auth** | Supabase Auth | Handles user registrations and logins (email/password). JWT verified server-side via Supabase Auth `/auth/v1/user` endpoint with service role key. |
| **Draft Caching** | Redis | Temporary draft state auto-saver (hosted on Redis Cloud). Keys stored as `draft:{user_id}` with 14-day TTL. |
| **Rate Limiting** | Token Bucket (Redis Lua Script) | Two tiers: cost=1 (20 capacity, 0.33 fill/s) for lightweight endpoints; cost=10 for `/submit`. Per-user keys `rate_limit:{user_id}`. Fail-open for cost=1 if Redis is down; returns 503 for cost=10. |
| **Styling** | Tailwind CSS (v4) & Custom Scoped CSS | Responsive UI design using a Clinical Slate & Soft-Glass Accents theme for internal dashboard, with custom stylesheets `portal-home.css` and `portal-theme.css` scoped under `.portal-home-page` for public pages (preserving normal scrolling). Global utility classes `.bg-portal` (gradient background) and `.card-portal` (glass-morphism card) defined in `globals.css`. |
| **Validation** | HTML5 & Pydantic | Client-side UI checks and Server-side Pydantic validation. |
| **Security Headers** | Next.js Middleware | CSP nonce (per-request), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`. |
| **Icons** | lucide-react | UI icon library. |

---

## 2. System Architecture

```text
                  +----------------------------------------------+
                  |         Next.js Frontend (Port 3000)         |
                  +----------------------+-----------------------+
                                         |
                       /api/v1/*         | Supabase Auth
                     Proxy Rewrite       | (JWT Token)
                               v         v
                  +----------------------+-----------------------+
                  |         FastAPI Backend (Port 8000)          |
                  +---------+------------+------------+----------+
                            |            |            |
                  Redis Cmd |            | SQLModel   | HTTP PUT
                            v            | Queries    | Url Request
                  +---------+--+         v            v
                  | Redis Cloud|   +-----+----+ +-----+----------+
                  | (Drafts)   |   | Supabase | | Supabase       |
                  +------------+   | Postgres | | Storage Bucket |
                                   +-----+----+ +-----+----------+
                                         ^            |
                                  pg_net |            | Direct File
                                 Webhook |            | Upload
                                         +------------+
```

---

## 3. Directory Structure

```text
midas-2.0/
├── apps/
│   ├── web/                  # Next.js Frontend (Page components, Auth gate)
│   │   ├── src/app/          # Routing layout, globals.css, state coordinator
│   │   │   ├── dashboard/    # Gated dashboard page for assessments
│   │   │   │   ├── page.tsx          # Server component, creates Supabase SSR client
│   │   │   │   └── DashboardClient.tsx # Main assessment wizard (5-step form)
│   │   │   ├── lite-version/ # Public page displaying Lite Version framework text
│   │   │   ├── login/        # Standalone login page with rate limit & password toggle
│   │   │   ├── auth-session-watcher.tsx # Client-side session change listener
│   │   │   ├── layout.tsx    # Root layout with CSP nonce & Geist fonts
│   │   │   ├── page.tsx      # Landing page (/)
│   │   │   ├── portal-home.css # Scoped override stylesheet for public pages
│   │   │   └── portal-theme.css # Scoped brand variables and fonts
│   │   ├── src/components/
│   │   │   ├── assessment/   # Modular wizard components
│   │   │   │   ├── LandingPage.tsx       # Marketing landing page content
│   │   │   │   ├── Stepper.tsx           # 5-step stepper with 15-domain expand
│   │   │   │   ├── DatasetBasicsForm.tsx # Section A plain text metadata layout
│   │   │   │   ├── QualityDomainForm.tsx # Section B rubric scores & justifications
│   │   │   │   ├── PrivacyCalculator.tsx # Section C PRS-Lite risk & multiplier
│   │   │   │   ├── DataUploadForm.tsx    # Section D structured/unstructured upload
│   │   │   │   ├── ReviewForm.tsx        # Section E compiled inputs preview
│   │   │   │   └── SuccessView.tsx       # Post-submission grades/scores display
│   │   │   ├── portal/       # Reusable public layout components
│   │   │   │   ├── PortalNav.tsx           # Auth-aware portal nav (avatar, role, logout when signed in)
│   │   │   │   ├── PortalFooter.tsx        # Public footer component
│   │   │   │   ├── PortalPageLayout.tsx    # Wrapper with IntersectionObserver
│   │   │   │   ├── LiteVersionPage.tsx     # Portal-styled presentation page
│   │   │   │   └── lite-content.ts         # Lite framework HTML (1196 lines)
│   │   │   └── ui/           # Reusable primitives
│   │   │       ├── Input.tsx
│   │   │       └── Button.tsx
│   │   ├── src/lib/
│   │   │   ├── supabase.ts   # Browser Supabase client singleton
│   │   │   └── domainsData.ts # 15 domain rubric definitions (0-4)
│   │   ├── src/middleware.ts  # Auth guard, CSP nonce, security headers
│   │   ├── next.config.ts    # API proxy rewrites (/api/v1/* -> localhost:8000)
│   │   ├── postcss.config.mjs # Tailwind CSS v4 PostCSS plugin
│   │   ├── eslint.config.mjs # ESLint v9 flat config
│   │   └── tsconfig.json     # Strict TypeScript config
│   ├── api/                  # FastAPI Backend API Engine
│   │   └── app/
│   │       ├── main.py       # FastAPI app factory, CORS, /healthz
│   │       ├── api/
│   │       │   └── endpoints.py # All route definitions (draft, upload, submit, etc.)
│   │       └── core/
│   │           ├── config.py      # Pydantic settings from .env
│   │           ├── security.py    # JWT verification, auth deps, RBAC
│   │           ├── redis.py       # RedisDraftCache client (14-day TTL)
│   │           ├── db.py          # SQLModel engine & session
│   │           ├── rate_limit.py  # Token bucket rate limiter (Lua script)
│   │           └── test_security.py # Security test script (IDOR, path traversal)
├── packages/
│   └── database/             # Shared SQLModel schemas & Alembic migrations
│       ├── alembic/
│       │   ├── env.py
│       │   ├── script.py.mako
│       │   └── versions/
│       │       ├── 658ba24a208f_initial_schema_migration.py
│       │       ├── 3f92085039ed_initial_schema_migration.py
│       │       ├── 0a29c7e5edae_add_user_id_to_assessmentfile.py
│       │       └── b4e71a9c3d21_make_assessment_id_nullable.py
│       ├── models/
│       │   ├── __init__.py
│       │   ├── assessment.py
│       │   ├── answer.py
│       │   └── file.py
│       ├── alembic.ini
│       ├── pyproject.toml
│       ├── run_migrations.py
│       ├── setup_supabase_extras.py  # Storage bucket, webhook, realtime setup
│       ├── deploy_rls_policies.py    # SQL Row-level security deployment
│       ├── fix_storage_permissions.py # Repair script for broken Supabase Storage permissions
│       ├── cleanup_expired_files.py  # Maintenance script to purge unlinked files older than 24h
│       ├── reset_dev_database.py     # Script to reset and clean test database artifacts
│       ├── seed_nodal.py             # Seeds nodal@gmail.com with role="nodal"
│       └── seed_user.py              # Seeds user@gmail.com with role="user"
├── docker/
│   ├── api.Dockerfile        # Python 3.11-slim container
│   └── web.Dockerfile        # Node 20-alpine multi-stage build
├── docker-compose.yml        # Local orchestration (redis, api, web)
├── package.json              # Root workspace run scripts
├── .env.example              # Environment variable template
└── .env                      # Project credentials & configurations
```

---

## 4. Getting Started

### Prerequisites
*   **Node.js** (v20+) and **npm**
*   **Python** (3.11+), **pip**, and **virtualenv**
*   *Note: No local Redis installation is required since the project connects to the Redis Cloud instance configured in your environment variables.*

### Local Configuration
1. Clone the repository and navigate to the project root.
2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in your Supabase project keys (URL, Anon key, Service role, JWT secret, and database Session Pooler URL) and your Redis Cloud credentials. Add a random string as the `WEBHOOK_SECRET` variable for webhook trigger validation.
4. Copy the environment file into the Next.js web application so the browser client and server-side middleware can read the configuration:
   ```bash
   cp .env apps/web/.env
   ```

---

## 5. Development Launch Commands

### Setup Infrastructure & Databases
1. Install database dependencies:
   ```bash
   pip install -e packages/database
   ```
2. Run Alembic schema migrations:
   ```bash
   python packages/database/run_migrations.py
   ```
3. Deploy Supabase Storage buckets, webhooks, and realtime settings:
   ```bash
   python packages/database/setup_supabase_extras.py
   ```
4. Provision the Nodal Team test account:
   ```bash
   python packages/database/seed_nodal.py
   ```
5. Provision the Standard Custodian test account:
   ```bash
   python packages/database/seed_user.py
   ```
6. Deploy Row-Level Security policies on SQL tables:
   ```bash
   python packages/database/deploy_rls_policies.py
   ```
7. (Optional) Run the cleanup job for expired files/orphaned objects:
   ```bash
   python packages/database/cleanup_expired_files.py
   ```

---

## 6. Local Webhook Tunneling (ngrok)

Because database upload events occur in the cloud (Supabase), the cloud server needs a public URL to trigger webhooks back to your local development environment:
1. Ensure you have registered an account at [ngrok.com](https://ngrok.com) and added your auth token:
   ```bash
   ngrok config add-authtoken <your-auth-token>
   ```
2. Start the tunnel proxy from the workspace root:
   ```bash
   npm run tunnel
   ```
3. Copy the generated public HTTPS URL (e.g. `https://1234-56-78.ngrok-free.app`) and append the endpoint path:
   ```text
   https://1234-56-78.ngrok-free.app/api/v1/webhooks/storage
   ```
4. Set this string as the `WEBHOOK_TARGET_URL` inside your `.env` file before executing `setup_supabase_extras.py`.

---

## 7. Booting the Application

To run the full stack locally from the root workspace directory, run these scripts in separate terminals:

*   **Launch Local tunnel**:
    ```bash
    npm run tunnel
    ```
*   **Launch FastAPI Backend (Port 8000)**:
    ```bash
    npm run dev:api
    ```
*   **Launch Next.js Frontend (Port 3000)**:
    ```bash
    npm run dev:web
    ```

Once loaded, navigate your browser to `http://localhost:3000`. The root URL (`/`) and the framework document page (`/lite-version`) are public routes and accessible anonymously. Attempting to navigate to the assessment wizard (`/dashboard`) or clicking login controls will route unauthenticated requests to `/login`. Sign in with either your standard custodian credentials (`user@gmail.com` / `test123`) or the Nodal Team account (`nodal@gmail.com` / `test123`). Note that manual signup has been disabled for safety.

---

## 8. Backend Role Authorization Guidelines (Developer Guide)

When writing new FastAPI endpoints in `endpoints.py`, follow these dependency-injection patterns to manage user authentication and role validation:

1. **Retrieve only the User ID (Standard Auth)**:
   If the route only needs to query/write rows owned by the current user:
   ```python
   @protected_router.get("/my-endpoint")
   def get_data(user_id: str = Depends(get_current_user_id)):
       # user_id is the string UUID parsed from the JWT
       ...
   ```

2. **Retrieve User ID & Role (Role-Aware Querying)**:
   If the endpoint behaves differently depending on user roles (e.g. nodal lists all, standard lists own):
   ```python
   @protected_router.get("/assessments")
   def get_assessments(current_user: CurrentUser = Depends(get_current_user)):
       # current_user.id provides the UUID string
       # current_user.role provides the role claim ('user', 'nodal', etc.)
       if current_user.role == "nodal":
           ...
   ```

3. **Restrict Route to Nodal Users Only (Strict RBAC)**:
   If the endpoint should be locked down entirely so that only Nodal accounts can query it:
   ```python
    @protected_router.get("/admin-settings", dependencies=[Depends(require_nodal)])
    def get_settings():
        ...
    ```

---

## 9. Rate Limiting Developer Guide

Rate limiting uses a **Token Bucket** algorithm implemented as a Lua script executed atomically in Redis. Two pre-configured instances are instantiated in `endpoints.py`:

| Instance | Capacity | Fill Rate | Cost | Used On |
|----------|----------|-----------|------|---------|
| `rate_limiter_cost_1` | 20 | 0.33 tok/s | 1 | GET/POST draft, upload-url, assessments |
| `rate_limiter_cost_10` | 20 | 0.33 tok/s | 10 | POST submit (expensive write) |

To add rate limiting to a new endpoint:

```python
@protected_router.post("/my-endpoint", dependencies=[Depends(rate_limiter_cost_1)])
def my_endpoint(user_id: str = Depends(get_current_user_id)):
    ...
```

**Key behaviors:**
- Each user gets a separate bucket keyed as `rate_limit:{user_id}`.
- If Redis is unreachable, cost-1 requests are allowed through (fail-open); cost-10 requests return **503 Service Unavailable** to prevent data corruption under load.
- The Lua script refills tokens based on elapsed wall-clock time (`now - last_refill`) to ensure accurate throttling even if the endpoint is called irregularly.

---

## 10. Operations & Maintenance Scripts

The `packages/database` and `apps/api/app/core` directories contain several Python utility scripts for environment maintenance and security testing:

### Maintenance & Cleanup
*   **`cleanup_expired_files.py`**: A database maintenance script intended to run periodically (e.g., via a daily cron job). It safely purges any abandoned, unlinked pending draft files (`assessment_id IS NULL`) older than 24 hours from both the `assessment_files` table and the `storage.objects` bucket.
*   **`reset_dev_database.py`**: A developer utility that resets the database to a clean baseline by purging all test assessments, stuck pending uploads, and orphaned storage objects. It safely bypasses the `storage.protect_delete()` trigger by setting `storage.allow_delete_query = 'true'` within the transaction.

### Security Audits & Repair
*   **`test_security.py`**: An automated security test suite that verifies score boundary constraints (HTTP 422), filename path traversal sanitization, and IDOR/ownership checks for file linking.
*   **`fix_storage_permissions.py`**: A database repair script that explicitly restores schema and table-level `SELECT, INSERT, UPDATE, DELETE` privileges across the `storage` and `net` schemas for `authenticated`, `anon`, and `service_role` roles. Used to resolve `403 Forbidden` and `42883 function does not exist` errors.

### Database Seeding
*   **`seed_nodal.py`**: Provisions the standard `nodal@gmail.com` account and attaches the `{"role": "nodal"}` claim via the Supabase Admin API.
*   **`seed_user.py`**: Provisions the standard `user@gmail.com` account and attaches the `{"role": "user"}` claim.
