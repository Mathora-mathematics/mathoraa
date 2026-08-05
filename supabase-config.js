// MATHORA SUPABASE CONFIGURATION
// Replace the two placeholder values below with your own Supabase project values.
// Supabase Dashboard → Project Settings → Data API

const MATHORA_SUPABASE_URL = "PASTE_YOUR_SUPABASE_PROJECT_URL_HERE";
const MATHORA_SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

window.mathoraSupabase = null;

if (
  MATHORA_SUPABASE_URL.startsWith("https://") &&
  !MATHORA_SUPABASE_URL.includes("PASTE_") &&
  !MATHORA_SUPABASE_ANON_KEY.includes("PASTE_") &&
  window.supabase
) {
  window.mathoraSupabase = window.supabase.createClient(
    MATHORA_SUPABASE_URL,
    MATHORA_SUPABASE_ANON_KEY
  );
}
