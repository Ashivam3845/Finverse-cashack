import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email !== "admin@finflow.com") {
      return NextResponse.json({ error: "Forbidden: Master Control Only" }, { status: 403 });
    }
    const users = await prisma.user.findMany({
      include: { investmentPortfolio: true },
      orderBy: { email: 'asc' }
    });
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email !== "admin@finflow.com") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const { userId, totalBalance, digitalCoins } = await req.json();
    
    // We overwrite entirely
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { 
        totalBalance: Number(totalBalance),
        digitalCoins: Number(digitalCoins)
      }
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
