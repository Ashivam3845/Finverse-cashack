import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, category } = await req.json();
    if (!amount || amount <= 0) {
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

    return NextResponse.json({
      success: true,
      cashback,
      coinsEarned,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Payment failed" }, { status: 500 });
  }
}
