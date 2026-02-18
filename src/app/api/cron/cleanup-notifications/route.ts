
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Verify the request is from your cron service
    const authHeader = req.headers.get("authorization");
    
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("🚀 Cron job triggered: Cleanup old notifications");

    // Delete read notifications older than 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const result = await prisma.notification.deleteMany({
      where: {
        isRead: true,
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    console.log(`✅ Cleaned up ${result.count} old notifications`);

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${result.count} old notifications`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in cleanup cron job:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to cleanup notifications",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}