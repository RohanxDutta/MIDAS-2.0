import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Exclude static assets from triggering redirection loops
  const path = request.nextUrl.pathname
  const isStaticAsset = path.startsWith('/_next') || path.includes('.') || path === '/favicon.ico'

  if (isStaticAsset) {
    return response
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          const isProd = process.env.NODE_ENV === 'production';
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              path: '/',
              sameSite: 'lax',
              secure: isProd,
            });
          });
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isPublicPage = path === '/' || path === '/login' || path === '/guide'

  if (!user && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Generate random base64 nonce for CSP using Edge-compatible btoa (Fix Finding 6)
  const nonce = btoa(crypto.randomUUID());
  const isProd = process.env.NODE_ENV === 'production';
  const cspHeader = `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://fnyrhbvatucdyjluxzzh.supabase.co; connect-src 'self' https://fnyrhbvatucdyjluxzzh.supabase.co; font-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; ${isProd ? 'upgrade-insecure-requests;' : ''}`;

  // Enforce CSP in production, report-only in dev (so HMR/hot-reload works)
  const cspHeaderName = isProd ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only';

  // Inject nonce and CSP request headers for Next.js Layout consumption
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set(cspHeaderName, cspHeader);

  const finalResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Copy Supabase cookies to finalResponse
  response.cookies.getAll().forEach((cookie) => {
    finalResponse.cookies.set(cookie.name, cookie.value, {
      path: cookie.path,
      domain: cookie.domain,
      expires: cookie.expires,
      maxAge: cookie.maxAge,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      httpOnly: cookie.httpOnly,
    });
  });

  // Apply safety headers to the response
  finalResponse.headers.set(cspHeaderName, cspHeader);
  finalResponse.headers.set('X-Frame-Options', 'DENY');
  finalResponse.headers.set('X-Content-Type-Options', 'nosniff');
  finalResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  finalResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return finalResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes proxy)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
