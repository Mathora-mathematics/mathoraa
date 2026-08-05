// MATHORA SUPABASE CONFIGURATION
// This file connects the Mathora website to your Supabase project.
// Use only a publishable/anon key here. Never use a secret or service_role key.

const MATHORA_SUPABASE_URL = "https://ckmwaxoewylaaahudwtk.supabase.co";
const MATHORA_SUPABASE_ANON_KEY = "sb_publishable_vbMrWIRqK96_6_51pR6QMw_OlSGqTjJ";

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
