import { createClient } from "@/lib/supabase/client";

export async function signInWithEmail(email: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: process.env.BASE_URL,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { data };
}
