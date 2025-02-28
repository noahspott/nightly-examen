/**
 * logSession
 *
 * After the user completes an examen, this will log the session in the database.
 */

import { createClient } from "../server";
import { getUser } from "@/lib/auth/server";

export default async function logSession() {
  const supabase = await createClient();

  const user = await getUser(supabase);

  const { error } = await supabase
    .from("sessions")
    .insert([{ user_id: user.id }]);

  if (error) {
    throw new Error(error.message);
  }

  return { message: "Session logged successfully" };
}
