# Superset Leaders Dashboard — Role & Chart Mapping

Source: `A4I-Engineering Tasks 1.xlsx` (Leader Dashboard sheet, **green rows = in scope**)  
Reference: Existing Shiksha Copilot dashboard screenshots

---

## Roles

| Role (Superset) | Full Name | Geography Scope | In ETL today? |
|---|---|---|---|
| `HM` | Headmaster | Own school only | ✅ |
| `CRP` | Cluster Resource Person | Block/cluster of schools | ✅ |
| `BEO` | Block Education Officer | Block level | ✅ |
| `MEO` | Mandal Education Officer | Mandal level | ⏳ to be added |
| `DEO` | District Education Officer | District level | ⏳ to be added |
| `DDPI` | Deputy Director of Public Instruction | Zone/division level | ✅ |
| `StateAdmin` | State Admin / Director | Full state | ✅ |

Geography hierarchy: **State → Zone → District → Mandal/Taluk → Block → School**

---

## In-Scope Report Categories (Green rows from Excel)

| # | Category | Charts/Metrics |
|---|---|---|
| 1 | Teacher Usage & Adoption | Login/activity count, AI feature usage, lesson gen, resource gen, chatbot usage |
| 2 | Academic Support | Lesson plans by subject, lesson plans by medium, plan status breakdown |
| 3 | Teacher Training | Feedback score on generated content, training completion |
| 4 | Classroom & Pedagogy Insights | Resource/module usage patterns, AI actions by type |
| 5 | Digital Adoption Reports | Active vs inactive users, active schools count, district-wise usage trends |
| 6 | Implementation Dashboards | Progress by zone/district/block/school |

---

## Charts (from existing Shiksha Copilot dashboard)

| # | Chart Name | Type | Data Source | Category |
|---|---|---|---|---|
| C1 | Lesson Plans by Zone | Bar | `fact_lesson_plans` + `dim_regions` | Academic Support / Implementation |
| C2 | Lesson Plans by Subject | Bar | `fact_lesson_plans.subject` | Academic Support |
| C3 | Lesson Plans by Medium | Donut (Kannada / English) | `fact_lesson_plans` | Academic Support |
| C4 | Active / Inactive Users | Gauge (x / total) | `dim_users` + `fact_user_activities` | Digital Adoption |
| C5 | User Activity Table | Table (Name, Role, Status) | `dim_users` + `fact_user_activities` | Teacher Usage |
| C6 | Avg Feedback Score on Generated Content | Donut (Very good / Needs improvement / Doesn't meet requirement) | `fact_lba_attempts.score` | Teacher Training |
| C7 | Chatbot Requests by Month | Grouped bar (Edu Chat / Lesson Chat) | `fact_chatbot_sessions` + `fact_ai_actions` | Teacher Usage / Classroom Insights |

> **Note:** C3 (Medium) is not yet in the ETL schema — `fact_lesson_plans` has no `medium` column. Either needs to be sourced from MongoDB `teacherlessonplans.medium` or treated as out of scope until schema is extended.

---

## Role → Chart Visibility Matrix

Superset Row-Level Security (RLS) automatically scopes data to the user's region/school.  
All roles see the same charts but data is filtered by their geographic scope.

| Chart | HM | CRP | BEO | MEO | DEO | DDPI | StateAdmin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| C1 Lesson Plans by Zone | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| C2 Lesson Plans by Subject | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| C3 Lesson Plans by Medium | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| C4 Active / Inactive Users | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| C5 User Activity Table | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| C6 Avg Feedback Score | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| C7 Chatbot Requests by Month | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**All charts visible to all roles — data scoped by RLS.**

---

## Per-Role Data Scope Detail

### HM — Headmaster
- **Sees:** Data for their own school only
- **Use case:** Monitor their teachers' lesson plan generation, AI tool usage, active/inactive teachers
- **Filters available:** Plan Type, Date range (State/Zone/District pre-filtered to their location)
- **Excel ref:** Teacher Usage & Adoption, Academic Support, Teacher Training, Classroom Insights

### CRP — Cluster Resource Person
- **Sees:** Data for all schools in their assigned block/cluster
- **Use case:** Assess academic quality across their cluster, identify schools needing support, guide subject-specific usage
- **Filters available:** School (within their cluster), Plan Type, Date range
- **Excel ref:** Academic Support, Classroom & Pedagogy Insights

### BEO — Block Education Officer
- **Sees:** Data for all schools in their block
- **Use case:** Block-level digital adoption, implementation progress, school comparison within block
- **Filters available:** School (within block), Plan Type, Date range
- **Excel ref:** Digital Adoption Reports, Implementation Dashboards, Classroom Insights

### MEO — Mandal Education Officer *(role to be added in MongoDB)*
- **Sees:** Data for all schools in their mandal
- **Use case:** Mandal-level adoption monitoring, classroom pedagogy patterns, implementation review
- **Filters available:** School (within mandal), Plan Type, Date range
- **Excel ref:** Classroom & Pedagogy Insights, Digital Adoption Reports, Implementation Dashboards

### DEO — District Education Officer *(role to be added in MongoDB)*
- **Sees:** Data for all schools in their district
- **Use case:** District-wide teacher engagement, training completion, zone/block comparison, review meeting prep
- **Filters available:** Zone, Block, School, Plan Type, Date range
- **Excel ref:** Teacher Usage & Adoption, Teacher Training, Digital Adoption Reports, Implementation Dashboards

### DDPI — Deputy Director of Public Instruction
- **Sees:** Data for all schools in their zone/division
- **Use case:** Zone-level overview, identify low-adoption districts, support state review meetings
- **Filters available:** District, Block, School, Plan Type, Date range
- **Excel ref:** Teacher Usage & Adoption, Digital Adoption Reports, Implementation Dashboards

### StateAdmin — State Director / Commissioner
- **Sees:** Entire state — no RLS filter applied
- **Use case:** Full state overview, cross-district comparison, policy decisions, review meetings
- **Filters available:** All filters (State, Zone, District, Taluk, School, Plan Type, Date range)
- **Excel ref:** All 6 in-scope categories

---

## Dashboard Filters (matching existing Shiksha Copilot UI)

| Filter | Visible to |
|---|---|
| State | All (pre-filled for non-StateAdmin) |
| Zone | DEO, DDPI, StateAdmin |
| District | DEO, DDPI, StateAdmin |
| Taluk / Mandal | MEO, BEO, DEO, DDPI, StateAdmin |
| School | HM (own only), CRP, BEO, MEO, DEO, DDPI, StateAdmin |
| Plan Type (Lesson Plan / Resource / etc.) | All |
| From / To (Date range) | All |

> In Superset, non-applicable filters can be hidden per dashboard or left visible with RLS automatically restricting the available options.

---

## What's NOT in scope (orange rows from Excel)

- Student Learning Outcomes
- School Visit Monitoring (CRP/MEO field visits)
- Attendance Data
- Infrastructure Reports
- Budget & Finance Reports
- Compliance / Inspection Reports

---

## Schema Change: medium field

`medium TEXT NOT NULL DEFAULT 'Unknown'` added to `fact_lesson_plans`.

ETL reads `teacherlessonplans.medium` from MongoDB (`lp.get("medium") or "Unknown"`).  
C3 (Lesson Plans by Medium) is now fully supported — no outstanding gap.
