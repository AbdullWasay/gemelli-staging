import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth-utils";
import { Role } from "@prisma/client";

// PUT - Admin: Update blogger review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyToken(
      request.headers.get("authorization")?.replace("Bearer ", "") || ""
    ) as { id: string; role?: string } | null;

    if (!decoded || decoded.role !== Role.ADMIN) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, role, imageUrl, order } = body;

    const review = await prisma.bloggerReview.update({
      where: { id },
      data: { ...(name && { name }), ...(role && { role }), ...(imageUrl && { imageUrl }), ...(order !== undefined && { order }) },
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error("Error updating blogger review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE - Admin: Delete blogger review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyToken(
      request.headers.get("authorization")?.replace("Bearer ", "") || ""
    ) as { id: string; role?: string } | null;

    if (!decoded || decoded.role !== Role.ADMIN) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.bloggerReview.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blogger review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
