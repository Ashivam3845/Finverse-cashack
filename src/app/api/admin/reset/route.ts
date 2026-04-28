import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    await prisma.transaction.deleteMany({});
    await prisma.investmentPortfolio.updateMany({
       data: { totalInvested: 0, currentEstimatedValue: 0 }
    });
    await prisma.user.updateMany({
      data: { totalBalance: 1000.0, digitalCoins: 0 }
    });
    return NextResponse.json({ success: true, message: "System Wiped. Base 1000 INR." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
