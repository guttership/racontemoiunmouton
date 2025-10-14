import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Allow SEO files to pass through without modification
  if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
    return NextResponse.next();
  }
  
  // Allow API routes and Next.js internals
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/_vercel')) {
    return NextResponse.next();
  }
  
  // Allow fonts directory
  if (pathname.startsWith('/font/')) {
    return NextResponse.next();
  }
  
  // Allow static files
  if (pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|ttf|woff|woff2|eot)$/)) {
    return NextResponse.next();
  }
  
  const locales = ['fr', 'en', 'es', 'de'];
  const defaultLocale = 'fr';
  
  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) {
    return NextResponse.next();
  }
  
  // Redirect root to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
  
  // Redirect other paths to default locale
  return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - _next (Next.js internals)
    // - _vercel (Vercel internals)
    // - Static files with extensions
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
