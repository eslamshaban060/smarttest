// // app/api/admin/courses/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getCurrentUser } from "@/lib/auth";

// export async function GET() {
//   try {
//     const currentUser = await getCurrentUser();
//     if (!currentUser || currentUser.role !== "ADMIN")
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const courses = await prisma.course.findMany({
//       orderBy: { createdAt: "desc" },
//       include: {
//         _count: { select: { enrollments: true, lessons: true } },
//         lessons: {
//           orderBy: { order: "asc" },
//           select: { id: true, order: true, titleEn: true, titleAr: true },
//         },
//       },
//     });

//     return NextResponse.json({ success: true, data: courses });
//   } catch (err) {
//     console.error("[ADMIN_COURSES_GET]", err);
//     return NextResponse.json({ error: String(err) }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const currentUser = await getCurrentUser();
//     if (!currentUser || currentUser.role !== "ADMIN")
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json();
//     const {
//       title,
//       titleAr,
//       description,
//       descriptionAr,
//       language,
//       price,
//       published,
//       imageUrl,
//       passingScore,
//       lessons,
//       finalExam,
//     } = body;

//     if (!title?.trim())
//       return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
//     if (!lessons?.length)
//       return NextResponse.json(
//         { error: "درس واحد على الأقل مطلوب" },
//         { status: 400 },
//       );

//     const course = await prisma.course.create({
//       data: {
//         title: title.trim(),
//         titleAr: titleAr?.trim() || null,
//         description: description?.trim() || null,
//         descriptionAr: descriptionAr?.trim() || null,
//         language: language || "AR",
//         price: parseFloat(price) || 0,
//         published: published === true,
//         imageUrl: imageUrl?.trim() || null,
//         passingScore: passingScore || 60,
//         lessons: {
//           create: lessons.map((lesson: any, idx: number) => ({
//             order: idx + 1,
//             titleEn: lesson.titleEn,
//             titleAr: lesson.titleAr || null,
//             materialUrl: lesson.materialUrl || null,
//             videoUrl: lesson.videoUrl || null,
//             ...(lesson.quiz?.questions?.length > 0
//               ? {
//                   quiz: {
//                     create: {
//                       passingScore: lesson.quiz.passingScore || 60,
//                       questions: {
//                         create: lesson.quiz.questions.map(
//                           (q: any, qi: number) => ({
//                             order: qi + 1,
//                             questionEn: q.questionEn,
//                             questionAr: q.questionAr || null,
//                             options: q.options,
//                             correctOption: q.correctOption,
//                           }),
//                         ),
//                       },
//                     },
//                   },
//                 }
//               : {}),
//           })),
//         },
//         ...(finalExam?.questions?.length > 0
//           ? {
//               finalExam: {
//                 create: {
//                   passingScore: finalExam.passingScore || 60,
//                   questions: {
//                     create: finalExam.questions.map((q: any, qi: number) => ({
//                       order: qi + 1,
//                       questionEn: q.questionEn,
//                       questionAr: q.questionAr || null,
//                       options: q.options,
//                       correctOption: q.correctOption,
//                     })),
//                   },
//                 },
//               },
//             }
//           : {}),
//       },
//       include: { lessons: true, finalExam: true },
//     });

//     return NextResponse.json({ success: true, data: course });
//   } catch (err) {
//     console.error("[ADMIN_COURSES_POST]", err);
//     return NextResponse.json({ error: String(err) }, { status: 500 });
//   }
// }
// app/api/admin/courses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { enrollments: true, lessons: true } },
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
      },
    });

    return NextResponse.json({ success: true, data: courses });
  } catch (err) {
    console.error("[ADMIN_COURSES_GET]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      title,
      titleAr,
      description,
      descriptionAr,
      language,
      price,
      published,
      imageUrl,
      passingScore,
      lessons,
      finalExam,
    } = body;

    if (!title?.trim())
      return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
    if (!lessons?.length)
      return NextResponse.json(
        { error: "درس واحد على الأقل مطلوب" },
        { status: 400 },
      );

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        titleAr: titleAr?.trim() || null,
        description: description?.trim() || null,
        descriptionAr: descriptionAr?.trim() || null,
        language: language || "AR",
        price: parseFloat(price) || 0,
        published: published === true,
        imageUrl: imageUrl?.trim() || null,
        passingScore: passingScore || 60,
        lessons: {
          create: lessons.map((lesson: any, idx: number) => ({
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
          })),
        },
        ...(finalExam?.questions?.length > 0
          ? {
              finalExam: {
                create: {
                  passingScore: finalExam.passingScore || 60,
                  questions: {
                    create: finalExam.questions.map((q: any, qi: number) => ({
                      order: qi + 1,
                      questionEn: q.questionEn,
                      questionAr: q.questionAr || null,
                      options: q.options,
                      correctOption: q.correctOption,
                    })),
                  },
                },
              },
            }
          : {}),
      },
      include: { lessons: true, finalExam: true },
    });

    return NextResponse.json({ success: true, data: course });
  } catch (err) {
    console.error("[ADMIN_COURSES_POST]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
