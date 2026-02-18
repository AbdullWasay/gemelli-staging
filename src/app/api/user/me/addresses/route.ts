import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth-utils";
import { TokenPayload } from "@/types/api";

// GET - Get all addresses for the current user
export async function GET(request: NextRequest) {
  try {
    // Extract the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: No token provided",
        },
        { status: 401 }
      );
    }

    // Extract and verify the token
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token) as TokenPayload | null;

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid token",
        },
        { status: 401 }
      );
    }

    // Fetch user addresses
    const addresses = await prisma.address.findMany({
      where: { userId: decoded.id },
    });

    return NextResponse.json(
      {
        success: true,
        data: addresses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user addresses",
      },
      { status: 500 }
    );
  }
}

// POST - Create a new address for the current user
export async function POST(request: NextRequest) {
  try {
    // Extract the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: No token provided",
        },
        { status: 401 }
      );
    }

    // Extract and verify the token
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token) as TokenPayload | null;

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid token",
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    const { country, cityState, postalCode } = body;

    if (!country || !cityState || !postalCode) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: country, cityState, postalCode",
        },
        { status: 400 }
      );
    }

    // Create the address
    const newAddress = await prisma.address.create({
      data: {
        country,
        cityState,
        postalCode,
        userId: decoded.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newAddress,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create address",
      },
      { status: 500 }
    );
  }
}
