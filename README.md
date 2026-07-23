# ICMR MIDAS 2.0 (Lite Version)
> **Dataset Quality and Trust Framework — Self-Assessment & Nodal Governance Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.11+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql)](https://supabase.com/)
[![Redis](https://img.shields.io/badge/Redis-Draft_Cache-DC382D?logo=redis)](https://redis.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

The **ICMR MIDAS 2.0 (Metric-based Integrity and Data Assessment System - Lite Version)** is a self-assessment and technical audit platform designed by the Indian Council of Medical Research (ICMR). It enables **Data Custodians (Applicants)** to evaluate dataset quality, integrity, interoperability, and privacy readiness across 15 structured domains, while providing **ICMR Nodal Officers** with a dedicated portal for technical evaluation, evidence verification, and release recommendation.

---

## ⚡ 5-Minute Quickstart Guide

Follow these step-by-step instructions to get the complete MIDAS 2.0 platform running locally on your machine.

### Prerequisites
Before you begin, ensure you have the following installed:
* **Node.js** (v20.0 or higher) and **npm**
* **Python** (v3.11 or higher) and **pip**
* **Git**

---

### Step 1: Clone & Configure Environment

```bash
# 1. Clone the repository
git clone https://github.com/Medhansh-741/MIDAS-2.0.git
cd MIDAS-2.0

# 2. Copy the environment variable template
cp .env.example .env

# 3. Copy the env file into the web app directory
cp .env apps/web/.env
```

> **Note on `.env` Credentials:**  
> The `.env.example` file contains working defaults for local development. If connecting to your own Supabase project or Redis instance, update `.env` with your `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `REDIS_HOST` credentials.

---

### Step 2: Setup Python Backend & Database

```bash
# 1. Navigate to the API app directory
cd apps/api

# 2. Create and activate a Python virtual environment
# On Windows PowerShell:
python -m venv venv
.\venv\Scripts\Activate.ps1

# On Linux / macOS:
python3 -m venv venv
source venv/bin/activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Install shared database package in editable mode
cd ../..
pip install -e packages/database
```

---

### Step 3: Run Database Migrations & Seed Test Users

```bash
# 1. Run Alembic schema migrations to build database tables
python packages/database/run_migrations.py

# 2. Deploy Supabase Storage buckets, webhooks, and security settings
python packages/database/setup_supabase_extras.py

# 3. Seed test user accounts
python packages/database/seed_nodal.py   # Provisions nodal@gmail.com (Nodal Role)
python packages/database/seed_user.py    # Provisions user@gmail.com (Standard Role)

# 4. Deploy Row-Level Security (RLS) policies
python packages/database/deploy_rls_policies.py
```

---

### Step 4: Install Frontend Dependencies & Launch!

Open **two separate terminal windows** from the project root directory:

**Terminal 1 (Backend API - Port 8000):**
```bash
# Activate virtualenv if not already active, then run:
npm run dev:api
```

**Terminal 2 (Frontend Web - Port 3000):**
```bash
# Install Node.js dependencies (first time only)
npm install

# Launch Next.js dev server
npm run dev:web
```

🎉 **You're all set!** Open your browser and navigate to `http://localhost:3000`.

---

## 🔑 Test User Credentials

Use these pre-configured test accounts to explore both user roles:

| Role | Email | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Data Custodian (Applicant)** | `user@gmail.com` | `test123` | Fill assessment wizard (`/dashboard`), upload CSV evidence, save Redis drafts, submit forms, view own past submissions (`/assessments`). |
| **ICMR Nodal Officer** | `nodal@gmail.com` | `test123` | Access Nodal Inbox (`/dashboard`), inspect all global dataset submissions, download evidence CSVs, review per-domain questions (`okay`/`needs_revision`), set final status (`approved`/`revision_required`). |

---

## 🐳 Docker Compose Quickstart (Alternative Setup)

If you prefer running the entire stack via Docker containers without installing Python or Node.js locally:

```bash
# 1. Build and start containers in background
npm run docker:up
# (or: docker-compose up -d)

# 2. Verify containers are running
docker-compose ps

# 3. Stop containers when done
npm run docker:down
```

---

## 🏗️ System Architecture

```text
+-----------------------------------------------------------------------------------+
|                                  USER BROWSER                                     |
|           (Applicant Submission Form  /  Nodal Reviewer Dashboard)                |
+------------------------------------------+----------------------------------------+
                                           | HTTPS
                                           v
+-----------------------------------------------------------------------------------+
|                            NEXT.JS FRONTEND (apps/web)                            |
|             [ Next.js App Router | React 19 | Supabase Client SDK ]              |
+---------------------+-------------------------------------+-----------------------+
                      | REST API Calls                      | Direct Storage PUT (.csv)
                      v                                     v
+-----------------------------------+         +-------------------------------------+
|     FASTAPI BACKEND (apps/api)    |         |          SUPABASE STORAGE           |
|  - Rate Limiter (Token Bucket)    |         | (Presigned URLs / Evidence Buckets) |
|  - Security & Auth (JWT/Supabase) |         +------------------+------------------+
|  - Scoring Engine (CQI & PRS)     |                            | Storage Webhook
|  - Endpoint Handlers              |                            | POST /webhooks/storage
+---------+-----------------+-------+                            | (X-Webhook-Secret)
          |                 |                                    v
          v SQLModel        v Redis Client                       +---------------------------------+
+-------------------+ +-------------------+         | AssessmentFile Record           |
| POSTGRESQL DB     | | REDIS CACHE       |         | Status updated:                 |
| - assessments     | | - draft:{user_id} |         | "pending" -> "success"/"failed" |
| - assessment_     | |   (TTL: 14 days)  |         +---------------------------------+
|   answers         | | - rate_limit:     |
| - assessment_files| |   {user_id}       |
+-------------------+ +-------------------+
```

---

## 📁 Repository Directory Structure

```text
MIDAS-2.0/
├── docs/
│   └── HANDOVER_DOCUMENT.md   # Full project handover specification
├── PRD.md                     # Official Product Requirements Document
├── midas-lite-version.md      # ICMR framework specification reference
├── apps/
│   ├── web/                   # Next.js 16 Frontend App
│   │   ├── src/app/           # Next.js App Router pages & API rewrites
│   │   ├── src/components/    # Form wizard, Stepper, & Portal UI components
│   │   ├── src/middleware.ts  # Route guards, CSP nonce injection, security headers
│   │   └── package.json
│   └── api/                   # FastAPI Python Backend API
│       ├── app/
│       │   ├── main.py        # App factory, CORS, health checks
│       │   ├── api/
│       │   │   └── endpoints.py # Core REST routes (draft, upload, submit, review)
│       │   └── core/
│       │       ├── config.py   # Settings loader from .env
│       │       ├── db.py       # SQLModel database session engine
│       │       ├── rate_limit.py# Token Bucket rate limiter (Redis Lua script)
│       │       ├── redis.py    # RedisDraftCache client (14-day TTL)
│       │       ├── security.py # Supabase auth verification & require_nodal dep
│       │       └── test_security.py # Pytest automated test suite
│       └── requirements.txt
├── packages/
│   └── database/              # Shared Database Schemas & Management Scripts
│       ├── alembic/           # Schema migration versions
│       ├── models/            # SQLModel table definitions (Assessment, Answer, File)
│       ├── setup_supabase_extras.py # Storage bucket & webhook registration
│       ├── deploy_rls_policies.py   # PostgreSQL Row-Level Security deployment
│       ├── seed_nodal.py      # Provision nodal@gmail.com account
│       ├── seed_user.py       # Provision user@gmail.com account
│       ├── cleanup_expired_files.py # Maintenance script to purge unlinked files
│       └── reset_dev_database.py    # Reset test database artifacts
├── docker/                    # Dockerfiles for API & Web
├── docker-compose.yml         # Container orchestration setup
└── package.json               # Root workspace execution scripts
```

---

## 🌐 Environment Variables Reference (`.env`)

| Environment Variable | Category | Required | Purpose / Default Value |
| :--- | :--- | :---: | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Yes | Your Supabase project REST URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Yes | Public anonymous API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Yes | Private service role key for backend verification |
| `SUPABASE_JWT_SECRET` | Supabase | Yes | JWT Secret key for decoding user tokens |
| `DATABASE_URL` | Database | Yes | PostgreSQL connection string (`postgresql://...`) |
| `REDIS_HOST` | Cache | Yes | Redis server hostname (`localhost` or Redis Cloud) |
| `REDIS_PORT` | Cache | Yes | Redis port (`6379`) |
| `REDIS_PASSWORD` | Cache | Optional | Redis password authentication |
| `WEBHOOK_SECRET` | Webhook | Yes | Shared secret key for verifying storage webhooks |
| `WEBHOOK_TARGET_URL` | Webhook | Optional | Target URL for Supabase webhooks (e.g. Ngrok URL) |

---

## 🔌 API Endpoints Reference

All endpoints are hosted under the `/api/v1` path prefix:

| Endpoint | Method | Role | Description |
| :--- | :--- | :---: | :--- |
| `/draft` | `POST` | All Users | Auto-saves in-progress form data to Redis cache (`draft:{user_id}`). |
| `/draft` | `GET` | All Users | Fetches current user's auto-saved draft from Redis. |
| `/upload-url` | `POST` | All Users | Generates a 15-min presigned URL for direct CSV upload to Supabase Storage. |
| `/webhooks/storage` | `POST` | Webhook | Webhook endpoint receiving file upload completion events from Supabase. |
| `/submit` | `POST` | All Users | Computes CQI & PRS scores, writes assessment to PostgreSQL, clears Redis draft. |
| `/assessments` | `GET` | All Users | Returns assessment list (Applicants: own; Nodal: all global submissions). |
| `/assessments/{id}` | `GET` | All Users | Returns full assessment details. (Scores masked for non-nodal users). |
| `/assessments/{id}/download` | `GET` | All Users | Generates a 60-second presigned URL for downloading evidence CSV files. |
| `/assessments/{id}/review` | `PUT` | Nodal Only | Saves per-question review status (`okay`/`needs_revision`) & remarks in-progress. |
| `/assessments/{id}/review/submit` | `POST` | Nodal Only | Finalizes review and sets assessment status to `approved` or `revision_required`. |

---

## 🛡️ Rate Limiting Policy

Rate limiting uses an atomic **Token Bucket** algorithm executed in Redis via a custom Lua script (`apps/api/app/core/rate_limit.py`):

- **Cost 1 Endpoints (`rate_limiter_cost_1`):** `capacity = 20`, `fill_rate = 0.33 tok/s`. Applied to `/draft`, `/upload-url`, `/assessments`, `/download`, `/review`.
- **Cost 10 Endpoints (`rate_limiter_cost_10`):** `capacity = 20`, `fill_rate = 0.33 tok/s`. Applied to `/submit` (heavy write endpoint).
- **Fail-Safe Behavior:** If Redis connection is down, cost-1 requests fail open (allowed), while cost-10 requests return `503 Service Unavailable`.

---

## 🛠️ Operational & Maintenance Scripts

Running maintenance utilities from workspace root:

```bash
# 1. Run backend security test suite (IDOR, path traversal, boundary checks)
pytest apps/api/app/core/test_security.py -v

# 2. Purge abandoned unlinked upload files older than 24 hours
python packages/database/cleanup_expired_files.py

# 3. Reset development database to clean baseline (clears test submissions)
python packages/database/reset_dev_database.py

# 4. Fix Supabase storage table permissions if encountering 403 errors
python packages/database/fix_storage_permissions.py
```

---

## 🌐 Local Webhook Tunneling (Ngrok)

When testing storage upload webhooks locally, Supabase Cloud requires a public HTTPS URL to deliver callbacks:

```bash
# 1. Start Ngrok tunnel proxy on backend port 8000
npm run tunnel

# 2. Copy the generated HTTPS URL (e.g., https://1234.ngrok-free.app)
# 3. Append endpoint path: https://1234.ngrok-free.app/api/v1/webhooks/storage
# 4. Set WEBHOOK_TARGET_URL in .env and run:
python packages/database/setup_supabase_extras.py
```

---

## ❓ Troubleshooting & FAQs

<details>
<summary><b>1. Error: 403 Forbidden on Supabase Storage upload</b></summary>
Run the permissions repair script from the root directory:
```bash
python packages/database/fix_storage_permissions.py
```
</details>

<details>
<summary><b>2. Error: Redis connection refused</b></summary>
Ensure Redis is running locally or check your `REDIS_HOST` and `REDIS_PORT` settings in `.env`. To start a local Redis container:
```bash
docker run -d --name midas_redis -p 6379:6379 redis:7-alpine
```
</details>

<details>
<summary><b>3. How do I test the Nodal Reviewer workflow?</b></summary>
Log out from any applicant session and log in using `nodal@gmail.com` with password `test123`. You will automatically be routed to the Nodal Inbox at `/dashboard`.
</details>

---

## 📄 License & Document References
- **Product Requirements:** See [PRD.md](./PRD.md) for full functional and technical specifications.
- **Handover Document:** See [docs/HANDOVER_DOCUMENT.md](./docs/HANDOVER_DOCUMENT.md) for formal handover details.
- **ICMR Framework:** Reference guidelines available in `midas-lite-version.md`.
