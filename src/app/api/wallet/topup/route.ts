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
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const userEmail = session.user.email!;

    const userTypeCheck = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!userTypeCheck) {
       return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: { totalBalance: userTypeCheck.totalBalance + amount }
    });

    return NextResponse.json({ success: true, newBalance: updatedUser.totalBalance });

  } catch (error: any) {
    console.error("Topup Error:", error);
    return NextResponse.json({ error: error.message || "Topup failed" }, { status: 500 });
  }
}
