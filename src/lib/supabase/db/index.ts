import { createClient } from "../server";

/**
 * logSession
 *
 * After the user completes an examen, this will log the session in the database.
 */
export async function logSession() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("sessions")
    .insert([{ user_id: user.id }]);

  if (error) {
    throw new Error(error.message);
  }

  return { message: "Session logged successfully" };
}
