// app/api/admin/recharge/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET — list all pending recharge requests
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const requests = await prisma.rechargeRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: requests });
  } catch (err) {
    console.error("[ADMIN_RECHARGE_GET]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
