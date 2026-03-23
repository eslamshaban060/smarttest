import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// ── GET — جيب بيانات اليوزر كاملة ──────────────────────────────────────────
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        balance: {
          select: { amount: true },
        },
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                language: true,
              },
            },
          },
          orderBy: { enrolledAt: "desc" },
        },
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    console.error("[PROFILE GET]", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

// ── PATCH — تعديل بيانات اليوزر ─────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fullName, phone } = await req.json();

    if (!fullName || fullName.trim() === "") {
      return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        fullName: fullName.trim(),
        phone: phone?.trim() || null,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[PROFILE PATCH]", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
