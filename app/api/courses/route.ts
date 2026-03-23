// // // import { NextRequest, NextResponse } from "next/server";
// // // import { prisma } from "@/lib/prisma";
// // // import { getCurrentUser } from "@/lib/auth";

// // // export async function GET() {
// // //   try {
// // //     const currentUser = await getCurrentUser();
// // //     if (!currentUser || currentUser.role !== "ADMIN") {
// // //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// // //     }

// // //     const courses = await prisma.course.findMany({
// // //       orderBy: { createdAt: "desc" },
// // //       include: { _count: { select: { enrollments: true } } },
// // //     });

// // //     return NextResponse.json({ success: true, data: courses });
// // //   } catch (err) {
// // //     console.error("[ADMIN_COURSES_GET]", err);
// // //     return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
// // //   }
// // // }

// // // export async function POST(req: NextRequest) {
// // //   try {
// // //     const currentUser = await getCurrentUser();
// // //     if (!currentUser || currentUser.role !== "ADMIN") {
// // //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// // //     }

// // //     const {
// // //       title,
// // //       titleAr,
// // //       description,
// // //       descriptionAr,
// // //       language,
// // //       videoUrls,
// // //       price,
// // //     } = await req.json();

// // //     if (!title || !videoUrls || videoUrls.length === 0) {
// // //       return NextResponse.json(
// // //         { error: "العنوان وفيديو واحد على الأقل مطلوبان" },
// // //         { status: 400 },
// // //       );
// // //     }

// // //     const course = await prisma.course.create({
// // //       data: {
// // //         title,
// // //         titleAr: titleAr ?? null,
// // //         description: description ?? null,
// // //         descriptionAr: descriptionAr ?? null,
// // //         language: language ?? "AR",
// // //         videoUrls: videoUrls,
// // //         price: price ?? 0,
// // //         published: false,
// // //       },
// // //     });

// // //     return NextResponse.json({ success: true, data: course });
// // //   } catch (err) {
// // //     console.error("[ADMIN_COURSES_POST]", err);
// // //     return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
// // //   }
// // // }
// // import { NextRequest, NextResponse } from "next/server";
// // import { prisma } from "@/lib/prisma";
// // import { getCurrentUser } from "@/lib/auth";

// // export async function GET() {
// //   try {
// //     const currentUser = await getCurrentUser();
// //     if (!currentUser || currentUser.role !== "ADMIN")
// //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// //     const courses = await prisma.course.findMany({
// //       orderBy: { createdAt: "desc" },
// //       include: { _count: { select: { enrollments: true } } },
// //     });

// //     return NextResponse.json({ success: true, data: courses });
// //   } catch (err) {
// //     console.error("[ADMIN_COURSES_GET]", err);
// //     return NextResponse.json({ error: String(err) }, { status: 500 });
// //   }
// // }

// // export async function POST(req: NextRequest) {
// //   try {
// //     const currentUser = await getCurrentUser();
// //     if (!currentUser || currentUser.role !== "ADMIN")
// //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// //     const body = await req.json();
// //     const {
// //       title,
// //       titleAr,
// //       description,
// //       descriptionAr,
// //       language,
// //       videoUrls,
// //       price,
// //       published,
// //       imageUrl,
// //     } = body;

// //     if (!title?.trim())
// //       return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });

// //     if (!Array.isArray(videoUrls) || videoUrls.length === 0)
// //       return NextResponse.json(
// //         { error: "فيديو واحد على الأقل مطلوب" },
// //         { status: 400 },
// //       );

// //     const course = await prisma.course.create({
// //       data: {
// //         title: title.trim(),
// //         titleAr: titleAr?.trim() || null,
// //         description: description?.trim() || null,
// //         descriptionAr: descriptionAr?.trim() || null,
// //         language: language || "AR",
// //         videoUrls,
// //         price: typeof price === "number" ? price : 0,
// //         published: published === true,
// //         imageUrl: imageUrl?.trim() || null,
// //       },
// //     });

// //     return NextResponse.json({ success: true, data: course });
// //   } catch (err) {
// //     console.error("[ADMIN_COURSES_POST]", err);
// //     return NextResponse.json({ error: String(err) }, { status: 500 });
// //   }
// // }
// // app/api/courses/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getCurrentUser } from "@/lib/auth";

// export async function GET() {
//   try {
//     const currentUser = await getCurrentUser();

//     const courses = await prisma.course.findMany({
//       where: { published: true },
//       orderBy: { createdAt: "desc" },
//       include: {
//         _count: { select: { enrollments: true } },
//         enrollments: currentUser
//           ? {
//               where: { userId: currentUser.id },
//               select: { id: true, progress: true, status: true },
//             }
//           : false,
//       },
//     });

//     return NextResponse.json({ success: true, data: courses });
//   } catch (err) {
//     console.error("[COURSES_GET]", err);
//     return NextResponse.json({ error: String(err) }, { status: 500 });
//   }
// }
// app/api/courses/route.ts
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
        _count: { select: { enrollments: true } },
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

    // normalize: courses without enrollments include → add empty array
    const normalized = courses.map((c: any) => ({
      ...c,
      enrollments: c.enrollments ?? [],
    }));

    return NextResponse.json({ success: true, data: normalized });
  } catch (err) {
    console.error("[COURSES_GET]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
