# Fontaine Command Data Model

The data model is course-agnostic. SEM 8175 and Fashion Marketing 8140 use the same structures.

## Primary hierarchy

```text
Course
└── Marking Period
    └── Unit
        └── Lesson
```

## Main relationships

- A course has many marking periods and units.
- A marking period belongs to one course and contains units.
- A unit belongs to one course and one marking period.
- A lesson belongs to one course, marking period, and unit.
- A lesson can connect to many standards, resources, assessments, and certification objectives.
- A resource can connect to many lessons, units, standards, and courses.
- Missing lesson components generate build tasks.
- Teacher feedback and revisions remain attached to the lesson across years.

## Readiness model

Required lesson components:

- Lesson plan
- Learning target
- Agenda
- Activity
- Exit ticket
- Canvas directions

`calculateLessonReadiness()` returns:

- `complete` — all required components are complete or not required
- `needs-materials` — one or more required components are missing
- `ready` — required components exist but at least one remains a draft
- `planned` — lesson is mapped but not yet developed

`blocked` is reserved for lessons that cannot proceed because of an external dependency.

## Example lesson relationship

```ts
const lesson: Lesson = {
  id: "SEM-004",
  courseId: "course-sem-8175",
  markingPeriodId: "sem-mp1",
  unitId: "sem-mp1-u02",
  sequence: 4,
  day: 4,
  title: "Marketing Functions in Sports and Entertainment",
  agenda: ["Bell ringer", "Mini lesson", "Project activity", "Exit ticket"],
  materials: [],
  differentiation: [],
  standardIds: ["MK8175.38", "MK8175.39"],
  certificationObjectiveIds: ["WRS-COMMUNICATION"],
  resourceIds: ["res-marketing-functions-template"],
  assessmentIds: [],
  componentStatuses: [
    { type: "lesson-plan", status: "complete", resourceIds: [] },
    { type: "learning-target", status: "complete", resourceIds: [] },
    { type: "agenda", status: "complete", resourceIds: [] },
    { type: "activity", status: "complete", resourceIds: ["res-marketing-functions-template"] },
    { type: "exit-ticket", status: "complete", resourceIds: [] },
    { type: "canvas-directions", status: "complete", resourceIds: [] },
  ],
  readiness: "complete",
  buildTaskIds: [],
  revisionIds: [],
  teacherFeedbackIds: [],
  tags: ["marketing-functions", "project", "SEM"],
  createdAt: "2026-07-11T00:00:00Z",
  updatedAt: "2026-07-11T00:00:00Z",
};
```

## Future database mapping

The interfaces can map directly to relational tables in PostgreSQL/Supabase. Many-to-many relationships should use join tables such as:

- `lesson_standards`
- `lesson_resources`
- `lesson_assessments`
- `lesson_certification_objectives`
- `resource_units`
- `resource_courses`

The current static application can continue running while the typed model is introduced incrementally.
