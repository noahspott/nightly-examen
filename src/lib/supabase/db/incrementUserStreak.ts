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
  // Get the user's last active date
  const { data: user, error } = await supabase
    .from("users")
    .select("last_active_date, examen_streak")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Calculate Streak
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  console.log("Streak calculation values:", {
    today,
    yesterdayStr,
    userLastActiveDate: user?.last_active_date,
    currentStreak: user?.examen_streak,
  });

  // If they completed a section, their streak will be 1
  let newStreak = 1;

  if (user?.last_active_date === yesterdayStr) {
    newStreak = (user.examen_streak || 0) + 1;
    console.log(
      "User was active yesterday - incrementing streak to:",
      newStreak,
    );
  } else if (user?.last_active_date === today) {
    newStreak = user.examen_streak;
    console.log(
      "User already active today - maintaining streak at:",
      newStreak,
    );
  } else {
    console.log(
      "User streak reset to 1 - last active date was:",
      user?.last_active_date,
    );
  }

  // Update record
  const { error: updateError } = await supabase
    .from("users")
    .update({
      last_active_date: today,
      examen_streak: newStreak,
    })
    .eq("id", userId);

  if (updateError) {
    console.error("Error updating user streak:", updateError);
    return { error: updateError };
  }

  console.log("updateUserStreak()");
  return { message: "User streak updated successfully", newStreak };
}
