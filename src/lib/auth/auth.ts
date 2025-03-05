import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
