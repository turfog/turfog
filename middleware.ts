import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes EXCEPT the login page itself
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Check for the secure admin session cookie
    const adminSession = request.cookies.get('turfog-admin-session')?.value;

    if (!adminSession) {
      // No session found. Redirect to the Admin Login screen.
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Only run this middleware on admin routes
export const config = {
  matcher: ['/admin/:path*'],
};