import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ROUTES } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect") || ROUTES.DASHBOARD;

  if (code) {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("players")
          .select("username_set")
          .eq("auth_id", user.id)
          .single();

        const player = data as { username_set: boolean } | null;

        if (!player?.username_set) {
          return NextResponse.redirect(
            new URL(ROUTES.SETUP_USERNAME, requestUrl.origin)
          );
        }
      }

      return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
    }
  }

  const errorUrl = new URL(ROUTES.SIGN_IN, requestUrl.origin);
  errorUrl.searchParams.set("error", "auth_callback_failed");
  return NextResponse.redirect(errorUrl);
}