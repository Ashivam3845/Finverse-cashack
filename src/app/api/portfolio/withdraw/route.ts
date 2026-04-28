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

    const { amount } = await req.json();
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid withdrawal amount" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: session.user.email! },
        include: { investmentPortfolio: true }
      });

      if (!user || !user.investmentPortfolio) throw new Error("User or Portfolio not found");
      const portfolio = user.investmentPortfolio;

      if (portfolio.currentEstimatedValue < amount) {
        throw new Error("Insufficient investment liquidity");
      }

      await tx.user.update({
        where: { id: user.id },
        data: { totalBalance: user.totalBalance + amount }
      });

      // Deduct from estimated value proportionally or just equally for mock purposes
      await tx.investmentPortfolio.update({
        where: { id: portfolio.id },
        data: { 
           currentEstimatedValue: portfolio.currentEstimatedValue - amount,
           totalInvested: Math.max(0, portfolio.totalInvested - amount)
        }
      });

      return {
        newBalance: user.totalBalance + amount,
        newPortfolioValue: portfolio.currentEstimatedValue - amount
      };
    });

    return NextResponse.json({ success: true, ...result });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
