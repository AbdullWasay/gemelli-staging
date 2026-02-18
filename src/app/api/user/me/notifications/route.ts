//src\app\api\user\me\notifications\route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// Using type assertion to work around Prisma client type issues

import { verifyToken } from "@/lib/auth-utils";
import { TokenPayload } from "@/types/api";

// Helper to get user ID from token
const getUserIdFromToken = (request: NextRequest): string | null => {
  // Extract the authorization header
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  // Extract and verify the token
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token) as TokenPayload | null;

  if (!decoded || !decoded.id) {
    return null;
  }

  return decoded.id;
};

// GET handler to retrieve user's notifications
export async function GET(req: NextRequest) {
  try {
    // Get filters from search params
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const isRead = searchParams.has("isRead")
      ? searchParams.get("isRead") === "true"
      : undefined;
    const sortOrder = searchParams.get("sortOrder") || "newest";
    const countOnly = searchParams.get("countOnly") === "true";

    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }

    // Build query conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = { userId };
    if (category) {
      where.category = category;
    }
    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    // Get count for pagination
    const totalCount = await prisma.notification.count({ where });

    // If countOnly is true, just return the count
    if (countOnly) {
      return NextResponse.json({
        success: true,
        data: {
          count: totalCount,
        },
      });
    }

    // Get notifications with pagination
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: sortOrder === "newest" ? "desc" : "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST handler to create a notification
export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate required fields
    if (!body.message || !body.category) {
      return NextResponse.json(
        { success: false, message: "Message and category are required" },
        { status: 400 }
      );
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        message: body.message,
        category: body.category,
        actionText: body.actionText,
        actionUrl: body.actionUrl,
        actionBgColor: body.actionBgColor,
        userId: userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create notification" },
      { status: 500 }
    );
  }
}

// PUT handler to mark notifications as read
export async function PUT(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Check if notificationId is provided for single notification update
    if (body.notificationId) {
      const notification = await prisma.notification.findUnique({
        where: { id: body.notificationId },
      });

      // Check if the notification exists and belongs to the user
      if (!notification || notification.userId !== userId) {
        return NextResponse.json(
          {
            success: false,
            message: "Notification not found or access denied",
          },
          { status: 404 }
        );
      }

      // Update notification
      const updatedNotification = await prisma.notification.update({
        where: { id: body.notificationId },
        data: { isRead: body.isRead ?? true },
      });

      return NextResponse.json({
        success: true,
        message: "Notification updated successfully",
        data: updatedNotification,
      });
    }

    // Mark all as read if markAllRead is true
    else if (body.markAllRead) {
      const result = await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });

      return NextResponse.json({
        success: true,
        message: "All notifications marked as read",
        data: { count: result.count },
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update notifications" },
      { status: 500 }
    );
  }
}

// DELETE handler to delete notifications
export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const notificationId = url.searchParams.get("id");

    // If notificationId is provided, delete specific notification
    if (notificationId) {
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });

      // Check if notification exists and belongs to the user
      if (!notification || notification.userId !== userId) {
        return NextResponse.json(
          {
            success: false,
            message: "Notification not found or access denied",
          },
          { status: 404 }
        );
      }

      // Delete notification
      await prisma.notification.delete({
        where: { id: notificationId },
      });

      return NextResponse.json({
        success: true,
        message: "Notification deleted successfully",
      });
    }

    // If clearAll is true, delete all read notifications
    else if (url.searchParams.get("clearAll") === "true") {
      const result = await prisma.notification.deleteMany({
        where: { userId, isRead: true },
      });

      return NextResponse.json({
        success: true,
        message: "All read notifications cleared successfully",
        data: { count: result.count },
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error deleting notifications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete notifications" },
      { status: 500 }
    );
  }
}
