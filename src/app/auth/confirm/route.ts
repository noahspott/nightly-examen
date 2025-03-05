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
  console.log("🔑 Auth callback initiated - Processing request:", request.url);

  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  console.log("📝 Initial request state:", {
    hasTokenHash: !!tokenHash,
    tokenHashLength: tokenHash?.length,
    type,
    cookies: request.cookies.getAll().map((c) => c.name), // Log cookie names for security
    headers: {
      // Log relevant headers that might affect auth
      "user-agent": request.headers.get("user-agent"),
      accept: request.headers.get("accept"),
      "accept-language": request.headers.get("accept-language"),
      "sec-fetch-site": request.headers.get("sec-fetch-site"),
      "sec-fetch-mode": request.headers.get("sec-fetch-mode"),
      "sec-fetch-dest": request.headers.get("sec-fetch-dest"),
    },
  });

  if (tokenHash && type) {
    try {
      console.log("🔄 Creating Supabase client...");
      const supabase = await createClient();

      console.log("🔐 Attempting OTP verification...");
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as "email" | "recovery" | "invite" | "magiclink" | "signup",
      });

      if (error) {
        console.error("❌ OTP Verification Failed:", {
          error: error.message,
          errorCode: error.status,
          errorName: error.name,
          tokenType: type,
          timestamp: new Date().toISOString(),
          requestUrl: request.url,
          hasToken: !!tokenHash,
          // Add stack trace if available
          stack: error.stack,
          // Add any additional error properties
          details: Object.keys(error),
        });

        const errorUrl = new URL("/login", request.url);
        errorUrl.searchParams.set("error", "auth");
        errorUrl.searchParams.set("error_description", error.message);
        console.log("↩️ Redirecting to error page:", errorUrl.toString());
        return NextResponse.redirect(errorUrl);
      }

      console.log("✅ OTP verification successful, redirecting to dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (e) {
      // Log any unexpected errors
      console.error("💥 Unexpected error during auth flow:", {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
        type: e?.constructor?.name,
      });
      throw e; // Re-throw to trigger error boundary
    }
  } else {
    console.log("⚠️ No auth code found in callback URL");
  }

  console.log("↩️ Redirecting to home page due to authentication failure");
  return NextResponse.redirect(new URL("/", request.url));
}
