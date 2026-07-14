# Curriculum Quality Audit

## Purpose

The quality audit is a permanent first-pass review system for the 180 released lessons in Fontaine Command. It identifies where teacher review and revision should begin without treating an automated score as a substitute for professional judgment or classroom evidence.

## Audit Dimensions

Each lesson begins at 100 points and receives transparent deductions for actionable issues in these areas:

- **Core completeness:** overview, target, success criteria, agenda, bell ringer, mini lesson, activity, exit ticket, materials, differentiation, Canvas directions, and standards.
- **Learning clarity:** measurable “I will” target, observable student action, and success criteria tied to at least 80% mastery.
- **Instructional detail:** explicit mini-lesson content, a complete agenda, and classroom-ready activity directions.
- **Student evidence:** a named student product, completion criteria, and an exit ticket requiring explanation, application, analysis, justification, or evidence.
- **Differentiation:** multiple concrete supports plus a meaningful extension or early-finisher challenge.
- **Delivery readiness:** usable materials, step-by-step Canvas directions, submission instructions, mastery expectations, duration, and standards alignment.
- **Repetition:** near-duplicate activity and exit-ticket language within the same course.

## Quality Bands

- **Strong:** 90–100
- **Minor Polish:** 80–89
- **Needs Revision:** 65–79
- **High Priority:** below 65

## Initial Baseline

The first complete audit produced:

- **180 lessons reviewed**
- **90/100 overall average**
- **113 Strong**
- **27 Minor Polish**
- **33 Needs Revision**
- **7 High Priority**

All seven High Priority lessons were SEM-001 through SEM-007. They were marked complete but still contained generic starter content for the opening course-launch and marketing-functions sequence.

## First Repair Cluster

SEM-001 through SEM-007 were rebuilt from their seven verified exact lesson documents. The strengthened sequence now includes specific modeling, measurable evidence, named student products, completion criteria, rigorous exit tickets, differentiation, source notes, and complete Canvas directions.

The post-repair audit produced:

- **92/100 overall average**
- **120 Strong**
- **27 Minor Polish**
- **33 Needs Revision**
- **0 High Priority**
- **SEM average increased from 91 to 96**

The next revision queue is concentrated in Fashion and Entrepreneurship MP1. The most common remaining issues are low-rigor exit tickets, thin activity directions, thin mini lessons, and missing activity completion criteria.

## Teacher Workflow

1. Open **Quality Audit** in the main navigation.
2. Review the three course averages and the most common quality flags.
3. Open the lowest available quality band.
4. Filter by course or search for a lesson, unit, marking period, or issue.
5. Open the lesson directly from the queue and revise the highest-impact flags first.
6. Use teacher reflections after instruction to confirm whether the automated concern was meaningful in practice.

## Quality Assurance

The `Curriculum Quality Audit` GitHub Actions workflow:

- loads the complete 180-lesson release in production script order;
- verifies that every lesson receives a score, band, and issue list;
- confirms there are no missing core instructional fields;
- reconciles course and quality-band totals;
- verifies that SEM-001 through SEM-007 remain Strong and that no High Priority lessons return;
- verifies dashboard script order and navigation registration;
- uploads `curriculum-quality-audit.json` with course summaries, common issues, and the first 30 revision priorities.

The current baseline is diagnostic. Quality gates should become stricter as each ranked revision cluster is strengthened.
