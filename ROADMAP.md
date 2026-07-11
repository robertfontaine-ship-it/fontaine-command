# Project Fontaine Master Roadmap

## Product mission

Build an AI-powered teaching operating system that eliminates repetitive planning, organization, and curriculum-management work.

## Product rule

Every feature must do at least one of the following:

- Save time
- Reduce clicks
- Eliminate duplicate work
- Improve instruction

If it does none of these, it does not belong in the product.

## Scope

Initial supported courses:

- Sports & Entertainment Marketing — 8175
- Fashion Marketing — 8140

Entrepreneurship remains intentionally out of scope until the SEM and Fashion workflows are stable.

---

# Milestone 0 — Repository and product foundation

**Priority:** P0  
**Effort:** Small  
**Status:** In progress

## Deliverables

- Working repository structure
- README and contributor instructions
- Product roadmap
- Initial data model
- Sample SEM and Fashion lesson data
- Local development instructions
- Deployment configuration

## Success criteria

- The app runs locally without paid tools.
- The repository can deploy through a free hosting provider.
- SEM and Fashion data can be loaded without hard-coded screen logic.

---

# Epic 1 — Daily Command Center

**Priority:** P0  
**Effort:** Medium  
**Dependencies:** Milestone 0

## User story

As a teacher, I need one screen that tells me what I am teaching, what is ready, what is missing, and what requires action.

## Features

- Today’s SEM and Fashion lessons
- Lesson readiness status
- Missing-material alerts
- Estimated prep time
- Upcoming lessons
- Build queue
- Quick actions
- Recent changes

## Quick actions

- Open lesson
- Generate missing material
- Mark resource complete
- Move lesson
- Create substitute version
- Shorten lesson

## Success criteria

- The teacher can identify today’s work in under 10 seconds.
- Missing materials are visible without opening lesson files.
- The most common actions require no more than two clicks.

---

# Epic 2 — Curriculum Database

**Priority:** P0  
**Effort:** Large  
**Dependencies:** Milestone 0

## User story

As a teacher, I need every course, unit, lesson, standard, assessment, and resource stored in a structured system instead of scattered folders.

## Core objects

- Course
- Marking period
- Unit
- Lesson
- Resource
- Standard
- Certification objective
- Assessment
- Build task
- Quality score
- Lesson revision
- Teacher feedback

## Required relationships

- Course → Units
- Unit → Lessons
- Lesson ↔ Standards
- Lesson ↔ Resources
- Lesson ↔ Assessments
- Lesson ↔ Certification objectives
- Lesson → Revisions
- Resource ↔ Multiple lessons

## Success criteria

- SEM and Fashion use the same course-agnostic data model.
- One resource can connect to multiple lessons.
- Lessons can be filtered by course, unit, standard, readiness, activity type, and duration.

---

# Epic 3 — Lesson Workspace

**Priority:** P0  
**Effort:** Medium  
**Dependencies:** Epic 2

## User story

As a teacher, I need one lesson screen containing everything required to teach the lesson.

## Lesson sections

- Overview
- Learning target
- Success criteria
- Agenda
- Bell ringer
- Mini lesson
- Student activity
- Exit ticket
- Materials
- Differentiation
- Standards
- Certification alignment
- Resources
- Canvas-ready directions
- Teacher notes
- Version history

## Success criteria

- The teacher does not need to search Drive to locate lesson components.
- All attached resources open from the lesson page.
- Missing components are clearly labeled.

---

# Epic 4 — Resource Library

**Priority:** P0  
**Effort:** Medium  
**Dependencies:** Epic 2

## User story

As a teacher, I need to find and reuse existing resources before generating new ones.

## Features

- Search by keyword
- Filter by course, unit, lesson, standard, file type, and readiness
- Resource-to-lesson relationships
- Duplicate detection
- Newest-version identification
- Missing-companion-material detection
- Resource health score

## Resource health inputs

- Last used date
- Number of linked lessons
- Teacher rating
- Completeness
- Duplicate status
- Standards alignment
- Missing companion files

## Success criteria

- Existing resources appear before generation options.
- Duplicate files are flagged.
- A teacher can locate a known resource in under 15 seconds.

---

# Epic 5 — Build Queue

**Priority:** P0  
**Effort:** Small  
**Dependencies:** Epics 2–4

## User story

As a teacher, I need one prioritized list of missing or weak curriculum components.

## Task types

- Missing slides
- Missing worksheet
- Missing answer key
- Missing Canvas directions
- Missing exit ticket
- Missing assessment
- Weak activity
- Standards gap
- Resource update

## Success criteria

- Every missing component can become a trackable task.
- Tasks can be filtered by course, priority, type, and lesson.
- Completing a task automatically updates lesson readiness.

---

# Epic 6 — Ask Fontaine

**Priority:** P1  
**Effort:** Large  
**Dependencies:** Epics 2–5

## User story

As a teacher, I need to give natural-language commands without manually navigating multiple screens.

## Initial commands

- Build tomorrow.
- Shorten this lesson to 35 minutes.
- Turn this into stations.
- Make this more competitive.
- Create Canvas directions.
- Create an exit ticket.
- Create a substitute version.
- Find an existing worksheet.
- Show every lesson aligned to a standard.

## Context requirements

Ask Fontaine should know:

- Current course
- Current lesson
- Previous lesson
- Next lesson
- Standards
- Existing resources
- Teacher preferences
- Time available

## Success criteria

- The system uses existing resources before proposing new ones.
- Generated outputs follow the teacher’s established formatting rules.
- Commands work without requiring repeated context entry.

---

# Epic 7 — Google Drive Sync

**Priority:** P1  
**Effort:** Large  
**Dependencies:** Epics 2–4

## User story

As a teacher, I need the system to index my existing Drive resources without moving or duplicating them.

## Features

- Google authentication
- Folder and file indexing
- Metadata extraction
- Resource matching
- Link preservation
- Change detection
- Duplicate detection
- Manual approve/reject matching

## Success criteria

- Drive remains the content repository.
- Fontaine Command stores links and metadata, not unnecessary copies.
- New or updated resources can be detected and linked.

---

# Epic 8 — Calendar and Pacing

**Priority:** P1  
**Effort:** Medium  
**Dependencies:** Epics 1–3

## User story

As a teacher, I need lessons placed on an instructional calendar that can adjust to interruptions.

## Features

- Year-at-a-glance map
- Marking-period calendar
- Drag-and-drop lesson movement
- Buffer days
- Assemblies and testing interruptions
- DECA event interruptions
- Push-forward scheduling
- Ahead/behind pacing indicator

## Success criteria

- Moving one lesson can shift downstream lessons.
- Standards coverage remains visible after schedule changes.
- The teacher can recover from interruptions without rebuilding the plan.

---

# Epic 9 — Standards and Certification Intelligence

**Priority:** P1  
**Effort:** Medium  
**Dependencies:** Epic 2

## User story

As a teacher, I need to know which standards and certification objectives have been taught, practiced, and assessed.

## Features

- Standards coverage dashboard
- Taught/practiced/assessed statuses
- WRS alignment
- Gap detection
- Overcoverage detection
- Assessment-frequency alerts

## Success criteria

- Every lesson can connect to one or more standards.
- Coverage reports distinguish instruction from assessment.
- The system identifies standards needing additional evidence.

---

# Epic 10 — Lesson Evolution

**Priority:** P2  
**Effort:** Medium  
**Dependencies:** Epic 3

## User story

As a teacher, I need lessons to improve each time I teach them rather than starting over each year.

## Features

- Post-lesson rating
- Too long / too short flags
- Too easy / too difficult flags
- Student engagement notes
- Revision history
- Version comparison
- Next-year recommendations

## Success criteria

- Teacher feedback is attached to the correct lesson version.
- Previous versions remain recoverable.
- The app surfaces prior notes before the lesson is taught again.

---

# Epic 11 — Curriculum Analytics

**Priority:** P2  
**Effort:** Medium  
**Dependencies:** Epics 2, 4, 9, and 10

## Features

- Curriculum completion
- Resource completeness
- Lesson ratings
- Most-used resources
- Never-used resources
- Duplicate count
- Standards heat map
- Activity-type balance
- Lecture/activity ratio
- Project and assessment frequency

## Success criteria

- Analytics lead to clear recommended actions.
- Metrics do not create extra teacher data-entry burden.
- Reports can be filtered by course, unit, and marking period.

---

# Epic 12 — Canvas-Ready Publishing

**Priority:** P2  
**Effort:** Large  
**Dependencies:** Epics 3 and 6

## Features

- Generate Canvas-ready instructions
- Attach resources
- Set due dates
- Create assignments
- Add items to modules
- Publish or save as draft

## Success criteria

- Canvas instructions preserve teacher preferences, including concise steps and emojis.
- The teacher reviews content before publication.
- Publishing status is reflected in lesson readiness.

---

# Epic 13 — DECA Module

**Priority:** P3  
**Effort:** Large  
**Dependencies:** Stable teaching workflow

## Features

- Meeting calendar
- Officer roles
- Membership and dues
- Competition deadlines
- Testing windows
- Fundraising
- Travel and permission tracking
- Advisor documents

---

# Epic 14 — Fontaine Labs

**Priority:** P3  
**Effort:** Large

## Purpose

Track invention ideas, reselling systems, side hustles, business experiments, and product-development projects.

---

# Epic 15 — Fontaine Brain

**Priority:** P3  
**Effort:** Large

## Purpose

Create a searchable knowledge system for ideas, notes, projects, documents, decisions, and next actions.

---

# Recommended build order

## Release 0.1 — Usable local prototype

1. Repository foundation
2. Curriculum data model
3. Daily Command Center
4. Lesson Workspace
5. Resource Library
6. Build Queue

## Release 0.2 — Real teacher workflow

1. Persistent database
2. Authentication
3. Google Drive indexing
4. Calendar and pacing
5. Standards coverage

## Release 0.3 — AI assistance

1. Ask Fontaine
2. Lesson adaptation
3. Missing-resource generation
4. Substitute-plan generation
5. Canvas-ready output

## Release 1.0 — Daily-use product

1. Reliable Drive sync
2. Complete SEM and Fashion maps
3. Stable lesson and resource workflows
4. Version history
5. Curriculum analytics
6. Free production deployment

---

# Immediate engineering backlog

| ID | Task | Priority | Effort | Dependency | Done when |
|---|---|---:|---:|---|---|
| FC-001 | Add complete app source to repository | P0 | M | None | App runs locally from cloned repo |
| FC-002 | Define typed curriculum models | P0 | S | FC-001 | Course, unit, lesson, resource, standard, and task types compile |
| FC-003 | Seed SEM and Fashion Days 1–20 | P0 | M | FC-002 | All 40 lesson records render |
| FC-004 | Build Daily Command Center | P0 | M | FC-002 | Today, readiness, alerts, and queue display |
| FC-005 | Build Lesson Workspace | P0 | M | FC-002 | One lesson page displays all core sections |
| FC-006 | Build searchable Resource Library | P0 | M | FC-002 | Search and filters work |
| FC-007 | Build readiness engine | P0 | M | FC-002 | Missing components produce readiness state |
| FC-008 | Build Build Queue | P0 | S | FC-007 | Missing items become actionable tasks |
| FC-009 | Add local persistence | P1 | S | FC-004–008 | Teacher changes survive refresh |
| FC-010 | Add deployment configuration | P0 | S | FC-001 | App deploys on free hosting |

---

# Definition of Version 1 success

Fontaine Command v1 is successful when a teacher can:

1. Open one screen and know what is being taught today.
2. See whether every required lesson component is ready.
3. Open the full lesson without searching Google Drive.
4. Find and reuse existing resources.
5. See missing work in a prioritized build queue.
6. Track standards and certification coverage.
7. Record lesson feedback for future improvement.
8. Run and deploy the app without paying Lovable or another app builder.
