MATHORA STAGE 5 — ONLINE SUBMISSIONS

NEW FILES
- supabase-config.js
- supabase-setup.sql

WHAT THIS VERSION DOES
- Saves student details to Supabase
- Saves all 12 answers
- Uploads handwritten-work images
- Uploads whiteboard images
- Gives the student a submission reference
- Keeps stored files private

SETUP
1. Create a free Supabase project.
2. Open SQL Editor.
3. Copy all of supabase-setup.sql and run it.
4. Open Project Settings → Data API.
5. Copy the Project URL and anon/public key.
6. Paste both values into supabase-config.js.
7. Upload every file in this folder to GitHub.
8. Hard refresh the published website.

SECURITY
Never put the Supabase service_role key in GitHub.
Only use the anon/public key in supabase-config.js.
