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
