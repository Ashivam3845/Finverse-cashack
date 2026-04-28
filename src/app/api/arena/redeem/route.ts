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

    const { coinCost, rewardAmt, game } = await req.json();
    if (coinCost === undefined || rewardAmt === undefined) {
      return NextResponse.json({ error: "Invalid arena data" }, { status: 400 });
    }

    const userEmail = session.user.email;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: userEmail }
      });

      if (!user) throw new Error("User not found");
      if (user.digitalCoins < coinCost) throw new Error("Insufficient Digital Coins");

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { 
          digitalCoins: user.digitalCoins - coinCost,
          totalBalance: user.totalBalance + rewardAmt,
        }
      });

      return { 
        newBalance: updatedUser.totalBalance,
        newCoins: updatedUser.digitalCoins 
      };
    });

    return NextResponse.json({ success: true, ...result });

  } catch (error: any) {
    console.error("Arena Error:", error);
    return NextResponse.json({ error: error.message || "Arena execution failed" }, { status: 500 });
  }
}
