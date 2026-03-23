import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 },
      );
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون ٨ أحرف على الأقل" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
    });
    if (!user)
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 },
      );

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "كلمة المرور الحالية غير صحيحة" },
        { status: 400 },
      );
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[CHANGE_PASSWORD]", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
