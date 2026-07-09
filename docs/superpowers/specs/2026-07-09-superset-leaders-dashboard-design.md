# Superset Leaders Dashboard — Role & Chart Design

## Overview

Embedded Apache Superset dashboard in the Shiksha Copilot frontend (`/#/leaders-dashboard`). All roles see the same 7 charts; data is filtered per-user via Superset guest token RLS clauses. No chart-level visibility toggling — RLS handles data scoping.

---

## Roles

| Role | Collection | Mongo `role` value | Scope |
|------|------------|-------------------|-------|
| HM | `adminusers` | `hm` | Own school only |
| CRP | `adminusers` | `crp` | Own block (cluster resource person) |
| BEO | `adminusers` | `beo` | Own block (block education officer) |
| MEO | `adminusers` | `meo` | Own block (mandal education officer) |
| DEO | `adminusers` | `deo` | Own district (district education officer) |
| DDPI | `adminusers` | `ddpi` | Own district (deputy director public instruction) |
| StateAdmin | `adminusers` | `admin` / `manager` / `state` | Entire state — no filter |

> Teachers are in the `users` collection with role `power`/`standard` and do not access this dashboard.

---

## Charts

| # | Chart Name | Viz Type | Dataset |
|---|-----------|----------|---------|
| 1 | Lesson Plans by Zone | Grouped Bar | `v_lp_by_region` |
| 2 | Lesson Plans by Subject | Grouped Bar | `fact_lesson_plans` |
| 3 | Lesson Plans by Medium | Pie | `fact_lesson_plans` |
| 4 | Active / Inactive Users | Pie | `v_user_status` |
| 5 | User Activity Table | Table | `v_user_status` |
| 6 | Avg Feedback Score on Generated Content | Pie | `v_feedback_score` |
| 7 | Chatbot Requests by Month | Time-series Bar | `v_chatbot_by_type` |

---

## Role → Data Scope Matrix

All roles see all 7 charts. Data shown is scoped by RLS.

| Chart | HM | CRP / BEO / MEO | DEO / DDPI | StateAdmin |
|-------|----|-----------------|------------|------------|
| Lesson Plans by Zone | own school | own block | own district | all |
| Lesson Plans by Subject | own school | own block | own district | all |
| Lesson Plans by Medium | own school | own block | own district | all |
| Active / Inactive Users | own school | own block | own district | all |
| User Activity Table | own school | own block | own district | all |
| Avg Feedback Score | own school | own block | own district | all |
| Chatbot Requests by Month | own school | own block | own district | all |

---

## RLS Implementation

RLS is applied via the Superset guest token `rls` field. The backend (`superset.routes.js`) computes the clause from the logged-in user's role and ID.

### Role mapping (`ROLE_MAP`)

```
power / standard / hm  →  HM
crp                    →  CRP
beo                    →  BEO
meo                    →  MEO
deo                    →  DEO
ddpi                   →  DDPI
admin / manager / state → StateAdmin
```

### RLS clauses

**HM** — school-level:
```sql
user_id IN (
  SELECT user_id FROM dim_users
  WHERE school_id = (SELECT school_id FROM dim_users WHERE user_id = '<uid>')
)
```

**CRP / BEO / MEO** — block-level:
```sql
user_id IN (
  SELECT user_id FROM dim_users
  WHERE region_id = (SELECT region_id FROM dim_users WHERE user_id = '<uid>')
)
```

**DEO / DDPI** — district-level (all blocks under same district):
```sql
user_id IN (
  SELECT user_id FROM dim_users
  WHERE region_id IN (
    SELECT r.region_id FROM dim_regions r
    WHERE r.parent_id = (
      SELECT dr.parent_id FROM dim_regions dr
      JOIN dim_users du ON du.region_id = dr.region_id
      WHERE du.user_id = '<uid>'
    )
  )
)
```

**StateAdmin** — no clause (empty `rls: []` in guest token).

---

## Analytics DB Requirements

Each user who views the dashboard must have a row in `dim_users` (analytics Postgres):

```sql
CREATE TABLE dim_users (
  user_id   TEXT PRIMARY KEY,   -- MongoDB _id hex string
  name      TEXT NOT NULL,
  role      TEXT NOT NULL CHECK (role IN ('HM','CRP','BEO','MEO','DEO','DDPI','StateAdmin')),
  school_id INTEGER REFERENCES dim_schools(school_id),  -- NULL for non-HM
  region_id INTEGER NOT NULL REFERENCES dim_regions(region_id)
);
```

`user_id` = MongoDB `_id` hex string. Must be kept in sync with `adminusers`.

> **Known gap**: no automatic sync between MongoDB `adminusers` and `dim_users`. Currently manual. Long-term fix: upsert into `dim_users` on guest token request, using `school_id` / `region_id` stored on the admin user document.

---

## Test Users (local `prod_dump2`)

All PIN: `1234`

| Phone | Role | Name | scope |
|-------|------|------|-------|
| 9000000001 | HM | Test HM School A (Narasapur) | school_id=25998, region_id=1148 |
| 9000000002 | HM | Test HM School B (Pothireddypally) | school_id=28929, region_id=1149 |
| 9000000003 | CRP | Test CRP Block Ramdurg | region_id=1148 (Ramdurg block, Belagavi district) |
| 9000000004 | BEO | Test BEO Block Ramdurg | region_id=1148 |
| 9000000005 | MEO | Test MEO Block Ramdurg | region_id=1148 |
| 9000000006 | DEO | Test DEO District Belagavi | region_id=1148 → district 1079 |
| 9000000009 | DDPI | Test DDPI District Belagavi | region_id=1148 → district 1079 |
| 9000000008 | StateAdmin | Test StateAdmin | no filter |

---

## Geography Hierarchy

```
State (1077)
└── District: Belagavi (1079)
    └── Block: Ramdurg (1148)  ← test block
        └── Schools: 25998 (Narasapur), ...
District: Sangareddy (1080)
└── Block: Sangareddy (1149)
    └── School: 28929 (Pothireddypally)
```

`dim_regions.type` values: `state`, `district`, `block`

---

## Frontend

- Component: `shiksha-website/shiksha-frontend/src/app/view/admin/leaders-dashboard/`
- Route: `/#/leaders-dashboard`
- Lazy-loaded Angular 16 standalone component
- Uses `@superset-ui/embedded-sdk` to embed the dashboard
- Guest token fetched from `POST /api/superset/guest-token` (requires auth)
- Backend env vars: `SUPERSET_URL`, `SUPERSET_ADMIN_USERNAME`, `SUPERSET_ADMIN_PASSWORD`, `SUPERSET_DASHBOARD_UUID`
