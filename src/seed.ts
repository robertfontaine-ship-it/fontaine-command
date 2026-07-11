import type {
  Course,
  CurriculumStore,
  Lesson,
  LessonComponent,
  MarkingPeriod,
  Resource,
  Standard,
  Unit,
} from "./models";

const now = "2026-07-11T00:00:00.000Z";

const completeComponents = (): LessonComponent[] => [
  { type: "lesson-plan", status: "complete", resourceIds: [] },
  { type: "learning-target", status: "complete", resourceIds: [] },
  { type: "agenda", status: "complete", resourceIds: [] },
  { type: "activity", status: "complete", resourceIds: [] },
  { type: "exit-ticket", status: "complete", resourceIds: [] },
  { type: "canvas-directions", status: "complete", resourceIds: [] },
];

const plannedComponents = (): LessonComponent[] => [
  { type: "lesson-plan", status: "draft", resourceIds: [] },
  { type: "learning-target", status: "draft", resourceIds: [] },
  { type: "agenda", status: "draft", resourceIds: [] },
  { type: "activity", status: "missing", resourceIds: [] },
  { type: "exit-ticket", status: "missing", resourceIds: [] },
  { type: "canvas-directions", status: "missing", resourceIds: [] },
];

const semTitles = [
  "Course Launch, Classroom Systems, and Teamwork Stations",
  "DECA, Workplace Readiness, and Career Growth",
  "What Is Marketing? Customers, Value, and Exchange",
  "Marketing Functions in Sports and Entertainment",
  "Marketing Functions Project Planning",
  "Marketing Functions Project Workday and Checkpoint",
  "Marketing Functions Presentations and Peer Feedback",
  "SEM Industries Overview",
  "Sports Marketing and Community Impact",
  "Entertainment Marketing and Media Evolution",
  "Target Markets in SEM",
  "Demographics and Fan Segmentation",
  "Promotion in Sports and Entertainment",
  "Sponsorships and Endorsements",
  "Naming Rights and Brand Partnerships",
  "Customer Service in SEM",
  "Sales Process in SEM",
  "Professional Communication",
  "Ethics and Company Culture",
  "MP1 Review and Performance Check",
] as const;

const fashionTitles = [
  "Course Launch, Fashion Identity, and Teamwork Stations",
  "DECA, Workplace Readiness, and Fashion Career Pathways",
  "Fashion Cycle and Trends",
  "History of Fashion and Cultural Influence",
  "Fashion History Decade Analysis",
  "Fashion History Project Planning and Research",
  "Fashion History Project Workday and Checkpoint",
  "Fashion History Presentations and Reflection",
  "Color Theory in Fashion",
  "Elements of Design in Fashion",
  "Principles of Design in Fashion",
  "Personal Style and Consumer Identity",
  "Fashion Trends and Cultural Influence",
  "Fashion Brands and Brand Image",
  "Fashion Designers and Branding",
  "Fashion Face-Off Planning",
  "Fashion Face-Off Workday",
  "Fashion Face-Off Presentations",
  "Fashion Careers and Employability Skills",
  "MP1 Review and Performance Check",
] as const;

const semUnits = [
  ["sem-mp1-u01", "Orientation & Workplace Readiness", 1, 2],
  ["sem-mp1-u02", "Overview of Marketing", 3, 7],
  ["sem-mp1-u03", "Importance of SEM Industries", 8, 15],
  ["sem-mp1-u04", "Employability & Interpersonal Skills", 16, 20],
] as const;

const fashionUnits = [
  ["fash-mp1-u01", "Orientation & Workplace Readiness", 1, 2],
  ["fash-mp1-u02", "Fashion Marketing Concept", 3, 13],
  ["fash-mp1-u03", "Fashion Designers & Branding", 14, 20],
] as const;

function unitForDay(course: "sem" | "fashion", day: number): string {
  const units = course === "sem" ? semUnits : fashionUnits;
  return units.find(([, , start, end]) => day >= start && day <= end)?.[0] ?? units[0][0];
}

function makeLesson(
  course: "sem" | "fashion",
  day: number,
  title: string,
): Lesson {
  const complete = day <= 7;
  const prefix = course === "sem" ? "SEM" : "FASH";
  const courseId = course === "sem" ? "course-sem" : "course-fashion";
  const standardId = course === "sem" ? "std-sem-mp1" : "std-fashion-mp1";

  return {
    id: `${prefix}-${String(day).padStart(3, "0")}`,
    courseId,
    markingPeriodId: `${course}-mp1`,
    unitId: unitForDay(course, day),
    sequence: day,
    day,
    title,
    summary: complete
      ? `Complete classroom-ready package for ${title}.`
      : `Mapped MP1 lesson awaiting full classroom-material build.`,
    learningTarget: complete
      ? `I will demonstrate understanding of ${title.toLowerCase()} with at least 80% accuracy.`
      : undefined,
    successCriteria: complete
      ? "I will know I am successful when I complete the lesson tasks with at least 80% accuracy."
      : undefined,
    agenda: complete
      ? ["Bell ringer", "Mini lesson", "Student activity", "Check for understanding", "Exit ticket"]
      : [],
    materials: [],
    differentiation: [],
    estimatedMinutes: complete ? 55 : undefined,
    standardIds: [standardId],
    certificationObjectiveIds: ["cert-wrs"],
    resourceIds: [],
    assessmentIds: [],
    componentStatuses: complete ? completeComponents() : plannedComponents(),
    readiness: complete ? "complete" : day % 3 === 0 ? "needs-materials" : "planned",
    buildTaskIds: complete ? [] : [`task-${prefix.toLowerCase()}-${String(day).padStart(3, "0")}`],
    revisionIds: [],
    teacherFeedbackIds: [],
    tags: [course, "mp1", complete ? "complete" : "planned"],
    createdAt: now,
    updatedAt: now,
  };
}

export const courses: Course[] = [
  {
    id: "course-sem",
    code: "8175",
    slug: "sem",
    title: "Sports & Entertainment Marketing",
    certificationIds: ["cert-wrs"],
    markingPeriodIds: ["sem-mp1"],
    unitIds: semUnits.map(([id]) => id),
    active: true,
  },
  {
    id: "course-fashion",
    code: "8140",
    slug: "fashion",
    title: "Fashion Marketing",
    certificationIds: ["cert-wrs"],
    markingPeriodIds: ["fashion-mp1"],
    unitIds: fashionUnits.map(([id]) => id),
    active: true,
  },
];

export const markingPeriods: MarkingPeriod[] = [
  {
    id: "sem-mp1",
    courseId: "course-sem",
    code: "MP1",
    title: "Marking Period 1",
    sequence: 1,
    unitIds: semUnits.map(([id]) => id),
  },
  {
    id: "fashion-mp1",
    courseId: "course-fashion",
    code: "MP1",
    title: "Marking Period 1",
    sequence: 1,
    unitIds: fashionUnits.map(([id]) => id),
  },
];

function buildUnits(
  courseId: string,
  markingPeriodId: string,
  source: readonly (readonly [string, string, number, number])[],
  prefix: "SEM" | "FASH",
): Unit[] {
  return source.map(([id, title, start, end], index) => ({
    id,
    courseId,
    markingPeriodId,
    title,
    sequence: index + 1,
    essentialQuestions: [],
    standardIds: [prefix === "SEM" ? "std-sem-mp1" : "std-fashion-mp1"],
    lessonIds: Array.from({ length: end - start + 1 }, (_, offset) =>
      `${prefix}-${String(start + offset).padStart(3, "0")}`,
    ),
    estimatedDays: end - start + 1,
  }));
}

export const units: Unit[] = [
  ...buildUnits("course-sem", "sem-mp1", semUnits, "SEM"),
  ...buildUnits("course-fashion", "fashion-mp1", fashionUnits, "FASH"),
];

export const lessons: Lesson[] = [
  ...semTitles.map((title, index) => makeLesson("sem", index + 1, title)),
  ...fashionTitles.map((title, index) => makeLesson("fashion", index + 1, title)),
];

export const standards: Standard[] = [
  {
    id: "std-sem-mp1",
    courseCode: "8175",
    code: "MK8175-MP1",
    description: "SEM MP1 pacing-guide competencies",
    lessonIds: lessons.filter((lesson) => lesson.courseId === "course-sem").map((lesson) => lesson.id),
    assessmentIds: [],
  },
  {
    id: "std-fashion-mp1",
    courseCode: "8140",
    code: "8140-MP1",
    description: "Fashion Marketing MP1 pacing-guide competencies",
    lessonIds: lessons.filter((lesson) => lesson.courseId === "course-fashion").map((lesson) => lesson.id),
    assessmentIds: [],
  },
];

export const resources: Resource[] = [
  {
    id: "res-marketing-functions-template",
    title: "Marketing Functions Project Template",
    type: "slides",
    lessonIds: ["SEM-004", "SEM-005", "SEM-006", "SEM-007"],
    unitIds: ["sem-mp1-u02"],
    courseIds: ["course-sem"],
    standardIds: ["std-sem-mp1"],
    tags: ["marketing-functions", "project"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "res-fashion-history",
    title: "Fashion of Yesterday & Today",
    type: "slides",
    lessonIds: ["FASH-003", "FASH-004", "FASH-005", "FASH-006", "FASH-007", "FASH-008"],
    unitIds: ["fash-mp1-u02"],
    courseIds: ["course-fashion"],
    standardIds: ["std-fashion-mp1"],
    tags: ["fashion-history", "trends"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
];

export const seedStore: CurriculumStore = {
  courses,
  markingPeriods,
  units,
  lessons,
  resources,
  standards,
  certificationObjectives: [
    {
      id: "cert-wrs",
      certification: "WRS",
      code: "WRS-MP1",
      description: "Workplace readiness skills integrated across MP1",
      lessonIds: lessons.map((lesson) => lesson.id),
      assessmentIds: [],
    },
  ],
  assessments: [],
  buildTasks: lessons
    .filter((lesson) => lesson.readiness !== "complete")
    .map((lesson) => ({
      id: lesson.buildTaskIds[0],
      lessonId: lesson.id,
      type: "other",
      title: `Build ${lesson.id}`,
      description: `Complete the missing lesson materials for ${lesson.title}.`,
      priority: lesson.day && lesson.day <= 10 ? "P0" : "P1",
      status: "open",
      dependencyIds: [],
      createdAt: now,
      updatedAt: now,
    })),
  qualityScores: [],
  lessonRevisions: [],
  teacherFeedback: [],
};

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

export function getLessonsByCourse(courseId: string): Lesson[] {
  return lessons.filter((lesson) => lesson.courseId === courseId);
}
