import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password)
      return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });

    if (password.length < 8)
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون ٨ أحرف على الأقل" },
        { status: 400 },
      );

    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    });
    if (!record || record.used || record.expiresAt < new Date())
      return NextResponse.json(
        { error: "الرابط منتهي الصلاحية أو مستخدم من قبل" },
        { status: 400 },
      );

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { used: true },
      }),
      prisma.session.deleteMany({ where: { userId: record.userId } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[RESET]", err);
    return NextResponse.json(
      { error: "حدث خطأ، حاول مجدداً" },
      { status: 500 },
    );
  }
}
