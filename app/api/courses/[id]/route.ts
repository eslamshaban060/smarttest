// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getCurrentUser } from "@/lib/auth";

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

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const data: Record<string, any> = {};
//     if (body.title !== undefined) data.title = body.title;
//     if (body.titleAr !== undefined) data.titleAr = body.titleAr;
//     if (body.description !== undefined) data.description = body.description;
//     if (body.descriptionAr !== undefined)
//       data.descriptionAr = body.descriptionAr;
//     if (body.published !== undefined) data.published = body.published;
//     if (body.videoUrls !== undefined) data.videoUrls = body.videoUrls;
//     if (body.price !== undefined) data.price = body.price;
//     if (body.language !== undefined) data.language = body.language;
//     if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;

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
        _count: { select: { enrollments: true } },
        enrollments: currentUser
          ? {
              where: { userId: currentUser.id },
              include: { videoProgress: true, certificate: true },
            }
          : false,
      },
    });

    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: course });
  } catch (err) {
    console.error("[COURSE_GET]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
