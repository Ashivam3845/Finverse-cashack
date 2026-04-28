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

    const { amount, recipient, category } = await req.json();
    if (!amount || amount <= 0 || !recipient) {
      return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
    }

    // Cashback Algorithm based on thresholds
    let randomPercent = 0;
    if (amount < 2000) {
      randomPercent = (Math.random() * (0.01 - 0.005)) + 0.005; // 0.5% - 1%
    } else {
      randomPercent = (Math.random() * (0.05 - 0.02)) + 0.02; // 2% - 5%
    }
    const cashback = Number((amount * randomPercent).toFixed(2));
    const coinsEarned = Math.floor(amount / 10);
    const userEmail = session.user.email!;

    // We do all this in a Prisma Transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: userEmail },
        include: { investmentPortfolio: true },
      });

      if (!user) throw new Error("User not found");
      if (user.totalBalance < amount) throw new Error("Insufficient Balance");

      // 1. Deduct from main balance
      const newBalance = user.totalBalance - amount;

      const transaction = await tx.transaction.create({
        data: {
          userId: user.id,
          amount,
          category: category || recipient,
          cashbackEarned: cashback,
          coinsEarned,
        }
      });

      // 3. Update the Portfolio
      const portfolio = user.investmentPortfolio;
      if (!portfolio) throw new Error("Portfolio missing");

      // 3% monthly compound interest projection. We just add it directly in this simulation
      // Actually we just add to totalInvested and currentEstimatedValue
      await tx.investmentPortfolio.update({
        where: { userId: user.id },
        data: {
          totalInvested: portfolio.totalInvested + cashback,
          currentEstimatedValue: portfolio.currentEstimatedValue + cashback, // real physics would apply interest over time, we just mock it.
        }
      });

      await tx.user.update({
        where: { id: user.id },
        data: { 
          totalBalance: newBalance,
          digitalCoins: user.digitalCoins + coinsEarned,
        }
      });

      return { newBalance, cashback, coinsEarned, newRdBalance: portfolio.totalInvested + cashback };
    });

    return NextResponse.json({ success: true, ...result });

  } catch (error: any) {
    console.error("Payment Error:", error);
    return NextResponse.json({ error: error.message || "Payment failed" }, { status: 500 });
  }
}
