// app/api/admin/recharge/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { action, adminNote } = await req.json();

    const rechargeReq = await prisma.rechargeRequest.findUnique({
      where: { id },
    });
    if (!rechargeReq)
      return NextResponse.json({ error: "Request not found" }, { status: 404 });

    if (rechargeReq.status !== "PENDING")
      return NextResponse.json({ error: "Already processed" }, { status: 400 });

    if (action === "approve") {
      await prisma.$transaction([
        prisma.rechargeRequest.update({
          where: { id },
          data: { status: "APPROVED", adminNote: adminNote ?? null },
        }),
        prisma.balance.upsert({
          where: { userId: rechargeReq.userId },
          create: { userId: rechargeReq.userId, amount: rechargeReq.amount },
          update: { amount: { increment: rechargeReq.amount } },
        }),
        prisma.transaction.create({
          data: {
            userId: rechargeReq.userId,
            type: "CREDIT",
            amount: rechargeReq.amount,
            description: `Recharge approved — ${rechargeReq.senderName}`,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: "Approved and balance added",
      });
    }

    if (action === "reject") {
      await prisma.rechargeRequest.update({
        where: { id },
        data: { status: "REJECTED", adminNote: adminNote ?? null },
      });
      return NextResponse.json({ success: true, message: "Rejected" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("[ADMIN_RECHARGE_PATCH]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const rechargeReq = await prisma.rechargeRequest.findUnique({
      where: { id },
    });
    if (!rechargeReq)
      return NextResponse.json({ error: "Request not found" }, { status: 404 });

    await prisma.rechargeRequest.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("[ADMIN_RECHARGE_DELETE]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
