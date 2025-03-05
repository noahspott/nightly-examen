import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Handles authentication callback verification for various authentication flows.
 *
 * @route GET /auth/confirm
 * @param request - Next.js request object containing token_hash and type parameters
 * @returns Redirects to:
 *  - /dashboard on successful verification
 *  - /login?error=auth on verification error
 *  - / (home) if no token_hash or type is provided
 */
export async function GET(request: NextRequest) {
  console.log("Auth callback initiated - Processing request:", request.url);

  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  if (tokenHash && type) {
    const clientTime = new Date();
    console.log("Received auth parameters:", {
      tokenHashLength: tokenHash.length,
      tokenHashPrefix: tokenHash.substring(0, 10) + "...",
      type,
      userAgent: request.headers.get("user-agent"),
      // Log all request headers to see if anything's being modified
      referrer: request.headers.get("referer"),
      // Log all URL parameters to see if anything's being added
      allParams: Object.fromEntries(requestUrl.searchParams.entries()),
      // Log the full URL path
      fullPath: requestUrl.pathname + requestUrl.search,
      clientTimestamp: clientTime.toISOString(),
      clientTimezoneOffset: clientTime.getTimezoneOffset(),
      serverTimestamp: new Date().toISOString(),
      // Log the time difference in minutes
      timeDiffMinutes: Math.abs(new Date().getTimezoneOffset()),
    });

    const supabase = createClient();

    const { error } = await (
      await supabase
    ).auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "email" | "recovery" | "invite" | "magiclink" | "signup",
    });

    if (error) {
      console.error("OTP Verification Failed:", {
        error: error.message,
        errorCode: error.status,
        tokenType: type,
        timestamp: new Date().toISOString(),
        requestUrl: request.url,
        hasToken: !!tokenHash,
      });

      const errorUrl = new URL("/login", request.url);
      errorUrl.searchParams.set("error", "auth");
      errorUrl.searchParams.set("error_description", error.message);
      return NextResponse.redirect(errorUrl);
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else {
    console.log("No auth code found in callback URL");
  }

  console.log("Redirecting to home page due to authentication failure");
  return NextResponse.redirect(new URL("/", request.url));
}
