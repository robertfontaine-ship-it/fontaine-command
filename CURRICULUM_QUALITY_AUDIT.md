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

SEM-001 through SEM-007 were rebuilt from their seven verified exact lesson documents.

- **92/100 overall average**
- **120 Strong**
- **27 Minor Polish**
- **33 Needs Revision**
- **0 High Priority**
- **SEM average increased from 91 to 96**

## Second Repair Cluster

ENT-011, ENT-014, and FASH-013 were rebuilt as evidence-based target-market, service-recovery, and trend-diffusion lessons.

- **92/100 overall average**
- **123 Strong**
- **27 Minor Polish**
- **30 Needs Revision**
- **0 High Priority**
- **Fashion average: 90**
- **Entrepreneurship average: 90**

## Third Repair Cluster

ENT-001, ENT-002, ENT-013, FASH-001, FASH-002, FASH-014, FASH-017, and FASH-018 were rebuilt as complete classroom workflows for course launch, careers, customer service, brand analysis, and Fashion Face-Off production and presentations.

- **93/100 overall average**
- **131 Strong**
- **27 Minor Polish**
- **22 Needs Revision**
- **0 High Priority**
- **SEM average: 96**
- **Fashion average: 92**
- **Entrepreneurship average: 92**

## Fourth Repair Cluster

The next four lowest-scoring lessons were strengthened:

- **ENT-012:** four-segment profile matrix, five-criterion attractiveness scoring, primary and secondary target selection, and marketing-mix comparison.
- **ENT-018:** seven-part elevator-pitch architecture, 90–130 word script, three timed practice rounds, feedback scorecards, revision log, and final delivery evidence.
- **FASH-004:** source-backed Then-and-Now Evidence Board and complete History of Fashion project launch brief with historical-to-modern connections and source requirements.
- **FASH-007:** source-backed eight-part project production tracker, peer Source-and-Evidence Audit, two documented revisions, and teacher checkpoint conference.

The fourth post-repair audit produced:

- **94/100 overall average**
- **135 Strong**
- **27 Minor Polish**
- **18 Needs Revision**
- **0 High Priority**
- **SEM average: 96**
- **Fashion average: 93**
- **Entrepreneurship average: 93**

## Fifth Repair Cluster

The four lessons previously tied at 75 were rebuilt as complete classroom decision and production labs:

- **ENT-006:** five customer-problem observations, three problem statements, three Concept Cards, six-criterion opportunity scoring, assumption stress testing, and an Opportunity Recommendation Brief.
- **FASH-009:** three-look color analysis, a six-color customer palette, two annotated fashion applications, peer verification, and a Color Strategy Memo.
- **FASH-011:** a three-look, six-principle design audit with twelve evidence statements, four annotated redesign changes, tradeoff analysis, and peer critique.
- **FASH-012:** a privacy-conscious seven-section Consumer Style Dossier, five ranked influences, five purchase decisions, a twelve-image style board, and a complete marketing response.

The fifth post-repair audit produced:

- **95/100 overall average**
- **139 Strong**
- **27 Minor Polish**
- **14 Needs Revision**
- **0 High Priority**
- **SEM average: 96**
- **Fashion average: 95**
- **Entrepreneurship average: 93**

The current lowest-scoring lessons are ENT-005 and ENT-017 at 76. The next group at 78 includes ENT-004, ENT-007, ENT-009, ENT-010, ENT-015, ENT-016, FASH-005, FASH-008, FASH-015, FASH-016, FASH-019, and FASH-020. The most common remaining issues are low-rigor exit tickets, unclear observable target actions, thin activity directions, thin mini lessons, and missing completion criteria.

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
- verifies all repaired SEM, Fashion, and Entrepreneurship MP1 lessons remain Strong;
- prevents any High Priority lesson from returning;
- verifies dashboard and quality-patch script order;
- uploads `curriculum-quality-audit.json` with course summaries, common issues, and the first 30 revision priorities.

The current baseline is diagnostic. Quality gates should become stricter as each ranked revision cluster is strengthened.