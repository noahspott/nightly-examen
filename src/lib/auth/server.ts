import { createClient } from "../supabase/server";
import { redirect } from "next/navigation";

/**
 * Retrieves the currently authenticated user from Supabase
 * @param {any} supabase - Supabase client instance
 * @returns {Promise<any|null>} The authenticated user object or null if not authenticated
 */
export async function getUser(supabase: any): Promise<any | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  return user;
}

/**
 * Signs out the current user from Supabase
 * @param {any} supabase - Supabase client instance
 * @returns {Promise<{success: boolean, error?: string}>} Object indicating success or failure
 * @example
 * const result = await signOut(supabase);
 * if (result.success) {
 *   // Handle successful logout
 * }
 */
export async function signOut(supabase: any) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
