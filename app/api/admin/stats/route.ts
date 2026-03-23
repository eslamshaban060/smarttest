import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      recentUsers,
      recentTransactions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.transaction.aggregate({
        where: { type: "CREDIT" },
        _sum: { amount: true },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.transaction.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { fullName: true } } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalRevenue: totalRevenue._sum.amount ?? 0,
        recentUsers,
        recentTransactions,
      },
    });
  } catch (err) {
    console.error("[ADMIN_STATS]", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
