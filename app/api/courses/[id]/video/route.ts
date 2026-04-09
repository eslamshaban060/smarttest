// app/api/courses/[id]/video/route.ts
// يرجع embed URL بعد التحقق من أن المستخدم مسجّل في الكورس
// الـ frontend يطلب هذا الـ endpoint مش YouTube مباشرة
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function toEmbed(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be"))
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}?rel=0&modestbranding=1`;
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}?rel=0&modestbranding=1`;
  } catch {}
  return url;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: courseId } = await params;
    const lessonId = new URL(req.url).searchParams.get("lessonId");

    if (!lessonId)
      return NextResponse.json({ error: "lessonId required" }, { status: 400 });

    // verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: currentUser.id, courseId } },
    });
    if (!enrollment)
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

    // get lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { videoUrl: true, courseId: true },
    });

    if (!lesson || lesson.courseId !== courseId || !lesson.videoUrl)
      return NextResponse.json({ error: "Video not found" }, { status: 404 });

    // return embed URL only — never the raw YouTube URL
    return NextResponse.json({
      success: true,
      embedUrl: toEmbed(lesson.videoUrl),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
