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
//         ...(currentUser
//           ? {
//               enrollments: {
//                 where: { userId: currentUser.id },
//                 select: { id: true, progress: true, status: true },
//               },
//             }
//           : {}),
//       },
//     });

//     // normalize: courses without enrollments include → add empty array
//     const normalized = courses.map((c: unknown) => ({
//       ...c,
//       enrollments: c.enrollments ?? [],
//     }));

//     return NextResponse.json({ success: true, data: normalized });
//   } catch (err) {
//     console.error("[COURSES_GET]", err);
//     return NextResponse.json({ error: String(err) }, { status: 500 });
//   }
// }
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

    const normalized = courses.map((c) => ({
      ...c,
      enrollments: "enrollments" in c ? c.enrollments : [],
    }));

    return NextResponse.json({ success: true, data: normalized });
  } catch (err) {
    console.error("[COURSES_GET]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
