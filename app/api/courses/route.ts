// // app/api/courses/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    const courses = await prisma.course.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { enrollments: true, lessons: true } },
        ...(currentUser
          ? {
              enrollments: {
                where: { userId: currentUser.id },
                select: { id: true, progress: true, status: true },
              },
            }
          : {}),
      },
    });

    const data = courses.map((c: any) => ({
      ...c,
      enrollments: c.enrollments ?? [],
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[COURSES_GET]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
