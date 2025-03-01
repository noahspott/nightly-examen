"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function signInWithEmail(email: string) {
  const supabase = await createClient();
  const headersList = headers();
  const origin =
    (await headersList).get("origin") || process.env.NEXT_PUBLIC_BASE_URL;

  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: origin,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { data };
}
