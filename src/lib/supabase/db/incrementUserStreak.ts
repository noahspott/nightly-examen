/**
 * Increments or resets a user's daily examen streak based on their last active date
 *
 * The streak logic works as follows:
 * - If the user was last active yesterday: increment their streak
 * - If the user was already active today: maintain current streak
 * - If the user missed a day: reset streak to 1
 *
 * @param supabase - Supabase client instance for database operations
 * @param userId - The unique identifier of the user
 *
 * @returns {Promise<Object>} Object containing either:
 *   - {message: string, newStreak: number} on success
 *   - {error: Error} on failure
 *
 * @throws {Error} If there's an error fetching the user data
 */

type StreakResponse = {
  message?: string;
  newStreak?: number;
  error?: Error;
};

export default async function incrementUserStreak(
  supabase: any,
  userId: string,
): Promise<StreakResponse> {
  const { data: user, error } = await supabase
    .from("users")
    .select("last_active_date, examen_streak")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const { last_active_date, examen_streak } = user;

  const today = new Date();

  // Update record
  const { error: updateError } = await supabase
    .from("users")
    .update({
      last_active_date: today,
      examen_streak: examen_streak + 1,
    })
    .eq("id", userId);

  if (updateError) {
    console.error("Error updating user streak:", updateError);
    return { error: updateError };
  }

  console.log("updateUserStreak()");
  return { message: "User streak updated successfully" };
}
