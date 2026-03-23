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
    const { videoIndex } = await req.json();

    if (typeof videoIndex !== "number")
      return NextResponse.json(
        { error: "videoIndex required" },
        { status: 400 },
      );

    // get enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: currentUser.id, courseId } },
      include: { videoProgress: true },
    });
    if (!enrollment)
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

    // get course to know total videos
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const totalVideos = course.videoUrls.length;

    // upsert video progress
    await prisma.videoProgress.upsert({
      where: {
        enrollmentId_videoIndex: { enrollmentId: enrollment.id, videoIndex },
      },
      create: {
        enrollmentId: enrollment.id,
        videoIndex,
        watched: true,
        watchedAt: new Date(),
      },
      update: { watched: true, watchedAt: new Date() },
    });

    // recalculate overall progress
    const watchedCount = await prisma.videoProgress.count({
      where: { enrollmentId: enrollment.id, watched: true },
    });

    const progressPercent = Math.round((watchedCount / totalVideos) * 100);
    const isCompleted = progressPercent === 100;

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: progressPercent,
        status: isCompleted ? "COMPLETED" : "ACTIVE",
      },
    });

    // auto-issue certificate if completed and not already issued
    let certificate = null;
    if (isCompleted) {
      certificate = await prisma.certificate.upsert({
        where: { enrollmentId: enrollment.id },
        create: {
          enrollmentId: enrollment.id,
          userId: currentUser.id,
          courseId,
        },
        update: {},
      });
    }

    return NextResponse.json({
      success: true,
      progress: progressPercent,
      completed: isCompleted,
      certificate,
    });
  } catch (err) {
    console.error("[PROGRESS_POST]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
