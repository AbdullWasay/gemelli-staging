import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma, Role } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
    const skip = (page - 1) * limit;

    // Build filters
    const filters: Prisma.UserWhereInput = {};
    if (role) {
      filters.role = role as Role;
    }

    // Fetch users with stores
    const users = await prisma.user.findMany({
      where: filters,
      include: {
        store: true,
      },
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Count total users matching filter
    const totalCount = await prisma.user.count({
      where: filters,
    });

    // Remove sensitive data
    const sanitizedUsers = users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return NextResponse.json({
      success: true,
      data: {
        users: sanitizedUsers,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}





