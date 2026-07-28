import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const publicRoutes = [
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-email",
    "/auth/callback",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isStaticAsset =
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/fonts") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.includes(".");

  if (isStaticAsset) return supabaseResponse;

  if (!user && !isPublicRoute && request.nextUrl.pathname !== "/") {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (user && isPublicRoute) {
    const { data: player } = await supabase
      .from("players")
      .select("username_set")
      .eq("auth_id", user.id)
      .single();

    if (!player?.username_set) {
      return NextResponse.redirect(new URL("/setup-username", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    user &&
    !isPublicRoute &&
    request.nextUrl.pathname !== "/setup-username"
  ) {
    const { data: player } = await supabase
      .from("players")
      .select("username_set")
      .eq("auth_id", user.id)
      .single();

    if (!player?.username_set) {
      return NextResponse.redirect(new URL("/setup-username", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|og-image.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2)$).*)",
  ],
};