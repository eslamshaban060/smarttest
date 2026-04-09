// app/api/courses/[id]/quiz/route.ts
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
    const { lessonQuizId, answers } = await req.json();
    // answers: { [questionId]: selectedOptionId }

    if (!lessonQuizId)
      return NextResponse.json(
        { error: "lessonQuizId required" },
        { status: 400 },
      );

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: currentUser.id, courseId } },
    });
    if (!enrollment)
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

    // get quiz with questions
    const quiz = await prisma.lessonQuiz.findUnique({
      where: { id: lessonQuizId },
      include: {
        questions: true,
        lesson: {
          include: {
            course: { include: { lessons: { orderBy: { order: "asc" } } } },
          },
        },
      },
    });
    if (!quiz)
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    // grade
    const total = quiz.questions.length;
    const correct = quiz.questions.filter(
      (q) => answers[q.id] === q.correctOption,
    ).length;
    const score = Math.round((correct / total) * 100);
    const passed = score >= (quiz.passingScore ?? 60);

    // save attempt
    await prisma.quizAttempt.create({
      data: {
        userId: currentUser.id,
        lessonQuizId,
        score,
        passed,
        answers,
      },
    });

    // if passed → mark quizPassed + unlock next lesson
    if (passed) {
      await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: { userId: currentUser.id, lessonId: quiz.lessonId },
        },
        create: {
          userId: currentUser.id,
          lessonId: quiz.lessonId,
          enrollmentId: enrollment.id,
          quizPassed: true,
        },
        update: { quizPassed: true },
      });

      // find next lesson and unlock it
      const lessons = quiz.lesson.course.lessons;
      const currentIdx = lessons.findIndex((l) => l.id === quiz.lessonId);
      const nextLesson = lessons[currentIdx + 1];

      if (nextLesson) {
        await prisma.lessonProgress.upsert({
          where: {
            userId_lessonId: {
              userId: currentUser.id,
              lessonId: nextLesson.id,
            },
          },
          create: {
            userId: currentUser.id,
            lessonId: nextLesson.id,
            enrollmentId: enrollment.id,
          },
          update: {},
        });
      }
    }

    return NextResponse.json({ success: true, score, passed, correct, total });
  } catch (err) {
    console.error("[QUIZ_POST]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
