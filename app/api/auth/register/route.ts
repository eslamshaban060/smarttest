import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateSecureToken } from "@/lib/auth";
import { sendVerifyEmail } from "@/lib/mailer";
export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, phone } = await req.json();

    if (!email || !password || !fullName)
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب ملؤها" },
        { status: 400 },
      );

    if (password.length < 8)
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون ٨ أحرف على الأقل" },
        { status: 400 },
      );

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return NextResponse.json(
        { error: "البريد الإلكتروني مسجّل بالفعل" },
        { status: 409 },
      );

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, fullName, phone: phone || null, passwordHash },
    });

    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.emailVerifyToken.create({
      data: { userId: user.id, token, expiresAt },
    });
    await sendVerifyEmail(email, token);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[REGISTER]", err);
    return NextResponse.json(
      { error: "حدث خطأ، حاول مجدداً" },
      { status: 500 },
    );
  }
}
