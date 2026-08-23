import { createClient } from "@supabase/supabase-js";

// Fallback placeholders prevent a build-time crash if env vars are missing.
// Real env vars always override these in dev and production.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export { supabaseAdmin };