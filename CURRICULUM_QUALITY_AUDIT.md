# Curriculum Quality Audit

## Purpose

The quality audit is a permanent first-pass review system for all 180 released lessons in Fontaine Command. It identifies where teacher review and revision should begin without treating an automated score as a substitute for professional judgment or classroom evidence.

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

## Progress History

- **Initial baseline:** 90 overall, 113 Strong, 27 Minor Polish, 33 Needs Revision, 7 High Priority.
- **First repair cluster:** rebuilt SEM-001 through SEM-007; 92 overall, 120 Strong, 0 High Priority.
- **Second repair cluster:** rebuilt ENT-011, ENT-014, and FASH-013; 123 Strong, 30 Needs Revision.
- **Third repair cluster:** rebuilt eight Entrepreneurship and Fashion MP1 foundation and project lessons; 93 overall, 131 Strong, 22 Needs Revision.
- **Fourth repair cluster:** rebuilt ENT-012, ENT-018, FASH-004, and FASH-007; 94 overall, 135 Strong, 18 Needs Revision.
- **Fifth repair cluster:** rebuilt ENT-006, FASH-009, FASH-011, and FASH-012; 95 overall, 139 Strong, 14 Needs Revision.
- **Sixth repair cluster:** rebuilt ENT-005 and ENT-017; 141 Strong, 12 Needs Revision.
- **Seventh repair cluster:** rebuilt ENT-004, ENT-007, ENT-009, ENT-010, ENT-015, and ENT-016; 96 overall, 147 Strong, 6 Needs Revision.
- **Eighth repair cluster:** rebuilt FASH-005, FASH-008, FASH-015, FASH-016, FASH-019, and FASH-020; 153 Strong and every Needs Revision lesson was eliminated.

## First Minor Polish Cluster

The three lessons previously tied at 81 were rebuilt as evidence-rich classroom labs:

- **ENT-008:** twelve-source credibility and usefulness audit, three research questions, four-source mixed-method sequence, triangulation matrix, bias and limitation analysis, and measurable decision rule.
- **FASH-003:** fifteen fad-trend-classic classifications, six-evidence lifecycle timeline, cause-and-effect annotations, contradiction testing, stage diagnosis, and brand-response recommendation.
- **FASH-010:** three-look elements audit with fifteen evidence statements, four redesign changes, design tradeoff analysis, peer verification, and customer-focused redesign brief.

Post-cluster audit:

- **97/100 overall average**
- **156 Strong**
- **24 Minor Polish**
- **0 Needs Revision**
- **0 High Priority**

## Second Minor Polish Cluster

The two lessons previously tied at 83 were rebuilt as complete presentation and mastery cycles:

- **ENT-019:** six-part three-to-four-minute business pitch, quantitative and qualitative evidence, live question-and-answer defense, four Investor Evidence Scorecards, a $100,000 portfolio allocation, and Presenter Revision Note.
- **ENT-020:** eight Venture Rescue cases, individual performance check or verified 50-question Wayground review, eight-domain mastery tracking, evidence-based error analysis, and three-action Mastery Recovery Plan.

Post-cluster audit:

- **97/100 overall average**
- **158 Strong**
- **22 Minor Polish**
- **0 Needs Revision**
- **0 High Priority**

## Third Minor Polish Cluster

The two lessons previously tied at 84 were rebuilt as distinct evidence and planning labs:

- **ENT-003:** twelve venture classifications, four Problem-to-Value Chains, a seven-criterion Opportunity Value Test, assumption and risk analysis, and an evidence-based advance-test-reject recommendation.
- **FASH-006:** eight-source readiness audit, five-source research set, six-section Evidence-to-Claim Map, eight-slide storyboard, six-image citation log, three-gap research plan, and peer Research Readiness Audit.

Post-cluster audit:

- **97/100 overall average**
- **160 Strong**
- **20 Minor Polish**
- **0 Needs Revision**
- **0 High Priority**
- **SEM average: 96 — 52 Strong, 8 Minor Polish**
- **Fashion average: 98 — 54 Strong, 6 Minor Polish**
- **Entrepreneurship average: 97 — 54 Strong, 6 Minor Polish**

## Current Priority Queue

1. **SEM-027 — Integrated Promotional Campaign Planning — 84:** target action, success evidence, and exit-ticket rigor.
2. **SEM-017 — Sales Process in SEM — 87:** success evidence, exit-ticket rigor, and extension.
3. **SEM-036 — Professional Communication and Active Listening — 88:** named student product and exit-ticket rigor.
4. Remaining 89-score lessons across Entrepreneurship, Fashion, and SEM.

The most common remaining issues are 41 low-rigor exit tickets, 25 unclear target actions, 16 success-evidence flags, seven unnamed activity products, five repeated exit tickets, three missing extensions, and two activities without completion criteria.

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
- verifies all repaired SEM, Fashion, and Entrepreneurship lessons remain Strong;
- requires at least 160 Strong lessons and no more than 20 Minor Polish lessons;
- prevents any Needs Revision or High Priority lesson from returning;
- verifies dashboard and quality-patch script order;
- uploads `curriculum-quality-audit.json` with course summaries, common issues, and the first 30 polish priorities.

The current baseline remains diagnostic. Quality gates will continue tightening as the remaining Minor Polish lessons are strengthened.