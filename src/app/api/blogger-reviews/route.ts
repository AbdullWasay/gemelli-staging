import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth-utils";
import { Role } from "@prisma/client";

// GET - Public: List all blogger reviews (for product page)
export async function GET() {
  try {
    const reviews = await prisma.bloggerReview.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching blogger reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST - Admin only: Create blogger review
export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(
      request.headers.get("authorization")?.replace("Bearer ", "") || ""
    ) as { id: string; role?: string } | null;

    if (!decoded || decoded.role !== Role.ADMIN) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, role, imageUrl, order = 0 } = body;

    if (!name || !role || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Name, role, and imageUrl are required" },
        { status: 400 }
      );
    }

    const review = await prisma.bloggerReview.create({
      data: { name, role, imageUrl, order },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error("Error creating blogger review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create review" },
      { status: 500 }
    );
  }
}
