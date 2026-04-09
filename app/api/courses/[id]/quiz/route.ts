// // app/api/courses/[id]/quiz/route.ts
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
//     const { lessonQuizId, answers } = await req.json();
//     // answers: { [questionId]: selectedOptionId }

//     if (!lessonQuizId)
//       return NextResponse.json(
//         { error: "lessonQuizId required" },
//         { status: 400 },
//       );

//     const enrollment = await prisma.enrollment.findUnique({
//       where: { userId_courseId: { userId: currentUser.id, courseId } },
//     });
//     if (!enrollment)
//       return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

//     // get quiz with questions
//     const quiz = await prisma.lessonQuiz.findUnique({
//       where: { id: lessonQuizId },
//       include: {
//         questions: true,
//         lesson: {
//           include: {
//             course: { include: { lessons: { orderBy: { order: "asc" } } } },
//           },
//         },
//       },
//     });
//     if (!quiz)
//       return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

//     // grade
//     const total = quiz.questions.length;
//     const correct = quiz.questions.filter(
//       (q) => answers[q.id] === q.correctOption,
//     ).length;
//     const score = Math.round((correct / total) * 100);
//     const passed = score >= (quiz.passingScore ?? 60);

//     // save attempt
//     await prisma.quizAttempt.create({
//       data: {
//         userId: currentUser.id,
//         lessonQuizId,
//         score,
//         passed,
//         answers,
//       },
//     });

//     // if passed → mark quizPassed + unlock next lesson
//     if (passed) {
//       await prisma.lessonProgress.upsert({
//         where: {
//           userId_lessonId: { userId: currentUser.id, lessonId: quiz.lessonId },
//         },
//         create: {
//           userId: currentUser.id,
//           lessonId: quiz.lessonId,
//           enrollmentId: enrollment.id,
//           quizPassed: true,
//         },
//         update: { quizPassed: true },
//       });

//       // find next lesson and unlock it
//       const lessons = quiz.lesson.course.lessons;
//       const currentIdx = lessons.findIndex((l) => l.id === quiz.lessonId);
//       const nextLesson = lessons[currentIdx + 1];

//       if (nextLesson) {
//         await prisma.lessonProgress.upsert({
//           where: {
//             userId_lessonId: {
//               userId: currentUser.id,
//               lessonId: nextLesson.id,
//             },
//           },
//           create: {
//             userId: currentUser.id,
//             lessonId: nextLesson.id,
//             enrollmentId: enrollment.id,
//           },
//           update: {},
//         });
//       }
//     }

//     return NextResponse.json({ success: true, score, passed, correct, total });
//   } catch (err) {
//     console.error("[QUIZ_POST]", err);
//     return NextResponse.json({ error: String(err) }, { status: 500 });
//   }
// }
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
    const { lessonQuizId, finalExamId, answers } = await req.json();

    if (!lessonQuizId && !finalExamId)
      return NextResponse.json(
        { error: "lessonQuizId or finalExamId required" },
        { status: 400 },
      );

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: currentUser.id, courseId } },
    });
    if (!enrollment)
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

    // ── LESSON QUIZ ──────────────────────────────────────────────────────────
    if (lessonQuizId) {
      const quiz = await prisma.lessonQuiz.findUnique({
        where: { id: lessonQuizId },
        include: {
          questions: true,
          lesson: {
            include: {
              course: {
                include: {
                  lessons: { orderBy: { order: "asc" }, select: { id: true } },
                },
              },
            },
          },
        },
      });
      if (!quiz)
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

      const total = quiz.questions.length;
      const correct = quiz.questions.filter(
        (q) => answers[q.id] === q.correctOption,
      ).length;
      const score = Math.round((correct / total) * 100);
      const passed = score >= (quiz.passingScore ?? 60);

      await prisma.quizAttempt.create({
        data: { userId: currentUser.id, lessonQuizId, score, passed, answers },
      });

      if (passed) {
        // mark quiz passed on this lesson
        await prisma.lessonProgress.upsert({
          where: {
            userId_lessonId: {
              userId: currentUser.id,
              lessonId: quiz.lessonId,
            },
          },
          create: {
            userId: currentUser.id,
            lessonId: quiz.lessonId,
            enrollmentId: enrollment.id,
            quizPassed: true,
          },
          update: { quizPassed: true },
        });

        // unlock next lesson
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

        // check if all lessons done → update enrollment progress
        const totalLessons = lessons.length;
        const passedLessons = await prisma.lessonProgress.count({
          where: { enrollmentId: enrollment.id, quizPassed: true },
        });
        const progress = Math.round((passedLessons / totalLessons) * 100);
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { progress },
        });
      }

      return NextResponse.json({
        success: true,
        score,
        passed,
        correct,
        total,
      });
    }

    // ── FINAL EXAM ───────────────────────────────────────────────────────────
    if (finalExamId) {
      const exam = await prisma.finalExam.findUnique({
        where: { id: finalExamId },
        include: { questions: true },
      });
      if (!exam)
        return NextResponse.json({ error: "Exam not found" }, { status: 404 });

      const total = exam.questions.length;
      const correct = exam.questions.filter(
        (q) => answers[q.id] === q.correctOption,
      ).length;
      const score = Math.round((correct / total) * 100);
      const passed = score >= (exam.passingScore ?? 60);

      await prisma.quizAttempt.create({
        data: { userId: currentUser.id, finalExamId, score, passed, answers },
      });

      if (passed) {
        // mark enrollment as completed
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { status: "COMPLETED", progress: 100 },
        });

        // create certificate
        await prisma.certificate.upsert({
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
        score,
        passed,
        correct,
        total,
      });
    }
  } catch (err) {
    console.error("[QUIZ_POST]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// GET course quiz questions (for taking the quiz)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const lessonQuizId = searchParams.get("lessonQuizId");
    const finalExamId = searchParams.get("finalExamId");

    if (lessonQuizId) {
      const quiz = await prisma.lessonQuiz.findUnique({
        where: { id: lessonQuizId },
        include: { questions: { orderBy: { order: "asc" } } },
      });
      return NextResponse.json({ success: true, data: quiz });
    }

    if (finalExamId) {
      const exam = await prisma.finalExam.findUnique({
        where: { id: finalExamId },
        include: { questions: { orderBy: { order: "asc" } } },
      });
      return NextResponse.json({ success: true, data: exam });
    }

    return NextResponse.json(
      { error: "lessonQuizId or finalExamId required" },
      { status: 400 },
    );
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
