// Mathora Supabase configuration
// Publishable browser keys are expected here.
// Never use a secret key or service_role key in this file.

const MATHORA_SUPABASE_URL = "https://ckmwaxoewylaaahudwtk.supabase.co";
const MATHORA_SUPABASE_ANON_KEY = "sb_publishable_vbMrWIRqK96_6_51pR6QMw_OlSGqTjJ";

window.mathoraSupabase = null;

if (window.supabase) {
  window.mathoraSupabase = window.supabase.createClient(
    MATHORA_SUPABASE_URL,
    MATHORA_SUPABASE_ANON_KEY
  );
}
