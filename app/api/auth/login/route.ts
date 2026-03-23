import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json(
        { error: "أدخل البريد وكلمة المرور" },
        { status: 400 },
      );

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 },
      );

    if (!user.isActive)
      return NextResponse.json(
        { error: "الحساب موقوف، تواصل مع الدعم" },
        { status: 403 },
      );

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid)
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 },
      );

    await createSession(user.id, user.role);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[LOGIN]", err);
    return NextResponse.json(
      { error: "حدث خطأ، حاول مجدداً" },
      { status: 500 },
    );
  }
}
