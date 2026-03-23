import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword } from "@/lib/auth";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        balance: true,
        enrollments: { include: { course: true } },
        transactions: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });

    if (!user)
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 },
      );
    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    console.error("[ADMIN_USER_GET]", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action, amount, description, role, isActive, newPassword } = body;

    // ── add balance ──
    if (action === "add_balance") {
      if (!amount || amount <= 0) {
        return NextResponse.json({ error: "المبلغ غير صالح" }, { status: 400 });
      }

      await prisma.$transaction([
        prisma.balance.upsert({
          where: { userId: id },
          create: { userId: id, amount },
          update: { amount: { increment: amount } },
        }),
        prisma.transaction.create({
          data: {
            userId: id,
            type: "CREDIT",
            amount,
            description: description ?? "إضافة رصيد من الأدمن",
          },
        }),
      ]);

      return NextResponse.json({ success: true });
    }

    // ── deduct balance ──
    if (action === "deduct_balance") {
      if (!amount || amount <= 0) {
        return NextResponse.json({ error: "المبلغ غير صالح" }, { status: 400 });
      }

      const balance = await prisma.balance.findUnique({
        where: { userId: id },
      });
      if (!balance || balance.amount < amount) {
        return NextResponse.json({ error: "الرصيد غير كافٍ" }, { status: 400 });
      }

      await prisma.$transaction([
        prisma.balance.update({
          where: { userId: id },
          data: { amount: { decrement: amount } },
        }),
        prisma.transaction.create({
          data: {
            userId: id,
            type: "DEBIT",
            amount,
            description: description ?? "خصم رصيد من الأدمن",
          },
        }),
      ]);

      return NextResponse.json({ success: true });
    }

    // ── toggle active ──
    if (action === "toggle_active") {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user)
        return NextResponse.json(
          { error: "المستخدم غير موجود" },
          { status: 404 },
        );

      await prisma.user.update({
        where: { id },
        data: { isActive: !user.isActive },
      });
      return NextResponse.json({ success: true });
    }

    // ── change role ──
    if (action === "change_role") {
      if (!role || !["STUDENT", "ADMIN"].includes(role)) {
        return NextResponse.json({ error: "الدور غير صالح" }, { status: 400 });
      }
      // only ADMIN can promote — prevent self-demotion
      if (id === currentUser.id) {
        return NextResponse.json(
          { error: "لا يمكنك تغيير دورك بنفسك" },
          { status: 400 },
        );
      }
      await prisma.user.update({ where: { id }, data: { role } });
      return NextResponse.json({ success: true });
    }

    // ── reset password ──
    if (action === "reset_password") {
      if (!newPassword || newPassword.length < 8) {
        return NextResponse.json(
          { error: "كلمة المرور يجب أن تكون ٨ أحرف على الأقل" },
          { status: 400 },
        );
      }
      const passwordHash = await hashPassword(newPassword);
      await prisma.$transaction([
        prisma.user.update({ where: { id }, data: { passwordHash } }),
        prisma.session.deleteMany({ where: { userId: id } }),
      ]);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "action غير معروف" }, { status: 400 });
  } catch (err) {
    console.error("[ADMIN_USER_PATCH]", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (id === currentUser.id) {
      return NextResponse.json(
        { error: "لا يمكنك حذف حسابك بنفسك" },
        { status: 400 },
      );
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ADMIN_USER_DELETE]", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
