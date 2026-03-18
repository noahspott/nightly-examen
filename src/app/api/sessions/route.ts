import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Use POST /api/users/[id]/sessions instead.",
    },
    { status: 404 },
  );
}
