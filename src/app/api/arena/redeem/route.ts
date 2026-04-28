import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { coinCost, rewardAmt } = await req.json();
    if (coinCost === undefined || rewardAmt === undefined) {
      return NextResponse.json({ error: "Invalid arena data" }, { status: 400 });
    }
    // All state management happens client-side in Zustand
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Arena failed" }, { status: 500 });
  }
}
