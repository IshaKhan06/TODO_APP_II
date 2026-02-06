import { NextRequest, NextResponse } from 'next/server';

// This middleware will run for all routes
export function middleware(request: NextRequest) {
  // For now, just allow all requests to pass through
  // Authentication will be handled in individual API routes
  return NextResponse.next();
}

// Configure which paths the middleware should run for
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes are handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};