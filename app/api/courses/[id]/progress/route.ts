// // app/api/courses/[id]/progress/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getCurrentUser } from "@/lib/auth";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   try {
//     const currentUser = await getCurrentUser();
//     if (!currentUser)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { id: courseId } = await params;
//     const { videoIndex } = await req.json();

//     if (typeof videoIndex !== "number")
//       return NextResponse.json(
//         { error: "videoIndex required" },
//         { status: 400 },
//       );

//     // get enrollment
//     const enrollment = await prisma.enrollment.findUnique({
//       where: { userId_courseId: { userId: currentUser.id, courseId } },
//       include: { videoProgress: true },
//     });
//     if (!enrollment)
//       return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

//     // get course to know total videos
//     const course = await prisma.course.findUnique({ where: { id: courseId } });
//     if (!course)
//       return NextResponse.json({ error: "Course not found" }, { status: 404 });

//     const totalVideos = course.videoUrls.length;

//     // upsert video progress
//     await prisma.videoProgress.upsert({
//       where: {
//         enrollmentId_videoIndex: { enrollmentId: enrollment.id, videoIndex },
//       },
//       create: {
//         enrollmentId: enrollment.id,
//         videoIndex,
//         watched: true,
//         watchedAt: new Date(),
//       },
//       update: { watched: true, watchedAt: new Date() },
//     });

//     // recalculate overall progress
//     const watchedCount = await prisma.videoProgress.count({
//       where: { enrollmentId: enrollment.id, watched: true },
//     });

//     const progressPercent = Math.round((watchedCount / totalVideos) * 100);
//     const isCompleted = progressPercent === 100;

//     await prisma.enrollment.update({
//       where: { id: enrollment.id },
//       data: {
//         progress: progressPercent,
//         status: isCompleted ? "COMPLETED" : "ACTIVE",
//       },
//     });

//     // auto-issue certificate if completed and not already issued
//     let certificate = null;
//     if (isCompleted) {
//       certificate = await prisma.certificate.upsert({
//         where: { enrollmentId: enrollment.id },
//         create: {
//           enrollmentId: enrollment.id,
//           userId: currentUser.id,
//           courseId,
//         },
//         update: {},
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       progress: progressPercent,
//       completed: isCompleted,
//       certificate,
//     });
//   } catch (err) {
//     console.error("[PROGRESS_POST]", err);
//     return NextResponse.json({ error: String(err) }, { status: 500 });
//   }
// }
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

    // get enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: currentUser.id, courseId } },
    });
    if (!enrollment)
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

    // get total lessons count for this course
    const totalLessons = await prisma.lesson.count({ where: { courseId } });
    if (totalLessons === 0)
      return NextResponse.json(
        { error: "Course has no lessons" },
        { status: 404 },
      );

    // upsert lesson progress — mark video as watched
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
    const watchedCount = await prisma.lessonProgress.count({
      where: { enrollmentId: enrollment.id, videoWatched: true },
    });

    const progressPercent = Math.round((watchedCount / totalLessons) * 100);
    const isCompleted = progressPercent === 100;

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: progressPercent,
        status: isCompleted ? "COMPLETED" : "ACTIVE",
      },
    });

    // auto-issue certificate if completed
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
