// app/api/courses/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    const course = await prisma.course.findUnique({
      where: { id, published: true },
      include: {
        _count: { select: { enrollments: true, lessons: true } },
        lessons: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            order: true,
            titleEn: true,
            titleAr: true,
            materialUrl: true,
            videoUrl: true,
            quiz: {
              select: {
                id: true,
                passingScore: true,
                _count: { select: { questions: true } },
              },
            },
          },
        },
        finalExam: {
          select: {
            id: true,
            passingScore: true,
            _count: { select: { questions: true } },
            questions: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                questionEn: true,
                questionAr: true,
                options: true,
                correctOption: true,
              },
            },
          },
        },
        ...(currentUser
          ? {
              enrollments: {
                where: { userId: currentUser.id },
                include: {
                  lessonProgress: {
                    select: {
                      lessonId: true,
                      videoWatched: true,
                      quizPassed: true,
                    },
                  },
                },
              },
            }
          : {}),
      },
    });

    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    // compute which lessons are unlocked for this user
    const enrollment = (course as any).enrollments?.[0] ?? null;
    const progMap: Record<
      string,
      { videoWatched: boolean; quizPassed: boolean }
    > = {};
    for (const lp of enrollment?.lessonProgress ?? []) {
      progMap[lp.lessonId] = {
        videoWatched: lp.videoWatched,
        quizPassed: lp.quizPassed,
      };
    }

    const lessonsWithUnlock = (course.lessons as any[]).map((lesson, i) => {
      const prog = progMap[lesson.id] ?? {
        videoWatched: false,
        quizPassed: false,
      };
      // first lesson always unlocked if enrolled; others unlock when previous quiz passed
      const prevLesson = i > 0 ? (course.lessons as any[])[i - 1] : null;
      const prevPassed =
        i === 0
          ? true
          : (progMap[prevLesson?.id]?.quizPassed ?? !prevLesson?.quiz);
      return {
        ...lesson,
        progress: prog,
        unlocked: !!enrollment && prevPassed,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        ...course,
        enrollments: (course as any).enrollments ?? [],
        enrollment,
        lessons: lessonsWithUnlock,
      },
    });
  } catch (err) {
    console.error("[COURSE_DETAIL_GET]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
