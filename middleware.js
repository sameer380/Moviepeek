import { NextResponse } from 'next/server';

// List of paths that should be cached
const CACHED_PATHS = [
  '/',
  '/movie',
  '/category',
  '/search',
];

// Function to check if path should be cached
const shouldCache = (path) => {
  return CACHED_PATHS.some(cachedPath => path.startsWith(cachedPath));
};

export function middleware(request) {
  const response = NextResponse.next();

  // Add caching headers for static assets and API responses
  if (shouldCache(request.nextUrl.pathname)) {
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=59');
  }

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Add SEO-related headers
  response.headers.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  // Enable preconnect for external resources
  response.headers.set(
    'Link',
    '<https://image.tmdb.org>; rel=preconnect'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};