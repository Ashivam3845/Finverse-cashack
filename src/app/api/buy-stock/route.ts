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

    const { symbol, shares, price, totalCost } = await req.json();
    if (!symbol || shares <= 0 || price <= 0 || totalCost <= 0) {
      return NextResponse.json({ error: "Invalid purchase data" }, { status: 400 });
    }

    const userEmail = session.user.email!;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: userEmail },
        include: { investmentPortfolio: true },
      });

      if (!user) throw new Error("User not found");
      if (user.totalBalance < totalCost) throw new Error("Insufficient Available Cash");

      const newBalance = user.totalBalance - totalCost;

      const portfolio = user.investmentPortfolio;
      if (!portfolio) throw new Error("Portfolio missing");

      // We explicitly increase total value logic globally
      const newTotalInvested = portfolio.totalInvested + totalCost;
      const newPortfolioValue = portfolio.currentEstimatedValue + totalCost;

      await tx.investmentPortfolio.update({
        where: { userId: user.id },
        data: {
          totalInvested: newTotalInvested,
          currentEstimatedValue: newPortfolioValue,
        }
      });

      await tx.user.update({
        where: { id: user.id },
        data: { totalBalance: newBalance }
      });

      return { newBalance, newTotalInvested, newPortfolioValue };
    });

    return NextResponse.json({ success: true, ...result });

  } catch (error: any) {
    console.error("Stock Purchase Error:", error);
    return NextResponse.json({ error: error.message || "Purchase failed" }, { status: 500 });
  }
}
