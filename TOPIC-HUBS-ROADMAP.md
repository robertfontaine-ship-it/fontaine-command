# Fontaine Mission Network

## Purpose

The Fontaine Mission Network turns major marketing concepts into permanent student-facing topic hubs. Each hub serves four classroom needs:

1. A reusable digital textbook and example library.
2. An independent early-finisher pathway.
3. A remediation and make-up resource.
4. A mission system connected to optional weekly giveaway entries.

Canvas remains the official location for required assignments, grades, and submissions. Topic hubs provide the learning experience, enrichment, and navigation layer.

## Phase 1 Prototype

### Student network

- `topic-hubs.html` — topic catalog, reward rules, and student workflow.
- `branding-hub.html` — first complete topic hub.
- `topic-hubs.js` — topic data, mission data, student profile, local progress, and mission receipts.
- `topic-hubs.css` — shared responsive design for student pages and the teacher dashboard extension.

### Branding hub

The prototype includes six foundational branding concepts and ten independent missions:

- Three Quick Missions worth one provisional entry each.
- Four Skill Missions worth two provisional entries each.
- Three Boss Missions worth four provisional entries each.
- Ten provisional entries maximum per student each week.
- Student and teacher period selectors covering Periods 1–7.

Student responses and receipts are stored only in the student browser. A receipt must be shown or submitted for teacher verification.

### Teacher workflow

`topic-hubs-admin.js` adds a **Topic Hubs** page to Fontaine Command with:

- Direct links to student-facing pages.
- Weekly giveaway settings.
- A local approval ledger.
- Per-student weekly entry-cap enforcement.
- Weighted random drawing.
- CSV export.
- Current rollout status and build queue.

## Independent-Use Direction Standard

Every topic hub must be understandable without a teacher explaining the page aloud. Each hub will use the same visible workflow:

1. **Finish required work** — students are told that regular class assignments come first.
2. **Choose one mission** — time, level, entry value, and expected outcome are visible before opening it.
3. **Complete every prompt** — students receive explicit response-quality expectations and must answer every numbered question.
4. **Create and submit the receipt** — the page states exactly what to copy, show, or submit and that entries require teacher approval.

Every mission window must include:

- A one-sentence mission goal.
- A clear time estimate and entry value.
- Numbered prompts in the order students should complete them.
- Complete-sentence and evidence expectations.
- A clear final submission step.
- A reminder not to close the receipt before copying or showing it.
- Plain-language button labels that describe the next action.

Directions should avoid assumed knowledge, vague phrases such as “complete the activity,” and hidden submission requirements. A student opening the website for the first time should be able to identify what to do, what a finished response contains, and what happens after submission.

## Mission Design Standard

Every mission should include:

- A realistic context or problem.
- A clear time estimate.
- One or more required decisions.
- Evidence-based explanations.
- A target-customer connection.
- A concrete product, recommendation, or analysis.
- A defined entry value.

Mission levels:

| Level | Typical Time | Entry Value | Purpose |
|---|---:|---:|---|
| Quick | 5–10 minutes | 1 | Focused identification, comparison, or repair |
| Skill | 15–25 minutes | 2 | Complete application or strategic recommendation |
| Boss | 30–40 minutes | 4 | Multi-part creation, crisis, pitch, or integrated strategy |

## Recommended Rollout Order

1. Branding
2. Target Market and Segmentation
3. The 4Ps of Marketing
4. Marketing Functions
5. Promotional Mix
6. Market Research
7. Pricing Strategy
8. Distribution
9. Selling and Customer Service

## Phase 2 Opportunities

- Centralized mission submissions instead of browser-only receipts.
- Teacher approval from a shared roster.
- Canvas deep links for required submissions.
- Topic mastery checks with 80% thresholds.
- Badges and cross-topic progression.
- Course-specific mission paths for SEM, Fashion, and Entrepreneurship.
- A monthly drawing that carries forward verified weekly participation.

## Current Live Foundation

- Six live departments: Brand Studio, Consumer Intelligence Center, Strategy War Room, Marketing Operations HQ, Campaign Command Center, and Market Research Lab.
- Fifty-nine Quick, Skill, and Boss missions.
- Wolverine Marketing Agency with six career roles, six editable client-brief starters, teacher-launched project links, and multi-role team rosters.
- Mission Control, Mission IDs, XP, seven reputation ranks, badges, and department progress.
- Teacher review packets, a review queue, approval ledger, weekly drawing, and CSV export.
- Period selectors covering Periods 1–7.

## Product North Star

The Mission Network should feel like one classroom learning operating system, not a collection of websites. A student should always know who they are, what to do next, what quality looks like, what was saved, and how to submit. The teacher should be able to launch, review, approve, and report activity without maintaining a second grading system.

### Student loop

1. Check in once with a Mission ID.
2. Finish required class work.
3. Choose a mission that fits the available time.
4. Complete specific, evidence-based work with visible quality criteria.
5. Submit one review packet, receive feedback, revise when needed, and continue progressing.

### Teacher loop

1. Open Fontaine Command.
2. See the pending review queue by period and status.
3. Review the complete student evidence in one place.
4. Approve, return, or reject without retyping student data.
5. Run the weekly drawing and export the ledger when needed.

## Non-Negotiable Release Gates

| Area | Release standard |
|---|---|
| Shared devices | Student missions, XP, entries, roles, and portfolios never appear under another student profile. |
| Reward economy | One network-wide weekly cap applies across every department, Agency project, and revision. |
| Independent use | Every mission states the time, goal, numbered steps, quality standard, and exact submission action. |
| Revision loop | Returned work can be revised and resubmitted under the original receipt without duplicate credit. |
| Teacher workload | A complete submission can be reviewed and acted on from one queue in under one minute. |
| Mobile access | All controls remain reachable at 390 px width with no horizontal document overflow and 44 px touch targets. |
| Reliability | Refreshing, switching profiles, revising, or reaching the weekly cap never corrupts progress. |
| Curriculum value | Every mission requires a marketing decision, evidence, target-customer reasoning, and a concrete product or recommendation. |
| Accessibility | Forms have visible labels, dialogs support keyboard use, status changes are announced, and color is never the only signal. |
| Free operation | The core classroom experience requires no paid student account or paid build platform. |

## Hardening Completed

- Replaced separate and conflicting browser stores with one versioned Mission Network data layer.
- Isolated progress by student name, last initial, and class period for shared classroom computers.
- Added automatic migration for the earlier Branding, department, Mission ID, and Agency storage formats.
- Enforced the ten-entry cap across the entire network while preserving full XP for completed work.
- Connected Agency projects to the same teacher review queue used by department missions.
- Allowed returned submissions to re-enter the queue as revisions instead of being blocked as duplicates.
- Allowed teachers to approve qualifying work even when no additional entries can be awarded.
- Consolidated the live departments into the main source of truth and removed render-time expansion patches.
- Added dedicated Mission Network QA for inventory, Periods 1–7, script order, page wiring, profile isolation, cap behavior, migration, Agency packets, and revision approval.
- Added profile-isolated autosave to all 49 department missions and every Agency role, including visible saved and recovered-work messages.
- Added student profile backup and restore with safe merging of completed work, Agency roles, and unfinished drafts.
- Added teacher-controlled cleanup for one student or the entire shared browser while preserving review-queue and giveaway records.
- Verified Mission Network layout and interactions in a real browser at desktop, iPhone, and iPad sizes, including 44 px touch controls and zero document overflow.
- Added end-to-end browser coverage for interrupted work, mission completion, backup download, cross-device restore, and teacher device reset.
- Standardized the five-destination primary navigation across Mission Control, all departments, Agency, and Mission ID, with clear current-page state and contextual on-page links.
- Added skip links, visible keyboard focus, reduced-motion support, focusable main landmarks, and 44 px contextual navigation targets.
- Added consistent dialog labels, background isolation, keyboard focus traps, Escape behavior, focus return, and receipt/status announcements.
- Added dedicated accessibility checks for all nine student surfaces plus Business World orientation and single-page navigation.
- Connected Business World City Hall directly to the shared Mission Network store so its profile, XP, entries, mission history, and Agency progress cannot drift from the rest of the system.
- Added teacher worklist filters for Periods 1–7, review status, search, and sort order, with pending work shown by default.
- Added selection-based batch approval and return actions with explicit confirmation, weekly cap enforcement, duplicate-credit protection, and preserved review history.
- Added a seven-period weekly participation summary, revision-cycle tracking, entry totals, and a detailed weekly CSV report.
- Completed browser coverage from student packet copy through teacher return, student revision, batch approval, reporting, weighted drawing, and phone-width teacher use.
- Added a dedicated Mission Network GitHub QA workflow so data, accessibility, and browser safeguards run automatically when relevant PR files change.
- Added a teacher Agency project launcher that turns any built-in or saved custom brief into one portable student link without a paid account or shared database.
- Added editable and reusable client-brief templates, Periods 1–7, due dates, solo or team formats, saved launches, duplication, and student-link/project-code sharing.
- Added two-to-six-student team rosters with unique professional roles, profile-isolated project joining, assigned work orders, and portable backup/restore support.
- Added one-paste roster setup that assigns distinct Agency roles automatically while keeping every role editable.
- Added role-specific client packets plus three individual accountability checks covering personal work, decision impact, and teammate handoffs.
- Added Agency team, role, project-code, prompt, and roster context to the teacher review queue and weekly CSV export.
- Added a current-week Agency accountability view showing expected roles, submitted packets, approvals, and returned work by team.
- Kept Monday-based weekly caps and reports on the correct local calendar date in every time zone.
- Added end-to-end browser coverage from teacher launch through two student roles, individual submissions, batch approval, weekly reporting, and phone-width use.
- Added a printable classroom launch kit that turns a pasted roster into privacy-conscious first-name/last-initial check-in cards, with six black-and-white cards per sheet and blank-card support.
- Added a configurable one-page substitute guide covering Periods 1–7, independent work, Canvas-first expectations, offline backup, teacher-only controls, and end-of-class procedures.
- Launched the Market Research Lab with ten missions covering objectives, secondary and primary evidence, sampling, survey design, qualitative research, analysis, limitations, and decision recommendations.

## Ordered Build Plan

### P0 — Finish classroom hardening

1. ✅ Run full browser interaction QA on desktop, iPhone-width, and iPad-width layouts.
2. ✅ Add autosaved drafts and clear recovery messages for interrupted student work.
3. ✅ Add profile export/import and a teacher-controlled shared-device reset.
4. ✅ Standardize navigation, focus return, dialog behavior, and status announcements on every student page.
5. ✅ Extend end-to-end browser coverage through copying, teacher return, student revision, approval, and the weekly drawing.

### P1 — Reduce teacher setup time

1. ✅ Add an Agency project launcher and editable client-brief templates.
2. ✅ Add team rosters, multi-role packets, and individual accountability evidence.
3. ✅ Add period and status filters, bulk review actions, and a weekly participation summary.
4. ✅ Add printable student check-in cards and a one-page substitute-mode guide.

### P2 — Expand the learning network

1. ✅ Market Research.
2. Pricing Strategy.
3. Distribution.
4. Selling and Customer Service.
5. Course-specific pathways for SEM, Fashion, and Entrepreneurship.
6. Topic mastery checks with an 80% threshold and targeted remediation routes.
