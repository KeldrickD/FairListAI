import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware extends the timeout for the listings generate API
export function middleware(request: NextRequest) {
  // Only apply to the listings generate API
  if (request.nextUrl.pathname.startsWith('/api/listings/generate')) {
    // Return the response with a longer timeout
    return NextResponse.next({
      headers: {
        'x-middleware-cache': 'no-cache',
        'x-middleware-timeout': '60000', // 60 seconds timeout
      },
    })
  }
  
  // For all other routes, continue as normal
  return NextResponse.next()
}

// Configure the middleware to run only for the API routes
export const config = {
  matcher: '/api/:path*',
} 