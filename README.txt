MATHORA V8 — DAILY CHALLENGE

ADD ONLY THESE FILES TO THE ROOT OF GITHUB:
- daily-question.html
- daily-v8.css
- daily-bank.js
- daily.js

NO EXISTING FILES NEED TO BE REPLACED.
NO SUPABASE CHANGES.
NO SQL.
NO PAID SERVICES.

HOW IT WORKS
- Automatically changes with the date.
- Two-year / 730-day rotation.
- Student chooses a pathway once.
- Choice is remembered in localStorage.
- Daily streak is remembered locally.
- Hint, worked solution, common mistake and exam tip.
- Previous and random challenges.
- Direct share links work, for example:
  daily-question.html?track=gcse-higher
  daily-question.html?track=ib-aa-hl
  daily-question.html?track=a-level
  daily-question.html?track=further-maths
- Link a specific challenge with:
  daily-question.html?track=gcse-higher&q=37

PATHWAYS
1. GCSE Foundation
2. GCSE Higher
3. Cambridge IGCSE Core
4. IGCSE Extended / Higher
5. AS Mathematics
6. A Level Mathematics
7. A Level Further Mathematics
8. IB AA SL
9. IB AA HL
10. IB AI SL
11. IB AI HL

QUESTION APPROACH
The questions are original Mathora questions generated from syllabus-aligned
template families. They are not copied from past papers.

The bank is deterministic rather than storing 8,030 giant static question
objects. This keeps GitHub lightweight while still creating a two-year daily
rotation for every pathway.

VALIDATION
gcse-foundation: 522 unique question strings / 730 generated days
gcse-higher: 373 unique question strings / 730 generated days
igcse-core: 522 unique question strings / 730 generated days
igcse-extended: 373 unique question strings / 730 generated days
as-maths: 306 unique question strings / 730 generated days
a-level: 304 unique question strings / 730 generated days
further-maths: 290 unique question strings / 730 generated days
ib-aa-sl: 305 unique question strings / 730 generated days
ib-aa-hl: 339 unique question strings / 730 generated days
ib-ai-sl: 291 unique question strings / 730 generated days
ib-ai-hl: 297 unique question strings / 730 generated days
TOTAL=8030


SUGGESTED GITHUB COMMIT
Add Mathora Daily two-year challenge
