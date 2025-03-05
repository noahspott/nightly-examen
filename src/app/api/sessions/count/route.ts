import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionCount } from "@/lib/supabase/db";

export async function POST() {
  try {
    const supabase = await createClient();
    const user = await getUser(supabase);

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // getSessionCount
    const count = getSessionCount();

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get session count" },
      { status: 500 },
    );
  }
}
