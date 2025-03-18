import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

export async function middleware(request: NextRequest) {
  // Skip middleware for public routes and the refresh endpoint itself
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname.includes('/api/auth/refresh') ||
    request.nextUrl.pathname.includes('/_next') ||
    request.nextUrl.pathname.includes('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Get the access token from cookies
  const accessToken = request.cookies.get(ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN)?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `refreshToken=${refreshToken}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Create a rewrite response to retry the original request path
      const newResponse = NextResponse.rewrite(new URL(request.url));

      // Forward any cookies set by the server (including the new access token)
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === 'set-cookie') {
          newResponse.headers.append('Set-Cookie', value);
        }
      });

      // This will retry the request with the new tokens
      return newResponse;
    } catch (error) {
      console.error('Error refreshing token in middleware:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: [
    // Match all routes except public ones
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
