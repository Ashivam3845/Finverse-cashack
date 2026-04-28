import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { symbol, shares, price, totalCost } = await req.json();
    if (!symbol || shares <= 0 || price <= 0 || totalCost <= 0) {
      return NextResponse.json({ error: "Invalid purchase data" }, { status: 400 });
    }
    // Balance updates handled client-side in Zustand
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Purchase failed" }, { status: 500 });
  }
}
