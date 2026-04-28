import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: "No query provided" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        transactions: {
          orderBy: { date: "desc" },
          take: 100, // Top 100 recent transactions
        },
        investmentPortfolio: true,
      },
    });

    if (!user) throw new Error("User not found");

    // Forward to FastAPI Service
    const fastApiPayload = {
      query,
      transactions: user.transactions.map((tx) => ({
        id: tx.id,
        amount: tx.amount,
        category: tx.category,
        date: tx.date.toISOString(),
        cashbackEarned: tx.cashbackEarned,
      })),
      totalBalance: user.totalBalance,
      rdBalance: user.investmentPortfolio?.currentEstimatedValue || 0,
    };

    const fastApiRes = await fetch("http://127.0.0.1:8000/api/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fastApiPayload),
    });

    if (!fastApiRes.ok) {
        console.error(await fastApiRes.text())
        throw new Error("FastAPI Service Error");
    }

    const aiData = await fastApiRes.json();
    return NextResponse.json({ answer: aiData.answer });

  } catch (error: any) {
    console.error("AI Insights Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate insights" }, { status: 500 });
  }
}
