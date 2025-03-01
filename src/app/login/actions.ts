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
