import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSecureToken } from "@/lib/auth";
import { sendResetPasswordEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json(
        { error: "أدخل البريد الإلكتروني" },
        { status: 400 },
      );

    const user = await prisma.user.findUnique({ where: { email } });
    // دايمًا بنرجع success عشان منفصحش لو الإيميل موجود ولا لأ
    if (!user) return NextResponse.json({ success: true });

    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // ساعة
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });
    await sendResetPasswordEmail(email, token);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[FORGOT]", err);
    return NextResponse.json(
      { error: "حدث خطأ، حاول مجدداً" },
      { status: 500 },
    );
  }
}
