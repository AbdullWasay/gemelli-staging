import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth-utils";
import { TokenPayload } from "@/types/api";
import { z } from "zod";

const storeSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  storeCategory: z.string().min(1, "Store category is required"),
  storeWebsite: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token) as TokenPayload | null;
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    if (decoded.role !== "SELLER") {
      return NextResponse.json(
        { success: false, error: "Only sellers can create a store" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = storeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { store: true },
    });
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    if (existingUser.store) {
      return NextResponse.json(
        { success: false, error: "Store already exists for this user" },
        { status: 409 }
      );
    }

    const store = await prisma.store.create({
      data: {
        userId: decoded.id,
        storeName: parsed.data.storeName,
        storeCategory: parsed.data.storeCategory,
        storeWebsite: parsed.data.storeWebsite ?? "",
      },
    });

    return NextResponse.json(
      { success: true, data: store },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create store error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create store" },
      { status: 500 }
    );
  }
}
