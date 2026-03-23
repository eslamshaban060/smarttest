import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token)
      return NextResponse.redirect(
        new URL("/auth/login?error=invalid", req.url),
      );

    const record = await prisma.emailVerifyToken.findUnique({
      where: { token },
    });
    if (!record || record.used || record.expiresAt < new Date())
      return NextResponse.redirect(
        new URL("/auth/login?error=expired", req.url),
      );

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: true },
      }),
      prisma.emailVerifyToken.update({
        where: { id: record.id },
        data: { used: true },
      }),
    ]);

    return NextResponse.redirect(new URL("/auth/login?verified=true", req.url));
  } catch (err) {
    console.error("[VERIFY]", err);
    return NextResponse.redirect(new URL("/auth/login?error=server", req.url));
  }
}
