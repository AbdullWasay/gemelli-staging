//src\app\api\user\me\notification-settings\route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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

// GET handler to retrieve notification settings
export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }

    // Find notification settings for user
    // Using type assertion for Prisma client
    const notificationSettings = await prisma.notificationSettings.findUnique({
      where: {
        userId: userId,
      },
    });

    // If no settings exist, create default settings
    if (!notificationSettings) {
      const newSettings = await prisma.notificationSettings.create({
        data: {
          userId: userId,
          // Default values are already set in the schema
        },
      });
      return NextResponse.json({ success: true, data: newSettings });
    }

    return NextResponse.json({ success: true, data: notificationSettings });
  } catch (error) {
    console.error("Error getting notification settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get notification settings" },
      { status: 500 }
    );
  }
}

// PUT handler to update notification settings
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

    // Update or create settings
    const updatedSettings = await prisma.notificationSettings.upsert({
      where: {
        userId: userId,
      },
      update: {
        newOrders: body.newOrders !== undefined ? body.newOrders : undefined,
        aiRecommendations: body.aiRecommendations !== undefined ? body.aiRecommendations : undefined,
        promotionsDiscounts: body.promotionsDiscounts !== undefined ? body.promotionsDiscounts : undefined,
        //lowStockAlerts: body.lowStockAlerts !== undefined ? body.lowStockAlerts : undefined,
        //orderStatusUpdates: body.orderStatusUpdates !== undefined ? body.orderStatusUpdates : undefined,
        emailChannel: body.emailChannel !== undefined ? body.emailChannel : undefined,
        smsChannel: body.smsChannel !== undefined ? body.smsChannel : undefined,
        appNotifications: body.appNotifications !== undefined ? body.appNotifications : undefined,
        marketingEmails: body.marketingEmails !== undefined ? body.marketingEmails : undefined,
        generalUpdates: body.generalUpdates !== undefined ? body.generalUpdates : undefined,
        orderReminders: body.orderReminders !== undefined ? body.orderReminders : undefined,
      },
      create: {
        userId: userId,
        newOrders: body.newOrders !== undefined ? body.newOrders : true,
        aiRecommendations: body.aiRecommendations !== undefined ? body.aiRecommendations : true,
        promotionsDiscounts: body.promotionsDiscounts !== undefined ? body.promotionsDiscounts : true,
        //lowStockAlerts: body.lowStockAlerts !== undefined ? body.lowStockAlerts : true,
        //orderStatusUpdates: body.orderStatusUpdates !== undefined ? body.orderStatusUpdates : true,
        emailChannel: body.emailChannel !== undefined ? body.emailChannel : false,
        smsChannel: body.smsChannel !== undefined ? body.smsChannel : false,
        appNotifications: body.appNotifications !== undefined ? body.appNotifications : true,
        marketingEmails: body.marketingEmails !== undefined ? body.marketingEmails : false,
        generalUpdates: body.generalUpdates !== undefined ? body.generalUpdates : true,
        orderReminders: body.orderReminders !== undefined ? body.orderReminders : true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Notification settings updated successfully",
      data: updatedSettings,
    });
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update notification settings" },
      { status: 500 }
    );
  }
}
