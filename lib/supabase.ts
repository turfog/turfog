import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Supabase Browser Client
 * Used in Client Components and Client-Side Hooks
 * Automatically reads cookies for session management
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Singleton instance for client-side usage
 * Created once and reused throughout the application lifecycle
 */
let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowserClient(): ReturnType<typeof createClient> {
  if (!browserClient) {
    browserClient = createClient();
  }
  return browserClient;
}