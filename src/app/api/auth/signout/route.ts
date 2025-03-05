import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/server";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("signing out...");

  const supabase = await createClient();

  try {
    const response = await signOut(supabase);

    if (response) {
      console.log("signout successful");
      return NextResponse.json(
        { message: "signout successful" },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "error during signout" },
      { status: 500 },
    );
  }
}
