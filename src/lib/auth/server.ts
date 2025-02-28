import { createClient } from "../supabase/server";
import { redirect } from "next/navigation";

export async function getUser(supabase: any) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  return user;
}

export async function signOut(supabase: any) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
