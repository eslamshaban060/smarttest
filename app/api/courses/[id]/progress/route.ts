// app/api/courses/[id]/progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: courseId } = await params;
    const { lessonId } = await req.json();

    if (!lessonId)
      return NextResponse.json({ error: "lessonId required" }, { status: 400 });

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: currentUser.id, courseId } },
      include: { lessonProgress: true },
    });
    if (!enrollment)
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

    // mark video watched
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: currentUser.id, lessonId } },
      create: {
        userId: currentUser.id,
        lessonId,
        enrollmentId: enrollment.id,
        videoWatched: true,
      },
      update: { videoWatched: true },
    });

    // recalculate overall progress
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          orderBy: { order: "asc" },
          select: { id: true, quiz: { select: { id: true } } },
        },
      },
    });
    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const totalLessons = course.lessons.length;
    const watchedCount = await prisma.lessonProgress.count({
      where: { enrollmentId: enrollment.id, videoWatched: true },
    });
    const progress = Math.round((watchedCount / totalLessons) * 100);

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { progress },
    });

    return NextResponse.json({ success: true, progress });
  } catch (err) {
    console.error("[PROGRESS_POST]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
