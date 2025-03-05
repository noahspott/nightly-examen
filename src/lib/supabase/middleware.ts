/**
 * Middleware Supabase Functions
 * src/lib/supabase/middleware.ts
 *
 * This middleware is used to update the session of the user.
 *
 * Important editable parts:
 * - Protected / Allowed paths
 * - Redirects
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  console.log("🔒 Middleware - Processing request:", {
    path: request.nextUrl.pathname,
    search: request.nextUrl.search,
    userAgent: request.headers.get("user-agent"),
    cookies: request.cookies.getAll().map((c) => c.name), // Just log cookie names for security
  });

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookies = request.cookies.getAll();
          console.log(
            "🍪 Middleware - Getting cookies:",
            cookies.map((c) => c.name),
          );
          return cookies;
        },
        setAll(cookiesToSet) {
          console.log(
            "🍪 Middleware - Setting cookies:",
            cookiesToSet.map((c) => c.name),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("👤 Middleware - Auth status:", {
    hasUser: !!user,
    path: request.nextUrl.pathname,
    isProtectedRoute: !(
      request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname === "/examen/classic" ||
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/auth")
    ),
  });

  if (
    !user &&
    !(request.nextUrl.pathname === "/") &&
    !(request.nextUrl.pathname === "/examen/classic") &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    console.log(
      "🚫 Middleware - Redirecting to login:",
      request.nextUrl.pathname,
    );
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
