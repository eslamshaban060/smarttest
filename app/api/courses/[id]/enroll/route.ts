// app/api/courses/[id]/enroll/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: courseId } = await params;

    const course = await prisma.course.findUnique({
      where: { id: courseId, published: true },
    });
    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    // check already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: currentUser.id, courseId } },
    });
    if (existing)
      return NextResponse.json({ error: "Already enrolled" }, { status: 400 });

    // free course → enroll directly
    if (course.price === 0) {
      const enrollment = await prisma.enrollment.create({
        data: { userId: currentUser.id, courseId },
      });
      return NextResponse.json({ success: true, data: enrollment });
    }

    // paid course → check balance
    const balance = await prisma.balance.findUnique({
      where: { userId: currentUser.id },
    });
    const amount = balance?.amount ?? 0;

    if (amount < course.price) {
      return NextResponse.json(
        {
          error: "insufficient_balance",
          required: course.price,
          available: amount,
        },
        { status: 402 },
      );
    }

    // deduct balance + create enrollment atomically
    const [enrollment] = await prisma.$transaction([
      prisma.enrollment.create({ data: { userId: currentUser.id, courseId } }),
      prisma.balance.update({
        where: { userId: currentUser.id },
        data: { amount: { decrement: course.price } },
      }),
      prisma.transaction.create({
        data: {
          userId: currentUser.id,
          type: "DEBIT",
          amount: course.price,
          description: `Enrollment: ${course.title}`,
        },
      }),
    ]);

    return NextResponse.json({ success: true, data: enrollment });
  } catch (err) {
    console.error("[ENROLL_POST]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
