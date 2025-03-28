import type { SupabaseClient } from "@supabase/supabase-js";
import { updateUserStreak } from "./userStreakUtils";
import { fetchStats } from "./api";

export async function fetchDashboardDataFrom(supabase: SupabaseClient) {
  console.log("fecthDashboardDataFrom");

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("No user found");

  await updateUserStreak(supabase, user.id);

  return fetchStats(supabase);
}

export async function updateUserStats() {
  console.log("[updateUserStats]");
}
