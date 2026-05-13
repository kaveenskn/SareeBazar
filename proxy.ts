import { NextResponse } from 'next/server';
import { auth } from './auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Protect /profile route
  if (nextUrl.pathname.startsWith('/profile') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }
  
  // Protect auth routes for logged in users
  if (isLoggedIn && (nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/profile', nextUrl));
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
