// // app/api/admin/courses/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getCurrentUser } from "@/lib/auth";

// export async function GET(
//   _: NextRequest,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   try {
//     const currentUser = await getCurrentUser();
//     if (!currentUser || currentUser.role !== "ADMIN")
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { id } = await params;
//     const course = await prisma.course.findUnique({
//       where: { id },
//       include: {
//         lessons: {
//           orderBy: { order: "asc" },
//           include: {
//             quiz: {
//               include: { questions: { orderBy: { order: "asc" } } },
//             },
//           },
//         },
//         finalExam: {
//           include: { questions: { orderBy: { order: "asc" } } },
//         },
//         _count: { select: { enrollments: true } },
//       },
//     });

//     if (!course)
//       return NextResponse.json({ error: "Not found" }, { status: 404 });
//     return NextResponse.json({ success: true, data: course });
//   } catch (err) {
//     return NextResponse.json({ error: String(err) }, { status: 500 });
//   }
// }

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   try {
//     const currentUser = await getCurrentUser();
//     if (!currentUser || currentUser.role !== "ADMIN")
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { id } = await params;
//     const body = await req.json();

//     // simple field updates (published, title, etc.)
//     const data: any = {};
//     if (body.title !== undefined) data.title = body.title;
//     if (body.titleAr !== undefined) data.titleAr = body.titleAr;
//     if (body.description !== undefined) data.description = body.description;
//     if (body.descriptionAr !== undefined)
//       data.descriptionAr = body.descriptionAr;
//     if (body.published !== undefined) data.published = body.published;
//     if (body.price !== undefined) data.price = body.price;
//     if (body.language !== undefined) data.language = body.language;
//     if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
//     if (body.passingScore !== undefined) data.passingScore = body.passingScore;

//     const course = await prisma.course.update({ where: { id }, data });
//     return NextResponse.json({ success: true, data: course });
//   } catch (err) {
//     console.error("[ADMIN_COURSE_PATCH]", err);
//     return NextResponse.json({ error: String(err) }, { status: 500 });
//   }
// }

// export async function DELETE(
//   _: NextRequest,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   try {
//     const currentUser = await getCurrentUser();
//     if (!currentUser || currentUser.role !== "ADMIN")
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { id } = await params;
//     await prisma.course.delete({ where: { id } });
//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("[ADMIN_COURSE_DELETE]", err);
//     return NextResponse.json({ error: String(err) }, { status: 500 });
//   }
// }
// app/api/admin/courses/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { order: "asc" },
          include: {
            quiz: {
              include: { questions: { orderBy: { order: "asc" } } },
            },
          },
        },
        finalExam: {
          include: { questions: { orderBy: { order: "asc" } } },
        },
        _count: { select: { enrollments: true } },
      },
    });

    if (!course)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: course });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    // ── 1. Update basic course fields ────────────────────────────────────────
    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.titleAr !== undefined) data.titleAr = body.titleAr;
    if (body.description !== undefined) data.description = body.description;
    if (body.descriptionAr !== undefined)
      data.descriptionAr = body.descriptionAr;
    if (body.published !== undefined) data.published = body.published;
    if (body.price !== undefined) data.price = body.price;
    if (body.language !== undefined) data.language = body.language;
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
    if (body.passingScore !== undefined) data.passingScore = body.passingScore;

    await prisma.course.update({ where: { id }, data });

    // ── 2. Re-create lessons if provided ────────────────────────────────────
    if (Array.isArray(body.lessons)) {
      // Delete all old lessons (cascade deletes quizzes + questions)
      await prisma.lesson.deleteMany({ where: { courseId: id } });

      // Create new lessons
      for (let idx = 0; idx < body.lessons.length; idx++) {
        const lesson = body.lessons[idx];
        await prisma.lesson.create({
          data: {
            courseId: id,
            order: idx + 1,
            titleEn: lesson.titleEn,
            titleAr: lesson.titleAr || null,
            materialUrl: lesson.materialUrl || null,
            videoUrl: lesson.videoUrl || null,
            ...(lesson.quiz?.questions?.length > 0
              ? {
                  quiz: {
                    create: {
                      passingScore: lesson.quiz.passingScore || 60,
                      questions: {
                        create: lesson.quiz.questions.map(
                          (q: any, qi: number) => ({
                            order: qi + 1,
                            questionEn: q.questionEn,
                            questionAr: q.questionAr || null,
                            options: q.options,
                            correctOption: q.correctOption,
                          }),
                        ),
                      },
                    },
                  },
                }
              : {}),
          },
        });
      }
    }

    // ── 3. Re-create finalExam if provided ───────────────────────────────────
    if ("finalExam" in body) {
      // Delete old final exam (cascade deletes questions)
      await prisma.finalExam.deleteMany({ where: { courseId: id } });

      if (body.finalExam?.questions?.length > 0) {
        await prisma.finalExam.create({
          data: {
            courseId: id,
            passingScore: body.finalExam.passingScore || 60,
            questions: {
              create: body.finalExam.questions.map((q: any, qi: number) => ({
                order: qi + 1,
                questionEn: q.questionEn,
                questionAr: q.questionAr || null,
                options: q.options,
                correctOption: q.correctOption,
              })),
            },
          },
        });
      }
    }

    // ── 4. Return updated course ─────────────────────────────────────────────
    const updated = await prisma.course.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { order: "asc" },
          include: {
            quiz: { include: { questions: { orderBy: { order: "asc" } } } },
          },
        },
        finalExam: {
          include: { questions: { orderBy: { order: "asc" } } },
        },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[ADMIN_COURSE_PATCH]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ADMIN_COURSE_DELETE]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
