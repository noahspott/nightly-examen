import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This is a server-side route handler for the /auth/callback URL
export async function GET(request: NextRequest) {
  console.log("Auth callback initiated - Processing request:", request.url);

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  console.log("code:", code);
  console.log("token_hash:", tokenHash);
  console.log("type:", type);

  if (tokenHash && type) {
    // console.log("Auth code found:", code.slice(0, 8) + "..."); // Log partial code for security
    console.log("token_hash found:", tokenHash.slice(0, 8) + "...");

    // Create a new Supabase client specifically for this server-side operation
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

    // If successful, redirect to dashboard or home
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else {
    console.log("No auth code found in callback URL");
  }

  console.log("Redirecting to home page due to authentication failure");
  return NextResponse.redirect(new URL("/", request.url));
}
