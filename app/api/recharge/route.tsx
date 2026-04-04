// app/api/recharge/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// POST — submit a recharge request
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { amount, senderName, receiptUrl } = body;

    if (!amount || amount <= 0)
      return NextResponse.json({ error: "المبلغ غير صحيح" }, { status: 400 });
    if (!senderName?.trim())
      return NextResponse.json({ error: "اسم المرسل مطلوب" }, { status: 400 });
    if (!receiptUrl?.trim())
      return NextResponse.json(
        { error: "صورة الإيصال مطلوبة" },
        { status: 400 },
      );

    const request = await prisma.rechargeRequest.create({
      data: {
        userId: currentUser.id,
        amount: parseFloat(amount),
        senderName: senderName.trim(),
        receiptUrl: receiptUrl.trim(),
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, data: request });
  } catch (err) {
    console.error("[RECHARGE_POST]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// GET — get current user's recharge requests
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const requests = await prisma.rechargeRequest.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ success: true, data: requests });
  } catch (err) {
    console.error("[RECHARGE_GET]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
