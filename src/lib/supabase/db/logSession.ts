/**
 * logSession
 *
 * After the user completes an examen, this will log the session in the database.
 */

import { createClient } from "../server";
import { getUser } from "@/lib/auth/server";
import incrementUserStreak from "./incrementUserStreak";

export default async function logSession() {
  const supabase = await createClient();

  const user = await getUser(supabase);

  // Format current time as timestamptz
  const now = new Date();
  const timestamptz = now.toISOString().replace("T", " ").replace("Z", "+00");

  // Log the session
  const { error } = await supabase.from("sessions").insert([
    {
      user_id: user.id,
      completed_at: timestamptz,
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }

  // Update user streak data
  try {
    incrementUserStreak(supabase, user.id);
  } catch (error) {
    console.error(error);
  }

  return { message: "Session logged successfully" };
}
