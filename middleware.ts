import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PREFIXES = [
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/callback",
  "/sports",
];

const PRIVATE_SEGMENTS = new Set([
  "dashboard",
  "profile",
  "settings",
  "communities",
  "games", "messages", "invites", "bookings", "matches",
  "notifications",
  "setup-username",
  "auth",
  "sports",
  "api",
]);

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  if (PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1 && !PRIVATE_SEGMENTS.has(segments[0])) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: Record<string, unknown>;
          }[]
        ) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (user) {
    const { data: playerRow } = await supabase
      .from("players")
      .select("username_set")
      .eq("auth_id", user.id)
      .maybeSingle();
    const usernameSet = !!playerRow?.username_set;
    const onSetup = path === "/setup-username";

    if (onSetup && usernameSet) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    if (!onSetup && !usernameSet) {
      const url = request.nextUrl.clone();
      url.pathname = "/setup-username";
      return NextResponse.redirect(url);
    }
    if (path.startsWith("/auth")) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  if (!isPublicPath(path)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};