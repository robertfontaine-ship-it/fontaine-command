# Mobile Layout and Navigation QA

## Tested viewports
- iPhone 12 — 390 × 844
- iPhone 14 Pro Max — 430 × 932
- iPad Mini — 768 × 1024

## Automated checks
- No horizontal document overflow on every navigation page
- All page links remain reachable through the mobile navigation bar
- Active navigation state updates correctly
- Navigation touch targets meet the 44px minimum
- AI Teacher Assistant collapses to one column
- Course and lesson selectors remain visible
- Suggested assistant commands produce the expected response
- Main Ask Fontaine search routes assistant commands correctly
- No browser console or page errors

## Defects found and fixed
- Mobile navigation expanded the document to 2,155px on a 390px viewport
- Reflections page expanded the document to 649px on a 390px viewport

## Result
All mobile layout and navigation checks pass in GitHub Actions.
