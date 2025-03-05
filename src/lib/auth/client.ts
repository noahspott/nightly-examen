import { createClient } from "../supabase/client";

export function signOut() {
  const supabase = createClient();
  supabase.auth.signOut();
}
