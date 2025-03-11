"use server";

import { createClient } from "@/lib/supabase/server";

export async function signInWithEmail(email: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function signInWithOtp(email: string) {
  const supabase = await createClient();

  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      shouldCreateUser: true,
    },
  });
}

export async function verifyOtp(email: string, token: string) {
  const supabase = await createClient();

  console.log(
    `[Auth] Attempting to verify OTP for email: ${email.slice(0, 3)}...`,
  );

  try {
    const result = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (result.error) {
      console.error("[Auth] OTP verification failed:", {
        error: result.error.message,
        code: result.error.status,
      });
      return result;
    }

    console.log("[Auth] OTP verification successful");
    return result;
  } catch (error) {
    console.error("[Auth] Unexpected error during OTP verification:", error);
    throw error;
  }
}
