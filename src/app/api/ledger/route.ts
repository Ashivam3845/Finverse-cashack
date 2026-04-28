import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      where: { user: { email: session.user.email! } },
      orderBy: { date: 'desc' }
    });

    const summary = transactions.reduce((acc, tx) => ({
      totalSpent: acc.totalSpent + tx.amount,
      totalCashback: acc.totalCashback + tx.cashbackEarned,
      totalCoins: acc.totalCoins + tx.coinsEarned
    }), { totalSpent: 0, totalCashback: 0, totalCoins: 0 });

    return NextResponse.json({ success: true, transactions, summary });

  } catch (error: any) {
    console.error("Ledger Fetch Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch ledger" }, { status: 500 });
  }
}
