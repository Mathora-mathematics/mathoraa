MATHORA V5 — PLATFORM STRUCTURE

NEW PAGES
index.html
free-assessment.html
services.html
exam-review.html
homework-review.html
weekly-check.html
mock-exams.html
tutoring.html
schools.html
contact.html
thank-you.html
privacy.html

NEW JAVASCRIPT
platform.js
contact.js

SUPABASE
Run mathora-v5-contact-setup.sql once in Supabase SQL Editor.
This creates contact_enquiries and permits anonymous form submissions.

EXISTING ASSESSMENT FILES RETAINED
register.html
instructions.html
test.html
register.js
instructions.js
tests.js
test.js
supabase-config.js

CONTACT FLOW
Ad/service page → contact.html?service=... → Supabase contact_enquiries → thank-you.html

NO PUBLIC PRICES
The platform deliberately uses consultation and enquiry calls to action rather than a price page.

UPLOAD
Upload all files in this package to the root of the GitHub repository.
Run the SQL before testing the contact form.
