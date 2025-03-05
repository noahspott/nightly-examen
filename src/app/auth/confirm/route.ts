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
  const email = requestUrl.searchParams.get("email");
  const token = requestUrl.searchParams.get("token");

  if (!email || !token) {
    console.log("⚠️ Missing email or token in callback URL");
    return NextResponse.redirect(
      new URL("/login?error=missing_params", request.url),
    );
  }

  try {
    console.log("🔄 Creating Supabase client...");
    const supabase = await createClient();

    console.log("🔐 Attempting OTP verification...");
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      console.error("❌ OTP Verification Failed:", {
        error: error.message,
        errorCode: error.status,
      });

      const errorUrl = new URL("/login", request.url);
      errorUrl.searchParams.set("error", "verification_failed");
      errorUrl.searchParams.set("error_description", error.message);
      return NextResponse.redirect(errorUrl);
    }

    console.log("✅ OTP verification successful, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (e) {
    console.error("💥 Unexpected error during auth flow:", e);
    return NextResponse.redirect(
      new URL(
        "/login?error=unknown&error_description=An+unexpected+error+occurred",
        request.url,
      ),
    );
  }
}
