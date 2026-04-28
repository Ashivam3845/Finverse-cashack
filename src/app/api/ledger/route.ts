import { NextResponse } from "next/server";

export async function GET() {
  // Ledger is managed client-side
  return NextResponse.json({ success: true, transactions: [], summary: { totalSpent: 0, totalCashback: 0, totalCoins: 0 } });
}
