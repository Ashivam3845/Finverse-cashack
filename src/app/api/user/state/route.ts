import { NextResponse } from "next/server";

export async function GET() {
  // State is managed client-side in Zustand with localStorage persistence
  return NextResponse.json({ success: true });
}
