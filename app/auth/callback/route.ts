import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ROUTES } from "@/lib/constants";

/**
 * Auth Callback Route
 * Handles OAuth redirects and email verification confirmations
 * Supabase redirects here after authentication completes
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect") || ROUTES.DASHBOARD;

  if (code) {
    const supabase = await createServerSupabaseClient();

    // Exchange the auth code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user needs to set up username
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: player } = await supabase
          .from("players")
          .select("username_set")
          .eq("auth_id", user.id)
          .single();

        if (!player?.username_set) {
          return NextResponse.redirect(
            new URL(ROUTES.SETUP_USERNAME, requestUrl.origin)
          );
        }
      }

      // Redirect to intended destination or dashboard
      return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
    }
  }

  // Something went wrong - redirect to sign in with error
  const errorUrl = new URL(ROUTES.SIGN_IN, requestUrl.origin);
  errorUrl.searchParams.set("error", "auth_callback_failed");
  return NextResponse.redirect(errorUrl);
}