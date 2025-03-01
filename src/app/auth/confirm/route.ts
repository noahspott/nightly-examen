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
    const supabase = createClient();

    const { error } = await (
      await supabase
    ).auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "email" | "recovery" | "invite" | "magiclink" | "signup",
    });

    if (error) {
      console.error("Error verifying OTP:", error.message);
      return NextResponse.redirect(new URL("/login?error=auth", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else {
    console.log("No auth code found in callback URL");
  }

  console.log("Redirecting to home page due to authentication failure");
  return NextResponse.redirect(new URL("/", request.url));
}
