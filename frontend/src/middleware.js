import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request) {
  // Get token from cookies or headers
  const token = request.cookies.get('token')?.value || 
               request.headers.get('authorization')?.replace('Bearer ', '');
  const { pathname, search } = request.nextUrl;

  // Public routes that don't require authentication
  const publicPaths = [
    '/login', 
    '/signup', 
    '/about', 
    '/contact', 
    '/',
    '/api',
    '/_next'
  ];
  
  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || 
    pathname.startsWith(`${path}/`) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')
  );

  // Allow search route without authentication
  if (pathname === '/compare' && search.includes('q=')) {
    return NextResponse.next();
  }

  // If user is not logged in and trying to access a protected route
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in and trying to access auth pages, redirect to home
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
