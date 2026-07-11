export type CourseCode = "8175" | "8140" | string;
export type CourseSlug = "sem" | "fashion" | string;
export type MarkingPeriodCode = "MP1" | "MP2" | "MP3" | "MP4" | string;

export type ReadinessStatus =
  | "complete"
  | "ready"
  | "needs-materials"
  | "planned"
  | "blocked";

export type ComponentType =
  | "lesson-plan"
  | "learning-target"
  | "agenda"
  | "bell-ringer"
  | "slides"
  | "worksheet"
  | "answer-key"
  | "activity"
  | "exit-ticket"
  | "canvas-directions"
  | "assessment"
  | "rubric"
  | "teacher-notes";

export type ResourceType =
  | "document"
  | "slides"
  | "spreadsheet"
  | "pdf"
  | "video"
  | "link"
  | "form"
  | "quiz"
  | "other";

export type AssessmentType =
  | "formative"
  | "summative"
  | "project"
  | "quiz"
  | "performance-task"
  | "certification-practice";

export type BuildTaskType =
  | "missing-slides"
  | "missing-worksheet"
  | "missing-answer-key"
  | "missing-canvas"
  | "missing-exit-ticket"
  | "missing-assessment"
  | "weak-activity"
  | "standards-gap"
  | "resource-update"
  | "other";

export type BuildTaskPriority = "P0" | "P1" | "P2" | "P3";
export type BuildTaskStatus = "open" | "in-progress" | "done" | "blocked";

export interface Course {
  id: string;
  code: CourseCode;
  slug: CourseSlug;
  title: string;
  description?: string;
  certificationIds: string[];
  markingPeriodIds: string[];
  unitIds: string[];
  active: boolean;
}

export interface MarkingPeriod {
  id: string;
  courseId: string;
  code: MarkingPeriodCode;
  title: string;
  sequence: number;
  startDate?: string;
  endDate?: string;
  unitIds: string[];
}

export interface Unit {
  id: string;
  courseId: string;
  markingPeriodId: string;
  title: string;
  sequence: number;
  essentialQuestions: string[];
  standardIds: string[];
  lessonIds: string[];
  estimatedDays?: number;
}

export interface LessonComponent {
  type: ComponentType;
  status: "complete" | "missing" | "draft" | "not-required";
  resourceIds: string[];
  notes?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  markingPeriodId: string;
  unitId: string;
  sequence: number;
  day?: number;
  title: string;
  summary?: string;
  learningTarget?: string;
  successCriteria?: string;
  agenda: string[];
  bellRinger?: string;
  miniLesson?: string;
  activity?: string;
  exitTicket?: string;
  materials: string[];
  differentiation: string[];
  estimatedMinutes?: number;
  standardIds: string[];
  certificationObjectiveIds: string[];
  resourceIds: string[];
  assessmentIds: string[];
  componentStatuses: LessonComponent[];
  readiness: ReadinessStatus;
  buildTaskIds: string[];
  revisionIds: string[];
  teacherFeedbackIds: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url?: string;
  driveFileId?: string;
  lessonIds: string[];
  unitIds: string[];
  courseIds: string[];
  standardIds: string[];
  tags: string[];
  version?: string;
  status: "active" | "draft" | "archived";
  lastUsedAt?: string;
  teacherRating?: number;
  healthScore?: number;
  duplicateOfResourceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Standard {
  id: string;
  courseCode: CourseCode;
  code: string;
  description: string;
  domain?: string;
  lessonIds: string[];
  assessmentIds: string[];
}

export interface CertificationObjective {
  id: string;
  certification: "WRS" | "NRF" | string;
  code: string;
  description: string;
  lessonIds: string[];
  assessmentIds: string[];
}

export interface Assessment {
  id: string;
  title: string;
  type: AssessmentType;
  courseId: string;
  lessonIds: string[];
  standardIds: string[];
  certificationObjectiveIds: string[];
  resourceIds: string[];
  maxScore?: number;
  masteryThreshold?: number;
}

export interface BuildTask {
  id: string;
  lessonId?: string;
  resourceId?: string;
  type: BuildTaskType;
  title: string;
  description?: string;
  priority: BuildTaskPriority;
  status: BuildTaskStatus;
  dependencyIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QualityScore {
  id: string;
  lessonId: string;
  engagement: number;
  efficiency: number;
  employability: number;
  certificationAlignment: number;
  rigor?: number;
  studentVoice?: number;
  reusability?: number;
  notes?: string;
  scoredAt: string;
}

export interface LessonRevision {
  id: string;
  lessonId: string;
  version: number;
  summary: string;
  changeNotes: string[];
  createdAt: string;
}

export interface TeacherFeedback {
  id: string;
  lessonId: string;
  rating: number;
  pacing?: "too-short" | "about-right" | "too-long";
  difficulty?: "too-easy" | "about-right" | "too-hard";
  engagementNotes?: string;
  revisionSuggestions: string[];
  createdAt: string;
}

export interface CurriculumStore {
  courses: Course[];
  markingPeriods: MarkingPeriod[];
  units: Unit[];
  lessons: Lesson[];
  resources: Resource[];
  standards: Standard[];
  certificationObjectives: CertificationObjective[];
  assessments: Assessment[];
  buildTasks: BuildTask[];
  qualityScores: QualityScore[];
  lessonRevisions: LessonRevision[];
  teacherFeedback: TeacherFeedback[];
}

const REQUIRED_COMPONENTS: ComponentType[] = [
  "lesson-plan",
  "learning-target",
  "agenda",
  "activity",
  "exit-ticket",
  "canvas-directions",
];

export function calculateLessonReadiness(
  components: LessonComponent[],
): ReadinessStatus {
  const relevant = components.filter((component) =>
    REQUIRED_COMPONENTS.includes(component.type),
  );

  const hasMissing = relevant.some((component) => component.status === "missing");
  const hasDraft = relevant.some((component) => component.status === "draft");
  const allComplete = relevant.length > 0 && relevant.every(
    (component) => component.status === "complete" || component.status === "not-required",
  );

  if (hasMissing) return "needs-materials";
  if (allComplete) return "complete";
  if (hasDraft) return "ready";
  return "planned";
}

export function getLessonResourceIdsByType(
  lesson: Lesson,
  type: ComponentType,
): string[] {
  return lesson.componentStatuses.find((component) => component.type === type)
    ?.resourceIds ?? [];
}

export function getOpenBuildTasksForLesson(
  lessonId: string,
  tasks: BuildTask[],
): BuildTask[] {
  return tasks.filter(
    (task) => task.lessonId === lessonId && task.status !== "done",
  );
}
