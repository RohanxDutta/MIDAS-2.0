# ICMR MIDAS 2.0 (Lite Version)
### Dataset Quality and Trust Framework (Self-Assessment Tool)

The Lite Version of MIDAS 2.0 (Metric-based Integrity and Data Assessment System) is a simplified self-assessment tool designed for Independent Centers to evaluate dataset quality, integrity, interoperability, and privacy. The completed self-assessment forms are submitted to the Nodal Centre for detailed evaluation, validation, and formal Composite Quality Index (CQI) and Privacy-Risk Score (PRS) technical auditing.

---

## 1. Technical Stack

| Layer / Component | Technology / Tool | Purpose / Details |
| :--- | :--- | :--- |
| **Frontend** | Next.js (v15 App Router) | Interactive Form UI, client-side routing, and Supabase Auth session management. |
| **Backend** | FastAPI (Python) | API engine handling score calculations, Redis caching logic, and file validation. |
| **Database** | Supabase PostgreSQL | Relational storage for submitted assessments and answers. |
| **ORM** | SQLModel | Pydantic-compatible SQLAlchemy database model layer. |
| **Database Migrations** | Alembic | Schema versioning and migration deployment tool. |
| **Auth** | Supabase Auth | Handles user registrations and logins (email/password). |
| **Draft Caching** | Redis | Temporary draft state auto-saver (hosted on Redis Cloud). |
| **Styling** | Tailwind CSS (v4) | Responsive UI design and aesthetic theme system. |
| **Validation** | HTML5 & Pydantic | Client-side UI checks and Server-side Pydantic validation. |

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
│   ├── web/               # Next.js Frontend (Page components, Auth gate)
│   │   ├── src/app/       # Routing layout, globals.css, forms
│   │   └── src/lib/       # Supabase client helpers
│   └── api/               # FastAPI Backend API Engine
│       └── app/           # Core config, Redis client, endpoints
├── packages/
│   └── database/          # Shared SQLModel schemas & Alembic migrations
│       ├── alembic/       # Version scripts directory
│       ├── models/        # Assessments, Answers, and Files models
│       ├── seed_nodal.py  # Admin seed script for Nodal user
│       └── deploy_rls_policies.py # SQL Row-level security setup script
├── docker/                # Containers configurations
│   ├── api.Dockerfile
│   └── web.Dockerfile
├── docker-compose.yml     # Local orchestration services
├── package.json           # Root workspace run scripts
└── .env                   # Project credentials & configurations
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
3. Open `.env` and fill in your Supabase project keys (URL, Anon key, Service role, JWT secret, and database Session Pooler URL) and your Redis Cloud credentials.

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
5. Deploy Row-Level Security policies on SQL tables:
   ```bash
   python packages/database/deploy_rls_policies.py
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

Once loaded, navigate your browser to `http://localhost:3000`. Log in with your assessment credentials or the Nodal Team account (`nodal@gmail.com` / `test123`).
