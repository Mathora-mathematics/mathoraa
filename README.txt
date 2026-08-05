MATHORA HOMEPAGE REPAIR — V6.1.1

WHY THIS PATCH EXISTS
The V6.1 design-system stylesheet replaced the stable V5 stylesheet before the
existing pages were rebuilt. This caused the homepage layout to collapse.

REPLACE ONLY THESE FILES
- style.css
- platform.js
- index.html

ADD THIS NEW FILE
- home-v6.css

DO NOT REPLACE
- contact.js
- supabase-config.js
- tests.js
- test.js
- register.js
- instructions.js
- any SQL files

WHAT THIS DOES
1. Restores the stable shared V5 stylesheet for all existing pages.
2. Gives the homepage its own isolated premium stylesheet.
3. Rebuilds the homepage so its layout matches the CSS.
4. Prevents future homepage work from breaking assessment or contact pages.

GITHUB STEPS
1. Extract this ZIP.
2. Upload the four files to the root of the repository.
3. Allow index.html, style.css and platform.js to replace the old files.
4. Commit: Repair and redesign Mathora homepage
5. Test in an Incognito window.

No Supabase changes are needed.
