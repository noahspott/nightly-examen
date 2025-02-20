import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This is a server-side route handler for the /auth/callback URL
export async function GET(request: NextRequest) {
  console.log("Auth callback initiated - Processing request:", request.url);

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("access_token");

  if (code) {
    console.log("Auth code found:", code.slice(0, 8) + "..."); // Log partial code for security

    // Create a new Supabase client specifically for this server-side operation
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          // Don't persist the session since this is a one-time server operation
          persistSession: false,
        },
      },
    );

    try {
      console.log("Attempting to exchange code for session...");
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Session exchange failed:", error);
        throw error;
      }

      if (data.session) {
        console.log("Session successfully created:", {
          userId: data.session.user.id,
          expiresAt: data.session.expires_at,
        });
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        console.log("No session data received despite successful exchange");
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  } else {
    console.log("No auth code found in callback URL");
  }

  console.log("Redirecting to home page due to authentication failure");
  return NextResponse.redirect(new URL("/", request.url));
}
