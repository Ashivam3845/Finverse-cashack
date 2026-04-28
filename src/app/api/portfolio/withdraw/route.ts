import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid withdrawal amount" }, { status: 400 });
    }
    // Portfolio state managed client-side in Zustand
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Withdrawal failed" }, { status: 500 });
  }
}
