# MIDAS 2.0 Project Handover Document
**Framework:** ICMR Metric-based Integrity and Data Assessment System (Lite Version 1.0)  
**Repository:** MIDAS-2.0  
**Verification Date:** July 23, 2026  
**Verification Status:** Codebase Verified (Empirical, with documentation fixes applied)  

---

## Table of Contents
1. [Executive Summary & Project Context](#1-executive-summary--project-context)
2. [Domain Framework & MIDAS 2.0 Scoring Engine](#2-domain-framework--midas-20-scoring-engine)
3. [System Architecture & Monorepo Structure](#3-system-architecture--monorepo-structure)
4. [Data Flow & File Upload Pipeline](#4-data-flow--file-upload-pipeline)
5. [User Workflows & Role Access Control (RBAC)](#5-user-workflows--role-access-control-rbac)
6. [Database Schema & Migration Guide](#6-database-schema--migration-guide)
7. [Local Setup, Docker & Development Runbook](#7-local-setup-docker--development-runbook)
8. [Security, Rate Limiting & Webhook Governance](#8-security-rate-limiting--webhook-governance)
9. [Maintenance, Testing & Technical Debt Handover](#9-maintenance-testing--technical-debt-handover)

---

## 1. Executive Summary & Project Context

### 1.1 Overview
The **ICMR MIDAS 2.0 (Metric-based Integrity and Data Assessment System - Lite Version)** is a web-based evaluation platform designed by the Indian Council of Medical Research (ICMR). It enables **Independent Centers (Data Custodians / Applicants)** to conduct self-assessments of medical and health datasets across quality, integrity, interoperability, and privacy dimensions before submitting them to the **Nodal Centre** for formal review.

### 1.2 Core Objectives & System Capabilities
- **Standardized Questionnaire:** Evaluates datasets across 15 structured domains using a 0–4 score ladder.
- **Automated Score Calculations:** Computes the **Composite Quality Index (CQI-Lite)** and **Privacy-Risk Score (PRS-Lite)** upon form submission.
- **Dynamic Release Matrix:** Maps CQI Grade and PRS Risk Band to determine release readiness: *Open*, *Open/Controlled*, *Controlled/Open*, *Controlled*, or *Restricted*.
- **Role-Aware Score Masking:** Applicants complete assessments without bias while score visibility is restricted strictly to ICMR Nodal Officers.
- **Nodal Officer Review Portal:** Enables Nodal Officers to view submissions, inspect attached CSV evidence files, save in-progress itemized reviews (`okay` / `needs_revision`), add remarks, and submit final decisions (`approved` / `revision_required`).

---

## 2. Domain Framework & MIDAS 2.0 Scoring Engine

### 2.1 The 15 Assessment Domains
1. **Annotation / Labelling Reliability** (Domain 1)
2. **Metadata Completeness** (Domain 2)
3. **Documentation & User Guidance** (Domain 3)
4. **Population Representativeness** (Domain 4)
5. **Data Structure & Interoperability** (Domain 5)
6. **AI / Analytics Readiness** (Domain 6)
7. **Privacy & Identifiability** (Domain 7)
8. **Security & Access Governance** (Domain 8)
9. **Provenance & Workflow Transparency** (Domain 9)
10. **Ethical & Social Accountability** (Domain 10)
11. **Synthetic / Simulated Data** (Domain 11 - Optional / Toggleable N/A)
12. **Stewardship & Governance** (Domain 12)
13. **Model Linkage Integrity** (Domain 13)
14. **Environmental Sustainability** (Domain 14)
15. **Continuous Curation & Feedback** (Domain 15)

### 2.2 Mathematical Scoring & Classification Code Logic

#### 1. CQI-Lite Formula (`apps/api/app/api/endpoints.py:L248`)
$$\text{CQI-Lite} = \left( \frac{\sum \text{Domain Scores}}{\text{Max Possible Score}} \right) \times 100$$
- If `domain_11_na` is `True`: `max_score = 56` (Domain 11 excluded).
- If `domain_11_na` is `False`: `max_score = 60` (All 15 domains included).

```python
# CQI Grade Determination
if cqi_score >= 95:    cqi_grade = "Diamond"
elif cqi_score >= 85:  cqi_grade = "Platinum"
elif cqi_score >= 70:  cqi_grade = "Gold"
elif cqi_score >= 50:  cqi_grade = "Silver"
elif cqi_score >= 25:  cqi_grade = "Bronze"
else:                  cqi_grade = "Remediation"
```

#### 2. PRS-Lite Formula (`apps/api/app/api/endpoints.py:L265`)
$$\text{PRS-Lite} = \min\Big(\text{round}(\text{identification\_risk} \times \text{sensitivity\_multiplier}), 100\Big)$$
- `identification_risk` values: $0, 5, 15, 30, 50$
- `sensitivity_multiplier` values: $1.0, 1.5, 2.0$

```python
# PRS Risk Band Determination
if prs_score <= 15:    prs_band = "Low"
elif prs_score <= 40:  prs_band = "Moderate"
elif prs_score <= 70:  prs_band = "High"
else:                  prs_band = "Very High"
```

#### 3. CQI-Lite × PRS-Lite Release Matrix Lookup (`apps/api/app/api/endpoints.py:L283-L310`)
```
+-------------------+-----------------+-----------------+-----------------+-----------------+-----------------+
| PRS \ CQI         | >=95 (Diamond)  | 85-94 (Platinum)| 70-84 (Gold)    | 50-69 (Silver)  | 25-49 (Bronze)  |
+-------------------+-----------------+-----------------+-----------------+-----------------+-----------------+
| Low (0-15)        | Open            | Open/Controlled | Controlled/Open | Controlled      | Restricted      |
| Moderate (16-40)  | Open/Controlled | Controlled      | Controlled      | Restricted      | Restricted      |
| High (41-70)      | Controlled      | Controlled      | Restricted      | Restricted      | Restricted      |
| Very High (71-100)| Restricted      | Restricted      | Restricted      | Restricted      | Restricted      |
+-------------------+-----------------+-----------------+-----------------+-----------------+-----------------+
```

---

## 3. System Architecture & Monorepo Structure

### 3.1 Monorepo Layout & Tech Stack
```
MIDAS-2.0/
├── apps/
│   ├── api/                    # FastAPI Backend (Python 3.11+)
│   │   ├── app/
│   │   │   ├── api/endpoints.py # Core API endpoints & validation
│   │   │   ├── core/
│   │   │   │   ├── config.py   # BaseSettings & environment loader
│   │   │   │   ├── db.py       # SQLModel database session generator
│   │   │   │   ├── rate_limit.py# TokenBucketRateLimiter (Lua script)
│   │   │   │   ├── redis.py    # RedisDraftCache client (TTL=14d)
│   │   │   │   ├── security.py # Supabase auth & require_nodal dependency
│   │   │   │   └── test_security.py # Pytest test suite
│   │   └── requirements.txt
│   └── web/                    # Next.js 16 Frontend (React 19, TypeScript)
│       ├── app/                # Next.js App Router
│       ├── package.json        # Frontend dependencies (@supabase/ssr, lucide-react)
│       └── tsconfig.json
├── packages/
│   └── database/               # Shared Database Package
│       ├── alembic/            # Alembic schema migrations
│       └── models/             # SQLModel DB Models
│           ├── assessment.py   # Assessment table schema
│           ├── answer.py       # AssessmentAnswer table schema
│           └── file.py         # AssessmentFile table schema
├── docker/                     # Dockerfiles for API & Web
├── docker-compose.yml          # Multi-container setup (Redis, API, Web)
├── midas-lite-version.md       # MIDAS 2.0 framework specification
└── package.json                # Root npm workspace scripts
```

### 3.2 System Architecture Diagram
```
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
|  - Endpoint Handlers              |                            |
+---------+-----------------+-------+                            | POST /webhooks/storage
          |                 |                                    | (X-Webhook-Secret)
          v SQLModel        v Redis Client                       v
+-------------------+ +-------------------+         +---------------------------------+
| POSTGRESQL DB     | | REDIS CACHE       |         | AssessmentFile Record           |
| - assessments     | | - draft:{user_id} |         | Status updated:                 |
| - assessment_     | |   (TTL: 14 days)  |         | "pending" -> "success"/"failed" |
|   answers         | | - rate_limit:     |         +---------------------------------+
| - assessment_files| |   {user_id}       |
+-------------------+ +-------------------+
```

---

## 4. Data Flow & File Upload Pipeline

### 4.1 Redis Form Draft Caching
- **Endpoint:** `POST /api/v1/draft` & `GET /api/v1/draft`
- **Key Format:** `draft:{user_id}`
- **TTL Expiration:** 14 Days ($1,209,600$ seconds)
- **Behavior:** Stores JSON payload of in-progress form inputs. Automatically cleared upon successful form submission (`redis_drafts.clear_draft(user_id)`).

### 4.2 Evidence File Upload & Webhook Sequence Diagram
- **File Constraints:** Only `.csv` extensions allowed; size $> 0$ bytes.
- **Storage Path Structure:** `evidence/{user_id}/{file_uuid}/{safe_file_name}`
- **Presigned Upload Expiry:** 900 seconds (15 minutes).
- **Presigned Download Expiry:** 60 seconds (1 minute).

```
Applicant Browser          FastAPI Backend           Supabase Storage           PostgreSQL / Redis
    |                            |                          |                           |
    |--- 1. POST /v1/draft ---->|                          |                           |
    |    (Autosave progress)     |----------------------------------------------------->| Save in Redis
    |                            |                          |                           | (draft:{user_id})
    |--- 2. POST /upload-url --->|                          |                           |
    |    (file_name, file_size)  |--- Gen Signed PUT URL -->|                           |
    |                            |    (expiresIn: 900s)     |                           |
    |<-- 3. Return presigned URL-|                          |                           |
    |       & file_id            |--- Create file DB record --------------------------->| Save AssessmentFile
    |                            |    (status: "pending")   |                           | (status="pending")
    |                                                       |                           |
    |--- 4. PUT file directly ----------------------------->| Uploads to evidence bucket|
    |    (Content-Type: .csv)                               |                           |
    |                                                       |--- 5. Webhook POST ------>| /v1/webhooks/storage
    |                                                       |    (X-Webhook-Secret)     | Validates .csv & size
    |                                                       |                           | Updates status to
    |                                                       |                           | "success" or "failed"
    |                                                       |                           |
    |--- 6. POST /v1/submit ---->|                          |                           |
    |    (Answers & file_ids)    |--- 7. Calculate Scores ----------------------------->| Write Assessment &
    |<-- 8. Return assessment_id-|    & relink files        |                           | Answer records; clear
                                 |                          |                           | Redis draft cache
```

---

## 5. User Workflows & Role Access Control (RBAC)

### 5.1 Authentication Mechanism
Authentication uses Supabase Auth tokens passed in the `Authorization: Bearer <token>` HTTP header. The backend validates tokens with Supabase Auth (`${NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`) and extracts the user ID and role from `app_metadata.role` (default: `"user"`, Nodal role: `"nodal"`).

### 5.2 Complete Endpoint Reference & Permissions

| Method | Endpoint Path | Protected | Allowed Roles | Description |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/v1/draft` | Yes | All Users | Save active form draft to Redis cache |
| `GET` | `/api/v1/draft` | Yes | All Users | Retrieve active form draft from Redis cache |
| `POST` | `/api/v1/upload-url` | Yes | All Users | Generate 15-min presigned URL for CSV upload |
| `POST` | `/api/v1/webhooks/storage` | Public* | Webhook Secret | Storage trigger callback for file validation |
| `POST` | `/api/v1/submit` | Yes | All Users | Submit assessment, calculate scores & clear draft |
| `GET` | `/api/v1/assessments` | Yes | All Users | List assessments (Applicants: own; Nodal: all) |
| `GET` | `/api/v1/assessments/{id}` | Yes | All Users | Get assessment detail (Applicants: own; Nodal: all) |
| `GET` | `/api/v1/assessments/{id}/download` | Yes | All Users | Generate 60-sec presigned file download URL |
| `PUT` | `/api/v1/assessments/{id}/review` | Yes | Nodal Only | Save in-progress question reviews & remarks |
| `POST` | `/api/v1/assessments/{id}/review/submit` | Yes | Nodal Only | Submit final review (`approved`/`revision_required`)|

*Note on Score Masking:* For non-nodal users (`role != "nodal"`), the endpoints `GET /assessments` and `GET /assessments/{id}` explicitly set `cqi_lite_score`, `cqi_lite_grade`, `prs_lite_score`, `prs_lite_risk_band`, and `release_category` to `None`.

---

## 6. Database Schema & Migration Guide

### 6.1 Database Models (`packages/database/models/`)

#### 1. `Assessment` (`assessments` table)
| Column Name | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key, `uuid4()` | Unique Assessment ID |
| `user_id` | UUID | Not Null | Supabase Auth User ID |
| `dataset_title` | String | Index = True | Dataset Title |
| `version_doi_handle` | String | Not Null | Version / DOI / Handle string |
| `submitting_pi_custodian` | String | Not Null | Submitting PI / Custodian name |
| `date_of_assessment` | Date | Not Null | Date of self-assessment |
| `assessor_name_affiliation` | String | Not Null | Assessor Name / Affiliation |
| `cqi_lite_score` | Float | Optional, Default: `None` | Calculated CQI score ($0-100$) |
| `cqi_lite_grade` | String | Optional, Default: `None` | Diamond, Platinum, Gold, etc. |
| `prs_lite_score` | Float | Optional, Default: `None` | Calculated PRS score ($0-100$) |
| `prs_lite_risk_band` | String | Optional, Default: `None` | Low, Moderate, High, Very High |
| `release_category` | String | Optional, Default: `None` | Open, Controlled, Restricted |
| `dataset_type` | String | Default: `"structured"` | `"structured"` or `"unstructured"` |
| `dataset_link` | String | Optional, Default: `None` | Link for unstructured dataset |
| `status` | String | Default: `"draft"` | `"draft"`, `"submitted"`, `"approved"`, `"revision_required"` |
| `created_at` | DateTime | Default: `utcnow` | Record creation timestamp |

#### 2. `AssessmentAnswer` (`assessment_answers` table)
| Column Name | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key, `uuid4()` | Unique Answer ID |
| `assessment_id` | UUID | Foreign Key -> `assessments.id` | Associated Assessment |
| `domain_id` | Integer | Not Null ($1-15$) | Domain Identifier |
| `score` | Integer | Not Null ($0-4$) | Choice Score |
| `factual_description` | Text | Not Null | Description / Justification text |
| `review_status` | String | Optional (`"okay"`, `"needs_revision"`) | Nodal per-question review status |
| `reviewer_remarks` | Text | Optional | Nodal remarks for revision |

#### 3. `AssessmentFile` (`assessment_files` table)
| Column Name | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key, `uuid4()` | Unique File ID |
| `user_id` | UUID | Not Null, Index = True | File Owner User ID |
| `assessment_id` | UUID | Foreign Key -> `assessments.id` | Associated Assessment (Null until submission) |
| `file_name` | String | Not Null | Original CSV filename |
| `storage_path` | String | Not Null | Path in Supabase Storage bucket |
| `file_size` | Integer | Not Null | Size in bytes |
| `status` | String | Default: `"pending"` | `"pending"`, `"success"`, `"failed"` |
| `uploaded_at` | DateTime | Default: `utcnow` | Upload timestamp |

### 6.2 Database Migrations (Alembic)
Schema migration scripts are located in `packages/database/alembic/versions/`.

```bash
# Navigate to database directory
cd packages/database

# Create a new migration revision after model changes
alembic revision --autogenerate -m "add_new_feature_fields"

# Apply pending migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1
```

---

## 7. Local Setup, Docker & Development Runbook

### 7.1 Prerequisites
- **Node.js:** v20.0+
- **Python:** v3.11+
- **Docker & Docker Compose** (Optional, for containerized execution)
- **Redis:** Local service or Docker container (`redis:7-alpine`)
- **PostgreSQL:** Local service or Supabase managed database

### 7.2 Workspace Scripts (`package.json`)
The root monorepo `package.json` contains convenient execution shortcuts:
- `npm run dev:web` - Launches Next.js dev server on port `3000`.
- `npm run dev:api` - Launches FastAPI backend via Uvicorn on port `8000`.
- `npm run tunnel` - Spawns Ngrok tunnel targeting port `8000` (for testing external webhooks).
- `npm run docker:up` - Starts all containerized services via Docker Compose.
- `npm run docker:down` - Stops all Docker containers.

### 7.3 Step-by-Step Manual Development Setup

#### 1. Setup Backend API (`apps/api`)
```bash
cd apps/api
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Linux / macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 2. Run Database Migrations
```bash
cd packages/database
alembic upgrade head
```

#### 3. Setup Frontend (`apps/web`)
```bash
cd apps/web
npm install
npm run dev
```

---

## 8. Security, Rate Limiting & Webhook Governance

### 8.1 Token Bucket Rate Limiter (`apps/api/app/core/rate_limit.py`)
Rate limiting uses an atomic Lua script (`LUA_TOKEN_BUCKET`) executed in Redis on key `rate_limit:{user_id}`:
- **Cost 1 Endpoints (`rate_limiter_cost_1`):** `capacity=20`, `fill_rate=0.33` tokens/sec. Used on `/draft`, `/upload-url`, `/assessments`, `/download`, `/review`.
- **Cost 10 Endpoints (`rate_limiter_cost_10`):** `capacity=20`, `fill_rate=0.33` tokens/sec. Used on `/submit`.
- **Connection Failure Handling:** If Redis fails, cost $<10$ requests fail open (allowed with warning), while heavy cost $\ge 10$ requests fail closed (`503 Service Unavailable`).

### 8.2 Webhook Security
The storage webhook endpoint `POST /api/v1/webhooks/storage` verifies the incoming request header `X-Webhook-Secret` against `settings.WEBHOOK_SECRET` before processing payload updates.

---

## 9. Maintenance, Testing & Technical Debt Handover

### 9.1 Test Suite Execution
Backend security tests are located in `apps/api/app/core/test_security.py`.
```bash
cd apps/api
pytest app/core/test_security.py -v
```

### 9.2 Critical Handover Notes & Unlinked Draft File Cleanup
- **Post-Submit File Cleanup:** During `POST /submit`, the API automatically deletes any remaining unlinked `AssessmentFile` records (`assessment_id == None`) belonging to the user (`apps/api/app/api/endpoints.py:L363-L374`).
- **Nodal Role Provisioning:** Nodal users must have `"role": "nodal"` present inside their Supabase Auth user `app_metadata`.

### 9.3 Handover Sign-off Checklist
| Task Item | Status | Verified By |
| :--- | :---: | :--- |
| Supabase Service Role & Anon Keys Provisioned | [ ] | DevOps / Admin |
| Redis Connection & Rate Limiting Tested | [ ] | Backend Engineer |
| Alembic Migrations Executed on Target DB | [ ] | DB Admin |
| CSV Evidence Upload & Webhook Verified | [ ] | QA Engineer |
| Applicant & Nodal Role Access Confirmed | [ ] | Product Lead |

---
*End of MIDAS 2.0 Project Handover Document.*
